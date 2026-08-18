import React from "react";
import { FormField } from "../../../types";
import { Briefcase, CheckCircle2, Code2, Globe, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

interface JobSiteProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  fields: FormField[];
  onFieldChange: (fieldId: string, value: any) => void;
  activeFieldId?: string;
  isAgentTyping?: boolean;
}

export const JOB_FIELDS: FormField[] = [
  // Paso 1: Contact & Links
  {
    id: "job_full_name",
    name: "fullName",
    label: "Nombre completo",
    type: "text",
    placeholder: "Ej: Elena Vega Morales",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "job_email",
    name: "email",
    label: "Correo electrónico profesional",
    type: "email",
    placeholder: "elena.vega.dev@ejemplo.com",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "job_phone",
    name: "phone",
    label: "Teléfono de contacto",
    type: "tel",
    placeholder: "+34 689 901 234",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "job_city",
    name: "city",
    label: "Ciudad / Ubicación actual",
    type: "text",
    placeholder: "Barcelona, España",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "job_linkedin",
    name: "linkedinUrl",
    label: "Perfil de LinkedIn",
    type: "text",
    placeholder: "https://linkedin.com/in/usuario",
    required: false,
    step: 1,
    value: "",
  },
  {
    id: "job_github",
    name: "githubUrl",
    label: "Perfil de GitHub o Portafolio",
    type: "text",
    placeholder: "https://github.com/usuario",
    required: false,
    step: 1,
    value: "",
  },

  // Paso 2: Experience & Tech
  {
    id: "job_title",
    name: "jobTitle",
    label: "Puesto o Cargo actual",
    type: "text",
    placeholder: "Ej: Senior Fullstack Engineer",
    required: true,
    step: 2,
    value: "",
  },
  {
    id: "job_exp_years",
    name: "experienceYears",
    label: "Años de experiencia relevante",
    type: "select",
    required: true,
    step: 2,
    value: "6",
    options: [
      { label: "Selecciona experiencia...", value: "" },
      { label: "1 - 2 años (Junior)", value: "1" },
      { label: "3 - 5 años (Mid-level)", value: "4" },
      { label: "6 - 9 años (Senior)", value: "6" },
      { label: "10+ años (Lead / Principal)", value: "10" },
    ],
  },
  {
    id: "job_salary",
    name: "salaryExpectation",
    label: "Expectativa Salarial Bruta Anual (€)",
    type: "number",
    placeholder: "58000",
    required: true,
    step: 2,
    value: "",
  },
  {
    id: "job_english",
    name: "englishLevel",
    label: "Nivel de Inglés",
    type: "select",
    required: true,
    step: 2,
    value: "C1 - Avanzado Profesional",
    options: [
      { label: "B1 - Intermedio", value: "B1 - Intermedio" },
      { label: "B2 - Intermedio Alto", value: "B2 - Intermedio Alto" },
      { label: "C1 - Avanzado Profesional", value: "C1 - Avanzado Profesional" },
      { label: "C2 / Nativo", value: "C2 / Nativo" },
    ],
  },
  {
    id: "job_skills",
    name: "skills",
    label: "Tecnologías y Habilidades principales",
    type: "text",
    placeholder: "React, TypeScript, Node.js, Next.js, Docker, Tailwind...",
    required: true,
    step: 2,
    value: "",
  },

  // Paso 3: Fit & Motivation
  {
    id: "job_remote_pref",
    name: "remotePreference",
    label: "Preferencia de Modalidad de Trabajo",
    type: "select",
    required: true,
    step: 3,
    value: "Remoto 100%",
    options: [
      { label: "Remoto 100%", value: "Remoto 100%" },
      { label: "Híbrido (2 días oficina)", value: "Híbrido" },
      { label: "Presencial", value: "Presencial" },
    ],
  },
  {
    id: "job_cover_letter",
    name: "coverLetter",
    label: "Carta de Presentación / ¿Por qué eres ideal para este puesto?",
    type: "textarea",
    placeholder: "Comparte tus logros destacados y motivaciones para unirte al equipo...",
    required: true,
    step: 3,
    value: "",
  },
  {
    id: "job_gdpr",
    name: "acceptTerms",
    label: "Acepto el tratamiento de datos curriculares conforme al RGPD",
    type: "checkbox",
    required: true,
    step: 3,
    value: true,
  },
];

export const JobApplicationSite: React.FC<JobSiteProps> = ({
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
    <div className="w-full min-h-full bg-slate-900 text-slate-100 font-sans pb-12" id="site_job_portal">
      {/* Top Navbar */}
      <nav className="bg-slate-950/80 backdrop-blur border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20 text-white">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white">TechCorp Talent Portal</span>
              <span className="text-xs text-indigo-400 block font-mono">careers.techcorp.io</span>
            </div>
          </div>
          <div className="text-xs px-3 py-1 bg-indigo-950/80 text-indigo-300 rounded-full border border-indigo-800">
            Vacante: Senior Fullstack Engineer
          </div>
        </div>
      </nav>

      {/* Main card */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-indigo-950/40">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
                  <Briefcase className="w-3.5 h-3.5" /> Equipo de Ingeniería • 100% Remoto
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Formulario de Candidatura Directa
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Proceso ágil de selección técnica. El asistente completará sus datos en segundos.
                </p>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                        currentStep === step
                          ? "bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-lg shadow-indigo-600/30"
                          : currentStep > step
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
                    </div>
                    {step < 3 && <div className="w-6 h-0.5 bg-slate-800 mx-1" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Step Body */}
          <div className="p-8 space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Globe className="w-4 h-4" /> 1. Datos de Contacto y Redes Técnicas
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="job_full_name" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Nombre y Apellidos <span className="text-rose-400">*</span>
                    </label>
                    <div className={`rounded-xl border transition-all ${
                      isHighlighted("job_full_name") ? "border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/30" : "border-slate-800 bg-slate-900"
                    }`}>
                      <input
                        type="text"
                        id="job_full_name"
                        name="fullName"
                        placeholder="Elena Vega Morales"
                        value={String(getVal("job_full_name"))}
                        onChange={(e) => onFieldChange("job_full_name", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="job_email" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Correo Electrónico <span className="text-rose-400">*</span>
                    </label>
                    <div className={`rounded-xl border transition-all ${
                      isHighlighted("job_email") ? "border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/30" : "border-slate-800 bg-slate-900"
                    }`}>
                      <input
                        type="email"
                        id="job_email"
                        name="email"
                        placeholder="elena.vega.dev@ejemplo.com"
                        value={String(getVal("job_email"))}
                        onChange={(e) => onFieldChange("job_email", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="job_phone" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Teléfono Móvil <span className="text-rose-400">*</span>
                    </label>
                    <div className={`rounded-xl border transition-all ${
                      isHighlighted("job_phone") ? "border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/30" : "border-slate-800 bg-slate-900"
                    }`}>
                      <input
                        type="tel"
                        id="job_phone"
                        name="phone"
                        placeholder="+34 689 901 234"
                        value={String(getVal("job_phone"))}
                        onChange={(e) => onFieldChange("job_phone", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="job_city" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Ciudad y País de Residencia <span className="text-rose-400">*</span>
                    </label>
                    <div className={`rounded-xl border transition-all ${
                      isHighlighted("job_city") ? "border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/30" : "border-slate-800 bg-slate-900"
                    }`}>
                      <input
                        type="text"
                        id="job_city"
                        name="city"
                        placeholder="Barcelona, España"
                        value={String(getVal("job_city"))}
                        onChange={(e) => onFieldChange("job_city", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="job_linkedin" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Perfil LinkedIn URL
                    </label>
                    <div className={`rounded-xl border transition-all ${
                      isHighlighted("job_linkedin") ? "border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/30" : "border-slate-800 bg-slate-900"
                    }`}>
                      <input
                        type="text"
                        id="job_linkedin"
                        name="linkedinUrl"
                        placeholder="https://linkedin.com/in/usuario"
                        value={String(getVal("job_linkedin"))}
                        onChange={(e) => onFieldChange("job_linkedin", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="job_github" className="block text-xs font-medium text-slate-300 mb-1.5">
                      GitHub / GitLab / Portfolio
                    </label>
                    <div className={`rounded-xl border transition-all ${
                      isHighlighted("job_github") ? "border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/30" : "border-slate-800 bg-slate-900"
                    }`}>
                      <input
                        type="text"
                        id="job_github"
                        name="githubUrl"
                        placeholder="https://github.com/usuario"
                        value={String(getVal("job_github"))}
                        onChange={(e) => onFieldChange("job_github", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> 2. Perfil Técnico y Expectativas
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="job_title" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Puesto Actual o Especialidad <span className="text-rose-400">*</span>
                    </label>
                    <div className={`rounded-xl border transition-all ${
                      isHighlighted("job_title") ? "border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/30" : "border-slate-800 bg-slate-900"
                    }`}>
                      <input
                        type="text"
                        id="job_title"
                        name="jobTitle"
                        placeholder="Senior Fullstack Engineer"
                        value={String(getVal("job_title"))}
                        onChange={(e) => onFieldChange("job_title", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="job_exp_years" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Años de Experiencia <span className="text-rose-400">*</span>
                    </label>
                    <div className={`rounded-xl border transition-all ${
                      isHighlighted("job_exp_years") ? "border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/30" : "border-slate-800 bg-slate-900"
                    }`}>
                      <select
                        id="job_exp_years"
                        name="experienceYears"
                        value={String(getVal("job_exp_years"))}
                        onChange={(e) => onFieldChange("job_exp_years", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none"
                      >
                        <option value="1" className="bg-slate-900">1 - 2 años</option>
                        <option value="4" className="bg-slate-900">3 - 5 años</option>
                        <option value="6" className="bg-slate-900">6 - 9 años (Senior)</option>
                        <option value="10" className="bg-slate-900">10+ años (Lead)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="job_salary" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Expectativa Salarial Bruta Anual (€) <span className="text-rose-400">*</span>
                    </label>
                    <div className={`rounded-xl border transition-all ${
                      isHighlighted("job_salary") ? "border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/30" : "border-slate-800 bg-slate-900"
                    }`}>
                      <input
                        type="number"
                        id="job_salary"
                        name="salaryExpectation"
                        placeholder="58000"
                        value={String(getVal("job_salary"))}
                        onChange={(e) => onFieldChange("job_salary", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="job_english" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Nivel de Inglés <span className="text-rose-400">*</span>
                    </label>
                    <div className={`rounded-xl border transition-all ${
                      isHighlighted("job_english") ? "border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/30" : "border-slate-800 bg-slate-900"
                    }`}>
                      <select
                        id="job_english"
                        name="englishLevel"
                        value={String(getVal("job_english"))}
                        onChange={(e) => onFieldChange("job_english", e.target.value)}
                        className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none"
                      >
                        <option value="B1 - Intermedio" className="bg-slate-900">B1 - Intermedio</option>
                        <option value="B2 - Intermedio Alto" className="bg-slate-900">B2 - Intermedio Alto</option>
                        <option value="C1 - Avanzado Profesional" className="bg-slate-900">C1 - Avanzado Profesional</option>
                        <option value="C2 / Nativo" className="bg-slate-900">C2 / Nativo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="job_skills" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Stack y Tecnologías Clave <span className="text-rose-400">*</span>
                  </label>
                  <div className={`rounded-xl border transition-all ${
                    isHighlighted("job_skills") ? "border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/30" : "border-slate-800 bg-slate-900"
                  }`}>
                    <input
                      type="text"
                      id="job_skills"
                      name="skills"
                      placeholder="React, TypeScript, Node.js, Next.js, Docker, Tailwind..."
                      value={String(getVal("job_skills"))}
                      onChange={(e) => onFieldChange("job_skills", e.target.value)}
                      className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> 3. Motivación y Envío Final
                </h3>

                <div>
                  <label htmlFor="job_remote_pref" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Preferencia de Modalidad <span className="text-rose-400">*</span>
                  </label>
                  <div className={`rounded-xl border transition-all ${
                    isHighlighted("job_remote_pref") ? "border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/30" : "border-slate-800 bg-slate-900"
                  }`}>
                    <select
                      id="job_remote_pref"
                      name="remotePreference"
                      value={String(getVal("job_remote_pref"))}
                      onChange={(e) => onFieldChange("job_remote_pref", e.target.value)}
                      className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none"
                    >
                      <option value="Remoto 100%" className="bg-slate-900">Remoto 100% (Global)</option>
                      <option value="Híbrido" className="bg-slate-900">Híbrido</option>
                      <option value="Presencial" className="bg-slate-900">Presencial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="job_cover_letter" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Carta de Motivación / Breve Presentación <span className="text-rose-400">*</span>
                  </label>
                  <div className={`rounded-xl border transition-all ${
                    isHighlighted("job_cover_letter") ? "border-indigo-400 ring-2 ring-indigo-500/30 bg-indigo-950/30" : "border-slate-800 bg-slate-900"
                  }`}>
                    <textarea
                      id="job_cover_letter"
                      name="coverLetter"
                      rows={4}
                      placeholder="Cuéntanos brevemente sobre tus proyectos más desafiantes y por qué te atrae este rol..."
                      value={String(getVal("job_cover_letter"))}
                      onChange={(e) => onFieldChange("job_cover_letter", e.target.value)}
                      className="w-full px-4 py-3 bg-transparent text-sm text-white focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${
                  isHighlighted("job_gdpr") ? "border-indigo-400 bg-indigo-950/40" : "border-slate-800 bg-slate-900/60"
                }`}>
                  <input
                    type="checkbox"
                    id="job_gdpr"
                    name="acceptTerms"
                    checked={Boolean(getVal("job_gdpr"))}
                    onChange={(e) => onFieldChange("job_gdpr", e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-700 bg-slate-800 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="job_gdpr" className="text-xs text-slate-300 cursor-pointer">
                    Autorizo a TechCorp al almacenamiento y tratamiento confidencial de mis datos con fines exclusivos de reclutamiento laboral.
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="p-6 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => onStepChange(currentStep - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 flex items-center gap-2"
                id="btn_job_prev"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => onStepChange(currentStep + 1)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                id="btn_job_next"
              >
                Paso Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => alert("¡Candidatura enviada con éxito a TechCorp!")}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30"
                id="btn_job_submit"
              >
                <CheckCircle2 className="w-4 h-4" /> Enviar Solicitud de Empleo
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
