import cron from "node-cron";
import { ejecutarScrapingDeTodasLasFuentes } from "@/services/scraping";

/**
 * CRON JOB de scraping automático
 * --------------------------------
 * node-cron permite programar tareas con una sintaxis tipo Linux:
 *   "minuto hora día mes díaSemana"
 *
 * Ejemplo "0 *\/6 * * *" = cada 6 horas en el minuto 0
 * Para pruebas, podés cambiarlo a "*\/2 * * * *" = cada 2 minutos.
 *
 * Solo procesa fuentes con activo = true (eso lo hace el servicio).
 * Imprime en consola cuántos arrendamientos se guardaron por fuente,
 * o el error si algo falló.
 */

// Variable global para evitar registrar el cron varias veces (Next.js recarga módulos)
declare global {
    // eslint-disable-next-line no-var
    var __scrapingCronIniciado: boolean | undefined;
}

if (!global.__scrapingCronIniciado) {
    global.__scrapingCronIniciado = true;

    cron.schedule("0 */6 * * *", async () => {
        console.log("[Scraping] Iniciando scraping automático...");
        try {
            const resultados = await ejecutarScrapingDeTodasLasFuentes();
            for (const r of resultados) {
                if (r.error) {
                    console.log(`[Scraping] ❌ ${r.fuente}: ${r.error}`);
                } else {
                    console.log(`[Scraping] ✅ ${r.fuente}: ${r.guardados} guardados, ${r.descartados} descartados`);
                }
            }
        } catch (error) {
            console.log("[Scraping] Error general:", error);
        }
    });

    console.log("[Scraping] Cron job registrado: cada 6 horas");
}

export {};
