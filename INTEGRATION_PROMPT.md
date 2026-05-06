# Prompt Maestro — Integración RentVago

> **Para el agente (Claude Sonnet en Claude Code):** Lee este documento COMPLETO antes de ejecutar cualquier acción. No escribas código hasta completar la Fase 0 (Inventario). Trabajamos por fases con gates de confirmación humana.

---

## 1. Contexto del proyecto

**Nombre:** RentVago
**Stack confirmado:**
- Next.js 16 (App Router) + TypeScript
- **Bun** como runtime y package manager (prioridad). Algunos integrantes pueden haber usado `npm` puntualmente — si encuentras `package-lock.json`, lo eliminas y consolidas todo con `bun.lockb`.
- **Prisma ORM** sobre **Supabase (PostgreSQL)** como base de datos.
- **Tailwind CSS** + **Recharts** (para métricas).
- **Apify** para el scraping de Facebook.

**Tipo de proyecto:** Plataforma de alquiler de casas con panel admin, scraping de propiedades desde Facebook (vía Apify), y métricas.

Somos un equipo de 4 desarrolladores. Arrancamos juntos un proyecto Next.js inicial en `rentvago/` antes de dividirnos. Cada uno se llevó una copia a su carpeta personal y desarrolló su módulo en paralelo. **Los 4 ya terminaron sus módulos.** Tu trabajo es **mergear lo que cada uno construyó en su carpeta hacia `rentvago/`**, produciendo una única aplicación coherente, sin conflictos.

### Estructura de carpetas (CRÍTICO)

```
<carpeta-padre>/             ← Tu directorio de trabajo. Aquí están las 5 carpetas.
├── kevin/                   ← FORK personal de Kevin (Superadmin + métricas + frontend)
├── juanjose/                ← FORK personal de Juanjose (CRUD casas)
├── juanpablo/               ← FORK personal de Juanpablo (Auth + Prisma + búsquedas/filtros)
├── jorge/                   ← FORK personal de Jorge (Scraper con Apify)
└── rentvago/                ← Proyecto inicial pre-división + DESTINO del merge final
```

**Concepto clave:** las 4 carpetas personales son **forks divergentes** del proyecto inicial. Cada integrante:
- Copió el proyecto que estaba en `rentvago/` antes de dividirnos.
- Le agregó su módulo.
- Probablemente también modificó archivos base compartidos (schema, layout, configs, package.json, middleware, etc.) según necesitó.

Tu trabajo es identificar qué de cada fork es **código nuevo del módulo** vs qué es **modificación de archivos base** (y necesita reconciliación), y consolidar todo dentro de `rentvago/` sin perder trabajo de nadie.

**Reglas sobre estas carpetas:**
- Las 4 carpetas personales son **SOLO LECTURA**. No escribes, no modificas, no borras nada en ellas.
- **Todo el código integrado se escribe dentro de `rentvago/`.**
- El contenido actual de `rentvago/` (proyecto inicial pre-división) puede aprovecharse o ser sobrescrito según convenga — es la única carpeta editable.

### Roles por integrante

| Dev | Carpeta-fuente | Módulo | Qué tomar |
|---|---|---|---|
| **Juanpablo** | `juanpablo/` | Auth + ORM Prisma + búsquedas/filtros indexados | **Arquitectura base, schema Prisma, middleware, estructura de carpetas, convenciones de naming, capas (services/repos/lib).** Fuente de verdad estructural. |
| **Kevin** | `kevin/` | Superadmin + métricas (Recharts) + frontend general | **Sistema de diseño completo: paleta, componentes UI, tipografía, espaciado, layouts.** Fuente de verdad visual. |
| **Juanjose** | `juanjose/` | CRUD de casas | Lógica de creación / edición / borrado de propiedades. |
| **Jorge** | `jorge/` | Scraper de Facebook con Apify | Lógica de scraping con Apify. **Sin cron** — disparo manual desde panel admin o endpoint POST autenticado. |

---

## 2. Reglas inmutables (no negociables)

1. **Arquitectura = la de Juanpablo.** Estructura de carpetas, naming, capas y patrones de Prisma se siguen al pie de la letra dentro de `rentvago/`.
2. **Diseño = el de Kevin.** Si Juanpablo o Juanjose tienen UIs feas o inconsistentes, se restylizan con el sistema de Kevin. **Si algún módulo no tiene frontend completo, lo construyes tú usando los componentes, colores y estilos de Kevin.** No mezclar dos sistemas visuales.
3. **No agregar funcionalidad nueva** que ningún integrante haya hecho. Si falta una vista, la construyes con piezas existentes (modelos, services, componentes UI de Kevin). No inventes features.
4. **Bun es el package manager.** Comandos: `bun install`, `bun run dev`, `bun run build`, `bun run lint`. Si encuentras `package-lock.json` o `yarn.lock`, los eliminas. Solo queda `bun.lockb`.
5. **Supabase es la DB.** Configura `DATABASE_URL` y `DIRECT_URL` en `.env.example` con placeholders claros. **No metas credenciales reales** — el equipo las pone después.
6. **No instalar dependencias nuevas sin justificarlo en `INTEGRATION_LOG.md`.** Las únicas deps esperadas son las que ya estén en alguno de los 4 forks. Cualquier dep extra requiere aprobación humana.
7. **Apify es el scraper.** Mantén la lógica de Jorge tal cual (cliente de Apify, actor, parsing de resultados). No reemplaces por Puppeteer/Playwright/etc.
8. **Una sola fuente para cada cosa dentro de `rentvago/`:** un solo `schema.prisma`, un solo `package.json`, un solo `.env.example`, un solo `middleware.ts`, un solo sistema de auth, un solo cliente de Prisma, un solo cliente de Supabase.
9. **TypeScript estricto.** Nada de `any` salvo que ya estuviera en el código original; si lo dejas, márcalo como deuda técnica en el log.
10. **El scraper NO usa cron.** Se dispara desde:
    - Botón "Ejecutar scraper" en el panel del Superadmin (Kevin), y/o
    - Endpoint `POST /api/scraper/run` protegido por middleware admin.
11. **Imágenes de propiedades = solo URLs públicas.** Como el contenido viene de scraping, **no descargues archivos ni los subas a storage**. La DB guarda la URL pública del hosting original (Facebook CDN o donde estén). El frontend renderiza directo desde esa URL con `next/image` configurado para dominios externos.
12. **No crear seed de datos.** El equipo crea sus SUPERADMINs manualmente en producción/dev. NO generes scripts de seed con usuarios de ejemplo.
13. **Las carpetas-fuente son inmutables.** No tocas `kevin/`, `juanjose/`, `juanpablo/`, `jorge/` por ningún motivo. Solo lees.
14. **No reescribas lógica que ya funciona.** Si el código de un integrante hace lo que tiene que hacer, lo portas tal cual; solo lo refactorizas si rompe la arquitectura de Juanpablo o el diseño de Kevin.
15. **Nunca borres código de un integrante sin documentarlo** en `INTEGRATION_LOG.md` con la razón.

---

## 3. Resolución de conflictos

Cuando dos integrantes hayan implementado lo mismo (ej: ambos modificaron `schema.prisma`, ambos tienen un `<Button>`, ambos definen el modelo `User`), aplica este orden:

1. **Conflicto de estructura/arquitectura/patrón** → gana **Juanpablo**.
2. **Conflicto de UI/visual/estilos** → gana **Kevin**.
3. **Conflicto de lógica de dominio del módulo** → gana el **dueño del módulo** (ej: lógica de casas la define Juanjose).
4. **Conflicto que no encaja en los 3 anteriores** → **decides tú con criterio técnico, pero JUSTIFICAS la decisión en `INTEGRATION_LOG.md`** explicando alternativas consideradas. Si la decisión es irreversible o de alto impacto, pregunta antes de ejecutar.

**Caso especial — schema.prisma:** los 4 probablemente lo modificaron. Estrategia:
- Empieza con el `schema.prisma` de Juanpablo como base (tiene los índices y la auth).
- Suma los modelos del CRUD de casas de Juanjose.
- Suma los modelos que necesite Jorge para persistir scraping (URLs de imágenes, fuente, fecha, etc.).
- Suma cualquier modelo extra que Kevin necesite para métricas (probablemente ninguno — las métricas suelen ser queries sobre los datos existentes).
- Asegura un `User` con roles `USER` y `SUPERADMIN`.
- En `Property` (o como se llame el modelo de casas), las imágenes son `images String[]` con URLs públicas.

---

## 4. Fases de trabajo

Trabajas en fases secuenciales. **No avances a la siguiente fase sin terminar la actual y actualizar `INTEGRATION_LOG.md`.** Al final de cada fase, esperas confirmación humana antes de continuar.

### FASE 0 — Inventario y diagnóstico (NO escribir código)

Objetivo: entender qué hay en cada fork y qué tan divergentes son.

Acciones:
- Recorrer las 4 carpetas-fuente y `rentvago/`.
- **Inspeccionar `rentvago/`** (proyecto inicial pre-división): qué archivos tiene, qué configs, qué schema mínimo si lo hay. Esto define el "ancestro común".
- **Comparar cada fork contra `rentvago/`** para identificar:
  - Archivos nuevos (módulo del integrante).
  - Archivos modificados respecto a la base (necesitan reconciliación).
  - Archivos sin cambios (se ignoran porque ya están en `rentvago/`).
- Leer `package.json`, `schema.prisma`, `middleware.ts`, `next.config.*`, `tsconfig.json`, `.env.example` de cada uno.
- Mapear endpoints API y rutas/páginas existentes por integrante.

Entregables (todo en `rentvago/INTEGRATION_LOG.md` bajo "Fase 0 — Inventario"):
- **Estado de `rentvago/`:** qué hay en el proyecto base.
- **Tabla de divergencia por fork:** archivos nuevos vs archivos modificados vs sin cambios (resumido por carpeta de alto nivel, no archivo por archivo si son cientos).
- Versión de Next.js y router usado por cada uno (App Router vs Pages Router). **Si alguien usó Pages Router, bandera roja inmediata.**
- Lista de dependencias por integrante con conflictos de versión marcados. Identificar si alguno usó npm en vez de bun.
- **Stack de auth de Juanpablo identificado:** ¿usa Supabase Auth directamente? ¿NextAuth con adaptador de Supabase? ¿JWT propio sobre tablas de Supabase? ¿Lucia? Documenta a fondo: librería, tablas, cookies/tokens, cómo protege rutas.
- **Configuración de Apify de Jorge:** qué actor usa, qué inputs, cómo procesa el output, qué guarda en DB.
- Schemas de Prisma de cada uno: modelos, campos, relaciones, índices. Marca duplicados y conflictos.
- Endpoints API existentes por integrante.
- Variables de entorno requeridas por cada módulo (Supabase URL/anon key/service key, Apify token, JWT secret si aplica, etc.).
- **Cobertura de frontend:** qué módulos tienen UI completa vs cuáles necesitan que tú construyas vistas usando el design system de Kevin.
- **Lista de conflictos detectados** clasificados como: bloqueante / medio / cosmético.
- **Plan de integración propuesto** con orden de fases y estimación de complejidad.

**STOP al final de Fase 0.** Presenta el reporte y espera OK explícito antes de seguir.

### FASE 1 — Esqueleto unificado dentro de `rentvago/`

- Tomar `rentvago/` como punto de partida (es el ancestro común del que partieron todos).
- **Sobrescribir/completar la estructura de carpetas con la de Juanpablo** (será más completa que la inicial, ya que él definió arquitectura).
- Consolidar `package.json` único con todas las deps necesarias en una sola versión por paquete. Eliminar `package-lock.json` y `yarn.lock` si existen. Correr `bun install`.
- Consolidar dentro de `rentvago/`: `tsconfig.json`, `next.config.ts` (con `images.remotePatterns` configurado para dominios externos del scraping), `tailwind.config.ts`, `postcss.config.*`, `.gitignore`.
- Crear `.env.example` con placeholders claros:
  ```
  # Supabase
  DATABASE_URL="postgresql://..."
  DIRECT_URL="postgresql://..."
  NEXT_PUBLIC_SUPABASE_URL=""
  NEXT_PUBLIC_SUPABASE_ANON_KEY=""
  SUPABASE_SERVICE_ROLE_KEY=""

  # Auth (ajustar según lo que use Juanpablo)
  # ...

  # Apify
  APIFY_TOKEN=""
  APIFY_ACTOR_ID=""
  ```
  Adapta los nombres de las variables a las que realmente use cada módulo.
- Crear `rentvago/CLAUDE.md` con reglas permanentes (ver sección 5).
- Verificar que dentro de `rentvago/` corren `bun install` y `bun run build` sin errores con el esqueleto.

### FASE 2 — Capa de datos (Prisma + Supabase)

- Unificar `schema.prisma` en `rentvago/prisma/schema.prisma` siguiendo la estrategia de la sección 3 (caso especial schema.prisma).
- **Mantener todos los índices de Juanpablo** intactos.
- Asegurar que el modelo de propiedades tenga `images String[]` para URLs públicas.
- Asegurar que el modelo `User` soporte roles (`USER`, `SUPERADMIN`).
- Generar cliente Prisma (`bunx prisma generate`).
- **NO correr migraciones contra una DB real** — el equipo configura sus credenciales después. Solo deja el schema listo y los comandos documentados en el README.
- **NO crear seed** (el equipo lo hace manual).

### FASE 3 — Auth y middleware (Juanpablo)

- Portar el sistema de auth de Juanpablo desde `juanpablo/` a `rentvago/`: login, register, hash de passwords (si aplica), sesión, middleware de protección.
- Configurar el cliente de Supabase (server + client) según el patrón que use Juanpablo.
- Asegurar que el middleware proteja: `/admin/*`, `/api/admin/*`, `/api/scraper/*`.
- Verificar que el rol `SUPERADMIN` da acceso al panel.
- **Si las vistas de login/register están feas o no existen completamente**, construirlas/restilizarlas con el design system de Kevin.

### FASE 4 — CRUD de casas (Juanjose) + búsquedas/filtros (Juanpablo)

- Portar el CRUD de Juanjose usando la capa de servicios/repos de Juanpablo.
- Integrar búsquedas y filtros indexados de Juanpablo sobre el modelo de propiedades.
- En el formulario de creación/edición, las imágenes son inputs de URLs (texto), no archivos. Documenta esto claramente.
- En las vistas de listado/detalle, renderizar imágenes con `next/image` apuntando a las URLs externas.
- **UI restilizada con el sistema de Kevin** si la de Juanjose no calza visualmente.

### FASE 5 — Scraper de Facebook con Apify (Jorge)

- Portar la lógica de scraping de Jorge a `rentvago/` como un service (`src/services/scraper/` o donde Juanpablo lo defina).
- Cliente de Apify configurado con `APIFY_TOKEN` desde env.
- Exponerlo SOLO como:
  - `POST /api/scraper/run` protegido por middleware admin.
  - Botón "Ejecutar scraper" en el panel admin (con loading state, resultado, errores visibles).
- Persistir resultados usando los modelos de propiedades de Juanjose. Las imágenes que devuelve Apify (URLs de Facebook CDN) se guardan tal cual como strings en `images[]`.
- Manejo de errores con logs visibles en el panel admin.

### FASE 6 — Panel Superadmin + métricas (Kevin)

- Portar el dashboard de Kevin conectado a datos reales de la DB (no mocks).
- Recharts conectado a queries reales vía la capa de Juanpablo.
- Sección del scraper integrada (botón + log de ejecuciones).
- **Cualquier vista faltante en cualquier módulo se construye aquí con el design system de Kevin** (mismos colores, componentes, tipografía).

### FASE 7 — QA y cierre

- Dentro de `rentvago/`:
  - `bun run build` y `bun run lint` sin errores ni warnings de TypeScript.
- Verificar flujo end-to-end manual (asumiendo que el equipo configuró Supabase y un SUPERADMIN manual):
  1. Registro de usuario nuevo.
  2. Login.
  3. Crear una casa.
  4. Buscar/filtrar casas.
  5. Login como SUPERADMIN.
  6. Ejecutar scraper desde el panel.
  7. Ver casas scrapeadas en el listado.
  8. Ver métricas en el dashboard con datos reales.
- Documentar en `rentvago/README.md`:
  - Cómo correr el proyecto con bun.
  - Cómo configurar Supabase (link a docs, qué variables van).
  - Cómo configurar Apify.
  - Cómo crear un SUPERADMIN manualmente (query SQL o script puntual).
  - Comandos del proyecto.
- `INTEGRATION_LOG.md` final con todas las decisiones y deuda técnica.

---

## 5. Archivos vivos que debes mantener (todos dentro de `rentvago/`)

### `rentvago/CLAUDE.md` — creado en Fase 1
Reglas permanentes del proyecto. Claude Code lo lee automáticamente. Incluye:
- Comandos: `bun run dev`, `bun run build`, `bun run lint`, `bunx prisma migrate dev`, etc.
- Convenciones de naming (las que use Juanpablo).
- Estructura de carpetas oficial.
- Reglas de "no tocar": índices de Prisma de Juanpablo, sistema de diseño de Kevin, carpetas-fuente, sin seed, sin descargar imágenes.
- Stack: Next.js 16 + Bun + Supabase + Apify.

### `rentvago/INTEGRATION_LOG.md` — creado en Fase 0, actualizado siempre
Diario vivo. Estructura:

```
# INTEGRATION LOG

## Fase 0 — Inventario
[fecha, hallazgos, conflictos detectados, divergencia por fork]

## Fase 1 — Esqueleto
[decisiones de configuración, deps consolidadas]

## Decisiones tomadas
[cada conflicto resuelto: qué ganó, por qué, alternativas consideradas]

## Decisiones pendientes (necesitan input humano)
[lista de cosas que necesitas que confirme]

## Deuda técnica detectada
[anys, código duplicado, refactors pendientes]

## Dependencias agregadas
[nombre, versión, justificación]

## Vistas construidas desde cero (con design system de Kevin)
[lista de vistas que tuviste que crear porque no existían]
```

---

## 6. Cómo comunicarte con el humano

- Al final de cada fase: **resumen corto** (máx 10 líneas) de qué hiciste, qué conflictos resolviste, y qué sigue.
- Si encuentras algo ambiguo o de alto impacto: **pregunta antes de asumir.**
- Si una decisión es reversible y de bajo impacto: decide con criterio técnico, regístrala en el log, y sigue.
- Si una decisión es irreversible o de alto impacto: **pregunta siempre.**
- Sé directo. Sin jerga innecesaria.

---

## 7. Definition of Done

El proyecto está terminado cuando, dentro de `rentvago/`:

- [ ] `bun install` corre sin warnings críticos.
- [ ] `bun run build` pasa sin errores ni warnings de TypeScript.
- [ ] `bun run lint` pasa sin errores.
- [ ] No quedan `package-lock.json` ni `yarn.lock`, solo `bun.lockb`.
- [ ] `bun run dev` arranca y todas las rutas principales cargan sin error 500 (asumiendo Supabase configurado).
- [ ] Flujo end-to-end manual funciona completo (ver Fase 7).
- [ ] `.env.example` lista todas las variables necesarias con placeholders claros.
- [ ] `README.md` permite levantar el proyecto en menos de 10 minutos siguiendo los pasos.
- [ ] `INTEGRATION_LOG.md` documenta todas las decisiones tomadas.
- [ ] `CLAUDE.md` está actualizado con las convenciones finales.
- [ ] Las imágenes de propiedades se renderizan vía `next/image` desde URLs externas (sin descarga local).
- [ ] El scraper de Apify se dispara solo desde el panel admin o el endpoint protegido (sin cron, sin auto-trigger).
- [ ] No quedan TODOs sin documentar en el log.
- [ ] Las carpetas-fuente (`kevin/`, `juanjose/`, `juanpablo/`, `jorge/`) NO han sido modificadas.

---

## 8. Empieza ahora

Tu primer paso: **recorrer las 4 carpetas-fuente y la carpeta destino `rentvago/`, y entregar la Fase 0 completa.**

Recuerda:
- Las carpetas-fuente son SOLO LECTURA. Todo lo que escribas o modifiques va dentro de `rentvago/`.
- Bun como package manager. Supabase como DB. Apify para scraping. Sin seed. Sin descargar imágenes.
- Las 4 personas terminaron sus módulos — tu trabajo es mergear, no completar trabajo a medias (salvo frontend faltante, que sí construyes con el design de Kevin).

No escribas código todavía. Solo inventario, diagnóstico y plan.

Cuando termines la Fase 0, detente y presenta el reporte. Espera mi confirmación antes de avanzar a la Fase 1.
