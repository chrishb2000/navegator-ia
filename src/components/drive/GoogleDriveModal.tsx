import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import {
  X,
  Cloud,
  FileText,
  Download,
  Upload,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  LogOut,
  Sparkles,
  Shield,
  FileCode,
  HardDrive,
  Check,
} from "lucide-react";
import {
  googleSignIn,
  logout,
  getAccessToken,
} from "../../lib/firebaseAuth";
import {
  listDriveFiles,
  getDriveFileContent,
  uploadVaultBackupToDrive,
  deleteDriveFile,
  DriveFileItem,
} from "../../lib/driveService";
import { UserProfile } from "../../types";

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  accessToken: string | null;
  onAuthChange: (user: User | null, token: string | null) => void;
  profiles: UserProfile[];
  onImportProfiles: (profiles: UserProfile[]) => void;
  onInjectPromptText: (text: string) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  user,
  accessToken,
  onAuthChange,
  profiles,
  onImportProfiles,
  onInjectPromptText,
}) => {
  const [activeTab, setActiveTab] = useState<"files" | "backups">("files");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<DriveFileItem | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isReadingContent, setIsReadingContent] = useState(false);
  const [actionStatus, setActionStatus] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Confirmation dialog state for safety (Mandatory destructive operation confirmation)
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    isOpen: boolean;
    fileId: string;
    fileName: string;
  }>({ isOpen: false, fileId: "", fileName: "" });

  const [isBackingUp, setIsBackingUp] = useState(false);

  // Load files when accessToken is available
  const loadFiles = async (token = accessToken, query = searchQuery) => {
    if (!token) return;
    setIsLoadingFiles(true);
    setActionStatus(null);
    try {
      const driveFiles = await listDriveFiles(token, query);
      setFiles(driveFiles);
    } catch (err: any) {
      setActionStatus({
        type: "error",
        message: err.message || "Error al cargar archivos de Google Drive",
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  useEffect(() => {
    if (isOpen && accessToken) {
      loadFiles(accessToken, searchQuery);
    }
  }, [isOpen, accessToken]);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setActionStatus(null);
    try {
      const res = await googleSignIn();
      if (res) {
        onAuthChange(res.user, res.accessToken);
        loadFiles(res.accessToken);
        setActionStatus({
          type: "success",
          message: `Sesión iniciada correctamente como ${res.user.displayName || res.user.email}`,
        });
      }
    } catch (err: any) {
      setActionStatus({
        type: "error",
        message: err.message || "Error al conectar con Google Drive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onAuthChange(null, null);
    setFiles([]);
    setSelectedFile(null);
    setFileContent(null);
    setActionStatus({
      type: "info",
      message: "Sesión de Google Drive cerrada.",
    });
  };

  const handleSelectFile = async (file: DriveFileItem) => {
    setSelectedFile(file);
    setFileContent(null);
    if (!accessToken) return;

    setIsReadingContent(true);
    try {
      const content = await getDriveFileContent(accessToken, file.id, file.mimeType);
      setFileContent(content);
    } catch (err: any) {
      setFileContent(`[No se pudo previsualizar el contenido: ${err.message}]`);
    } finally {
      setIsReadingContent(false);
    }
  };

  const handleInjectIntoPrompt = () => {
    if (!fileContent || !selectedFile) return;
    const cleanContent = fileContent.slice(0, 1500);
    const promptInjection = `[DATOS IMPORTADOS DE GOOGLE DRIVE: ${selectedFile.name}]\n${cleanContent}`;
    onInjectPromptText(promptInjection);
    setActionStatus({
      type: "success",
      message: `Contenido de "${selectedFile.name}" transferido al contexto del Agente IA.`,
    });
  };

  const handleImportBackup = () => {
    if (!fileContent) return;
    try {
      const parsed = JSON.parse(fileContent);
      if (Array.isArray(parsed.profiles) && parsed.profiles.length > 0) {
        onImportProfiles(parsed.profiles);
        setActionStatus({
          type: "success",
          message: `Se importaron ${parsed.profiles.length} perfiles desde Google Drive.`,
        });
      } else if (Array.isArray(parsed) && parsed.length > 0) {
        onImportProfiles(parsed);
        setActionStatus({
          type: "success",
          message: `Se importaron ${parsed.length} perfiles desde Google Drive.`,
        });
      } else {
        throw new Error("El archivo no tiene el formato de bóveda esperado.");
      }
    } catch (err: any) {
      setActionStatus({
        type: "error",
        message: "Error al importar el archivo JSON: " + err.message,
      });
    }
  };

  const handleBackupToDrive = async () => {
    const token = accessToken || (await getAccessToken());
    if (!token) {
      setActionStatus({
        type: "error",
        message: "Inicia sesión con Google para realizar la copia de seguridad.",
      });
      return;
    }

    setIsBackingUp(true);
    setActionStatus(null);
    try {
      const fileName = `AutoNav_Boveda_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      const res = await uploadVaultBackupToDrive(token, profiles, fileName);
      setActionStatus({
        type: "success",
        message: `Bóveda guardada con éxito en Google Drive como "${res.name}".`,
      });
      loadFiles(token);
    } catch (err: any) {
      setActionStatus({
        type: "error",
        message: "Error al guardar en Google Drive: " + err.message,
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  // Safe deletion with confirmation modal
  const handleExecuteDelete = async () => {
    const { fileId, fileName } = confirmDeleteModal;
    setConfirmDeleteModal({ isOpen: false, fileId: "", fileName: "" });
    if (!accessToken || !fileId) return;

    try {
      await deleteDriveFile(accessToken, fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
      if (selectedFile?.id === fileId) {
        setSelectedFile(null);
        setFileContent(null);
      }
      setActionStatus({
        type: "success",
        message: `El archivo "${fileName}" ha sido eliminado de Google Drive.`,
      });
    } catch (err: any) {
      setActionStatus({
        type: "error",
        message: "Error al eliminar: " + err.message,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div
        className="bg-white border border-slate-300 rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-slate-800"
        id="google_drive_modal"
      >
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Integración con Google Drive™
              </h2>
              <p className="text-xs text-slate-500">
                Accede a tus documentos, copias de seguridad de perfiles y exporta resguardos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Usuario"}
                    className="w-5 h-5 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-700 truncate max-w-[140px]">
                  {user.displayName || user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                  title="Cerrar sesión de Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Message Banner */}
        {actionStatus && (
          <div
            className={`px-4 py-2.5 text-xs flex items-center justify-between border-b ${
              actionStatus.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : actionStatus.type === "error"
                ? "bg-rose-50 text-rose-800 border-rose-200"
                : "bg-blue-50 text-blue-800 border-blue-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {actionStatus.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {actionStatus.type === "error" && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              {actionStatus.type === "info" && <Shield className="w-4 h-4 text-blue-600 shrink-0" />}
              <span className="font-medium">{actionStatus.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionStatus(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Auth Required State */}
        {!user || !accessToken ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-md">
              <Cloud className="w-8 h-8" />
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Conectar con tu cuenta de Google Drive
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Permite a AutoNav AI acceder a tus documentos y copias de seguridad de forma segura, con autorización explícita de tu cuenta de Google.
              </p>
            </div>

            {/* Official Branded Google Sign-In Button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="group relative inline-flex items-center justify-center px-6 py-3 border border-slate-300 rounded-lg shadow-sm bg-white hover:bg-slate-50 text-sm font-bold text-slate-700 transition-all cursor-pointer hover:border-slate-400 hover:shadow-md disabled:opacity-50"
              id="google_signin_btn"
            >
              <svg
                className="w-5 h-5 mr-3"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{isLoggingIn ? "Conectando con Google..." : "Iniciar sesión con Google"}</span>
            </button>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Conexión cifrada directa mediante OAuth 2.0 y Firebase Auth</span>
            </div>
          </div>
        ) : (
          /* Main Authenticated Explorer View */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Tabs & Controls */}
            <div className="px-6 pt-3 pb-0 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("files")}
                  className={`pb-3 px-2 border-b-2 text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === "files"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <HardDrive className="w-4 h-4" />
                  <span>Explorador de Archivos</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono font-semibold">
                    {files.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("backups")}
                  className={`pb-3 px-2 border-b-2 text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === "backups"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Copias de Seguridad (Bóveda)</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pb-2">
                <button
                  type="button"
                  onClick={handleBackupToDrive}
                  disabled={isBackingUp}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
                  title="Guardar perfiles actuales en Google Drive"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isBackingUp ? "Guardando..." : "Guardar Bóveda en Drive"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadFiles()}
                  disabled={isLoadingFiles}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors"
                  title="Actualizar lista de archivos"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? "animate-spin text-blue-600" : ""}`} />
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "files" ? (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* File List Column */}
                <div className="w-full md:w-3/5 border-r border-slate-200 flex flex-col bg-white">
                  {/* Search Bar */}
                  <div className="p-3 border-b border-slate-200">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && loadFiles()}
                        placeholder="Buscar archivos en Google Drive..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* List */}
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {isLoadingFiles ? (
                      <div className="p-10 text-center text-xs text-slate-500 flex flex-col items-center justify-center space-y-2">
                        <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                        <span>Cargando archivos desde Google Drive...</span>
                      </div>
                    ) : files.length === 0 ? (
                      <div className="p-10 text-center text-xs text-slate-500 space-y-1">
                        <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-bold text-slate-700">No se encontraron archivos</p>
                        <p>Sube archivos a tu Google Drive o guarda una copia de tu bóveda.</p>
                      </div>
                    ) : (
                      files.map((file) => {
                        const isSelected = selectedFile?.id === file.id;
                        const isJson = file.name.endsWith(".json") || file.mimeType.includes("json");
                        return (
                          <div
                            key={file.id}
                            onClick={() => handleSelectFile(file)}
                            className={`p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors ${
                              isSelected ? "bg-blue-50/70 border-l-4 border-blue-600" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                                {isJson ? (
                                  <FileCode className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">
                                  {file.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono truncate">
                                  {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString() : ""}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              {file.webViewLink && (
                                <a
                                  href={file.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded"
                                  title="Abrir en Google Drive"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDeleteModal({
                                    isOpen: true,
                                    fileId: file.id,
                                    fileName: file.name,
                                  });
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded"
                                title="Eliminar de Google Drive"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* File Details & Action Panel Column */}
                <div className="w-full md:w-2/5 flex flex-col bg-slate-50 p-4 space-y-4 overflow-y-auto">
                  {selectedFile ? (
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Archivo Seleccionado
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1 break-words">
                          {selectedFile.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          ID: {selectedFile.id}
                        </p>
                      </div>

                      {/* Content Preview */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                          <span>Vista Previa del Contenido</span>
                          {isReadingContent && <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />}
                        </span>
                        <div className="p-3 bg-white border border-slate-300 rounded-lg text-xs font-mono max-h-48 overflow-y-auto text-slate-700 whitespace-pre-wrap shadow-2xs">
                          {isReadingContent ? (
                            <span className="text-slate-400 italic">Descargando vista previa...</span>
                          ) : fileContent ? (
                            fileContent.slice(0, 1000) + (fileContent.length > 1000 ? "\n..." : "")
                          ) : (
                            <span className="text-slate-400 italic">Sin vista previa disponible</span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons based on file type */}
                      <div className="space-y-2 pt-2">
                        <button
                          type="button"
                          onClick={handleInjectIntoPrompt}
                          disabled={!fileContent || isReadingContent}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Usar Datos en Agente IA</span>
                        </button>

                        {(selectedFile.name.endsWith(".json") || selectedFile.mimeType.includes("json")) && (
                          <button
                            type="button"
                            onClick={handleImportBackup}
                            disabled={!fileContent || isReadingContent}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
                          >
                            <Download className="w-4 h-4" />
                            <span>Restaurar Perfiles a Bóveda</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-500 space-y-2 my-auto">
                      <HardDrive className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="font-bold text-slate-700">Selecciona un archivo</p>
                      <p>Haz clic en cualquier archivo de la lista para ver sus detalles y usar sus datos.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Backups Tab */
              <div className="p-6 space-y-6 overflow-y-auto">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">
                      Sincronización Segura de Perfiles en la Nube
                    </h4>
                    <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                      Guarda copias de seguridad de tus perfiles cifrados en tu propia unidad de Google Drive. Puedes restaurarlos en cualquier momento o sincronizarlos entre dispositivos.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Backup Card */}
                  <div className="p-5 border border-slate-300 rounded-xl bg-white space-y-4 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mb-3">
                        <Upload className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Crear Copia de Seguridad
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Sube los {profiles.length} perfiles activos de tu bóveda local actual a un archivo JSON en tu Google Drive.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleBackupToDrive}
                      disabled={isBackingUp}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isBackingUp ? "Guardando en Drive..." : "Exportar Bóveda a Google Drive"}</span>
                    </button>
                  </div>

                  {/* Vault Status Card */}
                  <div className="p-5 border border-slate-300 rounded-xl bg-white space-y-4 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-3">
                        <Check className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Estado de la Bóveda Local
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Actualmente tienes <strong className="text-slate-900">{profiles.length} perfiles</strong> configurados en memoria local.
                      </p>
                    </div>

                    <div className="text-xs text-slate-500 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {profiles.map((p) => p.name).join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal for Destructive Delete Operation */}
        {confirmDeleteModal.isOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-100">
            <div className="bg-white border border-rose-300 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    ¿Eliminar archivo de Google Drive?
                  </h3>
                  <p className="text-xs text-slate-500">Operación destructiva</p>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                ¿Estás seguro de que deseas eliminar permanentemente el archivo{" "}
                <strong className="text-slate-900 font-mono">
                  "{confirmDeleteModal.fileName}"
                </strong>{" "}
                de tu unidad de Google Drive? Esta acción no se puede deshacer.
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteModal({ isOpen: false, fileId: "", fileName: "" })}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Confirmar Eliminación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
