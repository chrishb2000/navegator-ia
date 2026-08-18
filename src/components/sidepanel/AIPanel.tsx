import React, { useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import {
  AgentLog,
  AIAutomationEngine,
  AutomationSettings,
  AutomationStatus,
  TypingSpeed,
  UserProfile,
} from "../../types";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Pause,
  RotateCcw,
  Sliders,
  Send,
  User,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Terminal,
  FileText,
  Lock,
  Cpu,
  Layers,
  Cloud,
} from "lucide-react";

interface AIPanelProps {
  userText: string;
  onUserTextChange: (val: string) => void;
  profiles: UserProfile[];
  selectedProfileId: string;
  onSelectProfile: (profileId: string) => void;
  onOpenProfileModal: () => void;
  onOpenGoogleDrive?: () => void;
  googleUser?: FirebaseUser | null;
  automationStatus: AutomationStatus;
  onStartAutofill: () => void;
  onPauseAutofill: () => void;
  onResetForm: () => void;
  agentLogs: AgentLog[];
  settings: AutomationSettings;
  onUpdateSettings: (newSettings: Partial<AutomationSettings>) => void;
  currentStep: number;
  totalSteps: number;
  activeFieldsCount: number;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  userText,
  onUserTextChange,
  profiles,
  selectedProfileId,
  onSelectProfile,
  onOpenProfileModal,
  onOpenGoogleDrive,
  googleUser,
  automationStatus,
  onStartAutofill,
  onPauseAutofill,
  onResetForm,
  agentLogs,
  settings,
  onUpdateSettings,
  currentStep,
  totalSteps,
  activeFieldsCount,
}) => {
  const [activeTab, setActiveTab] = useState<"assistant" | "logs" | "settings">("assistant");
  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);

  const isRunning =
    automationStatus === "scanning" ||
    automationStatus === "typing" ||
    automationStatus === "advancing";

  const handleQuickPrompt = (prompt: string) => {
    onUserTextChange(prompt);
  };

  return (
    <aside
      className="w-full sm:w-[380px] lg:w-[400px] h-full bg-white border-l border-slate-300 flex flex-col shadow-xl shrink-0 select-none z-30 font-sans"
      id="ai_sidepanel_container"
    >
      {/* 1. Panel Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              AI Navigator
            </span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Local Encrypted Mode
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 text-[10px] font-mono font-medium text-slate-600">
          <Cpu className="w-3 h-3 text-indigo-600" />
          <span>{settings.engine === "gemini" ? "Gemini 3.7" : "Heurística"}</span>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center bg-slate-50 px-4 pt-2 border-b border-slate-200 text-xs font-semibold gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("assistant")}
          className={`pb-2.5 px-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "assistant"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
          id="tab_btn_assistant"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Asistente</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className={`pb-2.5 px-2.5 border-b-2 transition-all flex items-center gap-1.5 relative ${
            activeTab === "logs"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
          id="tab_btn_logs"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Timeline</span>
          {agentLogs.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`pb-2.5 px-2.5 border-b-2 transition-all flex items-center gap-1.5 ml-auto ${
            activeTab === "settings"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
          id="tab_btn_settings"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Ajustes</span>
        </button>
      </div>

      {/* 3. Panel Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-700 bg-white">
        {activeTab === "assistant" && (
          <div className="space-y-4">
            {/* Profile Selection */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3 h-3 text-indigo-600" />
                  Perfil de Bóveda Guardado
                </label>
                <button
                  type="button"
                  onClick={onOpenProfileModal}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold underline"
                  id="btn_manage_profiles"
                >
                  Gestionar perfiles
                </button>
              </div>

              <select
                value={selectedProfileId}
                onChange={(e) => onSelectProfile(e.target.value)}
                className="w-full bg-slate-50 text-xs font-semibold text-slate-800 px-3 py-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                id="select_profile_dropdown"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Natural language / Free-form Textarea */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="user_prompt_textarea" className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Instrucciones o Datos de Entrada
                </label>
                {onOpenGoogleDrive && (
                  <button
                    type="button"
                    onClick={onOpenGoogleDrive}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
                    title="Importar documentos desde Google Drive"
                  >
                    <Cloud className="w-3 h-3" />
                    <span>{googleUser ? "Importar de Drive" : "Conectar Drive"}</span>
                  </button>
                )}
              </div>

              <textarea
                id="user_prompt_textarea"
                rows={3}
                value={userText}
                onChange={(e) => onUserTextChange(e.target.value)}
                placeholder="Escribe tus datos o instrucciones (ej. Nombre, DNI, dirección, fecha y motivo de la cita)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-800 resize-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-sans leading-relaxed shadow-2xs"
              />
            </div>

            {/* Quick example prompt chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Pruebas rápidas con 1-clic:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickPrompt(
                      "Cita previa para Renovación DNI y Pasaporte en Madrid el 15/09/2026 a las 10:30h con Carlos Gómez (DNI 48712390X, email carlos.gomez@correo.es, tel 612345678)"
                    )
                  }
                  className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 border border-slate-200 hover:border-indigo-300 transition-colors shadow-2xs"
                >
                  🏛️ Cita DNI Madrid
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickPrompt(
                      "Candidatura Senior Fullstack: Elena Vega, 6 años de experiencia, expectativa 58.000€, stack React y TypeScript, trabajo remoto 100%"
                    )
                  }
                  className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 border border-slate-200 hover:border-indigo-300 transition-colors shadow-2xs"
                >
                  💼 Empleo Tech
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickPrompt(
                      "Compra online para Digital Logistics SL con CIF B-88349201, dirección Parque Tecnológico Valencia y pago con tarjeta 4532..."
                    )
                  }
                  className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 border border-slate-200 hover:border-indigo-300 transition-colors shadow-2xs"
                >
                  🛒 Checkout B2B
                </button>
              </div>
            </div>

            {/* Detected Flow Info */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Campos detectados en página:
                </span>
                <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {activeFieldsCount} campos
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-700 font-medium">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  Flujo del sitio web:
                </span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Paso {currentStep} de {totalSteps}
                </span>
              </div>
            </div>

            {/* Auto Advance Toggle */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <label htmlFor="chk_auto_advance" className="text-xs text-slate-800 font-medium flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  id="chk_auto_advance"
                  checked={settings.autoAdvance}
                  onChange={(e) => onUpdateSettings({ autoAdvance: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <span>Avanzar automáticamente todos los pasos</span>
              </label>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-2 pt-1">
              {isRunning ? (
                <button
                  type="button"
                  onClick={onPauseAutofill}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-lg text-sm shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  id="btn_pause_autofill"
                >
                  <Pause className="w-4 h-4" />
                  Pausar Ejecución
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onStartAutofill}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-lg text-sm transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
                  id="btn_start_autofill"
                >
                  <Zap className="w-4 h-4" />
                  ⚡ Rellenar Formulario con IA
                </button>
              )}

              <button
                type="button"
                onClick={onResetForm}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                id="btn_reset_form"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpiar campos del formulario
              </button>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === "logs" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold">Registro de Eventos DOM</span>
              <span className="text-[10px] font-mono">{agentLogs.length} eventos</span>
            </div>

            {agentLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-300 rounded-lg">
                Inicia el autocompletado para ver los eventos del navegador en tiempo real.
              </div>
            ) : (
              <div className="space-y-2 font-mono text-[11px]" id="agent_logs_feed">
                {agentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2 text-slate-700"
                  >
                    {log.type === "scan" && <Sparkles className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />}
                    {log.type === "match" && <Zap className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />}
                    {log.type === "type" && <Send className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />}
                    {log.type === "advance" && <ChevronRight className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />}
                    {log.type === "success" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />}
                    {log.type === "warn" && <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />}

                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center text-[9px] text-slate-400 mb-0.5">
                        <span>{log.timestamp}</span>
                        {log.step && <span>Paso {log.step}</span>}
                      </div>
                      <div className="text-slate-800 leading-snug font-sans text-xs">{log.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-4 text-xs">
            {/* Engine Selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Motor de Inferencia de la IA</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ engine: "gemini" })}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    settings.engine === "gemini"
                      ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                  id="engine_opt_gemini"
                >
                  <div className="font-bold text-xs text-indigo-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Gemini 3.7
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Razonamiento semántico profundo
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onUpdateSettings({ engine: "heuristic_local" })}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    settings.engine === "heuristic_local"
                      ? "border-emerald-600 bg-emerald-50/50 text-emerald-900 shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                  id="engine_opt_local"
                >
                  <div className="font-bold text-xs text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Heurística Local
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    100% Offline en navegador
                  </div>
                </button>
              </div>
            </div>

            {/* Speed selection */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Velocidad de Escritura</label>
              <div className="grid grid-cols-3 gap-2">
                {(["instant", "fast", "natural"] as TypingSpeed[]).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => onUpdateSettings({ typingSpeed: spd })}
                    className={`py-2 rounded-lg border text-center transition-all capitalize font-semibold ${
                      settings.typingSpeed === spd
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                    id={`speed_opt_${spd}`}
                  >
                    {spd === "instant" && "Instantánea"}
                    {spd === "fast" && "Rápida"}
                    {spd === "natural" && "Humana"}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual highlight toggle */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-700">Resaltar campo activo</div>
                <div className="text-[10px] text-slate-500">Muestra borde y fondo esmeralda durante la escritura</div>
              </div>
              <input
                type="checkbox"
                checked={settings.highlightActiveField}
                onChange={(e) => onUpdateSettings({ highlightActiveField: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <div className="flex justify-between items-center opacity-70">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Data Origin: Local RAM &amp; Encrypted Storage
          </span>
          <div className="w-4 h-4 text-slate-400">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </aside>
  );
};
