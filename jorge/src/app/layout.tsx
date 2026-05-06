import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

// Importamos el cron una sola vez al arrancar la app del servidor.
// El propio archivo previene que se registre dos veces (HMR).
import "@/lib/cron";

export const metadata: Metadata = {
  title: "Arrendamientos CO",
  description: "Plataforma de arrendamientos con scraping automático",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
