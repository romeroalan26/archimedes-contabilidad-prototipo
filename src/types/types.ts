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
   * - consumidor_final: For final consumers (01)
   * - credito_fiscal: For registered businesses (02)
   * - gubernamental: For government entities (14)
   * - regimen_especial: For special cases (15)
   */
  ncfType:
    | "consumidor_final"
    | "credito_fiscal"
    | "gubernamental"
    | "regimen_especial";

  /**
   * Client's status in the system:
   * - activo: Active client
   * - inactivo: Inactive client
   */
  status: "activo" | "inactivo";
}

/**
 * Represents an account statement for a client
 */
export interface AccountStatement {
  /** Unique identifier for the statement */
  id: string;

  /** Reference to the client ID */
  clientId: string;

  /** Date of the statement */
  date: string;

  /** Description of the transaction */
  description: string;

  /** Amount of the transaction */
  amount: number;

  /** Type of transaction (debit/credit) */
  type: "debit" | "credit";

  /** Balance after the transaction */
  balance: number;
}
