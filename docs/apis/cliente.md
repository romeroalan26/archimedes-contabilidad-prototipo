# 👥 Módulo: Clientes

## ✅ Funcionalidades implementadas

- Crear nuevo cliente (POST)
- Consultar todos los clientes (GET)
- Consultar un cliente por ID (GET /:id)
- Actualizar datos de cliente (PUT /:id)
- Eliminar un cliente (DELETE /:id)
- Validaciones de campos obligatorios y formato

## 🔒 Decisiones clave

- **Validación de unicidad**: No se permiten clientes duplicados con el mismo nombre y RNC en una empresa
- **Campos obligatorios**: nombre, rnc_cedula y empresa_id son requeridos para crear un cliente
- **Actualización parcial**: Se pueden actualizar campos individuales sin necesidad de enviar todos los datos

## 📤 Endpoints disponibles

- `POST /api/clientes`
- `GET /api/clientes`
- `GET /api/clientes/:id`
- `PUT /api/clientes/:id`
- `DELETE /api/clientes/:id`

## 🧪 Validaciones aplicadas

- Validación de UUID en rutas (evita error 500 por formato inválido)
- Campos obligatorios: nombre, rnc_cedula, empresa_id
- RNC/Cédula no puede estar vacío
- Validación de unicidad de nombre + RNC por empresa
- Error 404 si el recurso no existe
- Error 409 si se intenta crear un cliente duplicado

## 📦 Tablas involucradas

- `cliente`

## 📋 Estructura de datos

```json
{
  "nombre": "string",
  "rnc_cedula": "string",
  "telefono": "string (opcional)",
  "correo": "string (opcional)",
  "direccion": "string (opcional)",
  "empresa_id": "UUID"
}
```

## 📌 Notas adicionales

- Todas las operaciones están hechas con `pg` (sin ORM)
- Se implementa manejo de errores con códigos HTTP apropiados
- Las respuestas de error incluyen mensajes descriptivos
- Se valida el formato UUID en todas las operaciones que requieren ID
