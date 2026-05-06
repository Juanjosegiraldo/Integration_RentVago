import React from "react";
import Link from "next/link";
import { leaseService } from "@/services/lease.service";
import { deleteLeaseAction } from "@/app/actions/db-actions";

export default async function LeasesPage() {
    const leases = await leaseService.getAllLeases();

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h1>Lista de Arriendos</h1>

                <Link
                    href="/dashboard/leases/new"
                    style={{ background: "#22c55e", color: "black", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold" }}
                >
                    + Nuevo Arriendo
                </Link>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", background: "#111", borderRadius: "10px" }}>
                <thead>
                    <tr style={{ borderBottom: "1px solid #333", textAlign: "left" }}>
                        <th style={{ padding: "15px" }}>Propiedad</th>
                        <th style={{ padding: "15px" }}>Inquilino</th>
                        <th style={{ padding: "15px" }}>Inicio</th>
                        <th style={{ padding: "15px" }}>Fin</th>
                        <th style={{ padding: "15px" }}>Renta mensual</th>
                        <th style={{ padding: "15px" }}>Estado</th>
                        <th style={{ padding: "15px" }}>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {leases.length === 0 ? (
                        <tr>
                            <td colSpan={7} style={{ padding: "30px", textAlign: "center", color: "#9ca3af" }}>
                                No hay arriendos registrados.
                            </td>
                        </tr>
                    ) : leases.map((lease) => (
                        <tr key={lease.id} style={{ borderBottom: "1px solid #222" }}>
                            <td style={{ padding: "15px" }}>
                                <div>
                                    <strong>{lease.property.title}</strong>
                                    <div style={{ color: "#9ca3af", fontSize: "14px" }}>
                                        {lease.property.address}
                                    </div>
                                </div>
                            </td>

                            <td style={{ padding: "15px" }}>
                                {lease.tenant.name || lease.tenant.email}
                            </td>

                            <td style={{ padding: "15px" }}>
                                {lease.startDate.toLocaleDateString("es-CO")}
                            </td>

                            <td style={{ padding: "15px" }}>
                                {lease.endDate.toLocaleDateString("es-CO")}
                            </td>

                            <td style={{ padding: "15px" }}>
                                ${Number(lease.monthlyRent).toLocaleString()}
                            </td>

                            <td style={{ padding: "15px" }}>
                                {lease.status}
                            </td>

                            <td style={{ padding: "15px", display: "flex", gap: "10px" }}>
                                <Link
                                    href={`/dashboard/leases/${lease.id}/edit`}
                                    style={{
                                        background: "#3b82f6",
                                        color: "white",
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        textDecoration: "none",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Editar
                                </Link>

                                <form action={deleteLeaseAction}>
                                    <input type="hidden" name="id" value={lease.id} />

                                    <button
                                        type="submit"
                                        style={{
                                            background: "#ef4444",
                                            color: "white",
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
