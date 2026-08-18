export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "textarea"
  | "number"
  | "password";

export interface FormOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  value: string | boolean | number;
  options?: FormOption[];
  required?: boolean;
  step: number;
  section?: string;
  helpText?: string;
  validationRegex?: string;
  filledByAgent?: boolean;
  confidenceScore?: number;
}

export interface FormStep {
  stepNumber: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  isCurrent: boolean;
  fields: FormField[];
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
  active?: boolean;
  secure?: boolean;
  loading?: boolean;
  siteId?: string;
}

export type ProfileCategory = "personal" | "laboral" | "financiero" | "medico" | "general";

export interface UserProfile {
  id: string;
  name: string;
  description: string;
  category: ProfileCategory;
  isDefault?: boolean;
  updatedAt: string;
  data: {
    // Personal info
    firstName?: string;
    lastName?: string;
    fullName?: string;
    documentType?: string; // DNI, NIE, Pasaporte
    documentNumber?: string;
    birthDate?: string;
    gender?: string;
    nationality?: string;
    civilStatus?: string;
    
    // Contact
    email?: string;
    phone?: string;
    mobilePhone?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;

    // Professional & Employment
    jobTitle?: string;
    experienceYears?: string;
    company?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    salaryExpectation?: string;
    skills?: string;
    educationLevel?: string;
    englishLevel?: string;
    remotePreference?: string;
    coverLetter?: string;

    // Financial & Billing
    companyName?: string;
    taxId?: string; // CIF / NIF
    billingAddress?: string;
    billingCity?: string;
    billingPostalCode?: string;
    billingCountry?: string;
    cardNumber?: string;
    cardHolder?: string;
    cardExpiry?: string;
    cardCvv?: string;
    iban?: string;
    monthlyIncome?: string;
    fundsOrigin?: string;

    // Appointment & Specifics
    appointmentReason?: string;
    preferredDate?: string;
    preferredTimeSlot?: string;
    officeLocation?: string;
    urgentReason?: string;

    // Custom key-values
    [key: string]: any;
  };
}

export type LogType = "scan" | "match" | "type" | "advance" | "success" | "warn" | "error" | "info";

export interface AgentLog {
  id: string;
  timestamp: string;
  type: LogType;
  message: string;
  fieldId?: string;
  fieldName?: string;
  value?: any;
  step?: number;
}

export type AutomationStatus =
  | "idle"
  | "scanning"
  | "typing"
  | "advancing"
  | "paused"
  | "completed"
  | "error";

export type TypingSpeed = "instant" | "fast" | "natural";
export type AIAutomationEngine = "gemini" | "heuristic_local";
export type PanelPosition = "left" | "right";

export interface AutomationSettings {
  engine: AIAutomationEngine;
  typingSpeed: TypingSpeed;
  autoAdvance: boolean;
  requireConfirmationBeforeSubmit?: boolean;
  highlightActiveField: boolean;
  panelSide?: PanelPosition;
  soundEffects?: boolean;
  confirmBeforeFinalSubmit?: boolean;
}

export interface ActiveTypingState {
  fieldId: string;
  fieldName: string;
  targetValue: string;
  currentDisplayValue: string;
  progressPercent: number;
}

export interface WebSitePreset {
  id: string;
  name: string;
  url: string;
  category: string;
  iconName: string;
  description: string;
  totalSteps: number;
}
