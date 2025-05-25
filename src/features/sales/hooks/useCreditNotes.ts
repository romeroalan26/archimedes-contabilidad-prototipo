import { useState, useEffect } from "react";
import {
  CreditNote,
  CreditNoteFormData,
  CreditNoteStats,
  CreditNoteFilters,
} from "../types";
import { creditNoteService } from "../services/creditNoteService";

// Hook para obtener todas las notas de crédito
export const useCreditNotes = (filters?: CreditNoteFilters) => {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await creditNoteService.getAll(filters);
      setCreditNotes(data);
    } catch (err: any) {
      console.error("Error fetching credit notes:", err);
      setError(err.message || "Error al cargar notas de crédito");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditNotes();
  }, [
    filters?.search,
    filters?.clientId,
    filters?.tipo,
    filters?.status,
    filters?.fechaDesde,
    filters?.fechaHasta,
    filters?.facturaOriginalId,
  ]);

  return {
    creditNotes,
    loading,
    error,
    refetch: fetchCreditNotes,
  };
};

// Hook para obtener una nota de crédito específica
export const useCreditNote = (id: string | null) => {
  const [creditNote, setCreditNote] = useState<CreditNote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditNote = async () => {
    if (!id) {
      setCreditNote(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await creditNoteService.getById(id);
      setCreditNote(data);
    } catch (err: any) {
      console.error("Error fetching credit note:", err);
      setError(err.message || "Error al cargar nota de crédito");
      setCreditNote(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditNote();
  }, [id]);

  return {
    creditNote,
    loading,
    error,
    refetch: fetchCreditNote,
  };
};

// Hook para filtrar notas de crédito
export const useCreditNotesFilter = () => {
  const [filters, setFilters] = useState<CreditNoteFilters>({
    search: "",
    clientId: undefined,
    tipo: undefined,
    status: undefined,
    fechaDesde: undefined,
    fechaHasta: undefined,
    facturaOriginalId: undefined,
  });

  const updateFilter = <K extends keyof CreditNoteFilters>(
    key: K,
    value: CreditNoteFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      clientId: undefined,
      tipo: undefined,
      status: undefined,
      fechaDesde: undefined,
      fechaHasta: undefined,
      facturaOriginalId: undefined,
    });
  };

  return {
    filters,
    updateFilter,
    clearFilters,
    setFilters,
  };
};

// Hook para estadísticas de notas de crédito
export const useCreditNoteStats = () => {
  const [stats, setStats] = useState<CreditNoteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await creditNoteService.getStats();
      setStats(data);
    } catch (err: any) {
      console.error("Error fetching credit note stats:", err);
      setError(err.message || "Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

// Hook para acciones de notas de crédito (CRUD)
export const useCreditNoteActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCreditNote = async (
    creditNote: CreditNoteFormData
  ): Promise<CreditNote | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await creditNoteService.create(creditNote);
      return result;
    } catch (err: any) {
      console.error("Error creating credit note:", err);
      setError(err.message || "Error al crear nota de crédito");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCreditNote = async (
    id: string,
    creditNote: Partial<CreditNoteFormData>
  ): Promise<CreditNote | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await creditNoteService.update(id, creditNote);
      return result;
    } catch (err: any) {
      console.error("Error updating credit note:", err);
      setError(err.message || "Error al actualizar nota de crédito");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const applyCreditNote = async (id: string): Promise<CreditNote | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await creditNoteService.apply(id);
      return result;
    } catch (err: any) {
      console.error("Error applying credit note:", err);
      setError(err.message || "Error al aplicar nota de crédito");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelCreditNote = async (id: string): Promise<CreditNote | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await creditNoteService.cancel(id);
      return result;
    } catch (err: any) {
      console.error("Error canceling credit note:", err);
      setError(err.message || "Error al cancelar nota de crédito");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCreditNote = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await creditNoteService.delete(id);
      return true;
    } catch (err: any) {
      console.error("Error deleting credit note:", err);
      setError(err.message || "Error al eliminar nota de crédito");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    createCreditNote,
    updateCreditNote,
    applyCreditNote,
    cancelCreditNote,
    deleteCreditNote,
    clearError,
  };
};

// Hook para obtener notas de crédito por cliente
export const useCreditNotesByClient = (clientId: string | null) => {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditNotesByClient = async () => {
    if (!clientId) {
      setCreditNotes([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await creditNoteService.getByClient(clientId);
      setCreditNotes(data);
    } catch (err: any) {
      console.error("Error fetching credit notes by client:", err);
      setError(err.message || "Error al cargar notas de crédito del cliente");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditNotesByClient();
  }, [clientId]);

  return {
    creditNotes,
    loading,
    error,
    refetch: fetchCreditNotesByClient,
  };
};

// Hook para obtener notas de crédito por factura
export const useCreditNotesByInvoice = (invoiceId: string | null) => {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditNotesByInvoice = async () => {
    if (!invoiceId) {
      setCreditNotes([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await creditNoteService.getByInvoice(invoiceId);
      setCreditNotes(data);
    } catch (err: any) {
      console.error("Error fetching credit notes by invoice:", err);
      setError(err.message || "Error al cargar notas de crédito de la factura");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditNotesByInvoice();
  }, [invoiceId]);

  return {
    creditNotes,
    loading,
    error,
    refetch: fetchCreditNotesByInvoice,
  };
};
