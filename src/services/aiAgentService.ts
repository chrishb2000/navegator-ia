import { AIAutomationEngine, FormField, UserProfile } from "../types";
import { matchFieldsLocally } from "../utils/heuristicsMatcher";

export interface AgentResolutionResult {
  engineUsed: AIAutomationEngine;
  fieldMappings: Array<{
    fieldId: string;
    fieldName?: string;
    value: any;
    confidence: number;
    reasoning?: string;
    source?: string;
  }>;
  readyToAdvance: boolean;
  missingRequiredFields: string[];
  summary: string;
}

export async function resolveFormFieldsWithAgent(
  fields: FormField[],
  userText: string,
  profile: UserProfile | null,
  engine: AIAutomationEngine,
  currentStep: number,
  totalSteps: number,
  pageContext: { title: string; url: string; category?: string }
): Promise<AgentResolutionResult> {
  // If user explicitly chose local heuristic offline engine
  if (engine === "heuristic_local") {
    const localResult = matchFieldsLocally(fields, userText, profile);
    const mappingsList = Object.entries(localResult.mappings).map(([fieldId, item]) => {
      const f = fields.find((x) => x.id === fieldId);
      return {
        fieldId,
        fieldName: f?.name || f?.label || fieldId,
        value: item.value,
        confidence: item.confidence,
        reasoning: `Asignado mediante motor heurístico local desde ${
          item.source === "text" ? "texto del usuario" : "bóveda privada local"
        }`,
        source: item.source,
      };
    });

    return {
      engineUsed: "heuristic_local",
      fieldMappings: mappingsList,
      readyToAdvance: localResult.readyToAdvance,
      missingRequiredFields: localResult.missingRequired,
      summary: `Procesado 100% en local. Se mapearon ${mappingsList.length} de ${fields.length} campos detectados.`,
    };
  }

  // Otherwise, attempt Gemini Server-side smart resolution
  try {
    const response = await fetch("/api/gemini/parse-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields,
        userText,
        profileData: profile?.data || {},
        currentStep,
        totalSteps,
        pageContext,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();

    if (data.fallback || !data.result) {
      // Graceful fallback to local engine
      console.info("Gemini API fallback requested, running local heuristic matcher:", data.message);
      const localResult = matchFieldsLocally(fields, userText, profile);
      const mappingsList = Object.entries(localResult.mappings).map(([fieldId, item]) => {
        const f = fields.find((x) => x.id === fieldId);
        return {
          fieldId,
          fieldName: f?.name || f?.label || fieldId,
          value: item.value,
          confidence: item.confidence,
          reasoning: `Motor local (fallback): Mapeado desde ${item.source}`,
          source: item.source,
        };
      });

      return {
        engineUsed: "heuristic_local",
        fieldMappings: mappingsList,
        readyToAdvance: localResult.readyToAdvance,
        missingRequiredFields: localResult.missingRequired,
        summary: data.message || "Campos resueltos mediante motor local seguro.",
      };
    }

    const geminiResult = data.result;
    return {
      engineUsed: "gemini",
      fieldMappings: geminiResult.fieldMappings || [],
      readyToAdvance: Boolean(geminiResult.readyToAdvance),
      missingRequiredFields: geminiResult.missingRequiredFields || [],
      summary: geminiResult.summary || "Campos interpretados y estructurados con Gemini 3.7 Flash.",
    };
  } catch (error: any) {
    console.warn("Gemini service unavailable, switching seamlessly to local engine:", error);
    const localResult = matchFieldsLocally(fields, userText, profile);
    const mappingsList = Object.entries(localResult.mappings).map(([fieldId, item]) => {
      const f = fields.find((x) => x.id === fieldId);
      return {
        fieldId,
        fieldName: f?.name || f?.label || fieldId,
        value: item.value,
        confidence: item.confidence,
        reasoning: `Motor local seguro: Mapeado desde ${item.source}`,
        source: item.source,
      };
    });

    return {
      engineUsed: "heuristic_local",
      fieldMappings: mappingsList,
      readyToAdvance: localResult.readyToAdvance,
      missingRequiredFields: localResult.missingRequired,
      summary: "Motor heurístico local ejecutado con éxito.",
    };
  }
}

export const aiAgentService = {
  resolveFormFieldsWithAgent,
  parseFormFieldsWithAI: async (params: {
    userText: string;
    profile?: UserProfile | null;
    fields: FormField[];
    engine?: AIAutomationEngine;
    currentStep?: number;
    totalSteps?: number;
    pageContext?: { title: string; url: string; category?: string };
  }) => {
    const res = await resolveFormFieldsWithAgent(
      params.fields,
      params.userText,
      params.profile || null,
      params.engine || "gemini",
      params.currentStep || 1,
      params.totalSteps || 3,
      params.pageContext || { title: "Formulario Web", url: window.location.href }
    );
    return {
      matchedFields: res.fieldMappings,
      confidenceScore: res.fieldMappings.length > 0 ? 0.95 : 0.4,
      readyToAdvance: res.readyToAdvance,
      summary: res.summary,
      engineUsed: res.engineUsed,
    };
  },
};
