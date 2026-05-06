import Link from "next/link";
import { notFound } from "next/navigation";
import { updateLeaseAction } from "@/app/actions/db-actions";
import { leaseService } from "@/services/lease.service";
import { propertyService } from "@/services/property.service";
import { adminService } from "@/services/admin.service";

function formatDateForInput(date: Date) {
    return date.toISOString().split("T")[0];
}

export default async function EditLeasePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const leaseId = Number(id);

    if (Number.isNaN(leaseId)) {
        notFound();
    }

    const [lease, properties, users] = await Promise.all([
        leaseService.getLeaseById(leaseId),
        propertyService.getAllProperties(),
        adminService.getAllUsers(),
    ]);

    if (!lease) {
        notFound();
    }

    return (
        <div style={{ maxWidth: "500px" }}>
            <Link href="/dashboard/leases">← Volver</Link>
            <h1 style={{ marginTop: "20px" }}>Editar Arriendo</h1>

            <form action={updateLeaseAction} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                <input type="hidden" name="id" value={lease.id} />

                <label>Propiedad:</label>
                <select
                    name="propertyId"
                    defaultValue={lease.propertyId}
                    required
                    style={{ padding: "10px", background: "#222", border: "1px solid #444", color: "white" }}
                >
                    {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                            {property.title} - {property.address}
                        </option>
                    ))}
                </select>

                <label>Inquilino:</label>
                <select
                    name="tenantId"
                    defaultValue={lease.tenantId}
                    required
                    style={{ padding: "10px", background: "#222", border: "1px solid #444", color: "white" }}
                >
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name || "Sin nombre"} - {user.email}
                        </option>
                    ))}
                </select>

                <label>Fecha de inicio:</label>
                <input
                    name="startDate"
                    type="date"
                    defaultValue={formatDateForInput(lease.startDate)}
                    required
                    style={{ padding: "10px", background: "#222", border: "1px solid #444", color: "white" }}
                />

                <label>Fecha de fin:</label>
                <input
                    name="endDate"
                    type="date"
                    defaultValue={formatDateForInput(lease.endDate)}
                    required
                    style={{ padding: "10px", background: "#222", border: "1px solid #444", color: "white" }}
                />

                <input
                    name="monthlyRent"
                    type="number"
                    defaultValue={Number(lease.monthlyRent)}
                    placeholder="Renta mensual"
                    required
                    style={{ padding: "10px", background: "#222", border: "1px solid #444", color: "white" }}
                />

                <select
                    name="status"
                    defaultValue={lease.status}
                    style={{ padding: "10px", background: "#222", border: "1px solid #444", color: "white" }}
                >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="ACTIVO">Activo</option>
                    <option value="EXPIRADO">Expirado</option>
                </select>

                <button
                    type="submit"
                    style={{ padding: "15px", background: "#22c55e", color: "black", fontWeight: "bold", border: "none", cursor: "pointer" }}
                >
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
}
