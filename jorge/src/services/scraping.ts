import axios from "axios";
import prisma from "@/lib/db";
import { ArrendamientoNormalizado } from "@/types/scraping";


function esperar(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// TIPOS
// ---------------------------------------------------------------------------

// Campos posibles que devuelve el actor de Apify para Facebook Marketplace.
// Los campos anidados llegan como claves planas con punto en el nombre.
interface ApifyFBItem {
    marketplace_listing_title?: string;
    listingUrl?: string;
    facebookUrl?: string;
    description?: string;
    id?: string | number;
    "primary_listing_photo.photo_image_url"?: string;
    "listing_price.formatted_amount"?: string;   // "COP650,000"
    "listing_price.amount"?: string;             // "650000"
}

// Tipo genérico para fuentes que devuelven arrays planos (modo C).
interface ItemCrudo {
    title?: string;
    titulo?: string;
    name?: string;
    price?: number | string;
    precio?: number | string;
    location?: string;
    ubicacion?: string;
    city?: string;
    description?: string;
    descripcion?: string;
    url?: string;
    link?: string;
    permalink?: string;
    id?: number | string;
    address?: { city_name?: string; state_name?: string };
    attributes?: Array<{ id: string; value_name?: string | null }>;
    thumbnail?: string;
    image?: string;
    imagen?: string;
    photo?: string;
    pictures?: Array<{ url?: string; secure_url?: string }>;
}

// 
// NORMALIZADOR GENÉRICO
// 
function normalizarGenerico(item: ItemCrudo, urlFuente: string): ArrendamientoNormalizado | null {
    const titulo = item.titulo || item.title || item.name || "";

    const precioRaw = item.precio ?? item.price ?? 0;
    const precio =
        typeof precioRaw === "string"
            ? parseFloat(precioRaw.replace(/[^\d.]/g, ""))
            : Number(precioRaw);

    const urlItem =
        item.url || item.link || item.permalink || `${urlFuente}#${item.id ?? titulo}`;

    const ciudad = item.address?.city_name || item.address?.state_name;
    const ubicacion = item.ubicacion || item.location || item.city || ciudad;

    const atributos = item.attributes
        ?.filter((a) => a.value_name)
        .map((a) => a.value_name)
        .join(" · ");
    const descripcion = item.descripcion || item.description || atributos;

    const imagen =
        item.imagen || item.image || item.photo || item.thumbnail ||
        item.pictures?.[0]?.secure_url || item.pictures?.[0]?.url || undefined;

    return {
        titulo: titulo.trim(),
        precio: isNaN(precio) ? 0 : precio,
        ubicacion,
        descripcion,
        imagen,
        urlFuente: urlItem,
    };
}

// 
// VALIDACIÓN
// 

function esValido(item: ArrendamientoNormalizado): boolean {
    if (!item.titulo || item.titulo.length === 0) return false;
    if (!item.precio || item.precio <= 0) return false;
    if (!item.urlFuente) return false;
    return true;
}

// 
// MODO A: APIFY — FACEBOOK MARKETPLACE
// 

async function ejecutarScrapingApify(
    fbUrl: string
): Promise<{ guardados: number; descartados: number }> {
    let guardados = 0;
    let descartados = 0;

    const token = process.env.APIFY_TOKEN;
    if (!token) throw new Error("APIFY_TOKEN no está definido en el .env");

    console.log("[Apify] Token cargado:", token.slice(0, 20) + "...");

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    console.log(`[Apify] Lanzando actor para: ${fbUrl}`);

    let runRes;
    try {
        runRes = await axios.post(
            "https://api.apify.com/v2/acts/apify~facebook-marketplace-scraper/runs",
            {
                startUrls:          [{ url: fbUrl }],
                urls:               [fbUrl],
                maxItems:           10,
                maxPagesPerUrl:     10,
                getListingDetails:  false,
                getAllListingPhotos: true,
                strictFiltering:    false,
                proxy:              { useApifyProxy: true },
            },
            {
                headers,
                timeout: 30000,
                params: { maxTotalChargeUsd: 1.0 },
            }
        );
    } catch (err: unknown) {
        const e = err as { response?: { status?: number; data?: unknown } };
        console.log("[Apify] Error al lanzar el actor:");
        console.log("  HTTP status:", e.response?.status);
        console.log("  Respuesta:", JSON.stringify(e.response?.data));
        throw err;
    }

    const runId: string = runRes.data?.data?.id;
    const datasetId: string = runRes.data?.data?.defaultDatasetId;

    if (!runId || !datasetId) {
        throw new Error("[Apify] La respuesta de /runs no trajo id o defaultDatasetId");
    }
    console.log("[Apify] Run iniciado. ID:", runId);

    // Polling — máximo 15 intentos × 8s = 2 minutos
    const MAX_INTENTOS = 15;
    for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
        await esperar(8000);

        const statusRes = await axios.get(
            `https://api.apify.com/v2/actor-runs/${runId}`,
            { headers, timeout: 10000 }
        );

        const estado: string = statusRes.data?.data?.status;
        console.log(`[Apify] Estado: ${estado} (intento ${intento}/${MAX_INTENTOS})`);

        if (estado === "SUCCEEDED") break;
        if (estado === "FAILED" || estado === "ABORTED" || estado === "TIMED-OUT") {
            throw new Error(`El actor de Apify finalizó con estado: ${estado}`);
        }
        if (intento === MAX_INTENTOS) {
            throw new Error("Timeout: el actor tardó más de 2 minutos");
        }
    }

    const dataRes = await axios.get(
        `https://api.apify.com/v2/datasets/${datasetId}/items?format=json&clean=true&limit=10`,
        { headers, timeout: 30000 }
    );

    const items: ApifyFBItem[] = Array.isArray(dataRes.data) ? dataRes.data : [];
    console.log("[Apify] Items recibidos:", items.length);

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if ((item as Record<string, unknown>).error) {
            console.log("[Apify] Item de error recibido:", (item as Record<string, unknown>).errorDescription);
            continue;
        }

        const titulo = (item.marketplace_listing_title || "").trim();
        const precioStr =
            item["listing_price.amount"] ||
            item["listing_price.formatted_amount"] ||
            "0";
        const precio = parseFloat(precioStr.replace(/[^\d.]/g, ""));
        const urlFuente = item.listingUrl || `fb-marketplace-${item.id ?? i}`;
        const imagen = item["primary_listing_photo.photo_image_url"] || undefined;

        const normalizado: ArrendamientoNormalizado = {
            titulo,
            precio: isNaN(precio) ? 0 : precio,
            ubicacion: undefined,
            descripcion: item.description || undefined,
            imagen,
            urlFuente,
        };

        if (!esValido(normalizado)) { descartados++; continue; }

        await prisma.arrendamiento.upsert({
            where: { urlFuente: normalizado.urlFuente },
            update: { titulo: normalizado.titulo, precio: normalizado.precio, ubicacion: normalizado.ubicacion, descripcion: normalizado.descripcion, imagen: normalizado.imagen },
            create: normalizado,
        });
        guardados++;
    }

    console.log(`[Apify] Guardados: ${guardados} | Descartados: ${descartados}`);
    return { guardados, descartados };
}

// 
// FUNCIÓN PRINCIPAL
// 

export async function ejecutarScraping(url: string): Promise<{ guardados: number; descartados: number }> {
    let guardados = 0;
    let descartados = 0;
    const items: ArrendamientoNormalizado[] = [];

    // ── MODO A: FACEBOOK MARKETPLACE (Apify) ──────────────────────────────
    if (url.includes("facebook.com/marketplace")) {
        return ejecutarScrapingApify(url);
    }

    // ── MODO B: GENÉRICO (GET + array JSON) ───────────────────────────────
    const respuesta = await axios.get(url, { timeout: 10000 });

    const datos: ItemCrudo[] = Array.isArray(respuesta.data)
        ? respuesta.data
        : (respuesta.data?.data || respuesta.data?.results || respuesta.data?.items || []);

    for (const item of datos) {
        const normalizado = normalizarGenerico(item, url);
        if (!normalizado || !esValido(normalizado)) { descartados++; continue; }
        items.push(normalizado);
    }

    // ── GUARDAR EN BD ─────────────────────────────────────────────────────
    for (const normalizado of items) {
        await prisma.arrendamiento.upsert({
            where: { urlFuente: normalizado.urlFuente },
            update: { titulo: normalizado.titulo, precio: normalizado.precio, ubicacion: normalizado.ubicacion, descripcion: normalizado.descripcion, imagen: normalizado.imagen },
            create: normalizado,
        });
        guardados++;
    }

    return { guardados, descartados };
}

// 

export async function ejecutarScrapingDeTodasLasFuentes() {
    const fuentes = await prisma.scrapingFuente.findMany({ where: { activo: true } });
    const resultados: Array<{ fuente: string; guardados: number; descartados: number; error?: string }> = [];

    for (const fuente of fuentes) {
        try {
            const { guardados, descartados } = await ejecutarScraping(fuente.url);
            resultados.push({ fuente: fuente.nombre, guardados, descartados });
        } catch (error: unknown) {
            const mensaje = error instanceof Error ? error.message : "Error desconocido";
            resultados.push({ fuente: fuente.nombre, guardados: 0, descartados: 0, error: mensaje });
        }
    }

    return resultados;
}
