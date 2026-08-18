import React from "react";
import { FormField } from "../../../types";
import { CreditCard, Lock, Package, ShieldCheck, ShoppingBag, Truck, ArrowRight, ArrowLeft } from "lucide-react";

interface EcommerceSiteProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  fields: FormField[];
  onFieldChange: (fieldId: string, value: any) => void;
  activeFieldId?: string;
}

export const ECOMMERCE_FIELDS: FormField[] = [
  // Paso 1: Envío
  {
    id: "shop_first_name",
    name: "firstName",
    label: "Nombre",
    type: "text",
    placeholder: "Marcos",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "shop_last_name",
    name: "lastName",
    label: "Apellidos",
    type: "text",
    placeholder: "Santana Ruiz",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "shop_email",
    name: "email",
    label: "Email para seguimiento",
    type: "email",
    placeholder: "facturacion@digitallogistics.es",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "shop_phone",
    name: "phone",
    label: "Teléfono móvil de contacto",
    type: "tel",
    placeholder: "+34 655 443 322",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "shop_address",
    name: "address",
    label: "Dirección de Entrega (Calle, Número, Piso)",
    type: "text",
    placeholder: "Parque Tecnológico, Edificio Beta, Planta 2",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "shop_postal_code",
    name: "postalCode",
    label: "Código Postal",
    type: "text",
    placeholder: "46022",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "shop_city",
    name: "city",
    label: "Ciudad",
    type: "text",
    placeholder: "Valencia",
    required: true,
    step: 1,
    value: "",
  },
  {
    id: "shop_country",
    name: "country",
    label: "País",
    type: "select",
    required: true,
    step: 1,
    value: "España",
    options: [
      { label: "España", value: "España" },
      { label: "Portugal", value: "Portugal" },
      { label: "Francia", value: "Francia" },
      { label: "Alemania", value: "Alemania" },
      { label: "México", value: "México" },
    ],
  },

  // Paso 2: Facturación
  {
    id: "shop_company_name",
    name: "companyName",
    label: "Razón Social o Nombre de Empresa",
    type: "text",
    placeholder: "Digital Logistics Solutions S.L.",
    required: false,
    step: 2,
    value: "",
  },
  {
    id: "shop_tax_id",
    name: "taxId",
    label: "NIF / CIF Fiscal de Empresa",
    type: "text",
    placeholder: "B-88349201",
    required: false,
    step: 2,
    value: "",
  },
  {
    id: "shop_billing_address",
    name: "billingAddress",
    label: "Dirección Fiscal de Facturación",
    type: "text",
    placeholder: "Parque Tecnológico, Edificio Beta, Planta 2",
    required: false,
    step: 2,
    value: "",
  },
  {
    id: "shop_billing_postal",
    name: "billingPostalCode",
    label: "Código Postal Fiscal",
    type: "text",
    placeholder: "46022",
    required: false,
    step: 2,
    value: "",
  },

  // Paso 3: Pago
  {
    id: "shop_card_number",
    name: "cardNumber",
    label: "Número de Tarjeta de Crédito/Débito",
    type: "text",
    placeholder: "4532 8890 1234 5678",
    required: true,
    step: 3,
    value: "",
  },
  {
    id: "shop_card_holder",
    name: "cardHolder",
    label: "Nombre del Titular (Como aparece en la tarjeta)",
    type: "text",
    placeholder: "MARCOS SANTANA RUIZ",
    required: true,
    step: 3,
    value: "",
  },
  {
    id: "shop_card_expiry",
    name: "cardExpiry",
    label: "Caducidad (MM/AA)",
    type: "text",
    placeholder: "08/28",
    required: true,
    step: 3,
    value: "",
  },
  {
    id: "shop_card_cvv",
    name: "cardCvv",
    label: "Código CVV / CVC",
    type: "password",
    placeholder: "892",
    required: true,
    step: 3,
    value: "",
  },
];

export const EcommerceCheckoutSite: React.FC<EcommerceSiteProps> = ({
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
    <div className="w-full min-h-full bg-stone-100 text-stone-800 font-sans pb-12" id="site_ecommerce">
      {/* Brand Nav */}
      <header className="bg-stone-900 text-white px-6 py-4 border-b border-stone-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-black">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-extrabold tracking-tight text-lg">NORDIC GEAR • Pro Store</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400 bg-stone-800 px-3 py-1.5 rounded-full">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pasarela Segura PCI-DSS Nivel 1</span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form area (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 border border-stone-200 shadow-sm">
            {/* Step Breadcrumbs */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className={`px-2.5 py-1 rounded-md ${currentStep === 1 ? "bg-amber-100 text-amber-900 font-bold" : "text-stone-500"}`}>
                  1. Envío
                </span>
                <span className="text-stone-300">/</span>
                <span className={`px-2.5 py-1 rounded-md ${currentStep === 2 ? "bg-amber-100 text-amber-900 font-bold" : "text-stone-500"}`}>
                  2. Facturación
                </span>
                <span className="text-stone-300">/</span>
                <span className={`px-2.5 py-1 rounded-md ${currentStep === 3 ? "bg-amber-100 text-amber-900 font-bold" : "text-stone-500"}`}>
                  3. Pago
                </span>
              </div>
              <div className="text-xs font-mono text-stone-500">Paso {currentStep} de 3</div>
            </div>

            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-600" /> Dirección de Entrega y Destinatario
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shop_first_name" className="block text-xs font-bold text-stone-700 mb-1">Nombre *</label>
                    <input
                      type="text"
                      id="shop_first_name"
                      placeholder="Marcos"
                      value={String(getVal("shop_first_name"))}
                      onChange={(e) => onFieldChange("shop_first_name", e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                        isHighlighted("shop_first_name") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label htmlFor="shop_last_name" className="block text-xs font-bold text-stone-700 mb-1">Apellidos *</label>
                    <input
                      type="text"
                      id="shop_last_name"
                      placeholder="Santana Ruiz"
                      value={String(getVal("shop_last_name"))}
                      onChange={(e) => onFieldChange("shop_last_name", e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                        isHighlighted("shop_last_name") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shop_email" className="block text-xs font-bold text-stone-700 mb-1">Email *</label>
                    <input
                      type="email"
                      id="shop_email"
                      placeholder="facturacion@digitallogistics.es"
                      value={String(getVal("shop_email"))}
                      onChange={(e) => onFieldChange("shop_email", e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                        isHighlighted("shop_email") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label htmlFor="shop_phone" className="block text-xs font-bold text-stone-700 mb-1">Teléfono Móvil *</label>
                    <input
                      type="tel"
                      id="shop_phone"
                      placeholder="+34 655 443 322"
                      value={String(getVal("shop_phone"))}
                      onChange={(e) => onFieldChange("shop_phone", e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                        isHighlighted("shop_phone") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="shop_address" className="block text-xs font-bold text-stone-700 mb-1">Dirección de Envío *</label>
                  <input
                    type="text"
                    id="shop_address"
                    placeholder="Calle / Avenida, Número, Piso"
                    value={String(getVal("shop_address"))}
                    onChange={(e) => onFieldChange("shop_address", e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                      isHighlighted("shop_address") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="shop_postal_code" className="block text-xs font-bold text-stone-700 mb-1">C. Postal *</label>
                    <input
                      type="text"
                      id="shop_postal_code"
                      placeholder="46022"
                      value={String(getVal("shop_postal_code"))}
                      onChange={(e) => onFieldChange("shop_postal_code", e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                        isHighlighted("shop_postal_code") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label htmlFor="shop_city" className="block text-xs font-bold text-stone-700 mb-1">Ciudad *</label>
                    <input
                      type="text"
                      id="shop_city"
                      placeholder="Valencia"
                      value={String(getVal("shop_city"))}
                      onChange={(e) => onFieldChange("shop_city", e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                        isHighlighted("shop_city") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label htmlFor="shop_country" className="block text-xs font-bold text-stone-700 mb-1">País *</label>
                    <select
                      id="shop_country"
                      value={String(getVal("shop_country"))}
                      onChange={(e) => onFieldChange("shop_country", e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-300 bg-white"
                    >
                      <option value="España">España</option>
                      <option value="Portugal">Portugal</option>
                      <option value="Francia">Francia</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Billing */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-600" /> Datos de Facturación / Empresa
                </h2>

                <div>
                  <label htmlFor="shop_company_name" className="block text-xs font-bold text-stone-700 mb-1">Razón Social / Nombre Comercial</label>
                  <input
                    type="text"
                    id="shop_company_name"
                    placeholder="Digital Logistics Solutions S.L."
                    value={String(getVal("shop_company_name"))}
                    onChange={(e) => onFieldChange("shop_company_name", e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                      isHighlighted("shop_company_name") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shop_tax_id" className="block text-xs font-bold text-stone-700 mb-1">NIF / CIF Fiscal</label>
                    <input
                      type="text"
                      id="shop_tax_id"
                      placeholder="B-88349201"
                      value={String(getVal("shop_tax_id"))}
                      onChange={(e) => onFieldChange("shop_tax_id", e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border font-mono ${
                        isHighlighted("shop_tax_id") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label htmlFor="shop_billing_postal" className="block text-xs font-bold text-stone-700 mb-1">C. Postal Fiscal</label>
                    <input
                      type="text"
                      id="shop_billing_postal"
                      placeholder="46022"
                      value={String(getVal("shop_billing_postal"))}
                      onChange={(e) => onFieldChange("shop_billing_postal", e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                        isHighlighted("shop_billing_postal") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="shop_billing_address" className="block text-xs font-bold text-stone-700 mb-1">Dirección Fiscal Completa</label>
                  <input
                    type="text"
                    id="shop_billing_address"
                    placeholder="Parque Tecnológico, Edificio Beta, Planta 2"
                    value={String(getVal("shop_billing_address"))}
                    onChange={(e) => onFieldChange("shop_billing_address", e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                      isHighlighted("shop_billing_address") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" /> Pago con Tarjeta Segura
                </h2>

                <div>
                  <label htmlFor="shop_card_number" className="block text-xs font-bold text-stone-700 mb-1">Número de Tarjeta *</label>
                  <input
                    type="text"
                    id="shop_card_number"
                    placeholder="4532 8890 1234 5678"
                    value={String(getVal("shop_card_number"))}
                    onChange={(e) => onFieldChange("shop_card_number", e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border font-mono tracking-wider ${
                      isHighlighted("shop_card_number") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="shop_card_holder" className="block text-xs font-bold text-stone-700 mb-1">Titular de la Tarjeta *</label>
                  <input
                    type="text"
                    id="shop_card_holder"
                    placeholder="MARCOS SANTANA RUIZ"
                    value={String(getVal("shop_card_holder"))}
                    onChange={(e) => onFieldChange("shop_card_holder", e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-sm rounded-xl border uppercase ${
                      isHighlighted("shop_card_holder") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shop_card_expiry" className="block text-xs font-bold text-stone-700 mb-1">Caducidad (MM/AA) *</label>
                    <input
                      type="text"
                      id="shop_card_expiry"
                      placeholder="08/28"
                      value={String(getVal("shop_card_expiry"))}
                      onChange={(e) => onFieldChange("shop_card_expiry", e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border font-mono ${
                        isHighlighted("shop_card_expiry") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label htmlFor="shop_card_cvv" className="block text-xs font-bold text-stone-700 mb-1">CVV / CVC *</label>
                    <input
                      type="password"
                      id="shop_card_cvv"
                      placeholder="892"
                      value={String(getVal("shop_card_cvv"))}
                      onChange={(e) => onFieldChange("shop_card_cvv", e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-sm rounded-xl border font-mono ${
                        isHighlighted("shop_card_cvv") ? "border-amber-600 ring-2 ring-amber-100 bg-amber-50/20" : "border-stone-300"
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Buttons */}
            <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => onStepChange(currentStep - 1)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
                  id="btn_shop_prev"
                >
                  <ArrowLeft className="w-4 h-4" /> Anterior
                </button>
              ) : <div />}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => onStepChange(currentStep + 1)}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
                  id="btn_shop_next"
                >
                  Avanzar <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => alert("¡Pago de 289,50 € procesado correctamente!")}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
                  id="btn_shop_pay"
                >
                  <ShieldCheck className="w-4 h-4" /> Pagar 289,50 €
                </button>
              )}
            </div>
          </div>

          {/* Cart Sidebar summary */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3">
              Resumen del Pedido (2 artículos)
            </h3>
            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Chaqueta Impermeable Pro GoreTex</span>
                <span className="font-semibold">220,00 €</span>
              </div>
              <div className="flex justify-between">
                <span>Mochila Alpinismo 45L</span>
                <span className="font-semibold">69,50 €</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Envío Express 24h</span>
                <span className="font-bold">GRATIS</span>
              </div>
              <div className="border-t border-stone-200 pt-3 flex justify-between text-sm font-black text-stone-900">
                <span>Total IVA incluido</span>
                <span>289,50 €</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
