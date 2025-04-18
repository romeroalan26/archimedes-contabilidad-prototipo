# 📦 BACKEND_PLAN.md – Plan de Arquitectura y Modelado de Datos

Este documento centralizará toda la planificación del backend para el sistema contable, incluyendo modelos de datos, relaciones entre entidades, y estructura de endpoints por módulo.

---

## 🧭 Estructura del documento

### 1. Objetivo General

Definir las estructuras de datos necesarias para cada módulo del sistema contable validado en frontend (modo demo), de modo que puedan ser migradas a un backend real con API REST, GraphQL o base de datos relacional (PostgreSQL, MySQL) o no relacional (MongoDB).

### 2. Módulos incluidos

- Ventas ✅
- Inventario ⏳
- Compras ⏳
- Proyectos ⏳
- NCF ⏳
- Formatos DGII ⏳
- Nómina / TSS ⏳
- Conciliación Bancaria ⏳
- Activos Fijos ⏳

Cada módulo tendrá su propia sección con:

- Entidades involucradas
- Modelo de datos sugerido (estructura de interfaces o tablas)
- Relaciones entre entidades
- JSON de ejemplo (para requests/responses de API)
- Notas para validación o lógica específica

### 3. Recomendaciones técnicas

- Uso de UUID para identificadores únicos
- Timestamps estándar ISO 8601 para fechas
- Normalización de relaciones 1:N y N:M según necesidad del módulo
- Modularización de endpoints por recurso (RESTful design)

---

## ✅ Módulo de Ventas (validado)

🔁 **Importado desde canvas `Ventas Esquema Datos Backend`**

- Entidades: Venta, Cliente, Producto, DetalleVenta
- Relaciones:
  - Cliente 1:N Ventas
  - Venta 1:N DetalleVenta
  - Producto 1:N DetalleVenta
- Ver estructura en canvas correspondiente

### 📌 Clientes (gestionados dentro del módulo de Ventas)

Aunque no hay un módulo independiente de clientes, el formulario y la lista de clientes están contenidos en el flujo de ventas. La entidad `Client` tiene la siguiente estructura:

```ts
interface Client {
  id: string;
  name: string;
  rnc: string;
  phone?: string;
  email?: string;
  billingType: "contado" | "credito" | "mixto";
  ncfType:
    | "consumidor_final"
    | "credito_fiscal"
    | "gubernamental"
    | "regimen_especial";
}
```

- Relación: Cliente 1:N Venta
- Validaciones: `name` y `rnc` obligatorios (Zod), `email` y `phone` opcionales
- Este cliente se selecciona al momento de crear una venta

#### Ejemplo de JSON:

```json
{
  "id": "cl_001",
  "name": "Constructora Gómez",
  "rnc": "101234567",
  "phone": "809-555-7890",
  "email": "contacto@cgomez.com",
  "billingType": "credito",
  "ncfType": "credito_fiscal"
}
```

---

## ⏳ Módulos pendientes por validar en frontend

- A medida que se complete cada módulo, agregar su modelo aquí.

---

Este archivo servirá como guía unificada para desarrollar el backend e implementar base de datos y API.
