import { UserProfile } from "../types";

const VAULT_STORAGE_KEY = "autonav_ai_local_vault_profiles_v1";
const SETTINGS_STORAGE_KEY = "autonav_ai_local_settings_v1";
const VAULT_PIN_KEY = "autonav_ai_vault_pin_v1";

export const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: "prof_carlos_personal",
    name: "Carlos Gómez (Principal / Citas)",
    description: "Perfil personal completo para trámites oficiales, citas médicas y registros civiles.",
    category: "personal",
    isDefault: true,
    updatedAt: new Date().toISOString(),
    data: {
      firstName: "Carlos",
      lastName: "Gómez Navarro",
      fullName: "Carlos Gómez Navarro",
      documentType: "DNI",
      documentNumber: "48712390X",
      birthDate: "1991-06-14",
      gender: "Masculino",
      nationality: "Española",
      civilStatus: "Soltero",
      
      email: "carlos.gomez@ejemplo.com",
      phone: "+34 612 345 678",
      mobilePhone: "+34 612 345 678",
      address: "Calle Gran Vía 42, Piso 4B",
      city: "Madrid",
      province: "Madrid",
      postalCode: "28013",
      country: "España",

      appointmentReason: "Renovación Documento de Identidad y Pasaporte",
      preferredDate: "2026-09-15",
      preferredTimeSlot: "10:30",
      officeLocation: "Oficina Central de Madrid - Gran Vía",
      urgentReason: "Viaje internacional de trabajo programado",
    },
  },
  {
    id: "prof_elena_tech",
    name: "Elena Vega (Candidatura Tech / CV)",
    description: "Datos profesionales, experiencia laboral, enlaces técnicos y carta de presentación.",
    category: "laboral",
    isDefault: false,
    updatedAt: new Date().toISOString(),
    data: {
      firstName: "Elena",
      lastName: "Vega Morales",
      fullName: "Elena Vega Morales",
      email: "elena.vega.dev@ejemplo.com",
      phone: "+34 689 901 234",
      mobilePhone: "+34 689 901 234",
      address: "Avenida Diagonal 350",
      city: "Barcelona",
      province: "Barcelona",
      postalCode: "08013",
      country: "España",

      jobTitle: "Senior Fullstack Engineer",
      experienceYears: "6",
      company: "Innovatech Labs",
      linkedinUrl: "https://linkedin.com/in/elena-vega-dev",
      githubUrl: "https://github.com/elenavega",
      salaryExpectation: "58000",
      skills: "React, TypeScript, Node.js, Next.js, Tailwind CSS, PostgreSQL, Docker",
      educationLevel: "Grado en Ingeniería Informática",
      englishLevel: "C1 - Avanzado Profesional",
      remotePreference: "Remoto 100%",
      coverLetter: "Cuento con más de 6 años de experiencia creando aplicaciones web escalables con arquitecturas modernas y foco obsesivo en rendimiento y UX.",
    },
  },
  {
    id: "prof_empresa_billing",
    name: "Digital Logistics S.L. (Facturación & Compras)",
    description: "Datos fiscales y societarios para pedidos, pasarelas de pago y facturación B2B.",
    category: "financiero",
    isDefault: false,
    updatedAt: new Date().toISOString(),
    data: {
      firstName: "Marcos",
      lastName: "Santana Ruiz",
      fullName: "Marcos Santana Ruiz",
      email: "facturacion@digitallogistics.es",
      phone: "+34 910 554 433",
      mobilePhone: "+34 655 443 322",
      address: "Parque Tecnológico, Edificio Beta, Planta 2",
      city: "Valencia",
      province: "Valencia",
      postalCode: "46022",
      country: "España",

      companyName: "Digital Logistics Solutions S.L.",
      taxId: "B-88349201",
      billingAddress: "Parque Tecnológico, Edificio Beta, Planta 2",
      billingCity: "Valencia",
      billingPostalCode: "46022",
      billingCountry: "España",
      cardNumber: "4532 8890 1234 5678",
      cardHolder: "MARCOS SANTANA RUIZ",
      cardExpiry: "08/28",
      cardCvv: "892",
      iban: "ES91 2100 0418 4502 0005 1324",
      monthlyIncome: "12000",
      fundsOrigin: "Actividad Comercial / Facturación de Servicios",
    },
  },
];

export function getStoredProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(DEFAULT_PROFILES));
      return DEFAULT_PROFILES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PROFILES;
  } catch (err) {
    console.warn("Failed to read local vault profiles, using defaults:", err);
    return DEFAULT_PROFILES;
  }
}

export function saveStoredProfiles(profiles: UserProfile[]): void {
  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error("Failed to save local vault profiles:", err);
  }
}

export function exportVaultToJson(): string {
  const profiles = getStoredProfiles();
  return JSON.stringify(
    {
      vaultVersion: "1.0",
      exportedAt: new Date().toISOString(),
      securityNote: "Exported from AutoNav AI Local Vault - Stored 100% Client-Side",
      profiles,
    },
    null,
    2
  );
}

export function importVaultFromJson(jsonString: string): { success: boolean; count: number; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    const profiles = parsed.profiles || parsed;
    if (!Array.isArray(profiles) || profiles.length === 0) {
      return { success: false, count: 0, message: "El archivo no contiene un formato de perfiles válido." };
    }
    
    // Validate profile shape
    const validatedProfiles: UserProfile[] = profiles.map((p, idx) => ({
      id: p.id || `imported_prof_${Date.now()}_${idx}`,
      name: p.name || `Perfil Importado ${idx + 1}`,
      description: p.description || "Perfil restaurado desde archivo de copia de seguridad local.",
      category: p.category || "general",
      isDefault: Boolean(p.isDefault),
      updatedAt: new Date().toISOString(),
      data: p.data || {},
    }));

    saveStoredProfiles(validatedProfiles);
    return { success: true, count: validatedProfiles.length, message: `Se importaron ${validatedProfiles.length} perfiles correctamente.` };
  } catch (err: any) {
    return { success: false, count: 0, message: `Error al procesar JSON: ${err.message}` };
  }
}

export function getVaultPin(): string | null {
  return localStorage.getItem(VAULT_PIN_KEY);
}

export function setVaultPin(pin: string): void {
  localStorage.setItem(VAULT_PIN_KEY, pin);
}

export function clearVaultPin(): void {
  localStorage.removeItem(VAULT_PIN_KEY);
}

export const loadVaultProfiles = getStoredProfiles;
export const saveVaultProfiles = saveStoredProfiles;
export const getDefaultVaultProfiles = () => DEFAULT_PROFILES;
