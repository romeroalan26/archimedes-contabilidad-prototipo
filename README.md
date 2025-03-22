# 🧾 Archimedes Contabilidad - Prototipo de Sistema Contable

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-prototype-lightgrey)

> Prototipo estático del sistema contable para **Archimedes Construcciones**, diseñado para visualizar flujos contables, gestión de obras y KPIs financieros antes del desarrollo funcional completo.

---

## 🚀 Comenzando

Este proyecto simula una plataforma contable para empresas constructoras. Ideal para presentaciones, validación de requerimientos y diseño de interfaces.

### ✅ Requisitos previos

- Node.js **v18.0.0** o superior
- npm **v9.0.0** o superior

---

## 🛠️ Instalación

```bash
# Clona el repositorio
git clone https://github.com/tuusuario/archimedes-contabilidad-prototipo.git
cd archimedes-contabilidad-prototipo

# Instala dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

---

## 💡 Características Principales

- 🔐 Login simulado con roles (admin, contador, gerente)
- 📊 Dashboard con KPIs financieros y alertas
- 🧾 Gestión contable: libro diario, mayor, balances
- 🏗 Proyectos y centros de costo por obra
- 💰 Módulos de ventas y compras
- 📦 Inventario asignado a obras
- 🏦 Conciliación bancaria y tesorería
- 📋 Reportes fiscales (606, 607, 608)
- 🌓 Modo claro/oscuro (opcional)
- 📤 Exportación simulada a Excel/PDF

---

## 📂 Estructura del Proyecto

```
src/
├── assets/         # Imágenes, íconos
├── components/     # Reutilizables (inputs, modales, etc.)
├── features/       # Módulos funcionales por dominio
│   ├── auth/       # Login y roles
│   ├── dashboard/  # KPIs y alertas
│   ├── sales/      # Ventas y CxC
│   ├── purchases/  # Compras y CxP
│   ├── inventory/  # Productos, movimientos
│   ├── projects/   # Obras y centros de costo
│   ├── treasury/   # Transferencias, cheques
│   ├── reports/    # Reportes fiscales y financieros
├── data/           # JSON simulados
├── store/          # Zustand o Jotai
├── types/          # Tipado global
├── utils/          # Funciones auxiliares
├── App.tsx         # Root app
```

---

## 📦 Scripts disponibles

```bash
npm run dev         # Ejecuta en modo desarrollo
npm run build       # Compila para producción
npm run preview     # Previsualiza la build
```

---

## 🌐 Despliegue en Vercel

1. Conecta tu cuenta en [https://vercel.com](https://vercel.com)
2. Importa este repositorio
3. Configura como framework: `Vite + React`
4. ¡Despliegue automático al hacer push!

---

## 🧪 Ejemplo de Uso

- Inicia sesión con un rol simulado
- Navega al dashboard para ver KPIs
- Ve a "Ventas" y registra una venta a crédito
- Consulta "Inventario" y asigna materiales a una obra

> ⚠️ **Este prototipo no tiene backend ni persistencia real. Todo es simulado con datos estáticos.**

---

## 🧭 Roadmap

- [x] Dashboard responsivo con KPIs
- [x] Módulos de ventas y compras
- [x] Gestión de proyectos y centros de costo
- [ ] Validaciones en formularios
- [ ] Modo oscuro
- [ ] Exportación real a Excel/PDF
- [ ] Animaciones y mejoras UX

---

## 🤝 Contribución

¡Contribuciones bienvenidas! Para contribuir:

1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/nombre`)
3. Realiza tus cambios y haz commit (`git commit -am 'Add feature'`)
4. Haz push a tu rama (`git push origin feature/nombre`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## ❓ FAQ

**¿Este sistema guarda datos?**  
No. Todos los datos están en archivos JSON y se reinician al recargar.

**¿Está listo para producción?**  
No. Este es un prototipo visual para validación y presentación.

---

## 📘 Documentación y enlaces

- [React Router](https://reactrouter.com/)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
