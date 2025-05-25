# 🔧 Refactorización del Módulo Clientes - Seguridad JWT

## 📋 **Resumen de Cambios**

Se refactorizó completamente el módulo de clientes para eliminar el uso inseguro de variables de entorno (`VITE_EMPRESA_ID`) y migrar a un patrón de seguridad basado exclusivamente en **tokens JWT**.

---

## 🚨 **Problema Original**

### **❌ ANTES (Inseguro)**

```javascript
// ❌ Variable de entorno expuesta en frontend
const EMPRESA_ID = import.meta.env.VITE_EMPRESA_ID;

// ❌ Enviando empresa_id en requests
const clienteData = {
  nombre: "Cliente Test",
  rnc_cedula: "12345678901",
  empresa_id: EMPRESA_ID, // ← Inseguro e innecesario!
};
```

### **⚠️ Riesgos de Seguridad**

1. **Variables de entorno expuestas** en el bundle del frontend
2. **Manipulación posible** del `empresa_id` desde DevTools
3. **Violación del aislamiento** entre empresas multi-tenant
4. **No conformidad** con mejores prácticas JWT

---

## ✅ **Solución Implementada**

### **🔐 Seguridad JWT Pura**

```javascript
// ✅ Solo token JWT en headers
const response = await fetch("/api/clientes", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

// ✅ Datos limpios sin empresa_id
const clienteData = {
  nombre: "Cliente Test",
  rnc_cedula: "12345678901",
  // empresa_id se toma automáticamente del token en backend
};
```

---

## 📁 **Archivos Modificados**

### **1. Servicio Principal**

📄 `src/services/clients/clientService.ts`

- ❌ **Eliminado**: `VITE_EMPRESA_ID` y validaciones UUID
- ❌ **Eliminado**: `empresa_id` de todos los payloads
- ✅ **Agregado**: Validación de token en todas las operaciones
- ✅ **Mejorado**: Manejo de errores JWT (401, 403)

### **2. Componente de Formulario**

📄 `src/components/ClientFormModal.tsx`

- ❌ **Eliminado**: Manejo de errores de `empresa_id`
- ✅ **Agregado**: Manejo de errores JWT específicos

### **3. Hook Personalizado (NUEVO)**

📄 `src/hooks/useClients.ts`

- ✅ **Creado**: Hook completo para gestión de clientes
- ✅ **Implementado**: Patrón JWT-only en todas las operaciones
- ✅ **Incluido**: Manejo robusto de errores de autenticación

---

## 🔄 **Operaciones CRUD Refactorizadas**

### **📥 GET - Obtener Clientes**

```javascript
// ✅ DESPUÉS - Solo token JWT
const clientes = await clientService.getAll();
// Backend filtra automáticamente por empresa del token
```

### **📝 POST - Crear Cliente**

```javascript
// ✅ DESPUÉS - Sin empresa_id
const nuevoCliente = await clientService.create({
  nombre: "Cliente Nuevo",
  rnc_cedula: "12345678901",
  telefono: "809-555-0123",
  // empresa_id se toma del token automáticamente
});
```

### **✏️ PUT - Actualizar Cliente**

```javascript
// ✅ DESPUÉS - Sin empresa_id
const clienteActualizado = await clientService.update(clienteId, {
  nombre: "Cliente Actualizado",
  telefono: "809-555-9999",
  // empresa_id se maneja automáticamente
});
```

### **🗑️ DELETE - Desactivar Cliente**

```javascript
// ✅ DESPUÉS - Solo token JWT
await clientService.deactivate(clienteId);
// Backend valida permisos automáticamente
```

---

## 🛠️ **Nuevo Hook `useClients`**

### **🎯 Uso Simplificado**

```typescript
import { useClients } from '../hooks/useClients';

function ClientesComponent() {
  const {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deactivateClient,
    reactivateClient,
    clearError
  } = useClients();

  const handleCreateClient = async (data) => {
    try {
      await createClient(data);
      // Cliente creado exitosamente
    } catch (error) {
      // Error manejado automáticamente en el hook
    }
  };

  return (
    <div>
      {loading && <div>Cargando...</div>}
      {error && <div>Error: {error}</div>}
      {/* Renderizar clientes */}
    </div>
  );
}
```

### **🔒 Beneficios del Hook**

- ✅ **Validación automática** de tokens
- ✅ **Manejo robusto** de errores JWT
- ✅ **Estado centralizado** de clientes
- ✅ **API limpia** y consistente
- ✅ **Recarga automática** cuando cambia el token

---

## 🔐 **Beneficios de Seguridad**

### **🛡️ Antes vs Después**

| Aspecto                        | ❌ ANTES               | ✅ DESPUÉS                      |
| ------------------------------ | ---------------------- | ------------------------------- |
| **Variables de entorno**       | Expuestas en frontend  | Eliminadas completamente        |
| **Manipulación de empresa_id** | Posible desde DevTools | Imposible - manejado en backend |
| **Aislamiento multi-tenant**   | Vulnerable             | Automático vía JWT              |
| **Superficie de ataque**       | Grande                 | Minimizada                      |
| **Conformidad JWT**            | No                     | Sí - mejores prácticas          |

### **🔒 Seguridad JWT Robusta**

1. **Token único**: Contiene toda la información necesaria
2. **Validación backend**: Automática en cada request
3. **Expiración**: Manejo automático de tokens vencidos
4. **Permisos**: Validación de roles y empresa integrada

---

## ⚠️ **Consideraciones Importantes**

### **🔑 Dependencias**

- **Token válido**: Todas las operaciones requieren autenticación
- **Backend compatible**: Debe extraer `empresa_id` del token JWT
- **Manejo de errores**: Frontend preparado para respuestas 401/403

### **📝 Variables de Entorno**

```bash
# ❌ YA NO NECESARIO
# VITE_EMPRESA_ID=empresa-uuid

# ✅ SOLO NECESARIO
VITE_API_URL=https://api.sistemacontable.lat/api
```

---

## 🚀 **Siguientes Pasos**

### **📋 Checklist Completado**

- [x] **Eliminar** `VITE_EMPRESA_ID` de servicios
- [x] **Actualizar** todas las operaciones CRUD
- [x] **Remover** `empresa_id` de payloads
- [x] **Crear** hook `useClients` optimizado
- [x] **Mejorar** manejo de errores JWT
- [x] **Verificar** build sin errores TypeScript

### **🔄 Refactorización de Otros Módulos**

Aplicar el mismo patrón a:

- [ ] **Módulo de Proveedores** (`src/features/suppliers/`)
- [ ] **Módulo de Productos** (`src/features/inventory/`)
- [ ] **Módulo de Ventas** (`src/features/sales/`)
- [ ] **Módulo de Compras** (`src/features/purchases/`) ✅ (Ya refactorizado)

---

## 📚 **Recursos y Referencias**

### **🔗 Mejores Prácticas JWT**

- [RFC 7519 - JSON Web Token](https://tools.ietf.org/html/rfc7519)
- [OWASP JWT Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

### **🏗️ Patrones de Arquitectura**

- **Multi-tenancy**: Aislamiento por JWT
- **Zero Trust**: Validación en cada request
- **Principio de menor privilegio**: Solo datos necesarios

---

## 👥 **Equipo y Mantenimiento**

**Refactorizado por**: AI Assistant (Claude Sonnet 4)  
**Fecha**: Enero 2025  
**Versión**: 1.0  
**Estado**: ✅ Completado y verificado

**Próximas revisiones**: Aplicar patrón a otros módulos del sistema
