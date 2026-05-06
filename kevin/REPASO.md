# Repaso RentVago

Este documento es para repasar el proyecto y entender qué hicimos, dónde está cada cosa y cómo fluye el código.

## Idea General

RentVago tiene dos partes principales:

- Parte pública: catálogo de propiedades.
- Parte privada: dashboard administrativo.

El dashboard permite administrar:

- Usuarios.
- Propiedades.
- Arriendos.

La estructura que usamos es sencilla:

```txt
Page/Form -> Server Action -> Service -> Prisma -> PostgreSQL
```

Eso significa:

1. Una página muestra un formulario.
2. El formulario llama una Server Action.
3. La Server Action valida datos y llama un service.
4. El service usa Prisma.
5. Prisma guarda o consulta en PostgreSQL.

## Encarpetado Principal

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
├── components/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── validations.ts
└── services/
    ├── admin.service.ts
    ├── lease.service.ts
    └── property.service.ts
```

## Qué Hace Cada Carpeta

### `src/app`

Es la carpeta principal de Next.js App Router.

Aquí viven:

- páginas
- layouts
- API routes
- Server Actions

Ejemplos:

```txt
src/app/dashboard/page.tsx
src/app/dashboard/properties/page.tsx
src/app/dashboard/leases/page.tsx
src/app/login/page.tsx
```

### `src/app/actions`

Aquí pusimos las Server Actions.

Archivo principal:

```txt
src/app/actions/db-actions.ts
```

Una Server Action es una función que corre en el servidor y puede ser llamada directamente desde un formulario.

Ejemplo de uso:

```tsx
<form action={createPropertyAction}>
```

Eso significa:

- El usuario llena el formulario.
- Da click en guardar.
- Next.js manda el formulario al servidor.
- Se ejecuta `createPropertyAction`.
- No necesitamos crear un `fetch` manual desde el cliente.

Server Actions que usamos:

```txt
loginAction
registerAction
logoutAction
createPropertyAction
updatePropertyAction
deletePropertyAction
createLeaseAction
updateLeaseAction
deleteLeaseAction
toggleUserStatusAction
changeUserRoleAction
```

### `src/services`

Aquí vive la lógica de acceso a datos.

Los services hablan con Prisma.

Ejemplos:

```txt
src/services/property.service.ts
src/services/lease.service.ts
src/services/admin.service.ts
```

La idea es que las páginas no llamen Prisma directamente.

Ejemplo del flujo:

```txt
createPropertyAction
  -> propertyService.createProperty
  -> prisma.property.create
```

### `src/lib`

Aquí pusimos utilidades compartidas.

Archivos importantes:

```txt
src/lib/db.ts
src/lib/auth.ts
src/lib/validations.ts
```

`db.ts` crea el cliente Prisma.

`auth.ts` maneja:

- hash de contraseña
- comparación de contraseña
- generación de JWT
- generación de refresh token

`validations.ts` tiene los schemas de Zod.

### `src/app/api`

Aquí están las API Routes.

Ejemplos:

```txt
src/app/api/auth/login/route.ts
src/app/api/auth/refresh/route.ts
src/app/api/properties/route.ts
src/app/api/leases/route.ts
```

Aunque el dashboard usa principalmente Server Actions, dejamos API Routes para endpoints JSON.

## Server Actions

Sí estamos usando Server Actions.

Están en:

```txt
src/app/actions/db-actions.ts
```

Ejemplo de crear propiedad:

```txt
src/app/dashboard/properties/new/page.tsx
  -> form action={createPropertyAction}
  -> src/app/actions/db-actions.ts
  -> createPropertyAction
```

Dentro de una action normalmente hacemos:

1. Leer `formData`.
2. Armar `rawData`.
3. Validar con Zod.
4. Llamar un service.
5. Revalidar la ruta.
6. Redirigir.

Ejemplo mental:

```txt
Formulario crear propiedad
  -> createPropertyAction
  -> propertySchema.safeParse
  -> propertyService.createProperty
  -> revalidatePath("/dashboard/properties")
  -> redirect("/dashboard/properties")
```

## Prisma

Prisma conecta la aplicación con PostgreSQL.

El schema está en:

```txt
prisma/schema.prisma
```

Modelos importantes:

```txt
User
Property
Lease
RefreshToken
Payment
Notification
```

La conexión a Prisma está en:

```txt
src/lib/db.ts
```

Ahí usamos:

```txt
PrismaClient
PrismaPg
DATABASE_URL
```

## PostgreSQL Local Con Docker

Usamos Docker para levantar PostgreSQL local.

Archivo:

```txt
docker-compose.yml
```

Servicio principal:

```txt
postgres
```

Datos locales:

```txt
usuario: postgres
password: root
base: rentvago_dev
puerto: 5432
```

Comando:

```bash
docker compose up -d postgres
```

Luego Prisma sincroniza las tablas:

```bash
bun --bun x prisma db push
```

## Zod

Zod lo usamos para validar datos antes de guardar en la base.

Archivo:

```txt
src/lib/validations.ts
```

Schemas principales:

```txt
registerSchema
loginSchema
propertySchema
leaseSchema
```

Ejemplo:

```txt
propertySchema
```

valida:

- título
- dirección
- tipo de propiedad
- precio
- propietario
- imagen opcional

Ejemplo:

```txt
leaseSchema
```

valida:

- propiedad
- inquilino
- fecha de inicio
- fecha de fin
- renta mensual
- estado

También valida que:

```txt
endDate > startDate
```

## Hash De Contraseña

Nunca guardamos la contraseña real.

Usamos `bcryptjs`.

Archivo:

```txt
src/lib/auth.ts
```

Al registrar:

```txt
registerAction
  -> authLib.hashPassword
  -> bcrypt.hash
  -> prisma.user.create
```

Al iniciar sesión:

```txt
loginAction
  -> authLib.comparePassword
  -> bcrypt.compare
```

Esto compara:

- contraseña escrita por el usuario
- hash guardado en la base

## JWT

JWT significa JSON Web Token.

Lo usamos para saber quién está autenticado.

Archivo:

```txt
src/lib/auth.ts
```

Generamos access token con:

```txt
generateAccessToken
```

El access token guarda:

```txt
userId
role
email
```

Sirve para:

- saber quién es el usuario
- saber si es ADMIN
- proteger el dashboard

Duración:

```txt
15 minutos
```

## Refresh Token

El access token dura poco.

El refresh token dura más y sirve para generar un nuevo access token.

Generamos refresh token con:

```txt
generateRefreshToken
```

Duración:

```txt
7 días
```

Lo guardamos en dos partes:

1. Cookie `refresh_token`.
2. Tabla `RefreshToken` en PostgreSQL.

Modelo Prisma:

```txt
RefreshToken
```

Esto permite invalidar el token cuando el usuario cierra sesión.

Al hacer logout:

```txt
logoutAction
  -> borra refresh token de DB
  -> borra cookie access_token
  -> borra cookie refresh_token
```

## Cookies

Al iniciar sesión se crean dos cookies:

```txt
access_token
refresh_token
```

Las cookies tienen:

```txt
httpOnly
sameSite: "lax"
secure en producción
path: "/"
maxAge
```

`httpOnly` significa que JavaScript del navegador no puede leerlas directamente.

Eso ayuda a proteger los tokens.

## Protección De Rutas

La protección está en:

```txt
src/proxy.ts
```

El proxy revisa:

- si existe `access_token`
- si el token es válido
- si el usuario es ADMIN
- si necesita usar `refresh_token`

Reglas:

```txt
/dashboard requiere ADMIN
/catalog requiere sesión
/login y /register redirigen si ya hay sesión
```

Si un usuario no admin intenta entrar al dashboard:

```txt
lo manda a /catalog
```

## Propiedades

Rutas principales:

```txt
src/app/dashboard/properties/page.tsx
src/app/dashboard/properties/new/page.tsx
src/app/dashboard/properties/[id]/edit/page.tsx
```

Service:

```txt
src/services/property.service.ts
```

Actions:

```txt
createPropertyAction
updatePropertyAction
deletePropertyAction
```

Flujo crear propiedad:

```txt
new/page.tsx
  -> createPropertyAction
  -> propertySchema
  -> propertyService.createProperty
  -> prisma.property.create
```

## Arriendos

Rutas principales:

```txt
src/app/dashboard/leases/page.tsx
src/app/dashboard/leases/new/page.tsx
src/app/dashboard/leases/[id]/edit/page.tsx
```

Service:

```txt
src/services/lease.service.ts
```

Actions:

```txt
createLeaseAction
updateLeaseAction
deleteLeaseAction
```

Un arriendo conecta:

```txt
Property + User + fechas + renta mensual + estado
```

Campos:

```txt
propertyId
tenantId
startDate
endDate
monthlyRent
status
```

Flujo crear arriendo:

```txt
leases/new/page.tsx
  -> createLeaseAction
  -> leaseSchema
  -> leaseService.createLease
  -> prisma.lease.create
```

## Usuarios

Rutas:

```txt
src/app/dashboard/users/page.tsx
```

Service:

```txt
src/services/admin.service.ts
```

Actions:

```txt
toggleUserStatusAction
changeUserRoleAction
```

Desde el dashboard se puede:

- activar o suspender usuario
- dar o quitar rol ADMIN

## Catálogo

Ruta:

```txt
src/app/catalog/page.tsx
```

El catálogo muestra propiedades reales desde PostgreSQL.

Si una propiedad no tiene imagen:

```txt
Sin imagen
```

Si tiene `imageUrl`, se muestra la imagen.

## Qué Hicimos

Durante el trabajo se hizo:

- Configurar PostgreSQL local con Docker.
- Ajustar `.env` para usar DB local.
- Sincronizar Prisma con `db push`.
- Arreglar acceso al dashboard con JWT y role ADMIN.
- Agregar refresh token en DB.
- Crear CRUD de propiedades.
- Crear CRUD de arriendos.
- Agregar validaciones con Zod.
- Proteger rutas con `src/proxy.ts`.
- Conectar catálogo con propiedades reales.
- Crear README de uso del proyecto.

## Cosas Importantes Para Recordar

### Server Actions

Se usan cuando ves:

```tsx
<form action={algunaAction}>
```

Ejemplos:

```tsx
<form action={createPropertyAction}>
<form action={updateLeaseAction}>
<form action={deleteLeaseAction}>
```

### Services

Se usan para separar Prisma de las páginas.

No queremos tener todo el Prisma metido directamente en el JSX.

### Zod

Valida antes de guardar.

Si algo está mal, no deja pasar datos inválidos.

### JWT

Sirve para autenticar.

### Refresh Token

Sirve para renovar sesión.

### Hash

Sirve para no guardar contraseñas reales.

## Comandos Para Recordar

```bash
docker compose up -d postgres
bun install
bun --bun x prisma generate
bun --bun x prisma db push
bun dev
bun --bun x tsc --noEmit
```

## Flujo Mental Final

Cuando el usuario guarda algo:

```txt
Formulario
  -> Server Action
  -> Zod
  -> Service
  -> Prisma
  -> PostgreSQL
  -> revalidatePath
  -> redirect
```

Cuando el usuario inicia sesión:

```txt
Formulario login
  -> loginAction
  -> loginSchema
  -> buscar usuario
  -> bcrypt.compare
  -> generar access_token
  -> generar refresh_token
  -> guardar refresh token en DB
  -> guardar cookies
  -> redirect dashboard
```

Cuando el usuario entra al dashboard:

```txt
request /dashboard
  -> proxy.ts
  -> lee access_token
  -> verifica JWT
  -> revisa role ADMIN
  -> permite entrar o redirige
```
