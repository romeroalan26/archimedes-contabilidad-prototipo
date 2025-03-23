# Módulo de Nómina

Este módulo maneja la gestión de nóminas para el sistema contable Archimedes.

## Estructura

```
src/features/payroll/
├── components/
│   ├── forms/
│   │   └── PayrollForm.tsx
│   ├── lists/
│   │   └── EmployeeList.tsx
│   └── summary/
│       └── PayrollSummary.tsx
├── hooks/
│   └── index.ts
├── pages/
│   ├── PayrollPage.tsx
│   ├── PayrollDetailPage.tsx
│   └── PayrollHistoryPage.tsx
├── services/
│   └── index.ts
├── types/
│   ├── employee.ts
│   ├── payroll.ts
│   └── schemas.ts
├── utils/
│   ├── calculations.ts
│   ├── format.ts
│   └── export.ts
└── routes.tsx
```

## Características

- Gestión de empleados (CRUD)
- Cálculo de nómina con:
  - Salario base
  - Bonificaciones (horas extra, comisiones, otros)
  - Deducciones (AFP, ARS, ISR, préstamos, adelantos)
  - Salario neto
- Historial de nóminas por período
- Exportación a TSS y PDF
- Validación de datos con Zod
- Integración con React Query para manejo de estado y caché

## TODO

- [ ] Integrar con backend RESTful
- [ ] Actualizar tablas de ISR
- [ ] Actualizar tasas de AFP y ARS
- [ ] Implementar formato específico de TSS
- [ ] Agregar pruebas unitarias
- [ ] Agregar pruebas de integración
- [ ] Mejorar manejo de errores
- [ ] Agregar paginación en listas
- [ ] Implementar búsqueda y filtros avanzados
- [ ] Agregar gráficos y reportes

## Dependencias

- react-hook-form
- @hookform/resolvers/zod
- zod
- @tanstack/react-query
- xlsx
- jspdf
- react-router-dom
- tailwindcss

## Uso

```tsx
import { PayrollPage } from './features/payroll/pages/PayrollPage';

function App() {
  return (
    <Routes>
      <Route path="/payroll/*" element={<PayrollPage />} />
    </Routes>
  );
}
```

## API

### Endpoints

```
GET    /api/payroll/employees
GET    /api/payroll/employees/:id
POST   /api/payroll/employees
PUT    /api/payroll/employees/:id
DELETE /api/payroll/employees/:id

GET    /api/payroll/payrolls
GET    /api/payroll/payrolls/:id
POST   /api/payroll/payrolls
GET    /api/payroll/payrolls/:id/export
```

### Tipos

```typescript
interface Employee {
  id: number;
  nombre: string;
  cedula: string;
  posicion: string;
  salario: number;
  fechaIngreso: string;
  estado: 'activo' | 'inactivo';
}

interface PayrollDetails {
  id: number;
  empleadoId: number;
  periodo: {
    inicio: string;
    fin: string;
    fechaPago: string;
  };
  salarioBase: number;
  bonificaciones: Array<{
    tipo: 'horasExtra' | 'comision' | 'otro';
    monto: number;
    descripcion: string;
  }>;
  deducciones: Array<{
    tipo: 'prestamo' | 'adelanto' | 'otro';
    monto: number;
    descripcion: string;
  }>;
  afp: number;
  ars: number;
  isr: number;
  salarioNeto: number;
  estado: 'pendiente' | 'procesado' | 'pagado';
  fechaCreacion: string;
  fechaActualizacion: string;
}
``` 