import React, { useState, useEffect, useRef, useCallback } from "react";
import { User } from "firebase/auth";
import {
  ActiveTypingState,
  AgentLog,
  AutomationSettings,
  AutomationStatus,
  BrowserTab,
  FormField,
  PanelPosition,
  UserProfile,
} from "./types";
import {
  getDefaultVaultProfiles,
  loadVaultProfiles,
  saveVaultProfiles,
} from "./utils/localVault";
import { initAuth } from "./lib/firebaseAuth";
import { aiAgentService } from "./services/aiAgentService";
import { BrowserChrome, SITE_PRESETS } from "./components/browser/BrowserChrome";
import { WebPageViewport } from "./components/browser/WebPageViewport";
import { AIPanel } from "./components/sidepanel/AIPanel";
import { ProfileManagerModal } from "./components/sidepanel/ProfileManagerModal";
import { DomInspectorModal } from "./components/sidepanel/DomInspectorModal";
import { GoogleDriveModal } from "./components/drive/GoogleDriveModal";
import { GOV_FIELDS } from "./components/browser/websites/GovernmentAppointmentSite";
import { JOB_FIELDS } from "./components/browser/websites/JobApplicationSite";
import { ECOMMERCE_FIELDS } from "./components/browser/websites/EcommerceCheckoutSite";
import { FINTECH_FIELDS } from "./components/browser/websites/FintechKycSite";
import { DEFAULT_CUSTOM_FIELDS } from "./components/browser/websites/CustomFormSite";

export default function App() {
  // --- 1. Profiles State ---
  const [profiles, setProfiles] = useState<UserProfile[]>(() => loadVaultProfiles());
  const [selectedProfileId, setSelectedProfileId] = useState<string>(() => {
    const loaded = loadVaultProfiles();
    const def = loaded.find((p) => p.isDefault);
    return def ? def.id : loaded[0]?.id || "prof_personal_1";
  });

  // --- Google Drive & OAuth State ---
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(null);
  const [isDriveOpen, setIsDriveOpen] = useState(false);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setDriveAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setDriveAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // --- 2. Browser Tabs State ---
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: "tab_1",
      title: "Sede Electrónica Citas",
      url: "https://sede.administracion.gob.es/citas-tramites",
      favicon: "🏛️",
      loading: false,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("tab_1");

  // Step state per site/tab
  const [tabSteps, setTabSteps] = useState<Record<string, number>>({
    tab_1: 1,
  });

  // --- 3. Fields State for all sites ---
  const [fieldsState, setFieldsState] = useState<Record<string, FormField[]>>({
    "https://sede.administracion.gob.es/citas-tramites": JSON.parse(JSON.stringify(GOV_FIELDS)),
    "https://jobs.techcorp.io/apply/senior-fullstack": JSON.parse(JSON.stringify(JOB_FIELDS)),
    "https://shop.nordicgear.com/checkout/step-1": JSON.parse(JSON.stringify(ECOMMERCE_FIELDS)),
    "https://app.novabank.com/open-account": JSON.parse(JSON.stringify(FINTECH_FIELDS)),
    "custom://formulario-personalizado": JSON.parse(JSON.stringify(DEFAULT_CUSTOM_FIELDS)),
  });

  // --- 4. User Assistant Input & Panel State ---
  const [userText, setUserText] = useState<string>(
    "Hola, me llamo Carlos Gómez Navarro con DNI 48712390X. Necesito tramitar la Renovación de DNI y Pasaporte en Madrid. Prefiero cita para el 15/09/2026 a las 10:30h. Mi teléfono es +34 670 123 456 y email carlos.gomez@empresa.es."
  );
  const [panelSide, setPanelSide] = useState<PanelPosition>("right");
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus>("idle");
  const [activeTyping, setActiveTyping] = useState<ActiveTypingState | null>(null);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);

  // Settings
  const [settings, setSettings] = useState<AutomationSettings>({
    typingSpeed: "fast",
    autoAdvance: true,
    engine: "gemini",
    highlightActiveField: true,
    confirmBeforeFinalSubmit: true,
  });

  // Modals
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Active tab helper
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const currentStep = tabSteps[activeTabId] || 1;

  // Active site preset info
  const activePreset =
    SITE_PRESETS.find((p) => p.url === activeTab?.url) || {
      totalSteps: 3,
      name: "Formulario Web",
    };
  const totalSteps = activePreset.totalSteps;

  // Fields for current active tab URL
  const currentTabUrl = activeTab?.url || "https://sede.administracion.gob.es/citas-tramites";
  const currentFields =
    fieldsState[currentTabUrl] ||
    fieldsState["custom://formulario-personalizado"] ||
    [];

  // Ref to cancel or pause loops
  const isCancelledRef = useRef(false);

  const addLog = useCallback((type: AgentLog["type"], message: string, step?: number) => {
    const newLog: AgentLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      type,
      message,
      step,
    };
    setAgentLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  }, []);

  // Update a field value in state
  const handleFieldChange = useCallback(
    (fieldId: string, value: any) => {
      setFieldsState((prev) => {
        const list = prev[currentTabUrl] || [];
        const updated = list.map((f) => (f.id === fieldId ? { ...f, value } : f));
        return { ...prev, [currentTabUrl]: updated };
      });
    },
    [currentTabUrl]
  );

  // Step change helper
  const handleStepChange = useCallback(
    (newStep: number) => {
      setTabSteps((prev) => ({ ...prev, [activeTabId]: newStep }));
      addLog("advance", `Navegación al Paso ${newStep} de ${totalSteps}`, newStep);
    },
    [activeTabId, totalSteps, addLog]
  );

  // Tab navigation
  const handleNavigateUrl = useCallback(
    (url: string) => {
      const preset = SITE_PRESETS.find((p) => p.url === url);
      const title = preset ? preset.name : url;

      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, url, title } : t))
      );
      setTabSteps((prev) => ({ ...prev, [activeTabId]: 1 }));
      addLog("scan", `Navegando a: ${url}`);
    },
    [activeTabId, addLog]
  );

  const handleNewTab = () => {
    const newId = `tab_${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title: "Nueva Pestaña",
      url: SITE_PRESETS[1].url,
      favicon: "💼",
      loading: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    setTabSteps((prev) => ({ ...prev, [newId]: 1 }));
  };

  const handleCloseTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    const filtered = tabs.filter((t) => t.id !== tabId);
    setTabs(filtered);
    if (activeTabId === tabId) {
      setActiveTabId(filtered[0].id);
    }
  };

  const handleSaveProfiles = (updated: UserProfile[]) => {
    setProfiles(updated);
    saveVaultProfiles(updated);
    addLog("match", `Bóveda privada actualizada (${updated.length} perfiles locales)`);
  };

  const handleResetForm = () => {
    let initialFields: FormField[] = [];
    if (currentTabUrl.includes("citas")) initialFields = GOV_FIELDS;
    else if (currentTabUrl.includes("jobs")) initialFields = JOB_FIELDS;
    else if (currentTabUrl.includes("checkout")) initialFields = ECOMMERCE_FIELDS;
    else if (currentTabUrl.includes("novabank")) initialFields = FINTECH_FIELDS;
    else initialFields = DEFAULT_CUSTOM_FIELDS;

    setFieldsState((prev) => ({
      ...prev,
      [currentTabUrl]: JSON.parse(JSON.stringify(initialFields)),
    }));
    setTabSteps((prev) => ({ ...prev, [activeTabId]: 1 }));
    setAutomationStatus("idle");
    setActiveTyping(null);
    addLog("warn", "Formulario y pasos restablecidos a valores iniciales.");
  };

  // --- 5. Main AI Autonomous Automation Loop ---
  const runAutonomousAutofill = async () => {
    isCancelledRef.current = false;
    setAutomationStatus("scanning");
    addLog("scan", `Iniciando escaneo inteligente del DOM para: ${activePreset.name}`, currentStep);

    const activeProfile = profiles.find((p) => p.id === selectedProfileId);

    // Speed delays
    const getCharDelay = () => {
      if (settings.typingSpeed === "instant") return 0;
      if (settings.typingSpeed === "fast") return 15;
      return 45; // natural
    };
    const getFieldDelay = () => {
      if (settings.typingSpeed === "instant") return 30;
      if (settings.typingSpeed === "fast") return 180;
      return 400;
    };

    let stepToProcess = currentStep;

    while (stepToProcess <= totalSteps && !isCancelledRef.current) {
      // 1. Get current step fields
      const allSiteFields = fieldsState[currentTabUrl] || currentFields;
      const stepFields = allSiteFields.filter((f) => f.step === stepToProcess);

      addLog(
        "match",
        `[Paso ${stepToProcess}] Analizando ${stepFields.length} campos requeridos con ${
          settings.engine === "gemini" ? "Gemini 3.7 Flash" : "Heurística Local"
        }`,
        stepToProcess
      );

      // 2. Dispatch to AI service
      const matchResult = await aiAgentService.parseFormFieldsWithAI({
        userText,
        profile: activeProfile,
        fields: stepFields,
        engine: settings.engine,
      });

      addLog(
        "type",
        `[Paso ${stepToProcess}] Mapeados ${matchResult.matchedFields.length} campos (${Math.round(
          matchResult.confidenceScore * 100
        )}% confianza). Comenzando inyección en DOM...`,
        stepToProcess
      );

      setAutomationStatus("typing");

      // 3. Sequentially fill each matched field with animated typing
      for (const matched of matchResult.matchedFields) {
        if (isCancelledRef.current) break;

        const targetValStr = String(matched.value);
        const fieldName = matched.fieldName || matched.fieldId;

        // Animated keystrokes
        if (settings.typingSpeed === "instant" || typeof matched.value === "boolean") {
          handleFieldChange(matched.fieldId, matched.value);
          setActiveTyping({
            fieldId: matched.fieldId,
            fieldName,
            targetValue: targetValStr,
            currentDisplayValue: targetValStr,
            progressPercent: 100,
          });
        } else {
          for (let i = 1; i <= targetValStr.length; i++) {
            if (isCancelledRef.current) break;
            const sub = targetValStr.substring(0, i);
            handleFieldChange(matched.fieldId, sub);
            setActiveTyping({
              fieldId: matched.fieldId,
              fieldName,
              targetValue: targetValStr,
              currentDisplayValue: sub,
              progressPercent: (i / targetValStr.length) * 100,
            });
            if (getCharDelay() > 0) {
              await new Promise((r) => setTimeout(r, getCharDelay()));
            }
          }
        }

        if (getFieldDelay() > 0) {
          await new Promise((r) => setTimeout(r, getFieldDelay()));
        }
      }

      if (isCancelledRef.current) break;

      addLog(
        "success",
        `[Paso ${stepToProcess}] Campos del paso ${stepToProcess} autocompletados correctamente.`,
        stepToProcess
      );

      // 4. Multi-step Auto-Advance
      if (settings.autoAdvance && stepToProcess < totalSteps) {
        setAutomationStatus("advancing");
        addLog(
          "advance",
          `[Modo Autónomo] Pulsando botón 'Siguiente / Continuar' para avanzar al paso ${
            stepToProcess + 1
          }...`,
          stepToProcess
        );

        await new Promise((r) => setTimeout(r, 600));

        if (isCancelledRef.current) break;

        stepToProcess += 1;
        setTabSteps((prev) => ({ ...prev, [activeTabId]: stepToProcess }));

        await new Promise((r) => setTimeout(r, 400));
      } else {
        // Finished or stopped here
        break;
      }
    }

    setActiveTyping(null);
    if (!isCancelledRef.current) {
      setAutomationStatus("completed");
      addLog(
        "success",
        `🎉 ¡Proceso de autocompletado finalizado con éxito! Todos los pasos requeridos fueron procesados.`
      );
    } else {
      setAutomationStatus("paused");
      addLog("warn", "Ejecución del agente pausada por el usuario.");
    }
  };

  const handlePauseAutofill = () => {
    isCancelledRef.current = true;
    setAutomationStatus("paused");
    setActiveTyping(null);
  };

  return (
    <div
      className="w-full h-screen flex flex-col bg-slate-100 text-slate-800 font-sans overflow-hidden"
      id="autonav_main_app"
    >
      {/* 1. Browser Chrome (Tabs, Omnibox, Actions) */}
      <BrowserChrome
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={(id) => setActiveTabId(id)}
        onCloseTab={handleCloseTab}
        onNewTab={handleNewTab}
        onNavigateUrl={handleNavigateUrl}
        onRefresh={() => {
          addLog("scan", `Página recargada: ${activeTab.url}`);
        }}
        panelSide={panelSide}
        onTogglePanelSide={() => setPanelSide(panelSide === "right" ? "left" : "right")}
        onOpenInspector={() => setIsInspectorOpen(true)}
        onOpenProfileVault={() => setIsVaultOpen(true)}
        onOpenGoogleDrive={() => setIsDriveOpen(true)}
        googleUser={googleUser}
        isAgentRunning={
          automationStatus === "scanning" ||
          automationStatus === "typing" ||
          automationStatus === "advancing"
        }
        activeStep={currentStep}
        totalSteps={totalSteps}
      />

      {/* 2. Main Workspace Layout (Dockable Sidebar + Viewport) */}
      <div
        className={`flex-1 flex overflow-hidden ${
          panelSide === "left" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Web Viewport Area */}
        <main className="flex-1 h-full overflow-hidden relative flex flex-col">
          <WebPageViewport
            siteUrl={currentTabUrl}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            fields={currentFields}
            onFieldChange={handleFieldChange}
            automationStatus={automationStatus}
            activeTyping={activeTyping}
            onTriggerAutofill={runAutonomousAutofill}
          />
        </main>

        {/* AI Sidepanel */}
        <AIPanel
          userText={userText}
          onUserTextChange={setUserText}
          profiles={profiles}
          selectedProfileId={selectedProfileId}
          onSelectProfile={setSelectedProfileId}
          onOpenProfileModal={() => setIsVaultOpen(true)}
          onOpenGoogleDrive={() => setIsDriveOpen(true)}
          googleUser={googleUser}
          automationStatus={automationStatus}
          onStartAutofill={runAutonomousAutofill}
          onPauseAutofill={handlePauseAutofill}
          onResetForm={handleResetForm}
          agentLogs={agentLogs}
          settings={settings}
          onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
          currentStep={currentStep}
          totalSteps={totalSteps}
          activeFieldsCount={currentFields.filter((f) => f.step === currentStep).length}
        />
      </div>

      {/* 3. Modals */}
      <ProfileManagerModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        profiles={profiles}
        onSaveProfiles={handleSaveProfiles}
        selectedProfileId={selectedProfileId}
        onSelectProfile={setSelectedProfileId}
      />

      <DomInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        fields={currentFields}
        currentStep={currentStep}
      />

      <GoogleDriveModal
        isOpen={isDriveOpen}
        onClose={() => setIsDriveOpen(false)}
        user={googleUser}
        accessToken={driveAccessToken}
        onAuthChange={(u, token) => {
          setGoogleUser(u);
          setDriveAccessToken(token);
          if (u) {
            addLog("system", `Google Drive conectado: ${u.email}`);
          } else {
            addLog("system", "Google Drive desconectado");
          }
        }}
        profiles={profiles}
        onImportProfiles={(newProfiles) => {
          handleSaveProfiles(newProfiles);
          addLog("success", `Se importaron ${newProfiles.length} perfiles desde Google Drive`);
        }}
        onInjectPromptText={(injectedText) => {
          setUserText(injectedText);
          addLog("ai", "Datos de archivo de Google Drive cargados al contexto del Agente");
        }}
      />
    </div>
  );
}
