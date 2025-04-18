/**
 * Represents a client in the system
 */
export interface Client {
  /** Unique identifier for the client */
  id: string;

  /** Client's name */
  name: string;

  /** Client's RNC (Registro Nacional del Contribuyente) or Cédula number */
  rnc: string;

  /** Optional phone number */
  phone?: string;

  /** Optional email address */
  email?: string;

  /**
   * Indicates the client's preferred billing type:
   * - contado: Cash payment
   * - credito: Credit payment
   * - mixto: Mixed payment methods
   */
  billingType: "contado" | "credito" | "mixto";

  /**
   * Defines the type of fiscal receipt (NCF) typically assigned to the client:
   * - final: For final consumers
   * - fiscal: For registered businesses
   * - gubernamental: For government entities
   * - especial: For special cases
   */
  ncfType: "final" | "fiscal" | "gubernamental" | "especial";
}
