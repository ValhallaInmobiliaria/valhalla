/**
 * Normaliza el valor de operación guardado en Supabase.
 *
 * Se aceptan las variantes actuales y algunas variantes históricas para que
 * diferencias de mayúsculas, tildes, espacios o separadores no oculten una
 * propiedad del catálogo público.
 */
export function normalizeOperation(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\/_|&+-]+/g, " y ")
    .replace(/\s+/g, " ");
}

function hasSale(operation: string): boolean {
  return /\bventa\b/.test(operation);
}

function hasRent(operation: string): boolean {
  return /\b(arriendo|alquiler|arrendamiento|arrendar)\b/.test(operation);
}

export function isForSale(value: unknown): boolean {
  const operation = normalizeOperation(value);
  return hasSale(operation);
}

export function isForRent(value: unknown): boolean {
  const operation = normalizeOperation(value);
  return hasRent(operation);
}

export function operationLabel(value: unknown): string {
  const operation = normalizeOperation(value);
  const sale = hasSale(operation);
  const rent = hasRent(operation);

  if (sale && rent) {
    return "VENTA Y ARRIENDO";
  }

  if (rent) {
    return "ARRIENDO";
  }

  if (sale) {
    return "VENTA";
  }

  return String(value || "Propiedad").trim().toUpperCase();
}
