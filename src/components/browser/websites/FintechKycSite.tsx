import React from "react";
import { FormField } from "../../../types";
import { Landmark, ShieldAlert, Sparkles, UserCheck, ArrowRight, ArrowLeft } from "lucide-react";

interface FintechSiteProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  fields: FormField[];
  onFieldChange: (fieldId: string, value: any) => void;
  activeFieldId?: string;
}

export const FINTECH_FIELDS: FormField[] = [
  // Paso 1: Identidad
  {
    id: "bank_first_name",
    name: "firstName",
    label: "Primer Nombre",
    type: "text",
    placeholder: "Carlos",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "bank_last_name",
    name: "lastName",
    label: "Apellidos",
    type: "text",
    placeholder: "Gómez Navarro",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "bank_document_number",
    name: "documentNumber",
    label: "DNI / NIE / Pasaporte",
    type: "text",
    placeholder: "48712390X",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "bank_birth_date",
    name: "birthDate",
    label: "Fecha de Nacimiento",
    type: "date",
    required: true,
    step: 1,
    value: "1991-06-14",
  },
  {
    id: "bank_nationality",
    name: "nationality",
    label: "Nacionalidad",
    type: "select",
    required: true,
    step: 1,
    value: "Española",
    options: [
      { label: "Española", value: "Española" },
      { label: "Italiana", value: "Italiana" },
      { label: "Francesa", value: "Francesa" },
      { label: "Alemana", value: "Alemana" },
      { label: "Argentina", value: "Argentina" },
      { label: "Mexicana", value: "Mexicana" },
      { label: "Colombiana", value: "Colombiana" },
    ],
  },
  {
    id: "bank_civil_status",
    name: "civilStatus",
    label: "Estado Civil",
    type: "select",
    required: true,
    step: 1,
    value: "Soltero",
    options: [
      { label: "Soltero/a", value: "Soltero" },
      { label: "Casado/a", value: "Casado" },
      { label: "Pareja de Hecho", value: "Pareja de Hecho" },
      { label: "Divorciado/a", value: "Divorciado" },
    ],
  },

  // Paso 2: Datos Económicos
  {
    id: "bank_job_title",
    name: "jobTitle",
    label: "Actividad Profesional o Profesión",
    type: "text",
    placeholder: "Ingeniero de Software / Consultor",
    required: true,
    step: 2,
    value: "",
  },
  {
    id: "bank_monthly_income",
    name: "monthlyIncome",
    label: "Ingresos Mensuales Estimados (€)",
    type: "select",
    required: true,
    step: 2,
    value: "3000 - 5000 €",
    options: [
      { label: "Menos de 1.500 €", value: "<1500" },
      { label: "1.500 € - 3.000 €", value: "1500-3000" },
      { label: "3.000 € - 5.000 €", value: "3000-5000" },
      { label: "Más de 5.000 €", value: ">5000" },
    ],
  },
  {
    id: "bank_funds_origin",
    name: "fundsOrigin",
    label: "Origen de los Fondos y Capital",
    type: "select",
    required: true,
    step: 2,
    value: "Nómina o Rendimiento del Trabajo",
    options: [
      { label: "Nómina o Rendimiento del Trabajo", value: "Nómina o Rendimiento del Trabajo" },
      { label: "Actividad Comercial / Autónomo", value: "Actividad Comercial" },
      { label: "Inversiones o Dividendos", value: "Inversiones" },
      { label: "Herencia o Donación", value: "Herencia" },
    ],
  },
  {
    id: "bank_iban",
    name: "iban",
    label: "IBAN de cuenta bancaria previa para vinculación",
    type: "text",
    placeholder: "ES91 2100 0418 4502 0005 1324",
    required: true,
    step: 2,
    value: "",
  },

  // Paso 3: Claves y Contrato
  {
    id: "bank_pin_code",
    name: "pinCode",
    label: "Código Secreto de Acceso Digital (6 dígitos)",
    type: "password",
    placeholder: "••••••",
    required: true,
    step: 3,
    value: "847291",
  },
  {
    id: "bank_terms_contract",
    name: "acceptTerms",
    label: "Acepto el contrato de servicios bancarios y la política del Fondo de Garantía de Depósitos",
    type: "checkbox",
    required: true,
    step: 3,
    value: true,
  },
];

export const FintechKycSite: React.FC<FintechSiteProps> = ({
  currentStep,
  onStepChange,
  fields,
  onFieldChange,
  activeFieldId,
}) => {
  const getVal = (id: string) => {
    const f = fields.find((x) => x.id === id);
    return f ? f.value : "";
  };

  const isHighlighted = (id: string) => activeFieldId === id;

  return (
    <div className="w-full min-h-full bg-cyan-950 text-slate-100 font-sans pb-12" id="site_fintech">
      <header className="bg-cyan-900/60 backdrop-blur border-b border-cyan-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-400 text-cyan-950 flex items-center justify-center font-black">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">NOVABANK DIGITAL</span>
              <span className="text-cyan-300 text-xs block">Banco Supervisado por el Banco Central</span>
            </div>
          </div>
          <span className="text-xs font-mono bg-cyan-900 px-3 py-1 rounded-full border border-cyan-700 text-cyan-300">
            Proceso KYC Digital
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-slate-900 rounded-2xl border border-cyan-800/60 shadow-2xl p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-5">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" /> Apertura de Cuenta y Verificación de Identidad
              </h1>
              <p className="text-xs text-slate-400 mt-1">Cumplimiento normativo Antiblanqueo de Capitales (PBC/FT)</p>
            </div>
            <div className="text-xs font-bold bg-cyan-950 text-cyan-400 px-3 py-1.5 rounded-lg border border-cyan-800">
              Paso {currentStep} de 3
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">1. Datos Personales de Identificación</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bank_first_name" className="block text-xs text-slate-300 mb-1">Nombre *</label>
                  <input
                    type="text"
                    id="bank_first_name"
                    value={String(getVal("bank_first_name"))}
                    onChange={(e) => onFieldChange("bank_first_name", e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border text-sm ${
                      isHighlighted("bank_first_name") ? "border-cyan-400 ring-2 ring-cyan-500/30" : "border-slate-800"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="bank_last_name" className="block text-xs text-slate-300 mb-1">Apellidos *</label>
                  <input
                    type="text"
                    id="bank_last_name"
                    value={String(getVal("bank_last_name"))}
                    onChange={(e) => onFieldChange("bank_last_name", e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border text-sm ${
                      isHighlighted("bank_last_name") ? "border-cyan-400 ring-2 ring-cyan-500/30" : "border-slate-800"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="bank_document_number" className="block text-xs text-slate-300 mb-1">DNI / NIE *</label>
                  <input
                    type="text"
                    id="bank_document_number"
                    value={String(getVal("bank_document_number"))}
                    onChange={(e) => onFieldChange("bank_document_number", e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border text-sm font-mono ${
                      isHighlighted("bank_document_number") ? "border-cyan-400 ring-2 ring-cyan-500/30" : "border-slate-800"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="bank_birth_date" className="block text-xs text-slate-300 mb-1">Fecha Nacimiento *</label>
                  <input
                    type="date"
                    id="bank_birth_date"
                    value={String(getVal("bank_birth_date"))}
                    onChange={(e) => onFieldChange("bank_birth_date", e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border text-sm ${
                      isHighlighted("bank_birth_date") ? "border-cyan-400 ring-2 ring-cyan-500/30" : "border-slate-800"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="bank_nationality" className="block text-xs text-slate-300 mb-1">Nacionalidad *</label>
                  <select
                    id="bank_nationality"
                    value={String(getVal("bank_nationality"))}
                    onChange={(e) => onFieldChange("bank_nationality", e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border border-slate-800 text-sm"
                  >
                    <option value="Española">Española</option>
                    <option value="Italiana">Italiana</option>
                    <option value="Francesa">Francesa</option>
                    <option value="Alemana">Alemana</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">2. Información Económica y Laboral</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bank_job_title" className="block text-xs text-slate-300 mb-1">Profesión *</label>
                  <input
                    type="text"
                    id="bank_job_title"
                    value={String(getVal("bank_job_title"))}
                    onChange={(e) => onFieldChange("bank_job_title", e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border text-sm ${
                      isHighlighted("bank_job_title") ? "border-cyan-400 ring-2 ring-cyan-500/30" : "border-slate-800"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="bank_iban" className="block text-xs text-slate-300 mb-1">IBAN Cuenta Vinculada *</label>
                  <input
                    type="text"
                    id="bank_iban"
                    value={String(getVal("bank_iban"))}
                    onChange={(e) => onFieldChange("bank_iban", e.target.value)}
                    className={`w-full px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border text-sm font-mono ${
                      isHighlighted("bank_iban") ? "border-cyan-400 ring-2 ring-cyan-500/30" : "border-slate-800"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">3. Seguridad y Firma</h3>
              <div>
                <label htmlFor="bank_pin_code" className="block text-xs text-slate-300 mb-1">PIN Secreto Digital *</label>
                <input
                  type="password"
                  id="bank_pin_code"
                  value={String(getVal("bank_pin_code"))}
                  onChange={(e) => onFieldChange("bank_pin_code", e.target.value)}
                  className={`w-full max-w-xs px-3.5 py-2.5 bg-slate-950 text-white rounded-xl border text-sm font-mono ${
                    isHighlighted("bank_pin_code") ? "border-cyan-400 ring-2 ring-cyan-500/30" : "border-slate-800"
                  }`}
                />
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="bank_terms_contract"
                  checked={Boolean(getVal("bank_terms_contract"))}
                  onChange={(e) => onFieldChange("bank_terms_contract", e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded bg-slate-900 border-slate-700 mt-0.5 cursor-pointer"
                />
                <label htmlFor="bank_terms_contract" className="text-xs text-slate-300 cursor-pointer">
                  Acepto los términos de apertura de cuenta y certifico que no tengo residencia fiscal en paraísos fiscales.
                </label>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => onStepChange(currentStep - 1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-xl flex items-center gap-2"
                id="btn_bank_prev"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            ) : <div />}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => onStepChange(currentStep + 1)}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2"
                id="btn_bank_next"
              >
                Paso Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => alert("¡Cuenta bancaria activada exitosamente!")}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2"
                id="btn_bank_submit"
              >
                Finalizar Apertura de Cuenta
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
