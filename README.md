# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

# Archimedes Contabilidad

Sistema de contabilidad y gestión empresarial.

## Estructura del Proyecto

```
src/
├── features/
│   ├── payroll/                 # Módulo de Nómina
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── PayrollForm.tsx  # Formulario de nómina
│   │   │   └── PayrollList.tsx  # Lista de nóminas
│   │   ├── hooks/              # Hooks personalizados
│   │   │   ├── usePayroll.ts   # Hook principal de nómina
│   │   │   └── useEmployees.ts # Hook de gestión de empleados
│   │   ├── pages/              # Páginas del módulo
│   │   │   ├── PayrollPage.tsx # Página principal
│   │   │   └── PayrollHistoryPage.tsx # Historial
│   │   ├── services/           # Servicios y API
│   │   │   └── index.ts        # Servicios de nómina
│   │   ├── types/              # Tipos y interfaces
│   │   │   ├── payroll.ts      # Tipos de nómina
│   │   │   └── employee.ts     # Tipos de empleado
│   │   └── utils/              # Utilidades
│   │       ├── calculations.ts # Cálculos de nómina
│   │       ├── export.ts       # Exportación de reportes
│   │       └── validations.ts  # Validaciones
│   └── ...
└── ...
```

## Módulo de Nómina

El módulo de nómina permite gestionar el proceso de cálculo y pago de salarios, incluyendo:

### Características Principales

- Cálculo automático de salarios netos
- Gestión de bonificaciones y deducciones
- Exportación de reportes en múltiples formatos
- Historial de nóminas con filtros avanzados
- Validaciones de negocio integradas

### Exportación de Reportes

El módulo soporta la exportación de reportes en los siguientes formatos:

1. **TSS (Tesoreria de la Seguridad Social)**
   - Formato estándar para reportes de nómina
   - Validación de datos requeridos
   - Generación de archivo plano

2. **Excel**
   - Resumen de nóminas
   - Totales y subtotales
   - Formato profesional con estilos

3. **PDF**
   - Reporte individual por empleado
   - Diseño profesional con encabezados y pie de página
   - Tablas y formatos de moneda

### Integración

Para integrar el módulo con el backend:

1. Actualizar las URLs en `services/index.ts`
2. Implementar los endpoints correspondientes
3. Configurar las variables de entorno necesarias

### Pruebas

El módulo incluye pruebas unitarias para:

- Cálculos de nómina
- Validaciones de datos
- Generación de reportes
- Manejo de errores

Para ejecutar las pruebas:

```bash
npm test src/features/payroll
```

### Próximos Pasos

1. Implementar exportación TSS con formato específico
2. Mejorar la generación de reportes PDF/Excel
3. Agregar más opciones de filtrado en el historial
4. Implementar validaciones de negocio adicionales
5. Optimizar el rendimiento de la paginación

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Construcción

```bash
npm run build
```

## Pruebas

```bash
npm test
```
