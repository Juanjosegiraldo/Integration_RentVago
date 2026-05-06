# Arrendamientos CO

Aplicacion en Next.js con autenticacion por JWT, panel por roles (`ADMIN` y `USER`) y modulo de scraping para guardar arrendamientos en PostgreSQL usando Prisma.

## Stack

- `Next.js 16`
- `React 19`
- `Prisma`
- `PostgreSQL`
- `JWT`
- `node-cron`
- `Axios`

## Que hace el proyecto

- Registro e inicio de sesion.
- Roles `ADMIN` y `USER`.
- Panel de administracion para crear, editar y eliminar fuentes de scraping.
- Ejecucion manual del scraping desde API.
- Ejecucion automatica cada 6 horas con `node-cron`.
- Listado de arrendamientos guardados en base de datos.


1. `Facebook Marketplace`
   Usa Apify porque Facebook bloquea scraping directo y requiere navegador real.

## Requisitos

- `Node.js 20+`
- `PostgreSQL`
- `npm`
- Token de Apify si vas a usar Facebook Marketplace

## Instalacion

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

La aplicacion quedara disponible en `http://localhost:3000`.

## Variables de entorno

Archivo `.env` minimo:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/arrendamientos"
ACCESS_SECRET="tu_access_secret"
REFRESH_SECRET="tu_refresh_secret"
APIFY_TOKEN="apify_api_token_opcional_si_usas_facebook"
```

## Seed inicial

El proyecto trae un seed para crear dos usuarios de prueba:

```bash
npm run seed
```

Usuarios creados:

- `andres@admin.com` / `admin123`
- `andres@user.com` / `user123`


## Roles

- `ADMIN`: puede administrar fuentes y ejecutar scraping.
- `USER`: puede consultar arrendamientos guardados.




## Ejemplos de fuentes
https://web.facebook.com/marketplace/medellin/search/?query=arriendo%20casa%20medellin

http://localhost:3000/api/arriendos

### Facebook Marketplace


Notas:

- Esta fuente usa Apify.
- El servicio limita la recoleccion con `maxItems: 10`.
- Si Facebook carga demasiado lento, no se resuelve cambiando solo la URL. El control real hoy esta en la configuracion enviada al actor de Apify dentro de [src/services/scraping.ts](/home/cohorte6/Escritorio/next-auth-repo-scraping/proyecto/src/services/scraping.ts:197).




## Estructura util del proyecto

```text
prisma/schema.prisma
prisma/seed.ts
src/app/api/scraping/ejecutar/route.ts
src/app/api/scraping/fuentes/route.ts
src/app/api/scraping/fuentes/[id]/route.ts
src/app/api/scraping/arrendamientos/route.ts
src/services/scraping.ts
src/lib/cron.ts
```

## Modelos de base de datos

Modelos relevantes en [prisma/schema.prisma](/home/cohorte6/Escritorio/next-auth-repo-scraping/proyecto/prisma/schema.prisma:1):

- `User`
- `Agent`
- `ScrapingFuente`
- `Arrendamiento`

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run seed
```

