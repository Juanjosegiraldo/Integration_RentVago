import Link from "next/link";
import { createLeaseAction } from "@/app/actions/db-actions";
import { propertyService } from "@/services/property.service";
import { adminService } from "@/services/admin.service";

export default async function NewLeasePage() {
    const properties = await propertyService.getAllProperties();
    const users = await adminService.getAllUsers();

    return (
        <div style={{ maxWidth: "500px" }}>
            <Link href="/dashboard/leases">← Volver</Link>
            <h1 style={{ marginTop: "20px" }}>Crear Arriendo</h1>

            <form action={createLeaseAction} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                <label>Propiedad:</label>
                <select
                    name="propertyId"
                    required
                    style={{ padding: "10px", background: "#222", border: "1px solid #444", color: "white" }}
                >
                    <option value="">Selecciona una propiedad</option>

                    {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                            {property.title} - {property.address}
                        </option>
                    ))}
                </select>

                <label>Inquilino:</label>
                <select
                    name="tenantId"
                    required
                    style={{ padding: "10px", background: "#222", border: "1px solid #444", color: "white" }}
                >
                    <option value="">Selecciona un inquilino</option>

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
                    required
                    style={{ padding: "10px", background: "#222", border: "1px solid #444", color: "white" }}
                />

                <label>Fecha de fin:</label>
                <input
                    name="endDate"
                    type="date"
                    required
                    style={{ padding: "10px", background: "#222", border: "1px solid #444", color: "white" }}
                />

                <input
                    name="monthlyRent"
                    type="number"
                    placeholder="Renta mensual"
                    required
                    style={{ padding: "10px", background: "#222", border: "1px solid #444", color: "white" }}
                />

                <select
                    name="status"
                    defaultValue="PENDIENTE"
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
                    Guardar Arriendo
                </button>
            </form>
        </div>
    );
}
