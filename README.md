# Lubricentro 208 — Backend

API REST para el sistema de gestión de services (frontend del sistema).

- **Express 5** + **Prisma 6** + **PostgreSQL**
- Auth con **JWT** (`Authorization: Bearer <token>`)

## Scripts

| Comando         | Qué hace                                  |
| --------------- | ---------------------------------------- |
| `npm run dev`   | nodemon sobre `src/server.js`            |
| `npm start`     | `node src/server.js`                     |

## Setup

```bash
npm install
cp .env.example .env       # completar DATABASE_URL y JWT_SECRET
npx prisma generate
npx prisma migrate deploy  # o `npx prisma migrate dev` en desarrollo
node src/createAdmin.js    # crea admin@test.com (una sola vez)
npm run dev
```

## Endpoints

| Método | Ruta                             | Auth | Descripción                       |
| ------ | -------------------------------- | ---- | -------------------------------- |
| GET    | `/`                              | —    | Healthcheck ("API funcionando")  |
| POST   | `/api/auth/login`               | —    | `{ email, password }` → `{ token }` |
| GET    | `/api/vehicles`                 | ✔    | Lista de vehículos               |
| GET    | `/api/vehicles/:plate`          | —    | Buscar vehículo por patente      |
| POST   | `/api/vehicles`                 | ✔    | Crear service                    |
| PUT    | `/api/vehicles/:id`             | ✔    | Editar service                   |
| PATCH  | `/api/vehicles/:id/recontacto`  | ✔    | Marcar recontacto hecho          |
| DELETE | `/api/vehicles/:id`            | ✔    | Borrar vehículo                  |
| GET    | `/api/settings`                 | —    | Config (intervalo de service)    |
| PUT    | `/api/settings`                 | ✔    | Actualizar config                |

## Notas

- `src/db/database.js` y `src/routes/searchRoutes.js` son código heredado que
  **no** está montado en `server.js`. Se dejaron por compatibilidad; se pueden
  borrar sin afectar la API.
