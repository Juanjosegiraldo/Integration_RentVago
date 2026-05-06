"use client"

import { useActionState } from "react";
import { registerAction } from "@/app/actions/db-actions";
import { UserPlus, Mail, Lock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-gray-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <Link 
          href="/" 
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-400 mb-8 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
        
        <div className="bg-black p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.8)] border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 via-green-500 to-gray-800"></div>
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-white mb-2">Únete a RentVago</h1>
            <p className="text-gray-400 font-medium">Crea tu cuenta profesional hoy</p>
          </div>

          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 tracking-wider">Nombre Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                </div>
                <input 
                  name="name" 
                  type="text" 
                  placeholder="Tu nombre"
                  className="block w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-600 text-white font-medium shadow-inner"
                />
              </div>
              {state?.details?.name && <p className="text-red-400 text-xs font-bold mt-2 ml-2">{state.details.name[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 tracking-wider">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                </div>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="ejemplo@correo.com"
                  className="block w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-600 text-white font-medium shadow-inner"
                />
              </div>
              {state?.details?.email && <p className="text-red-400 text-xs font-bold mt-2 ml-2">{state.details.email[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1 tracking-wider">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-green-400 transition-colors" />
                </div>
                <input 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-600 text-white font-medium shadow-inner"
                />
              </div>
              {state?.details?.password && <p className="text-red-400 text-xs font-bold mt-2 ml-2">{state.details.password[0]}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 bg-green-500 text-black text-sm font-extrabold rounded-2xl hover:bg-green-400 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] mt-8"
            >
              {isPending ? (
                "Creando cuenta..."
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Registrarse ahora
                </>
              )}
            </button>

            {state?.error && (
              <div className="p-4 bg-red-500/10 text-red-400 text-sm font-bold rounded-xl border border-red-500/20 text-center mt-6">
                {state.error}
              </div>
            )}

            {state?.success && (
              <div className="p-4 bg-green-500/10 text-green-400 text-sm font-bold rounded-xl border border-green-500/20 text-center mt-6">
                ¡Registro exitoso! Redirigiendo...
              </div>
            )}

            <p className="text-center text-sm text-gray-500 mt-8 font-medium">
              ¿Ya tienes cuenta? {" "}
              <Link href="/login" className="font-bold text-green-400 hover:text-green-300 hover:underline underline-offset-4 transition-colors">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
