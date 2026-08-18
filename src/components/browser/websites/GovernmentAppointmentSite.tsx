import React from "react";
import { FormField } from "../../../types";
import { Building2, Calendar, CheckCircle2, FileText, Lock, Shield, User, Clock, ArrowRight, ArrowLeft } from "lucide-react";

interface GovernmentSiteProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  fields: FormField[];
  onFieldChange: (fieldId: string, value: any) => void;
  activeFieldId?: string;
  isAgentTyping?: boolean;
}

export const GOV_FIELDS: FormField[] = [
  // Paso 1
  {
    id: "gov_province",
    name: "province",
    label: "Provincia de tramitación",
    type: "select",
    required: true,
    step: 1,
    value: "Madrid",
    options: [
      { label: "Selecciona una provincia...", value: "" },
      { label: "Madrid", value: "Madrid" },
      { label: "Barcelona", value: "Barcelona" },
      { label: "Valencia", value: "Valencia" },
      { label: "Sevilla", value: "Sevilla" },
      { label: "Zaragoza", value: "Zaragoza" },
      { label: "Málaga", value: "Málaga" },
      { label: "Bilbao / Bizkaia", value: "Bilbao" },
    ],
    helpText: "Selecciona el territorio donde deseas acudir a la cita presencial.",
  },
  {
    id: "gov_procedure",
    name: "appointmentReason",
    label: "Trámite requerido",
    type: "select",
    required: true,
    step: 1,
    value: "Renovación Documento de Identidad y Pasaporte",
    options: [
      { label: "Selecciona trámite oficial...", value: "" },
      { label: "Renovación Documento de Identidad y Pasaporte", value: "Renovación Documento de Identidad y Pasaporte" },
      { label: "Emisión de Certificado Digital FNMT", value: "Emisión de Certificado Digital FNMT" },
      { label: "Trámites de Extranjería / NIE / TIE", value: "Trámites de Extranjería / NIE / TIE" },
      { label: "Registro Civil e Inscripciones", value: "Registro Civil e Inscripciones" },
      { label: "Seguridad Social y Prestaciones", value: "Seguridad Social y Prestaciones" },
    ],
  },
  {
    id: "gov_office",
    name: "officeLocation",
    label: "Oficina de atención presencial",
    type: "select",
    required: true,
    step: 1,
    value: "Oficina Central de Madrid - Gran Vía",
    options: [
      { label: "Selecciona centro u oficina...", value: "" },
      { label: "Oficina Central de Madrid - Gran Vía", value: "Oficina Central de Madrid - Gran Vía" },
      { label: "Comisaría de Policía / DNI - Calle Almagro", value: "Comisaría de Policía / DNI - Calle Almagro" },
      { label: "Oficina de Distrito - Retiro / Chamberí", value: "Oficina de Distrito - Retiro / Chamberí" },
      { label: "Delegación del Gobierno - Castellana", value: "Delegación del Gobierno - Castellana" },
    ],
  },

  // Paso 2
  {
    id: "gov_doc_type",
    name: "documentType",
    label: "Tipo de documento",
    type: "select",
    required: true,
    step: 2,
    value: "DNI",
    options: [
      { label: "DNI (Documento Nacional de Identidad)", value: "DNI" },
      { label: "NIE (Número de Identidad de Extranjero)", value: "NIE" },
      { label: "Pasaporte Oficial", value: "Pasaporte" },
    ],
  },
  {
    id: "gov_doc_number",
    name: "documentNumber",
    label: "Número de documento de identidad",
    type: "text",
    placeholder: "Ej: 12345678Z o X1234567Y",
    required: true,
    step: 2,
    value: "",
  },
  {
    id: "gov_first_name",
    name: "firstName",
    label: "Nombre de pila",
    type: "text",
    placeholder: "Ej: Carlos",
    required: true,
    step: 2,
    value: "",
  },
  {
    id: "gov_last_name",
    name: "lastName",
    label: "Apellidos completos",
    type: "text",
    placeholder: "Ej: Gómez Navarro",
    required: true,
    step: 2,
    value: "",
  },
  {
    id: "gov_email",
    name: "email",
    label: "Correo electrónico de contacto",
    type: "email",
    placeholder: "nombre@ejemplo.com",
    required: true,
    step: 2,
    value: "",
    helpText: "Se enviará el resguardo oficial y localizador a esta dirección.",
  },
  {
    id: "gov_phone",
    name: "phone",
    label: "Teléfono móvil (para SMS de confirmación)",
    type: "tel",
    placeholder: "+34 600 000 000",
    required: true,
    step: 2,
    value: "",
  },
  {
    id: "gov_urgent_reason",
    name: "urgentReason",
    label: "Motivo / Justificante de necesidad o urgencia",
    type: "textarea",
    placeholder: "Describe brevemente la justificación de la cita...",
    required: false,
    step: 2,
    value: "",
  },

  // Paso 3
  {
    id: "gov_pref_date",
    name: "preferredDate",
    label: "Fecha preferida para la cita",
    type: "date",
    required: true,
    step: 3,
    value: "2026-09-15",
  },
  {
    id: "gov_pref_time",
    name: "preferredTimeSlot",
    label: "Franja horaria o turno deseado",
    type: "select",
    required: true,
    step: 3,
    value: "10:30",
    options: [
      { label: "Selecciona horario...", value: "" },
      { label: "09:00 - Primer turno mañana", value: "09:00" },
      { label: "10:30 - Media mañana", value: "10:30" },
      { label: "12:00 - Mediodía", value: "12:00" },
      { label: "16:00 - Primer turno tarde", value: "16:00" },
      { label: "17:30 - Tarde", value: "17:30" },
    ],
  },
  {
    id: "gov_notify_sms",
    name: "notifySms",
    label: "Deseo recibir recordatorio de cita por SMS gratuito 24h antes",
    type: "checkbox",
    required: false,
    step: 3,
    value: true,
  },
  {
    id: "gov_terms",
    name: "acceptTerms",
    label: "Declaro bajo juramento la veracidad de los datos aportados conforme a la Ley de Procedimiento Administrativo",
    type: "checkbox",
    required: true,
    step: 3,
    value: false,
  },
];

export const GovernmentAppointmentSite: React.FC<GovernmentSiteProps> = ({
  currentStep,
  onStepChange,
  fields,
  onFieldChange,
  activeFieldId,
  isAgentTyping,
}) => {
  const getFieldValue = (id: string) => {
    const f = fields.find((item) => item.id === id);
    return f ? f.value : "";
  };

  const isFieldHighlighted = (id: string) => activeFieldId === id;

  const stepFields = fields.filter((f) => f.step === currentStep);

  return (
    <div className="w-full min-h-full bg-slate-50 text-slate-800 font-sans pb-12" id="site_gov_portal">
      {/* Header Institucional */}
      <header className="bg-slate-900 text-white border-b-4 border-amber-500 shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                Sede Electrónica Oficial
              </div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Sistema Centralizado de Citas y Trámites Públicos
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 text-slate-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Conexión Segura SSL 256-bit</span>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <Shield className="w-3.5 h-3.5" /> Portal Ciudadano
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Solicitud y Reserva de Cita Previa Oficial
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Complete los 3 sencillos pasos para confirmar su cita presencial con código seguro de verificación (CSV).
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <button
                  type="button"
                  onClick={() => onStepChange(step)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep === step
                      ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm"
                      : currentStep > step
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                  }`}
                  id={`btn_step_indicator_${step}`}
                >
                  {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
                </button>
                {step < 4 && (
                  <div
                    className={`w-6 sm:w-10 h-1 mx-1 rounded ${
                      currentStep > step ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" id="gov_form_card">
          {/* Step header title */}
          <div className="bg-slate-50/80 px-8 py-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {currentStep}
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {currentStep === 1 && "Paso 1: Selección de Trámite y Oficina"}
                  {currentStep === 2 && "Paso 2: Datos Personales del Solicitante"}
                  {currentStep === 3 && "Paso 3: Elección de Fecha, Turno y Notificaciones"}
                  {currentStep === 4 && "Paso 4: Resguardo Oficial de Cita Confirmada"}
                </h3>
                <p className="text-xs text-slate-500">
                  {currentStep === 1 && "Indique la provincia y el tipo de gestión a realizar."}
                  {currentStep === 2 && "Introduzca los datos del titular que asistirá a la oficina."}
                  {currentStep === 3 && "Seleccione el día y franja horaria preferente."}
                  {currentStep === 4 && "Cita registrada con éxito en el Registro General Electrónico."}
                </p>
              </div>
            </div>

            <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              Paso {currentStep} de 4
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Province */}
                  <div>
                    <label htmlFor="gov_province" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Provincia <span className="text-rose-500">*</span>
                    </label>
                    <div className={`relative rounded-xl border transition-all ${
                      isFieldHighlighted("gov_province")
                        ? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/20"
                        : "border-slate-300 hover:border-slate-400"
                    }`}>
                      <select
                        id="gov_province"
                        name="province"
                        value={String(getFieldValue("gov_province"))}
                        onChange={(e) => onFieldChange("gov_province", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 rounded-xl focus:outline-none"
                      >
                        <option value="">Selecciona provincia...</option>
                        <option value="Madrid">Madrid</option>
                        <option value="Barcelona">Barcelona</option>
                        <option value="Valencia">Valencia</option>
                        <option value="Sevilla">Sevilla</option>
                        <option value="Zaragoza">Zaragoza</option>
                        <option value="Málaga">Málaga</option>
                        <option value="Bilbao">Bilbao</option>
                      </select>
                    </div>
                  </div>

                  {/* Procedure */}
                  <div>
                    <label htmlFor="gov_procedure" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Trámite Oficial <span className="text-rose-500">*</span>
                    </label>
                    <div className={`relative rounded-xl border transition-all ${
                      isFieldHighlighted("gov_procedure")
                        ? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/20"
                        : "border-slate-300 hover:border-slate-400"
                    }`}>
                      <select
                        id="gov_procedure"
                        name="appointmentReason"
                        value={String(getFieldValue("gov_procedure"))}
                        onChange={(e) => onFieldChange("gov_procedure", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 rounded-xl focus:outline-none"
                      >
                        <option value="">Selecciona trámite...</option>
                        <option value="Renovación Documento de Identidad y Pasaporte">Renovación Documento de Identidad y Pasaporte</option>
                        <option value="Emisión de Certificado Digital FNMT">Emisión de Certificado Digital FNMT</option>
                        <option value="Trámites de Extranjería / NIE / TIE">Trámites de Extranjería / NIE / TIE</option>
                        <option value="Registro Civil e Inscripciones">Registro Civil e Inscripciones</option>
                        <option value="Seguridad Social y Prestaciones">Seguridad Social y Prestaciones</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Office */}
                <div>
                  <label htmlFor="gov_office" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Oficina o Centro de Atención Presencial <span className="text-rose-500">*</span>
                  </label>
                  <div className={`relative rounded-xl border transition-all ${
                    isFieldHighlighted("gov_office")
                      ? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/20"
                      : "border-slate-300 hover:border-slate-400"
                  }`}>
                    <select
                      id="gov_office"
                      name="officeLocation"
                      value={String(getFieldValue("gov_office"))}
                      onChange={(e) => onFieldChange("gov_office", e.target.value)}
                      className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 rounded-xl focus:outline-none"
                    >
                      <option value="">Selecciona oficina...</option>
                      <option value="Oficina Central de Madrid - Gran Vía">Oficina Central de Madrid - Gran Vía</option>
                      <option value="Comisaría de Policía / DNI - Calle Almagro">Comisaría de Policía / DNI - Calle Almagro</option>
                      <option value="Oficina de Distrito - Retiro / Chamberí">Oficina de Distrito - Retiro / Chamberí</option>
                      <option value="Delegación del Gobierno - Castellana">Delegación del Gobierno - Castellana</option>
                    </select>
                  </div>
                </div>

                {/* Information Card */}
                <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="text-xs text-blue-900 leading-relaxed">
                    <strong>Requisito importante:</strong> Deberá comparecer 10 minutos antes de la hora indicada provisto del documento de identidad original y una fotografía tamaño carnet en caso de renovación.
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Doc type */}
                  <div>
                    <label htmlFor="gov_doc_type" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Tipo Doc. <span className="text-rose-500">*</span>
                    </label>
                    <div className={`relative rounded-xl border transition-all ${
                      isFieldHighlighted("gov_doc_type")
                        ? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/20"
                        : "border-slate-300 hover:border-slate-400"
                    }`}>
                      <select
                        id="gov_doc_type"
                        name="documentType"
                        value={String(getFieldValue("gov_doc_type"))}
                        onChange={(e) => onFieldChange("gov_doc_type", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 rounded-xl focus:outline-none"
                      >
                        <option value="DNI">DNI (Español)</option>
                        <option value="NIE">NIE (Extranjero)</option>
                        <option value="Pasaporte">Pasaporte</option>
                      </select>
                    </div>
                  </div>

                  {/* Doc Number */}
                  <div className="md:col-span-2">
                    <label htmlFor="gov_doc_number" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Número de Documento <span className="text-rose-500">*</span>
                    </label>
                    <div className={`relative rounded-xl border transition-all ${
                      isFieldHighlighted("gov_doc_number")
                        ? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/20"
                        : "border-slate-300 hover:border-slate-400"
                    }`}>
                      <input
                        type="text"
                        id="gov_doc_number"
                        name="documentNumber"
                        placeholder="Ej: 48712390X"
                        value={String(getFieldValue("gov_doc_number"))}
                        onChange={(e) => onFieldChange("gov_doc_number", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 rounded-xl focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First name */}
                  <div>
                    <label htmlFor="gov_first_name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Nombre de pila <span className="text-rose-500">*</span>
                    </label>
                    <div className={`relative rounded-xl border transition-all ${
                      isFieldHighlighted("gov_first_name")
                        ? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/20"
                        : "border-slate-300 hover:border-slate-400"
                    }`}>
                      <input
                        type="text"
                        id="gov_first_name"
                        name="firstName"
                        placeholder="Ej: Carlos"
                        value={String(getFieldValue("gov_first_name"))}
                        onChange={(e) => onFieldChange("gov_first_name", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Last name */}
                  <div>
                    <label htmlFor="gov_last_name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Apellidos completos <span className="text-rose-500">*</span>
                    </label>
                    <div className={`relative rounded-xl border transition-all ${
                      isFieldHighlighted("gov_last_name")
                        ? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/20"
                        : "border-slate-300 hover:border-slate-400"
                    }`}>
                      <input
                        type="text"
                        id="gov_last_name"
                        name="lastName"
                        placeholder="Ej: Gómez Navarro"
                        value={String(getFieldValue("gov_last_name"))}
                        onChange={(e) => onFieldChange("gov_last_name", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div>
                    <label htmlFor="gov_email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Correo electrónico <span className="text-rose-500">*</span>
                    </label>
                    <div className={`relative rounded-xl border transition-all ${
                      isFieldHighlighted("gov_email")
                        ? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/20"
                        : "border-slate-300 hover:border-slate-400"
                    }`}>
                      <input
                        type="email"
                        id="gov_email"
                        name="email"
                        placeholder="carlos.gomez@ejemplo.com"
                        value={String(getFieldValue("gov_email"))}
                        onChange={(e) => onFieldChange("gov_email", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="gov_phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Teléfono móvil <span className="text-rose-500">*</span>
                    </label>
                    <div className={`relative rounded-xl border transition-all ${
                      isFieldHighlighted("gov_phone")
                        ? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/20"
                        : "border-slate-300 hover:border-slate-400"
                    }`}>
                      <input
                        type="tel"
                        id="gov_phone"
                        name="phone"
                        placeholder="+34 612 345 678"
                        value={String(getFieldValue("gov_phone"))}
                        onChange={(e) => onFieldChange("gov_phone", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Urgent reason */}
                <div>
                  <label htmlFor="gov_urgent_reason" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Motivo o justificación de urgencia (Opcional)
                  </label>
                  <div className={`relative rounded-xl border transition-all ${
                    isFieldHighlighted("gov_urgent_reason")
                      ? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/20"
                      : "border-slate-300 hover:border-slate-400"
                  }`}>
                    <textarea
                      id="gov_urgent_reason"
                      name="urgentReason"
                      rows={2}
                      placeholder="Indique si tiene un viaje inminente, requerimiento judicial o cita de trabajo..."
                      value={String(getFieldValue("gov_urgent_reason"))}
                      onChange={(e) => onFieldChange("gov_urgent_reason", e.target.value)}
                      className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 rounded-xl focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Preferred Date */}
                  <div>
                    <label htmlFor="gov_pref_date" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Fecha preferida de cita <span className="text-rose-500">*</span>
                    </label>
                    <div className={`relative rounded-xl border transition-all ${
                      isFieldHighlighted("gov_pref_date")
                        ? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/20"
                        : "border-slate-300 hover:border-slate-400"
                    }`}>
                      <input
                        type="date"
                        id="gov_pref_date"
                        name="preferredDate"
                        value={String(getFieldValue("gov_pref_date"))}
                        onChange={(e) => onFieldChange("gov_pref_date", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label htmlFor="gov_pref_time" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Turno y Franja Horaria <span className="text-rose-500">*</span>
                    </label>
                    <div className={`relative rounded-xl border transition-all ${
                      isFieldHighlighted("gov_pref_time")
                        ? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/20"
                        : "border-slate-300 hover:border-slate-400"
                    }`}>
                      <select
                        id="gov_pref_time"
                        name="preferredTimeSlot"
                        value={String(getFieldValue("gov_pref_time"))}
                        onChange={(e) => onFieldChange("gov_pref_time", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 rounded-xl focus:outline-none"
                      >
                        <option value="">Selecciona horario...</option>
                        <option value="09:00">09:00 - Primer turno mañana</option>
                        <option value="10:30">10:30 - Media mañana</option>
                        <option value="12:00">12:00 - Mediodía</option>
                        <option value="16:00">16:00 - Primer turno tarde</option>
                        <option value="17:30">17:30 - Tarde</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-4 pt-2">
                  <div className={`p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isFieldHighlighted("gov_notify_sms")
                      ? "border-blue-500 bg-blue-50/30"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                  }`}>
                    <input
                      type="checkbox"
                      id="gov_notify_sms"
                      name="notifySms"
                      checked={Boolean(getFieldValue("gov_notify_sms"))}
                      onChange={(e) => onFieldChange("gov_notify_sms", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="gov_notify_sms" className="text-xs text-slate-700 cursor-pointer select-none">
                      <span className="font-semibold block text-slate-900">Notificación y Recordatorio SMS gratuito</span>
                      Recibir un mensaje SMS en su teléfono 24 horas antes con el recordatorio de cita y documentación obligatoria.
                    </label>
                  </div>

                  <div className={`p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isFieldHighlighted("gov_terms")
                      ? "border-blue-500 bg-blue-50/30"
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                  }`}>
                    <input
                      type="checkbox"
                      id="gov_terms"
                      name="acceptTerms"
                      checked={Boolean(getFieldValue("gov_terms"))}
                      onChange={(e) => onFieldChange("gov_terms", e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="gov_terms" className="text-xs text-slate-700 cursor-pointer select-none">
                      <span className="font-semibold block text-slate-900">Declaración de Responsabilidad Legal <span className="text-rose-500">*</span></span>
                      Declaro bajo mi responsabilidad que los datos cumplimentados son exactos y que soy el titular o representante legítimo de la solicitud.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Summary / Confirmation */}
            {currentStep === 4 && (
              <div className="text-center py-4 space-y-6" id="gov_confirmation_view">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Cita Previa Registrada con Éxito
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-3">
                    Resguardo Oficial y Localizador Asignado
                  </h3>
                  <p className="text-sm text-slate-600 max-w-lg mx-auto mt-1">
                    Se ha reservado su turno en la sede oficial. Presente el siguiente código identificativo en el lector de la entrada.
                  </p>
                </div>

                {/* Ticket Details */}
                <div className="max-w-lg mx-auto bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
                  
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
                    <div>
                      <div className="text-xs text-slate-400 font-mono">LOCALIZADOR OFICIAL</div>
                      <div className="text-xl font-mono font-black text-amber-400 tracking-wider">
                        CSV-2026-MAD-98421
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">ESTADO</div>
                      <div className="text-xs font-bold text-emerald-400 uppercase">Confirmada</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Titular:</span>
                      <strong className="text-slate-100">{String(getFieldValue("gov_first_name"))} {String(getFieldValue("gov_last_name"))}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Documento:</span>
                      <strong className="text-slate-100 font-mono">{String(getFieldValue("gov_doc_number")) || "48712390X"}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Fecha y Hora:</span>
                      <strong className="text-slate-100">{String(getFieldValue("gov_pref_date")) || "2026-09-15"} - {String(getFieldValue("gov_pref_time")) || "10:30"}h</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Oficina:</span>
                      <strong className="text-slate-100 truncate block">{String(getFieldValue("gov_office")) || "Oficina Central Madrid"}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card Footer Navigation Buttons */}
          <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex items-center justify-between">
            {currentStep > 1 && currentStep < 4 ? (
              <button
                type="button"
                onClick={() => onStepChange(currentStep - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-2 hover:bg-slate-100 transition-colors"
                id="btn_gov_prev_step"
              >
                <ArrowLeft className="w-4 h-4" />
                Paso Anterior
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 && (
              <button
                type="button"
                onClick={() => onStepChange(currentStep + 1)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                id="btn_gov_next_step"
              >
                Continuar al Paso {currentStep + 1}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                onClick={() => onStepChange(4)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                id="btn_gov_submit_step"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirmar y Registrar Cita
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="button"
                onClick={() => onStepChange(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs flex items-center gap-2 transition-colors mx-auto"
                id="btn_gov_restart"
              >
                Solicitar Otra Cita
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
