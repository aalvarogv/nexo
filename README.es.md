# Nexo

[![Test Docker Compose](../../actions/workflows/test-docker-compose.yml/badge.svg)](../../actions/workflows/test-docker-compose.yml)
[![Test Backend](../../actions/workflows/test-backend.yml/badge.svg)](../../actions/workflows/test-backend.yml)

Nexo es un dashboard personal diario que centraliza agenda, correo, tareas y tiempo en un solo sitio. Se puede instalar como PWA en iPhone y usar desde cualquier ordenador.

También es un proyecto de portfolio: la calidad del código, la estructura, la documentación y el historial de commits importan tanto como las funcionalidades.

## Estado

En desarrollo temprano. El proyecto se construye de forma incremental, unas pocas horas a la semana, siguiendo la hoja de ruta de más abajo.

## Funcionalidades planeadas

### v1 — primera versión útil
- **Hoy**: eventos de hoy, tareas pendientes, correo importante y tiempo de un vistazo.
- **Agenda**: sincronización bidireccional con iCloud Calendar (CalDAV).
- **Correo**: integración con Gmail — leer, marcar como leído, archivar, responder.
- **Tareas**: nativas de Nexo — crear, editar, completar, fechas límite.
- **Tiempo**: [Open-Meteo](https://open-meteo.com), sin necesidad de API key.

### Más adelante
Hábitos, seguimiento de búsqueda de empleo, correo universitario, actividad de GitHub, seguimiento de ventas de Vinted, finanzas personales, un resumen diario generado por IA, y un bot de Telegram como punto de entrada conversacional.

## Stack tecnológico

- ⚡ [**FastAPI**](https://fastapi.tiangolo.com) para la API del backend.
  - 🧰 [SQLModel](https://sqlmodel.tiangolo.com) para las interacciones con la base de datos SQL (ORM).
  - 🔍 [Pydantic](https://docs.pydantic.dev) para la validación de datos y la configuración.
  - 💾 [PostgreSQL](https://www.postgresql.org) como base de datos, con migraciones de Alembic.
- 🚀 [React](https://react.dev) + TypeScript para el frontend.
  - 💃 Construido con [Vite](https://vitejs.dev).
  - 🎨 [Tailwind CSS](https://tailwindcss.com) y [shadcn/ui](https://ui.shadcn.com) para los componentes.
  - 🤖 Un cliente de API generado automáticamente.
  - 📱 Instalable como PWA, mobile-first.
- 🔒 Autenticación JWT y hash seguro de contraseñas.
- 🐋 [Docker Compose](https://www.docker.com) para el desarrollo local.
- ✅ [Pytest](https://pytest.org) para el backend y [Playwright](https://playwright.dev) para tests end-to-end.
- 🏭 CI con GitHub Actions.

## Desarrollo del backend

Documentación del backend: [backend/README.md](./backend/README.md).

## Desarrollo del frontend

Documentación del frontend: [frontend/README.md](./frontend/README.md).

## Desarrollo

Documentación general de desarrollo: [development.md](./development.md). Incluye el flujo local de FastAPI y Vite, los servicios de Docker Compose, la configuración de `.env`, y más.

## Despliegue

Todavía no disponible. Nexo se desplegará en servicios de capa gratuita sin tarjeta de crédito (frontend estático, backend en Render, Postgres gestionado, tareas de sincronización programadas en GitHub Actions). La documentación de despliegue se añadirá cuando se implemente esa fase.

## Licencia

Nexo está licenciado bajo los términos de la licencia MIT — ver [LICENSE](./LICENSE).

Partió de [fastapi/full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template), de Sebastián Ramírez, usado aquí como punto de partida depurado y adaptado a un producto distinto.
