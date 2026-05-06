import { createPropertyAction } from "@/app/actions/db-actions";
import { adminService } from "@/services/admin.service";
import Link from "next/link";

export default async function NewPropertyPage() {
    const users = await adminService.getAllUsers();

    return (
        <div style={{ maxWidth: '500px' }}>
            <Link href="/dashboard/properties">← Volver</Link>
            <h1 style={{ marginTop: '20px' }}>Crear Propiedad</h1>

            <form action={createPropertyAction} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input name="title" placeholder="Título (ej: Apto 201)" required style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />
                <input name="address" placeholder="Dirección" required style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />

                <select name="type" style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}>
                    <option value="APARTAMENTO">Apartamento</option>
                    <option value="CASA">Casa</option>
                </select>

                <input name="price" type="number" placeholder="Precio Mensual" required style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />

                <label>Propietario:</label>

                <select
                    name="ownerId"
                    required
                    style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}
                >
                    <option value="">Selecciona un propietario</option>

                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name || "Sin nombre"} - {user.email}
                        </option>
                    ))}
                </select>

                <input
                    name="imageUrl"
                    placeholder="URL de imagen"
                    style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }}
                />


                <textarea name="description" placeholder="Descripción corta" style={{ padding: '10px', background: '#222', border: '1px solid #444', color: 'white' }} />

                <button type="submit" style={{ padding: '15px', background: '#22c55e', color: 'black', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                    Guardar Propiedad
                </button>
            </form>
        </div>
    );
}
