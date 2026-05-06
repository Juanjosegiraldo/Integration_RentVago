import React from 'react';
import Link from 'next/link';
import { propertyService } from '@/services/property.service';
import { deletePropertyAction } from '@/app/actions/db-actions';

export default async function PropertiesPage() {
    const properties = await propertyService.getAllProperties();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h1>Lista de Propiedades</h1>
                <Link href="/dashboard/properties/new" style={{ background: '#22c55e', color: 'black', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>
                    + Nueva Propiedad
                </Link>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#111', borderRadius: '10px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                        <th style={{ padding: '15px' }}>Título</th>
                        <th style={{ padding: '15px' }}>Dirección</th>
                        <th style={{ padding: '15px' }}>Precio</th>
                        <th style={{ padding: '15px' }}>Tipo</th>
                        <th style={{ padding: '15px' }}>Propietario</th>
                        <th style={{ padding: '15px' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {properties.length === 0 ? (
                        <tr>
                            <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#9ca3af' }}>
                                No hay propiedades registradas.
                            </td>
                        </tr>
                    ) : properties.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
                            <td style={{ padding: '15px' }}>{p.title}</td>
                            <td style={{ padding: '15px' }}>{p.address}</td>
                            <td style={{ padding: '15px' }}>${Number(p.price).toLocaleString()}</td>
                            <td style={{ padding: '15px' }}>{p.type}</td>
                            <td style={{ padding: '15px' }}>
                                {p.owner?.name || p.owner?.email || "Sin propietario"}
                            </td>
                            <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                                <Link
                                    href={`/dashboard/properties/${p.id}/edit`}
                                    style={{
                                        background: '#3b82f6',
                                        color: 'white',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        textDecoration: 'none',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Editar
                                </Link>

                                <form action={deletePropertyAction}>
                                    <input type="hidden" name="id" value={p.id} />

                                    <button
                                        type="submit"
                                        style={{
                                            background: '#ef4444',
                                            color: 'white',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
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
