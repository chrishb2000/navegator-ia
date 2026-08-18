import React, { useState } from "react";
import { FormField } from "../../../types";
import { Code2, Plus, Sparkles, Trash2, ArrowRight, ArrowLeft } from "lucide-react";

interface CustomFormSiteProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  fields: FormField[];
  onFieldChange: (fieldId: string, value: any) => void;
  activeFieldId?: string;
  onAddField?: (field: FormField) => void;
  onDeleteField?: (fieldId: string) => void;
}

export const DEFAULT_CUSTOM_FIELDS: FormField[] = [
  {
    id: "custom_name",
    name: "fullName",
    label: "Nombre completo del solicitante",
    type: "text",
    placeholder: "Escribe o autocompleta con IA...",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "custom_dni",
    name: "documentNumber",
    label: "Documento de Identidad (DNI/NIE)",
    type: "text",
    placeholder: "12345678Z",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "custom_email",
    name: "email",
    label: "Correo electrónico principal",
    type: "email",
    placeholder: "correo@ejemplo.com",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "custom_phone",
    name: "phone",
    label: "Número de teléfono",
    type: "tel",
    placeholder: "+34 600 000 000",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "custom_address",
    name: "address",
    label: "Dirección de residencia",
    type: "text",
    placeholder: "Calle Ejemplo 123",
    required: false,
    step: 2,
    value: "",
  },
  {
    id: "custom_city",
    name: "city",
    label: "Ciudad",
    type: "text",
    placeholder: "Madrid",
    required: false,
    step: 2,
    value: "",
  },
  {
    id: "custom_notes",
    name: "notes",
    label: "Comentarios o instrucciones especiales",
    type: "textarea",
    placeholder: "Instrucciones para el trámite...",
    required: false,
    step: 2,
    value: "",
  },
];

export const CustomFormSite: React.FC<CustomFormSiteProps> = ({
  currentStep,
  onStepChange,
  fields,
  onFieldChange,
  activeFieldId,
}) => {
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<FormField["type"]>("text");

  const currentStepFields = fields.filter((f) => f.step === currentStep);

  return (
    <div className="w-full min-h-full bg-slate-900 text-slate-100 font-sans pb-12" id="site_custom_form">
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base">Laboratorio DOM Personalizado</span>
              <span className="text-xs text-violet-400 block">custom://formulario-personalizado</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs bg-violet-950/80 px-3 py-1.5 rounded-full border border-violet-800 text-violet-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Detector de DOM Dinámico</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h1 className="text-xl font-bold text-white">Formulario Dinámico de Pruebas</h1>
              <p className="text-xs text-slate-400 mt-1">
                Escribe cualquier dato en el panel de IA para ver cómo el agente detecta y rellena los campos en tiempo real.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStepChange(s)}
                  className={`px-3 py-1 text-xs rounded-lg font-bold ${
                    currentStep === s ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  Paso {s}
                </button>
              ))}
            </div>
          </div>

          {/* Fields render */}
          <div className="space-y-4">
            {currentStepFields.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                No hay campos configurados en este paso.
              </div>
            ) : (
              currentStepFields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor={field.id} className="block text-xs font-semibold text-slate-300">
                      {field.label} {field.required && <span className="text-rose-400">*</span>}
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">id: {field.id}</span>
                  </div>

                  <div className={`rounded-xl border transition-all ${
                    activeFieldId === field.id
                      ? "border-violet-400 ring-2 ring-violet-500/40 bg-violet-950/30"
                      : "border-slate-800 bg-slate-900"
                  }`}>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.id}
                        rows={3}
                        placeholder={field.placeholder}
                        value={String(field.value || "")}
                        onChange={(e) => onFieldChange(field.id, e.target.value)}
                        className="w-full px-4 py-2.5 bg-transparent text-sm text-white focus:outline-none resize-none"
                      />
                    ) : (
                      <input
                        type={field.type}
                        id={field.id}
                        placeholder={field.placeholder}
                        value={String(field.value || "")}
                        onChange={(e) => onFieldChange(field.id, e.target.value)}
                        className="w-full px-4 py-2.5 bg-transparent text-sm text-white focus:outline-none font-sans"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Navigation */}
          <div className="pt-4 border-t border-slate-800 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => onStepChange(currentStep - 1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Paso 1
              </button>
            ) : <div />}

            {currentStep === 1 ? (
              <button
                type="button"
                onClick={() => onStepChange(2)}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-violet-600/20"
              >
                Avanzar al Paso 2 <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => alert("¡Formulario de prueba enviado con éxito!")}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2"
              >
                Finalizar Envío
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
