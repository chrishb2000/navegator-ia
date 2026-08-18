import React from "react";
import { ActiveTypingState, AutomationStatus, FormField } from "../../types";
import { GovernmentAppointmentSite } from "./websites/GovernmentAppointmentSite";
import { JobApplicationSite } from "./websites/JobApplicationSite";
import { EcommerceCheckoutSite } from "./websites/EcommerceCheckoutSite";
import { FintechKycSite } from "./websites/FintechKycSite";
import { CustomFormSite } from "./websites/CustomFormSite";
import { Sparkles } from "lucide-react";

interface WebPageViewportProps {
  siteUrl: string;
  currentStep: number;
  onStepChange: (step: number) => void;
  fields: FormField[];
  onFieldChange: (fieldId: string, value: any) => void;
  automationStatus: AutomationStatus;
  activeTyping: ActiveTypingState | null;
  onTriggerAutofill: () => void;
}

export const WebPageViewport: React.FC<WebPageViewportProps> = ({
  siteUrl,
  currentStep,
  onStepChange,
  fields,
  onFieldChange,
  automationStatus,
  activeTyping,
  onTriggerAutofill,
}) => {
  const isAgentActive =
    automationStatus === "typing" ||
    automationStatus === "scanning" ||
    automationStatus === "advancing";

  const renderActiveSite = () => {
    if (siteUrl.includes("sede.administracion.gob.es") || siteUrl.includes("citas")) {
      return (
        <GovernmentAppointmentSite
          currentStep={currentStep}
          onStepChange={onStepChange}
          fields={fields}
          onFieldChange={onFieldChange}
          activeFieldId={activeTyping?.fieldId}
          isAgentTyping={automationStatus === "typing"}
        />
      );
    }
    if (siteUrl.includes("jobs.techcorp.io") || siteUrl.includes("apply")) {
      return (
        <JobApplicationSite
          currentStep={currentStep}
          onStepChange={onStepChange}
          fields={fields}
          onFieldChange={onFieldChange}
          activeFieldId={activeTyping?.fieldId}
          isAgentTyping={automationStatus === "typing"}
        />
      );
    }
    if (siteUrl.includes("shop.nordicgear.com") || siteUrl.includes("checkout")) {
      return (
        <EcommerceCheckoutSite
          currentStep={currentStep}
          onStepChange={onStepChange}
          fields={fields}
          onFieldChange={onFieldChange}
          activeFieldId={activeTyping?.fieldId}
        />
      );
    }
    if (siteUrl.includes("novabank.com") || siteUrl.includes("open-account")) {
      return (
        <FintechKycSite
          currentStep={currentStep}
          onStepChange={onStepChange}
          fields={fields}
          onFieldChange={onFieldChange}
          activeFieldId={activeTyping?.fieldId}
        />
      );
    }
    // Default custom form playground
    return (
      <CustomFormSite
        currentStep={currentStep}
        onStepChange={onStepChange}
        fields={fields}
        onFieldChange={onFieldChange}
        activeFieldId={activeTyping?.fieldId}
      />
    );
  };

  return (
    <div className="relative w-full h-full overflow-y-auto bg-slate-100 flex flex-col font-sans" id="webpage_viewport_container">
      {/* Floating Autonomous Agent Status Bar */}
      {isAgentActive && (
        <div className="sticky top-4 z-40 mx-auto max-w-xl w-[92%] animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="bg-white/95 backdrop-blur-md border border-indigo-200 shadow-xl rounded-xl p-3 flex items-center justify-between gap-4 text-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    {automationStatus === "scanning" && "Analizando DOM y campos..."}
                    {automationStatus === "typing" && "Inyectando valores en el formulario..."}
                    {automationStatus === "advancing" && "Avanzando al siguiente paso..."}
                  </span>
                </div>
                <div className="text-xs text-slate-600 truncate mt-0.5">
                  {activeTyping ? (
                    <span>
                      Escribiendo en <strong className="text-slate-900 font-semibold">"{activeTyping.fieldName}"</strong>:{" "}
                      <span className="font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                        {activeTyping.currentDisplayValue}
                      </span>
                    </span>
                  ) : (
                    "Mapeando datos privados y validando formulario"
                  )}
                </div>
              </div>
            </div>

            {/* Visual mini progress bar */}
            {activeTyping && (
              <div className="w-20 hidden sm:block shrink-0">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-mono font-semibold">
                  <span>Progreso</span>
                  <span>{Math.round(activeTyping.progressPercent)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-75"
                    style={{ width: `${activeTyping.progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Website Rendered Canvas */}
      <div className="flex-1 w-full flex flex-col">{renderActiveSite()}</div>
    </div>
  );
};
