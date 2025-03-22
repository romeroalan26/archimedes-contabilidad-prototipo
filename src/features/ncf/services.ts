import { Ncf, NcfFormData, NcfFilters } from "./types";
import { mockNcf } from "./ncfData";

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simular error aleatorio (20% de probabilidad)
const simulateError = () => {
  if (Math.random() < 0.2) {
    throw new Error("Error de conexión simulado");
  }
};

// Función auxiliar para validar número de NCF
export function validateNcfNumber(numero: string): boolean {
  const ncfPattern = /^(B|E)(0[1-9]|[1-4][0-9]|50)\d{8}$/;
  return ncfPattern.test(numero);
}

// Función auxiliar para generar número de NCF
export function generateNcfNumber(tipo: string): string {
  const prefix = tipo;
  const random = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, "0");
  return `${prefix}${random}`;
}

// Servicios CRUD
export async function getNcfList(filters?: NcfFilters): Promise<Ncf[]> {
  await delay(500);
  simulateError();

  let filtered = [...mockNcf];

  if (filters) {
    if (filters.tipo) {
      filtered = filtered.filter((ncf) => ncf.tipo === filters.tipo);
    }
    if (filters.estado) {
      filtered = filtered.filter((ncf) => ncf.estado === filters.estado);
    }
    if (filters.fechaInicio) {
      filtered = filtered.filter((ncf) => ncf.fecha >= filters.fechaInicio!);
    }
    if (filters.fechaFin) {
      filtered = filtered.filter((ncf) => ncf.fecha <= filters.fechaFin!);
    }
    if (filters.cliente) {
      filtered = filtered.filter((ncf) =>
        ncf.cliente.toLowerCase().includes(filters.cliente!.toLowerCase())
      );
    }
  }

  return filtered;
}

export async function getNcfById(id: number): Promise<Ncf | undefined> {
  await delay(300);
  simulateError();
  return mockNcf.find((ncf) => ncf.id === id);
}

export async function createNcf(formData: NcfFormData): Promise<Ncf> {
  await delay(800);
  simulateError();

  const newNcf: Ncf = {
    id: Math.max(...mockNcf.map((n) => n.id)) + 1,
    ...formData,
    numero: formData.numero || generateNcfNumber(formData.tipo),
    estado: "Emitido",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockNcf.push(newNcf);
  return newNcf;
}

export async function updateNcfStatus(
  id: number,
  estado: Ncf["estado"]
): Promise<Ncf> {
  await delay(500);
  simulateError();

  const ncf = mockNcf.find((n) => n.id === id);
  if (!ncf) {
    throw new Error("NCF no encontrado");
  }

  ncf.estado = estado;
  ncf.updatedAt = new Date().toISOString();

  return ncf;
}

// Simulación de sincronización con DGII
export async function syncWithDgii(
  ncfId: number
): Promise<{ success: boolean; message: string }> {
  await delay(1000);
  simulateError();

  const ncf = mockNcf.find((n) => n.id === ncfId);
  if (!ncf) {
    throw new Error("NCF no encontrado");
  }

  // Simular respuesta de DGII
  const success = Math.random() > 0.3;

  if (success) {
    ncf.estado = "Aceptado";
    ncf.updatedAt = new Date().toISOString();
    return {
      success: true,
      message: "NCF sincronizado exitosamente con DGII",
    };
  } else {
    ncf.estado = "Rechazado";
    ncf.updatedAt = new Date().toISOString();
    return {
      success: false,
      message: "Error al sincronizar con DGII",
    };
  }
}
