import React from "react";
import { FormField } from "../../types";
import { X, Code2 } from "lucide-react";

interface DomInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  fields: FormField[];
  currentStep: number;
}

export const DomInspectorModal: React.FC<DomInspectorModalProps> = ({
  isOpen,
  onClose,
  fields,
  currentStep,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div
        className="bg-white border border-slate-300 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-800"
        id="dom_inspector_modal"
      >
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Inspector de Campos DOM del Formulario
              </h2>
              <p className="text-xs text-slate-500">
                Esquema detectado automáticamente por el motor de escaneo del navegador.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {fields.length} Campos Registrados en el DOM
            </span>
            <span className="text-xs bg-slate-100 border border-slate-200 px-3 py-1 rounded-md text-slate-700 font-mono font-semibold">
              Paso Actual: {currentStep}
            </span>
          </div>

          <div className="rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="p-3 font-bold">ID / Selector</th>
                  <th className="p-3 font-bold font-sans">Etiqueta (Label)</th>
                  <th className="p-3 font-bold">Tipo</th>
                  <th className="p-3 font-bold">Paso</th>
                  <th className="p-3 font-bold">Obligatorio</th>
                  <th className="p-3 font-bold">Valor Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {fields.map((f) => {
                  const isCurrentStep = f.step === currentStep;
                  const hasValue =
                    f.value !== "" && f.value !== false && f.value !== null && f.value !== undefined;
                  return (
                    <tr
                      key={f.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isCurrentStep ? "bg-indigo-50/40" : "opacity-75"
                      }`}
                    >
                      <td className="p-3 font-semibold text-indigo-600">{f.id}</td>
                      <td className="p-3 font-sans font-medium text-slate-900">{f.label}</td>
                      <td className="p-3 text-slate-500 uppercase text-[10px]">{f.type}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isCurrentStep
                              ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          P{f.step}
                        </span>
                      </td>
                      <td className="p-3">
                        {f.required ? (
                          <span className="text-rose-600 font-bold">Sí *</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="p-3 truncate max-w-[160px]">
                        {hasValue ? (
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {String(f.value)}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">vacío</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
