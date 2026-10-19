# ServiHub – Backend (Tarea 2)

API REST con Node.js + Express + PostgreSQL. Expone el CRUD completo de 4 tablas del modelo de la primera entrega: **roles, usuarios, categorias y servicios**.

## Requisitos
- Node.js 18 o superior
- PostgreSQL 14 o superior

## Instalación
```bash
# 1. Instalar dependencias
npm install

# 2. Crear la base de datos y cargar tablas + datos de prueba
createdb servihub
psql -d servihub -f database/servihub_tarea2.sql

# 3. Configurar variables de entorno
cp .env.example .env        # y editar con tus credenciales reales

# 4. Ejecutar
npm start                   # o: npm run dev
```
El servidor queda en `http://localhost:3000` (o el `PORT` que definas en `.env`).

## Estructura (arquitectura por capas)
```
src/
├── config/        db.js (pool de PostgreSQL con variables de entorno)
├── routes/        definición de endpoints
├── controllers/   validación de datos y respuestas HTTP
├── models/        acceso a datos (consultas SQL)
├── middlewares/   validarId, manejo de errores, helpers de validación
├── app.js         configuración de Express
└── server.js      arranque del servidor
database/          script .sql (tablas + datos de prueba)
```

## Endpoints
Cada recurso (`/api/roles`, `/api/usuarios`, `/api/categorias`, `/api/servicios`) expone:

| Método | Ruta         | Acción                |
|--------|--------------|-----------------------|
| GET    | `/api/<recurso>`     | Consultar todos       |
| GET    | `/api/<recurso>/:id` | Consultar uno         |
| POST   | `/api/<recurso>`     | Crear                 |
| PUT    | `/api/<recurso>/:id` | Actualizar            |
| DELETE | `/api/<recurso>/:id` | Eliminar              |

Las contraseñas de usuarios se guardan cifradas con bcrypt y **nunca** se devuelven en las respuestas.
