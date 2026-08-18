import { FormField, UserProfile } from "../types";

export interface ParsedUserInput {
  extracted: Record<string, string>;
  rawKeywords: string[];
}

/**
 * Parses free-form text entered by the user in natural language (Spanish / English)
 * to extract key entities like names, DNI, emails, phones, dates, locations, reasons, etc.
 */
export function parseUnstructuredText(text: string): ParsedUserInput {
  const extracted: Record<string, string> = {};
  if (!text || !text.trim()) {
    return { extracted, rawKeywords: [] };
  }

  const raw = text.trim();
  const lower = raw.toLowerCase();

  // 1. Email matching
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = raw.match(emailRegex);
  if (emailMatch) {
    extracted.email = emailMatch[1];
  }

  // 2. Phone matching (+34 612 345 678, 600112233, etc.)
  const phoneRegex = /(?:\+?34\s?)?(?:[6789]\d{2}(?:[\s.-]?\d{3}){2}|[6789]\d{8})/g;
  const phoneMatch = raw.match(phoneRegex);
  if (phoneMatch) {
    extracted.phone = phoneMatch[0].trim();
    extracted.mobilePhone = phoneMatch[0].trim();
  }

  // 3. DNI / NIE / NIF Spanish ID matching (8 numbers + letter or X/Y/Z + 7 numbers + letter)
  const dniRegex = /\b([0-9]{8}[A-Za-z]|[XYZxyz][0-9]{7}[A-Za-z])\b/;
  const dniMatch = raw.match(dniRegex);
  if (dniMatch) {
    extracted.documentNumber = dniMatch[1].toUpperCase();
    extracted.taxId = dniMatch[1].toUpperCase();
  }

  // 4. Postal Code matching (5 digits, e.g., 28013, 08013, 46022)
  const cpRegex = /\b(0[1-9]|[1-4][0-9]|5[0-2])\d{3}\b/;
  const cpMatch = raw.match(cpRegex);
  if (cpMatch) {
    extracted.postalCode = cpMatch[0];
    extracted.billingPostalCode = cpMatch[0];
  }

  // 5. Date matching (YYYY-MM-DD or DD/MM/YYYY or "15 de octubre de 2026")
  const isoDateRegex = /\b(20\d{2}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01]))\b/;
  const isoMatch = raw.match(isoDateRegex);
  if (isoMatch) {
    extracted.birthDate = isoMatch[1].replace(/\//g, "-");
    extracted.preferredDate = isoMatch[1].replace(/\//g, "-");
  } else {
    const spanishDateRegex = /\b(0[1-9]|[12]\d|3[01])[-/](0[1-9]|1[0-2])[-/](19\d{2}|20\d{2})\b/;
    const spMatch = raw.match(spanishDateRegex);
    if (spMatch) {
      const parts = spMatch[0].split(/[-/]/);
      extracted.birthDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      extracted.preferredDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  // 6. Name extraction heuristics (e.g., "me llamo Carlos Gómez", "nombre: Juan Pérez", "mi nombre es...")
  const nameTriggers = [
    /(?:me llamo|mi nombre es|nombre completo es|nombre[:\s]+)\s*([A-ZÁÉÍÓÚÑa-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+){1,3})/i,
    /(?:candidato|solicitante|titular)[:\s]+([A-ZÁÉÍÓÚÑa-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑa-záéíóúñ]+){1,3})/i,
  ];
  for (const trigger of nameTriggers) {
    const match = raw.match(trigger);
    if (match && match[1]) {
      const nameParts = match[1].trim().split(/\s+/);
      extracted.fullName = match[1].trim();
      extracted.firstName = nameParts[0];
      if (nameParts.length > 1) {
        extracted.lastName = nameParts.slice(1).join(" ");
      }
      break;
    }
  }

  // 7. City / Province matching
  const knownCities = [
    "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza", "Málaga", "Murcia", "Palma",
    "Las Palmas", "Bilbao", "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón", "Granada",
    "A Coruña", "Oviedo", "Salamanca", "Santander", "Pamplona", "Toledo", "Donostia", "San Sebastián"
  ];
  for (const city of knownCities) {
    if (new RegExp(`\\b${city}\\b`, "i").test(raw)) {
      extracted.city = city;
      extracted.province = city;
      extracted.billingCity = city;
      break;
    }
  }

  // 8. Address matching (e.g., "Calle Mayor 12", "Av. Diagonal 350", "Paseo de la Castellana...")
  const addressRegex = /\b(?:calle|c\/|avda|avenida|paseo|plaza|carretera|carrera|urbanización)\s+[^,.\n]{4,40}/i;
  const addrMatch = raw.match(addressRegex);
  if (addrMatch) {
    extracted.address = addrMatch[0].trim();
    extracted.billingAddress = addrMatch[0].trim();
  }

  // 9. Appointment reasons / Motivos
  if (/dni|pasaporte|identidad|renovaci[oó]n/i.test(lower)) {
    extracted.appointmentReason = "Renovación Documento de Identidad y Pasaporte";
    extracted.documentType = "DNI";
  } else if (/m[eé]dic|salud|dermatolog|cita previa|consulta/i.test(lower)) {
    extracted.appointmentReason = "Consulta Médica Especializada";
  } else if (/certificado|firma digital/i.test(lower)) {
    extracted.appointmentReason = "Emisión de Certificado Digital FNMT";
  }

  // 10. Time slot / Turno preference
  if (/mañana|10:00|10:30|11:00|temprano/i.test(lower)) {
    extracted.preferredTimeSlot = "10:30";
  } else if (/tarde|16:00|17:00|18:00/i.test(lower)) {
    extracted.preferredTimeSlot = "17:00";
  }

  // 11. Salary expectation
  const salaryRegex = /(?:sueldo|salario|expectativa|rango)[:\s]*([0-9]{2,3}(?:\.?[0-9]{3})?)/i;
  const salMatch = raw.match(salaryRegex);
  if (salMatch) {
    extracted.salaryExpectation = salMatch[1].replace(".", "");
  }

  // 12. Experience years
  const expRegex = /(\d+)\s*(?:años?|years?)\s*(?:de\s*)?experiencia/i;
  const expMatch = raw.match(expRegex);
  if (expMatch) {
    extracted.experienceYears = expMatch[1];
  }

  // 13. LinkedIn / GitHub URLs
  const linkedinMatch = raw.match(/(https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) extracted.linkedinUrl = linkedinMatch[1];
  const githubMatch = raw.match(/(https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+)/i);
  if (githubMatch) extracted.githubUrl = githubMatch[1];

  const rawKeywords = lower.split(/[\s,.;:!?\n]+/).filter((w) => w.length > 2);

  return { extracted, rawKeywords };
}

/**
 * Maps unstructured extracted info + saved user profile data to the form fields of the current step
 */
export function matchFieldsLocally(
  fields: FormField[],
  userText: string,
  profile?: UserProfile | null
): {
  mappings: Record<string, { value: any; confidence: number; source: "text" | "profile" | "default" }>;
  readyToAdvance: boolean;
  missingRequired: string[];
} {
  const parsed = parseUnstructuredText(userText);
  const textData = parsed.extracted;
  const profData = profile?.data || {};

  // Combined source data with userText having highest priority over profile
  const combinedData = { ...profData, ...textData };

  const mappings: Record<string, { value: any; confidence: number; source: "text" | "profile" | "default" }> = {};
  const missingRequired: string[] = [];

  // Semantic field synonym dictionary
  const synonymMap: Record<string, string[]> = {
    firstName: ["nombre", "first_name", "firstname", "nombre_pila", "given_name", "primer_nombre"],
    lastName: ["apellidos", "apellido", "last_name", "lastname", "family_name", "primer_apellido", "segundo_apellido"],
    fullName: ["nombre_completo", "fullname", "nombre_apellidos", "nombreyapellidos", "titular", "solicitante"],
    email: ["email", "correo", "correo_electronico", "e-mail", "mail", "contact_email"],
    phone: ["telefono", "phone", "celular", "movil", "telefono_contacto", "mobile", "tel"],
    mobilePhone: ["movil", "mobile", "telefono_movil", "celular"],
    documentType: ["tipo_documento", "document_type", "tipo_doc", "doc_type", "documento"],
    documentNumber: ["dni", "nie", "nif", "documento", "num_documento", "id_number", "passport", "pasaporte", "identificacion"],
    birthDate: ["fecha_nacimiento", "birth_date", "birthdate", "f_nacimiento", "nacimiento", "fecha_nac"],
    gender: ["genero", "gender", "sexo"],
    nationality: ["nacionalidad", "nationality", "pais_origen"],
    civilStatus: ["estado_civil", "civil_status", "marital_status"],
    
    address: ["direccion", "address", "domicilio", "calle", "street", "via"],
    city: ["ciudad", "city", "poblacion", "municipio", "localidad"],
    province: ["provincia", "province", "state", "region", "departamento"],
    postalCode: ["codigo_postal", "cp", "postal_code", "zip", "zip_code"],
    country: ["pais", "country", "nacion"],

    jobTitle: ["puesto", "cargo", "job_title", "posicion", "role", "profesion", "titulo_profesional"],
    experienceYears: ["experiencia", "years_experience", "anos_experiencia", "experiencia_anos"],
    company: ["empresa", "company", "compania", "empresa_actual"],
    linkedinUrl: ["linkedin", "linkedin_url", "perfil_linkedin"],
    githubUrl: ["github", "github_url", "perfil_github", "repositorio"],
    salaryExpectation: ["salario", "sueldo", "salary", "remuneracion", "rango_salarial"],
    skills: ["skills", "habilidades", "tecnologias", "stack", "conocimientos"],
    educationLevel: ["estudios", "nivel_estudios", "education", "formacion", "titulacion"],
    englishLevel: ["ingles", "nivel_ingles", "english_level", "idiomas"],
    remotePreference: ["modalidad", "remoto", "presencial", "hibrido", "remote_preference"],
    coverLetter: ["carta", "carta_presentacion", "cover_letter", "motivacion", "mensaje"],

    companyName: ["nombre_empresa", "razon_social", "company_name", "empresa_facturacion"],
    taxId: ["cif", "cif_nif", "tax_id", "vat_number", "nif_empresa"],
    billingAddress: ["direccion_facturacion", "billing_address", "domicilio_fiscal"],
    billingCity: ["ciudad_facturacion", "billing_city", "ciudad_fiscal"],
    billingPostalCode: ["cp_facturacion", "billing_postal_code", "cp_fiscal"],
    cardNumber: ["numero_tarjeta", "card_number", "tarjeta", "credit_card"],
    cardHolder: ["titular_tarjeta", "card_holder", "card_name", "nombre_tarjeta"],
    cardExpiry: ["caducidad", "card_expiry", "exp_date", "vencimiento"],
    cardCvv: ["cvv", "cvc", "security_code", "codigo_seguridad"],
    iban: ["iban", "cuenta_bancaria", "num_cuenta", "banco_cuenta"],
    monthlyIncome: ["ingresos", "ingresos_mensuales", "monthly_income", "salario_mensual"],
    fundsOrigin: ["origen_fondos", "funds_origin", "procedencia_fondos"],

    appointmentReason: ["motivo_cita", "tramite", "tipo_tramite", "appointment_reason", "motivo", "asunto"],
    preferredDate: ["fecha_cita", "fecha_deseada", "preferred_date", "fecha", "date"],
    preferredTimeSlot: ["turno", "horario", "hora_cita", "preferred_time", "hora", "time_slot"],
    officeLocation: ["oficina", "sede", "lugar", "office_location", "centro"],
    urgentReason: ["urgencia", "motivo_urgencia", "urgency_reason", "justificante"],
  };

  for (const field of fields) {
    const fieldKey = (field.name || field.id || "").toLowerCase();
    const fieldLabel = (field.label || "").toLowerCase();
    let matchedValue: any = null;
    let confidence = 0;
    let source: "text" | "profile" | "default" = "profile";

    // Direct key match in combinedData
    if (combinedData[field.id] !== undefined) {
      matchedValue = combinedData[field.id];
      confidence = 0.95;
      source = textData[field.id] !== undefined ? "text" : "profile";
    } else if (combinedData[field.name] !== undefined) {
      matchedValue = combinedData[field.name];
      confidence = 0.95;
      source = textData[field.name] !== undefined ? "text" : "profile";
    } else {
      // Find matching semantic category
      for (const [key, synonyms] of Object.entries(synonymMap)) {
        const isMatch =
          synonyms.some((s) => fieldKey.includes(s) || fieldLabel.includes(s)) ||
          fieldKey === key.toLowerCase() ||
          fieldLabel.includes(key.toLowerCase());

        if (isMatch && combinedData[key] !== undefined) {
          matchedValue = combinedData[key];
          confidence = 0.88;
          source = textData[key] !== undefined ? "text" : "profile";
          break;
        }
      }
    }

    // Special type handling
    if (field.type === "select" && field.options && field.options.length > 0 && matchedValue !== null) {
      const matchStr = String(matchedValue).toLowerCase();
      // Look for best matching option value or label
      const optionMatch = field.options.find(
        (opt) =>
          opt.value.toLowerCase() === matchStr ||
          opt.label.toLowerCase().includes(matchStr) ||
          matchStr.includes(opt.label.toLowerCase()) ||
          matchStr.includes(opt.value.toLowerCase())
      );
      if (optionMatch) {
        matchedValue = optionMatch.value;
      } else {
        // Default to first valid option if not matched and required
        if (field.required && field.options.length > 1) {
          matchedValue = field.options[1].value;
          confidence = 0.6;
        }
      }
    } else if (field.type === "checkbox") {
      if (typeof matchedValue === "boolean") {
        // as is
      } else if (typeof matchedValue === "string") {
        matchedValue = ["true", "si", "sí", "1", "yes", "on", "acepto"].includes(matchedValue.toLowerCase());
      } else if (field.required) {
        // Auto-check mandatory terms/GDPR checkboxes
        matchedValue = true;
        confidence = 0.85;
      }
    } else if (field.type === "radio" && field.options && matchedValue !== null) {
      const matchStr = String(matchedValue).toLowerCase();
      const optionMatch = field.options.find(
        (opt) =>
          opt.value.toLowerCase() === matchStr ||
          opt.label.toLowerCase().includes(matchStr) ||
          matchStr.includes(opt.label.toLowerCase())
      );
      if (optionMatch) {
        matchedValue = optionMatch.value;
      }
    }

    if (matchedValue !== null && matchedValue !== undefined && matchedValue !== "") {
      mappings[field.id] = {
        value: matchedValue,
        confidence,
        source,
      };
    } else if (field.required) {
      missingRequired.push(field.id);
    }
  }

  const readyToAdvance = missingRequired.length === 0;

  return {
    mappings,
    readyToAdvance,
    missingRequired,
  };
}
