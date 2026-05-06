import React from 'react';
import { adminService } from '@/services/admin.service';
import { toggleUserStatusAction, changeUserRoleAction } from '@/app/actions/db-actions';

export default async function UsersAdminPage() {
  const users = await adminService.getAllUsers();
  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Directorio de Usuarios</h1>
        <p className="text-gray-400 font-medium">Control total sobre roles y accesos a la plataforma.</p>
      </header>

      <div className="bg-black rounded-2xl border border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.6)] overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-800">
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Rol</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-900/50 transition-colors group">
                  <td className="px-8 py-6 font-semibold text-white">
                    {user.name || <span className="text-gray-600 italic font-normal">Sin nombre</span>}
                  </td>
                  <td className="px-8 py-6 text-gray-400 font-medium">{user.email}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider border ${
                      user.role === 'ADMIN' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                        : 'bg-gray-800 text-gray-300 border-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-600'}`}></div>
                      <span className={`text-sm font-bold ${user.isActive ? 'text-gray-200' : 'text-gray-500'}`}>
                        {user.isActive ? 'ACTIVO' : 'SUSPENDIDO'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Botón para Cambiar Rol */}
                      <form action={changeUserRoleAction.bind(null, user.id!, user.role)}>
                        <button className="text-xs font-bold uppercase tracking-wider bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md transition-all border border-gray-700">
                          Dar/Quitar Admin
                        </button>
                      </form>
                      {/* Botón para Activar/Desactivar */}
                      <form action={toggleUserStatusAction.bind(null, user.id!, user.isActive)}>
                        <button className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-md transition-all border ${
                          user.isActive 
                            ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500 hover:text-white hover:border-red-500' 
                            : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500 hover:text-white hover:border-green-500'
                        }`}>
                          {user.isActive ? 'Suspender' : 'Activar'}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
