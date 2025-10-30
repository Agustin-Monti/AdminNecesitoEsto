// app/sign-in/page.tsx
"use client";

import { signInAction } from "@/actions/auth-actions/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function Login() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const error = searchParams?.get('error');
    const success = searchParams?.get('success');
    
    if (error) {
      setMessage({ type: 'error', text: decodeURIComponent(error) });
    } else if (success) {
      setMessage({ type: 'success', text: decodeURIComponent(success) });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form className="flex flex-col bg-white/80 backdrop-blur-sm p-8 w-full max-w-md rounded-2xl shadow-xl border border-white/20">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Admin Necesito Esto!</h1>
        <p className="text-center text-gray-600 mb-8">Ingresa a tu cuenta de administrador</p>

        {/* Mensajes de error/éxito */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'error' 
              ? 'bg-red-50 border border-red-200 text-red-700' 
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {message.type === 'error' ? (
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-600">
              Email
            </Label>
            <Input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              name="email"
              type="email"
              placeholder="correo@correo.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-600">
              Contraseña
            </Label>
            <PasswordInput
              name="password"
              placeholder="Tu Contraseña"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            />
          </div>

          <SubmitButton
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            pendingText="Verificando acceso..."
            formAction={signInAction}
          >
            Iniciar Sesión
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}