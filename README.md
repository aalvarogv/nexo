# Nexo

[![Test Docker Compose](../../actions/workflows/test-docker-compose.yml/badge.svg)](../../actions/workflows/test-docker-compose.yml)
[![Test Backend](../../actions/workflows/test-backend.yml/badge.svg)](../../actions/workflows/test-backend.yml)

Nexo is a personal daily dashboard that brings together agenda, mail, tasks and weather in one place. It's installable as a PWA on iPhone and usable from any computer.

It is also a portfolio project: code quality, structure, documentation and commit history matter as much as features.

## Status

Early development. The project is being built incrementally, a few hours a week, following the roadmap below.

## Planned Features

### v1 — first useful version
- **Today**: today's events, tasks due, important mail and weather at a glance.
- **Agenda**: two-way sync with iCloud Calendar (CalDAV).
- **Mail**: Gmail integration — read, mark as read, archive, reply.
- **Tasks**: native to Nexo — create, edit, complete, due dates.
- **Weather**: [Open-Meteo](https://open-meteo.com), no API key required.

### Later
Habits, a job-application tracker, university mail, GitHub activity, a Vinted sales tracker, personal finances, an AI-generated daily summary, and a Telegram bot as the conversational entry point.

## Technology Stack

- ⚡ [**FastAPI**](https://fastapi.tiangolo.com) for the backend API.
  - 🧰 [SQLModel](https://sqlmodel.tiangolo.com) for the SQL database interactions (ORM).
  - 🔍 [Pydantic](https://docs.pydantic.dev) for data validation and settings management.
  - 💾 [PostgreSQL](https://www.postgresql.org) as the database, with Alembic migrations.
- 🚀 [React](https://react.dev) + TypeScript for the frontend.
  - 💃 Built with [Vite](https://vitejs.dev).
  - 🎨 [Tailwind CSS](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com) for components.
  - 🤖 An automatically generated API client.
  - 📱 Installable as a PWA, mobile-first.
- 🔒 JWT authentication and secure password hashing.
- 🐋 [Docker Compose](https://www.docker.com) for local development.
- ✅ [Pytest](https://pytest.org) for the backend and [Playwright](https://playwright.dev) for end-to-end tests.
- 🏭 CI with GitHub Actions.

## Backend Development

Backend docs: [backend/README.md](./backend/README.md).

## Frontend Development

Frontend docs: [frontend/README.md](./frontend/README.md).

## Development

General development docs: [development.md](./development.md). This includes the local FastAPI and Vite workflow, Docker Compose services, `.env` configuration, and more.

## Deployment

Not yet available. Nexo will deploy to free-tier services with no credit card required (static frontend, backend on Render, managed Postgres, scheduled sync jobs on GitHub Actions). Deployment docs will be added once that phase is implemented.

## License

Nexo is licensed under the terms of the MIT license — see [LICENSE](./LICENSE).

It started from [fastapi/full-stack-fastapi-template](https://github.com/fastapi/full-stack-fastapi-template) by Sebastián Ramírez, used here as a cleaned-up starting point and adapted into a different product.
