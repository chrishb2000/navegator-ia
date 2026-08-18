import React, { useState } from "react";
import { User } from "firebase/auth";
import { BrowserTab, PanelPosition, WebSitePreset } from "../../types";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock,
  PanelLeft,
  PanelRight,
  ShieldCheck,
  Code2,
  Bookmark,
  Plus,
  X,
  Layers,
  Sparkles,
  ChevronDown,
  Cloud,
} from "lucide-react";

export const SITE_PRESETS: WebSitePreset[] = [
  {
    id: "site_gov",
    name: "Sede Electrónica Citas",
    url: "https://sede.administracion.gob.es/citas-tramites",
    category: "Oficial / Trámites",
    iconName: "Building2",
    description: "Portal oficial de cita previa para DNI, Pasaporte y Trámites Públicos (4 pasos).",
    totalSteps: 4,
  },
  {
    id: "site_jobs",
    name: "TechCorp Empleo",
    url: "https://jobs.techcorp.io/apply/senior-fullstack",
    category: "Laboral / IT",
    iconName: "Code2",
    description: "Portal de reclutamiento para puesto Senior Fullstack Engineer (3 pasos).",
    totalSteps: 3,
  },
  {
    id: "site_ecommerce",
    name: "NordicGear Checkout",
    url: "https://shop.nordicgear.com/checkout/step-1",
    category: "E-Commerce",
    iconName: "ShoppingBag",
    description: "Pasarela de pago y facturación para pedidos comerciales (3 pasos).",
    totalSteps: 3,
  },
  {
    id: "site_fintech",
    name: "NovaBank KYC Digital",
    url: "https://app.novabank.com/open-account",
    category: "Banca / Fintech",
    iconName: "Landmark",
    description: "Apertura de cuenta bancaria y verificación de identidad digital (3 pasos).",
    totalSteps: 3,
  },
  {
    id: "site_custom",
    name: "Formulario Libre",
    url: "custom://formulario-personalizado",
    category: "Playground",
    iconName: "FileCode",
    description: "Simulador de campos DOM personalizados interactivos.",
    totalSteps: 2,
  },
];

interface BrowserChromeProps {
  tabs: BrowserTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTab: () => void;
  onNavigateUrl: (url: string) => void;
  onRefresh: () => void;
  panelSide: PanelPosition;
  onTogglePanelSide: () => void;
  onOpenInspector: () => void;
  onOpenProfileVault: () => void;
  onOpenGoogleDrive: () => void;
  googleUser: User | null;
  isAgentRunning: boolean;
  activeStep: number;
  totalSteps: number;
}

export const BrowserChrome: React.FC<BrowserChromeProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onNavigateUrl,
  onRefresh,
  panelSide,
  onTogglePanelSide,
  onOpenInspector,
  onOpenProfileVault,
  onOpenGoogleDrive,
  googleUser,
  isAgentRunning,
  activeStep,
  totalSteps,
}) => {
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const [inputUrl, setInputUrl] = useState(activeTab?.url || "");
  const [showPresetsDropdown, setShowPresetsDropdown] = useState(false);

  // Keep input in sync with active tab URL
  React.useEffect(() => {
    if (activeTab) {
      setInputUrl(activeTab.url);
    }
  }, [activeTab?.url]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    const preset = SITE_PRESETS.find(
      (p) =>
        p.url.toLowerCase() === inputUrl.toLowerCase() ||
        p.name.toLowerCase() === inputUrl.toLowerCase()
    );
    if (preset) {
      onNavigateUrl(preset.url);
    } else {
      onNavigateUrl(inputUrl);
    }
  };

  return (
    <div className="w-full bg-slate-100 border-b border-slate-300 flex flex-col shrink-0" id="browser_chrome_container">
      {/* 1. Tab Bar with Window Dots */}
      <div className="flex items-center px-4 pt-2.5 gap-2 bg-slate-200 border-b border-slate-300">
        {/* Window Traffic Light Dots */}
        <div className="flex items-center gap-1.5 mr-3 shrink-0">
          <div className="w-3 h-3 rounded-full bg-rose-400 border border-rose-500/30" />
          <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/30" />
          <div className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/30" />
        </div>

        {/* Tab Items */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`group relative flex items-center gap-2 max-w-[220px] min-w-[140px] px-3.5 py-2 rounded-t-lg text-xs font-semibold cursor-pointer transition-all ${
                  isActive
                    ? "bg-white text-slate-800 border-t-2 border-indigo-600 border-x border-slate-300 shadow-xs"
                    : "bg-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-800 border-t-2 border-transparent border-x border-transparent"
                }`}
                id={`browser_tab_${tab.id}`}
              >
                {tab.loading ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-600 shrink-0" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                )}
                <span className="truncate flex-1">{tab.title}</span>
                {tabs.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:bg-slate-200 p-0.5 rounded text-slate-400 hover:text-slate-700 transition-opacity"
                    title="Cerrar pestaña"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* New Tab Button */}
          <button
            type="button"
            onClick={onNewTab}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-300/60 transition-colors ml-1"
            title="Nueva pestaña"
            id="btn_browser_new_tab"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Status Indicator */}
        <div className="flex items-center gap-3 shrink-0 pl-2">
          {isAgentRunning && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold animate-pulse shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
              <span>Autocompletando Paso {activeStep}/{totalSteps}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Bóveda 100% Local</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation & Omnibox Bar */}
      <div className="h-14 bg-white flex items-center px-4 gap-3 border-b border-slate-200">
        {/* Nav Controls */}
        <div className="flex items-center gap-1 text-slate-500">
          <button
            type="button"
            onClick={() => {
              if (activeStep > 1) onNavigateUrl(activeTab.url);
            }}
            className="p-2 rounded-md hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Atrás"
            id="btn_browser_back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 rounded-md hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Adelante"
            id="btn_browser_forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-md hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Recargar página"
            id="btn_browser_refresh"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateUrl(SITE_PRESETS[0].url)}
            className="p-2 rounded-md hover:bg-slate-100 hover:text-slate-800 transition-colors"
            title="Inicio"
            id="btn_browser_home"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Omnibox URL Input */}
        <div className="flex-1 relative">
          <form onSubmit={handleUrlSubmit} className="relative flex items-center gap-2">
            <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 rounded-lg border-2 border-slate-300 h-10 flex items-center px-3 gap-2.5 focus-within:border-indigo-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-2xs">
              <div className="w-4 h-4 text-emerald-600 shrink-0 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onFocus={() => setShowPresetsDropdown(true)}
                placeholder="Dirección URL del sitio web (ej: https://sede.administracion.gob.es/citas-tramites)..."
                className="w-full bg-transparent text-xs text-slate-800 font-mono placeholder-slate-400 focus:outline-none font-medium"
                id="browser_omnibox_input"
              />

              {/* Quick Presets Dropdown Toggle */}
              <button
                type="button"
                onClick={() => setShowPresetsDropdown(!showPresetsDropdown)}
                className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors flex items-center gap-1 shrink-0"
                id="btn_browser_presets"
                title="Seleccionar sitio web de prueba"
              >
                <span>Cambiar Web</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Direct Navigate/Go Button */}
            <button
              type="submit"
              className="h-10 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
              id="btn_browser_go_url"
              title="Cargar URL en el navegador"
            >
              <span>Ir</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Presets Popup Menu */}
          {showPresetsDropdown && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-300 rounded-xl shadow-2xl p-3.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex justify-between items-center px-1 pb-2.5 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">
                    Selecciona una URL o Portal Web para probar el autocompletado:
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPresetsDropdown(false)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold px-2 py-0.5 rounded hover:bg-slate-100"
                >
                  Cerrar ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-2.5">
                {SITE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      onNavigateUrl(preset.url);
                      setShowPresetsDropdown(false);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all group ${
                      activeTab.url === preset.url
                        ? "border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-200"
                        : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                    }`}
                    id={`preset_option_${preset.id}`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                      {preset.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {preset.name}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-200">
                          {preset.totalSteps} pasos
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-mono">
                        {preset.url}
                      </p>
                      <p className="text-[11px] text-slate-600 line-clamp-1 mt-1">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-1.5">
          {/* Google Drive Button */}
          <button
            type="button"
            onClick={onOpenGoogleDrive}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              googleUser
                ? "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 shadow-2xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-300"
            }`}
            title={googleUser ? `Google Drive conectado: ${googleUser.email}` : "Conectar Google Drive"}
            id="btn_open_drive"
          >
            <Cloud className={`w-3.5 h-3.5 ${googleUser ? "text-blue-600" : "text-blue-500"}`} />
            <span className="hidden md:inline">Google Drive</span>
            {googleUser && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
          </button>

          {/* DOM Inspector */}
          <button
            type="button"
            onClick={onOpenInspector}
            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition-colors"
            title="Inspeccionar campos DOM detectados"
            id="btn_open_inspector"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">Campos DOM</span>
          </button>

          {/* Profile Vault */}
          <button
            type="button"
            onClick={onOpenProfileVault}
            className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition-colors"
            title="Gestionar Bóveda de Perfiles Locales"
            id="btn_open_vault"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Bóveda Privada</span>
          </button>

          {/* Dock Side Toggle (Left / Right) */}
          <button
            type="button"
            onClick={onTogglePanelSide}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-indigo-600 border border-slate-300 transition-colors"
            title={panelSide === "right" ? "Mover panel IA a la izquierda" : "Mover panel IA a la derecha"}
            id="btn_toggle_panel_side"
          >
            {panelSide === "right" ? (
              <PanelLeft className="w-4 h-4" />
            ) : (
              <PanelRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* 3. Bookmarks bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs overflow-x-auto scrollbar-none">
        <Bookmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-600 font-bold uppercase text-[10px] tracking-wider shrink-0 mr-1">
          Sitios Web rápidos:
        </span>
        {SITE_PRESETS.map((site) => (
          <button
            key={site.id}
            type="button"
            onClick={() => onNavigateUrl(site.url)}
            className={`px-3 py-1 rounded-md transition-all shrink-0 flex items-center gap-1.5 text-xs font-medium ${
              activeTab.url === site.url
                ? "bg-indigo-600 text-white shadow-xs font-bold"
                : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-2xs"
            }`}
            id={`bookmark_btn_${site.id}`}
          >
            <span>{site.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
