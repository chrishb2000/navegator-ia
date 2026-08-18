import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy Gemini client initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Endpoint to analyze form schema against raw user input / profile data
 * and return exact field mappings, step actions, and confidence scores.
 */
app.post("/api/gemini/parse-form", async (req, res) => {
  try {
    const { fields, userText, profileData, currentStep, totalSteps, pageContext } = req.body;

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({
        error: "Missing or invalid form fields payload",
      });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return notice to use client-side heuristic engine fallback
      return res.status(200).json({
        fallback: true,
        message: "Gemini API key not configured on server. Falling back to local offline heuristic engine.",
        mappings: {},
        nextStepAction: null,
      });
    }

    const systemInstruction = `You are AutoNav AI, an autonomous browser agent specialized in parsing DOM form fields and filling them accurately from free-form user text and user profile data.
Your goal is to extract corresponding values for the given form fields based on the user's unstructured text and profile.
Ensure format correctness (dates in YYYY-MM-DD or DD/MM/YYYY as requested, emails, phone numbers without unwanted characters, dropdown option matching, checkboxes as boolean or value).
If a field cannot be reliably inferred, leave value as null.
Also determine if all required fields for the current step are satisfied and if the agent should click the next step button.`;

    const promptPayload = {
      userText: userText || "",
      profileData: profileData || {},
      pageContext: pageContext || {},
      currentStep: currentStep || 1,
      totalSteps: totalSteps || 1,
      formFields: fields.map((f: any) => ({
        id: f.id,
        name: f.name,
        label: f.label,
        type: f.type,
        placeholder: f.placeholder,
        options: f.options,
        required: f.required,
        currentValue: f.value,
      })),
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Please map the user text and profile data into the following form schema:\n\n${JSON.stringify(
        promptPayload,
        null,
        2
      )}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fieldMappings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  fieldId: { type: Type.STRING },
                  fieldName: { type: Type.STRING },
                  value: { type: Type.STRING },
                  confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 1" },
                  reasoning: { type: Type.STRING },
                },
                required: ["fieldId", "value", "confidence"],
              },
            },
            readyToAdvance: {
              type: Type.BOOLEAN,
              description: "Whether all required fields in this step are matched and we can advance",
            },
            missingRequiredFields: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "IDs of required fields that could not be mapped",
            },
            summary: {
              type: Type.STRING,
              description: "Short Spanish summary of what fields were filled and next action",
            },
          },
          required: ["fieldMappings", "readyToAdvance", "missingRequiredFields", "summary"],
        },
      },
    });

    const responseText = response.text?.trim() || "{}";
    const parsed = JSON.parse(responseText);

    return res.json({
      fallback: false,
      result: parsed,
    });
  } catch (error: any) {
    console.error("Gemini parse-form error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process form with Gemini",
      fallback: true,
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AutoNav Browser Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
