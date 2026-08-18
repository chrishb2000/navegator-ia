import React, { useState } from "react";
import { UserProfile } from "../../types";
import { exportVaultToJson, importVaultFromJson } from "../../utils/localVault";
import {
  X,
  Plus,
  Trash2,
  Download,
  Upload,
  ShieldCheck,
  Check,
  User,
  Briefcase,
  CreditCard,
} from "lucide-react";

interface ProfileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: UserProfile[];
  onSaveProfiles: (profiles: UserProfile[]) => void;
  selectedProfileId: string;
  onSelectProfile: (id: string) => void;
}

export const ProfileManagerModal: React.FC<ProfileManagerModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onSaveProfiles,
  selectedProfileId,
  onSelectProfile,
}) => {
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    const newProf: UserProfile = {
      id: `prof_custom_${Date.now()}`,
      name: "Nuevo Perfil Personalizado",
      description: "Perfil de usuario para autocompletado en formularios web.",
      category: "personal",
      isDefault: false,
      updatedAt: new Date().toISOString(),
      data: {
        firstName: "",
        lastName: "",
        documentNumber: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
      },
    };
    setEditingProfile(newProf);
  };

  const handleSaveCurrentEdit = () => {
    if (!editingProfile) return;
    const exists = profiles.some((p) => p.id === editingProfile.id);
    let updated: UserProfile[];
    if (exists) {
      updated = profiles.map((p) => (p.id === editingProfile.id ? editingProfile : p));
    } else {
      updated = [...profiles, editingProfile];
    }
    onSaveProfiles(updated);
    setEditingProfile(null);
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      alert("Debes mantener al menos un perfil en la bóveda.");
      return;
    }
    const updated = profiles.filter((p) => p.id !== id);
    onSaveProfiles(updated);
    if (selectedProfileId === id) {
      onSelectProfile(updated[0].id);
    }
  };

  const handleExport = () => {
    const jsonStr = exportVaultToJson();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `autonav_boveda_privada_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importVaultFromJson(content);
      setImportStatus(res.message);
      if (res.success) {
        try {
          const loaded = JSON.parse(localStorage.getItem("autonav_ai_local_vault_profiles_v1") || "[]");
          if (loaded.length > 0) onSaveProfiles(loaded);
        } catch (_) {}
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div
        className="bg-white border border-slate-300 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-800"
        id="profile_vault_modal"
      >
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Bóveda de Perfiles Privados (Local Vault)
              </h2>
              <p className="text-xs text-slate-500">
                Almacenamiento 100% en tu navegador (LocalStorage). Cero transmisión a servidores externos.
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {editingProfile ? (
            /* Editing Profile View */
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Editar Datos del Perfil</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(null)}
                    className="px-3 py-1.5 rounded-md border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCurrentEdit}
                    className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-100"
                  >
                    <Check className="w-4 h-4" /> Guardar Perfil
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Nombre del Perfil</label>
                  <input
                    type="text"
                    value={editingProfile.name}
                    onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                    className="w-full bg-slate-50 px-3 py-2 rounded-md border border-slate-300 text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Categoría</label>
                  <select
                    value={editingProfile.category}
                    onChange={(e) =>
                      setEditingProfile({ ...editingProfile, category: e.target.value as any })
                    }
                    className="w-full bg-slate-50 px-3 py-2 rounded-md border border-slate-300 text-slate-900 focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value="personal">Personal / Ciudadano</option>
                    <option value="laboral">Laboral / Profesional</option>
                    <option value="financiero">Financiero / Empresa</option>
                  </select>
                </div>
              </div>

              {/* Data Fields */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Datos de Identidad y Contacto
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Nombre</label>
                    <input
                      type="text"
                      value={editingProfile.data.firstName || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          data: { ...editingProfile.data, firstName: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 px-3 py-2 rounded-md border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Apellidos</label>
                    <input
                      type="text"
                      value={editingProfile.data.lastName || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          data: { ...editingProfile.data, lastName: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 px-3 py-2 rounded-md border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">DNI / NIE / Pasaporte</label>
                    <input
                      type="text"
                      value={editingProfile.data.documentNumber || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          data: { ...editingProfile.data, documentNumber: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 px-3 py-2 rounded-md border border-slate-300 text-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={editingProfile.data.email || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          data: { ...editingProfile.data, email: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 px-3 py-2 rounded-md border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={editingProfile.data.phone || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          data: { ...editingProfile.data, phone: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 px-3 py-2 rounded-md border border-slate-300 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="md:col-span-2">
                    <label className="block text-slate-600 font-medium mb-1">Dirección</label>
                    <input
                      type="text"
                      value={editingProfile.data.address || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          data: { ...editingProfile.data, address: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 px-3 py-2 rounded-md border border-slate-300 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Ciudad</label>
                    <input
                      type="text"
                      value={editingProfile.data.city || ""}
                      onChange={(e) =>
                        setEditingProfile({
                          ...editingProfile,
                          data: { ...editingProfile.data, city: e.target.value },
                        })
                      }
                      className="w-full bg-slate-50 px-3 py-2 rounded-md border border-slate-300 text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Profiles List View */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Perfiles Guardados ({profiles.length})
                </span>
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Crear Perfil
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profiles.map((profile) => {
                  const isSelected = profile.id === selectedProfileId;
                  return (
                    <div
                      key={profile.id}
                      className={`p-4 rounded-lg border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/40 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            {profile.category === "personal" && <User className="w-3.5 h-3.5 text-indigo-600" />}
                            {profile.category === "laboral" && <Briefcase className="w-3.5 h-3.5 text-indigo-600" />}
                            {profile.category === "financiero" && <CreditCard className="w-3.5 h-3.5 text-emerald-600" />}
                            {profile.name}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                              Activo
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {profile.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => onSelectProfile(profile.id)}
                          className={`text-xs font-bold ${
                            isSelected ? "text-emerald-700" : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {isSelected ? "✓ Seleccionado" : "Seleccionar"}
                        </button>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingProfile(profile)}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                          >
                            Editar
                          </button>
                          {profiles.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteProfile(profile.id)}
                              className="text-slate-400 hover:text-rose-600"
                              title="Eliminar perfil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Export & Import Backup */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExport}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-300 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Exportar Bóveda (JSON)
                  </button>
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-300 flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Importar Bóveda
                    <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                  </label>
                </div>

                {importStatus && <span className="text-xs text-emerald-700 font-medium">{importStatus}</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
