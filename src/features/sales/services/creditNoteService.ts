import axiosInstance from "../../../services/axiosConfig";
import {
  CreditNote,
  ApiCreditNote,
  ApiCreditNotesResponse,
  ApiCreditNoteResponse,
  CreditNoteFormData,
  CreditNoteStats,
  CreditNoteFilters,
} from "../types";

// Endpoint para notas de crédito
const creditNotesEndpoint = "/notas-credito";

// Función para adaptar datos de la API al formato de la aplicación
const adaptApiCreditNote = (apiCreditNote: ApiCreditNote): CreditNote => {
  return {
    id: apiCreditNote.nota_credito_id,
    numero: apiCreditNote.numero,
    fechaEmision: new Date(apiCreditNote.fecha_emision),
    clientId: apiCreditNote.cliente_id,
    clientName: apiCreditNote.cliente_nombre,
    facturaOriginalId: apiCreditNote.factura_original_id,
    facturaOriginalNumero: apiCreditNote.factura_original_numero,
    tipo: apiCreditNote.tipo,
    motivo: apiCreditNote.motivo,
    items: apiCreditNote.items.map((item, index) => ({
      id: `item-${index}`,
      productId: item.producto_id,
      productName: item.producto_nombre,
      quantity: item.cantidad,
      unitPrice: parseFloat(item.precio_unitario),
      subtotal: parseFloat(item.subtotal),
      itbis: parseFloat(item.itbis),
      total: parseFloat(item.total),
      reason: item.razon,
    })),
    subtotal: parseFloat(apiCreditNote.subtotal),
    descuentoTotal: parseFloat(apiCreditNote.descuento_total),
    itbisTotal: parseFloat(apiCreditNote.itbis_total),
    montoTotal: parseFloat(apiCreditNote.monto_total),
    status: apiCreditNote.estado,
    observaciones: apiCreditNote.observaciones,
    fechaAplicacion: apiCreditNote.fecha_aplicacion
      ? new Date(apiCreditNote.fecha_aplicacion)
      : undefined,
    creadoPor: apiCreditNote.creado_por,
    fechaCreacion: new Date(apiCreditNote.created_at),
    fechaModificacion: apiCreditNote.updated_at
      ? new Date(apiCreditNote.updated_at)
      : undefined,
  };
};

// Función para adaptar datos de la aplicación al formato de la API
const adaptCreditNoteToApi = (creditNote: CreditNoteFormData) => {
  return {
    cliente_id: creditNote.clientId,
    factura_original_id: creditNote.facturaOriginalId,
    tipo: creditNote.tipo,
    motivo: creditNote.motivo,
    items: creditNote.items.map((item) => ({
      producto_id: item.productId,
      producto_nombre: item.productName,
      cantidad: item.quantity,
      precio_unitario: item.unitPrice.toString(),
      subtotal: item.subtotal.toString(),
      itbis: item.itbis.toString(),
      total: item.total.toString(),
      razon: item.reason,
    })),
    subtotal: creditNote.items
      .reduce((sum, item) => sum + item.subtotal, 0)
      .toString(),
    descuento_total: "0", // Can be calculated if needed
    itbis_total: creditNote.items
      .reduce((sum, item) => sum + item.itbis, 0)
      .toString(),
    monto_total: creditNote.items
      .reduce((sum, item) => sum + item.total, 0)
      .toString(),
    observaciones: creditNote.observaciones,
  };
};

// Función para calcular estadísticas de notas de crédito
const calculateCreditNoteStats = (
  creditNotes: CreditNote[]
): CreditNoteStats => {
  const totalNotasCredito = creditNotes.length;
  const montoTotalCreditos = creditNotes.reduce(
    (sum, note) => sum + note.montoTotal,
    0
  );

  const notasPendientes = creditNotes.filter(
    (note) => note.status === "pendiente"
  ).length;
  const notasAplicadas = creditNotes.filter(
    (note) => note.status === "aplicada"
  ).length;

  const montoPendiente = creditNotes
    .filter((note) => note.status === "pendiente")
    .reduce((sum, note) => sum + note.montoTotal, 0);

  const montoAplicado = creditNotes
    .filter((note) => note.status === "aplicada")
    .reduce((sum, note) => sum + note.montoTotal, 0);

  return {
    totalNotasCredito,
    montoTotalCreditos,
    notasPendientes,
    notasAplicadas,
    montoPendiente,
    montoAplicado,
  };
};

// Servicios para Notas de Crédito
export const creditNoteService = {
  // GET - Obtener todas las notas de crédito
  getAll: async (filters?: CreditNoteFilters): Promise<CreditNote[]> => {
    try {
      console.log("🔍 Obteniendo notas de crédito...", filters);

      // Construir parámetros de consulta
      const params: any = {};
      if (filters?.search) params.search = filters.search;
      if (filters?.clientId) params.cliente_id = filters.clientId;
      if (filters?.tipo) params.tipo = filters.tipo;
      if (filters?.status) params.estado = filters.status;
      if (filters?.fechaDesde)
        params.fecha_desde = filters.fechaDesde.toISOString().split("T")[0];
      if (filters?.fechaHasta)
        params.fecha_hasta = filters.fechaHasta.toISOString().split("T")[0];
      if (filters?.facturaOriginalId)
        params.factura_original_id = filters.facturaOriginalId;

      const response = await axiosInstance.get<ApiCreditNotesResponse>(
        creditNotesEndpoint,
        { params }
      );

      console.log("=== RESPONSE CREDIT NOTES GETALL ===");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("===================================");

      if (!Array.isArray(response.data.notas_credito)) {
        console.error(
          "❌ La respuesta no es un array:",
          response.data.notas_credito
        );
        throw new Error("Formato de respuesta inválido");
      }

      return response.data.notas_credito.map(adaptApiCreditNote);
    } catch (error: any) {
      console.error("❌ Error al obtener notas de crédito:", error);

      if (error.response?.status === 401) {
        throw new Error("Token de autenticación inválido o expirado");
      } else if (error.response?.status === 403) {
        throw new Error(
          "No tiene permisos para acceder a las notas de crédito"
        );
      } else if (error.response?.status === 500) {
        throw new Error("Error interno del servidor");
      } else if (error.message?.includes("Network")) {
        throw new Error("Error de conexión con el servidor");
      }

      throw new Error("Error al cargar notas de crédito");
    }
  },

  // GET por ID - Obtener una nota de crédito específica
  getById: async (id: string): Promise<CreditNote> => {
    try {
      console.log(`🔍 Obteniendo nota de crédito ${id}...`);
      const response = await axiosInstance.get<ApiCreditNoteResponse>(
        `${creditNotesEndpoint}/${id}`
      );

      console.log("=== RESPONSE CREDIT NOTE GETBYID ===");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("====================================");

      return adaptApiCreditNote(response.data.nota_credito);
    } catch (error: any) {
      console.error(`❌ Error al obtener nota de crédito ${id}:`, error);

      if (error.response?.status === 404) {
        throw new Error("Nota de crédito no encontrada");
      }

      throw new Error("Error al cargar la nota de crédito");
    }
  },

  // POST - Crear una nueva nota de crédito
  create: async (creditNote: CreditNoteFormData): Promise<CreditNote> => {
    try {
      console.log("📝 Creando nota de crédito...", creditNote);
      const apiCreditNote = adaptCreditNoteToApi(creditNote);
      const response = await axiosInstance.post<ApiCreditNoteResponse>(
        creditNotesEndpoint,
        apiCreditNote
      );

      console.log("=== RESPONSE CREDIT NOTE CREATE ===");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("===================================");

      return adaptApiCreditNote(response.data.nota_credito);
    } catch (error: any) {
      console.error("❌ Error al crear nota de crédito:", error);

      if (error.response?.status === 400) {
        throw new Error("Datos de la nota de crédito inválidos");
      } else if (error.response?.status === 409) {
        throw new Error("Ya existe una nota de crédito para esta factura");
      }

      throw new Error("Error al crear la nota de crédito");
    }
  },

  // PUT - Actualizar una nota de crédito
  update: async (
    id: string,
    creditNote: Partial<CreditNoteFormData>
  ): Promise<CreditNote> => {
    try {
      console.log(`📝 Actualizando nota de crédito ${id}...`, creditNote);
      const apiCreditNote = creditNote
        ? adaptCreditNoteToApi(creditNote as CreditNoteFormData)
        : {};
      const response = await axiosInstance.put<ApiCreditNoteResponse>(
        `${creditNotesEndpoint}/${id}`,
        apiCreditNote
      );

      console.log("=== RESPONSE CREDIT NOTE UPDATE ===");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("===================================");

      return adaptApiCreditNote(response.data.nota_credito);
    } catch (error: any) {
      console.error(`❌ Error al actualizar nota de crédito ${id}:`, error);

      if (error.response?.status === 400) {
        throw new Error("Datos de la nota de crédito inválidos");
      } else if (error.response?.status === 404) {
        throw new Error("Nota de crédito no encontrada");
      }

      throw new Error("Error al actualizar la nota de crédito");
    }
  },

  // PUT - Aplicar una nota de crédito
  apply: async (id: string): Promise<CreditNote> => {
    try {
      console.log(`✅ Aplicando nota de crédito ${id}...`);
      const response = await axiosInstance.put<ApiCreditNoteResponse>(
        `${creditNotesEndpoint}/${id}/aplicar`,
        { estado: "aplicada", fecha_aplicacion: new Date().toISOString() }
      );

      console.log("=== RESPONSE CREDIT NOTE APPLY ===");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("==================================");

      return adaptApiCreditNote(response.data.nota_credito);
    } catch (error: any) {
      console.error(`❌ Error al aplicar nota de crédito ${id}:`, error);

      if (error.response?.status === 400) {
        throw new Error("No se puede aplicar esta nota de crédito");
      } else if (error.response?.status === 404) {
        throw new Error("Nota de crédito no encontrada");
      }

      throw new Error("Error al aplicar la nota de crédito");
    }
  },

  // PUT - Cancelar una nota de crédito
  cancel: async (id: string): Promise<CreditNote> => {
    try {
      console.log(`❌ Cancelando nota de crédito ${id}...`);
      const response = await axiosInstance.put<ApiCreditNoteResponse>(
        `${creditNotesEndpoint}/${id}/cancelar`,
        { estado: "cancelada" }
      );

      console.log("=== RESPONSE CREDIT NOTE CANCEL ===");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("===================================");

      return adaptApiCreditNote(response.data.nota_credito);
    } catch (error: any) {
      console.error(`❌ Error al cancelar nota de crédito ${id}:`, error);

      if (error.response?.status === 400) {
        throw new Error("No se puede cancelar esta nota de crédito");
      } else if (error.response?.status === 404) {
        throw new Error("Nota de crédito no encontrada");
      }

      throw new Error("Error al cancelar la nota de crédito");
    }
  },

  // DELETE - Eliminar una nota de crédito (solo si está en estado pendiente)
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`🗑️ Eliminando nota de crédito ${id}...`);
      await axiosInstance.delete(`${creditNotesEndpoint}/${id}`);

      console.log("=== CREDIT NOTE DELETED ===");
      console.log(`Nota de crédito ${id} eliminada exitosamente`);
      console.log("===========================");
    } catch (error: any) {
      console.error(`❌ Error al eliminar nota de crédito ${id}:`, error);

      if (error.response?.status === 400) {
        throw new Error("No se puede eliminar una nota de crédito aplicada");
      } else if (error.response?.status === 404) {
        throw new Error("Nota de crédito no encontrada");
      }

      throw new Error("Error al eliminar la nota de crédito");
    }
  },

  // GET - Obtener estadísticas de notas de crédito
  getStats: async (): Promise<CreditNoteStats> => {
    try {
      console.log("📊 Obteniendo estadísticas de notas de crédito...");

      // Obtener todas las notas de crédito para calcular estadísticas
      const creditNotes = await creditNoteService.getAll();
      return calculateCreditNoteStats(creditNotes);
    } catch (error: any) {
      console.error(
        "❌ Error al obtener estadísticas de notas de crédito:",
        error
      );
      throw new Error("Error al cargar estadísticas de notas de crédito");
    }
  },

  // GET - Obtener notas de crédito por cliente
  getByClient: async (clientId: string): Promise<CreditNote[]> => {
    try {
      console.log(`🔍 Obteniendo notas de crédito para cliente ${clientId}...`);
      return await creditNoteService.getAll({
        search: "",
        clientId,
      });
    } catch (error: any) {
      console.error(
        `❌ Error al obtener notas de crédito para cliente ${clientId}:`,
        error
      );
      throw new Error("Error al cargar notas de crédito del cliente");
    }
  },

  // GET - Obtener notas de crédito por factura original
  getByInvoice: async (invoiceId: string): Promise<CreditNote[]> => {
    try {
      console.log(
        `🔍 Obteniendo notas de crédito para factura ${invoiceId}...`
      );
      return await creditNoteService.getAll({
        search: "",
        facturaOriginalId: invoiceId,
      });
    } catch (error: any) {
      console.error(
        `❌ Error al obtener notas de crédito para factura ${invoiceId}:`,
        error
      );
      throw new Error("Error al cargar notas de crédito de la factura");
    }
  },
};
