import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard - Arrendamientos CO",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-[calc(100vh-72px)] bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-slate-950 to-black">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {children}
            </div>
        </div>
    );
}
