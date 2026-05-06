import Link from "next/link";
import { notFound } from "next/navigation";
import { propertyService } from "@/services/property.service";
import { updatePropertyAction } from "@/app/actions/db-actions";
import { adminService } from "@/services/admin.service";

export default async function EditPropertyPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const propertyId = Number(id);

    if (Number.isNaN(propertyId)) {
        notFound();
    }

    const [property, users] = await Promise.all([
        propertyService.getPropertyById(propertyId),
        adminService.getAllUsers(),
    ]);

    if (!property) {
        notFound();
    }

    return (

        <div style={{ maxWidth: '500px' }}>
            <Link href="/dashboard/properties">← Volver</Link>
            <h1 style={{ marginTop: '20px' }}>Editar Propiedad</h1>

            <form action={updatePropertyAction} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input type="hidden" name="id" value={property.id} />

                <input
                    name="title"
                    defaultValue={property.title}
                    placeholder="Título"
                    required
                    style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}
                />

                <input
                    name="address"
                    defaultValue={property.address}
                    placeholder="Dirección"
                    required
                    style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}
                />

                <select
                    name="type"
                    defaultValue={property.type}
                    style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}
                >
                    <option value="APARTAMENTO">Apartamento</option>
                    <option value="CASA">Casa</option>
                </select>

                <input
                    name="price"
                    type="number"
                    defaultValue={Number(property.price)}
                    placeholder="Precio Mensual"
                    required
                    style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}
                />

                <label>Propietario:</label>

                <select
                    name="ownerId"
                    defaultValue={property.ownerId}
                    required
                    style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}
                >
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name || "Sin nombre"} - {user.email}
                        </option>
                    ))}
                </select>

                <input
                    name="imageUrl"
                    defaultValue={property.imageUrl ?? ""}
                    placeholder="URL de imagen"
                    style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}
                />

                <textarea
                    name="description"
                    defaultValue={property.description ?? ""}
                    placeholder="Descripción corta"
                    style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}
                />

                <button
                    type="submit"
                    style={{ padding: '15px', background: '#22c55e', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
                >
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
}
