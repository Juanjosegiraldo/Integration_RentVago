# RentVago

RentVago es una aplicación de gestión inmobiliaria construida con Next.js 16, Prisma 7, PostgreSQL local con Docker y Server Actions.

El proyecto incluye:

- Catálogo público de propiedades.
- Login con JWT y refresh token.
- Panel administrativo protegido.
- CRUD de propiedades.
- CRUD de arriendos.
- Gestión básica de usuarios.
- Validaciones con Zod.

## Stack

- Next.js 16 App Router
- React 19
- Prisma 7
- PostgreSQL 16 con `pgvector`
- Bun
- Tailwind CSS
- Zod
- Jose para JWT
- Docker Compose

## Requisitos

Antes de iniciar, instala o ten disponible:

- Docker Desktop
- Bun

Para verificar:

```bash
docker --version
bun --version
```

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto.

Para desarrollo local con Docker, usa:

```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/rentvago_dev"
DIRECT_URL="postgresql://postgres:root@localhost:5432/rentvago_dev"
JWT_SECRET="cambia_este_secreto_en_produccion"
APIFY_TOKEN=""
```

Notas:

- `DATABASE_URL` es la URL que usa la aplicación en runtime.
- `DIRECT_URL` es la URL que usa Prisma CLI mediante `prisma.config.ts`.
- En local ambas apuntan a la misma base.
- `JWT_SECRET` debe existir para login, JWT y refresh token.
- `APIFY_TOKEN` puede quedar vacío si no vas a usar scraping.

## Levantar la Base de Datos

Abre Docker Desktop y luego ejecuta:

```bash
docker compose up -d postgres
```

Esto levanta PostgreSQL local con:

- Host: `localhost`
- Puerto: `5432`
- Usuario: `postgres`
- Password: `root`
- Base de datos: `rentvago_dev`

Para verificar que el contenedor está arriba:

```bash
docker ps
```

Deberías ver un contenedor llamado:

```txt
rentvago-postgres
```

Si el contenedor ya existe pero está detenido:

```bash
docker start rentvago-postgres
```

## Instalar Dependencias

```bash
bun install
```

## Preparar Prisma

Genera Prisma Client:

```bash
bun --bun x prisma generate
```

Sincroniza el schema con la base local:

```bash
bun --bun x prisma db push
```

Si la base local está recién creada, esto crea las tablas del proyecto.

## Correr el Proyecto

```bash
bun dev
```

Luego abre:

```txt
http://localhost:3000
```

Rutas principales:

```txt
/catalog
/login
/register
/dashboard
/dashboard/properties
/dashboard/leases
/dashboard/users
```

## Flujo Recomendado Para Probar

1. Registra un usuario en `/register`.
2. Cambia su rol a `ADMIN` desde la base o desde el panel si ya tienes un admin.
3. Inicia sesión en `/login`.
4. Entra a `/dashboard`.
5. Crea propiedades en `/dashboard/properties`.
6. Verifica que aparezcan en `/catalog`.
7. Crea arriendos en `/dashboard/leases`.
8. Edita y elimina propiedades/arriendos para probar el CRUD.

## Autenticación

El login genera:

- `access_token`
- `refresh_token`

Ambos se guardan como cookies `httpOnly`.

El `refresh_token` también se guarda en la tabla `RefreshToken`, para poder invalidarlo al cerrar sesión.

El dashboard está protegido por `src/proxy.ts`:

- Usuarios sin sesión van a `/login`.
- Usuarios no admin son redirigidos a `/catalog`.
- Usuarios admin pueden entrar a `/dashboard`.

## Estructura Principal

```txt
src/
├── app/
│   ├── actions/
│   │   └── db-actions.ts
│   ├── api/
│   ├── catalog/
│   ├── dashboard/
│   │   ├── leases/
│   │   ├── properties/
│   │   └── users/
│   ├── login/
│   └── register/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── validations.ts
└── services/
    ├── admin.service.ts
    ├── lease.service.ts
    └── property.service.ts
```

## Patrón Usado

El proyecto usa una estructura simple:

```txt
Page/Form -> Server Action -> Service -> Prisma -> PostgreSQL
```

Ejemplo al crear una propiedad:

```txt
src/app/dashboard/properties/new/page.tsx
  -> createPropertyAction
  -> propertySchema
  -> propertyService.createProperty
  -> prisma.property.create
```

Esto mantiene:

- Formularios simples.
- Validaciones centralizadas con Zod.
- Acceso a base de datos dentro de services.
- Server Actions para mutaciones desde el dashboard.

## Docker Compose

El archivo `docker-compose.yml` incluye:

- `postgres`: base principal del proyecto.
- `mongo`: servicio disponible para integraciones anteriores o futuras.

Para levantar solo PostgreSQL:

```bash
docker compose up -d postgres
```

Para levantar todos los servicios:

```bash
docker compose up -d
```

Para detener:

```bash
docker compose down
```

Para detener sin borrar datos:

```bash
docker stop rentvago-postgres
```

## Problemas Comunes

### Prisma no conecta

Verifica que Docker esté corriendo:

```bash
docker ps
```

Verifica que `.env` tenga:

```env
DATABASE_URL="postgresql://postgres:root@localhost:5432/rentvago_dev"
DIRECT_URL="postgresql://postgres:root@localhost:5432/rentvago_dev"
```

Luego ejecuta:

```bash
bun --bun x prisma db push
```

### No puedo entrar al dashboard

El usuario debe tener rol:

```txt
ADMIN
```

Si el usuario es `USER`, el proxy lo redirige a `/catalog`.

### El catálogo dice "Sin imagen"

La propiedad no tiene `imageUrl`.

Puedes agregar una URL de imagen al crear o editar una propiedad:

```txt
https://example.com/imagen.jpg
```

La URL debe ser válida porque se valida con Zod.

## Comandos Útiles

```bash
# Levantar DB local
docker compose up -d postgres

# Instalar dependencias
bun install

# Generar Prisma Client
bun --bun x prisma generate

# Sincronizar DB
bun --bun x prisma db push

# Correr dev server
bun dev

# Verificar TypeScript
bun --bun x tsc --noEmit
```

## Estado Actual

Funcionalidades principales listas:

- Autenticación con JWT y refresh token.
- Protección de rutas admin.
- CRUD de propiedades.
- CRUD de arriendos.
- Catálogo público conectado a la base.
- Validaciones con Zod.
- PostgreSQL local con Docker.
