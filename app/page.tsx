import { Roboto } from 'next/font/google'
import Link from "next/link";
 
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
})

export default async function Index() {
  return (
    <>
      <main className={`flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${roboto.className} bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900`}>
        <div className="w-full max-w-md space-y-8">
          {/* Card Container */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/30 p-8 transition-all duration-300 hover:shadow-xl">
            
            {/* Logo Section */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-lg"></div>
                <img
                  src="/logoprincipalsf.png"
                  alt="Logo de Necesito Esto!"
                  width={80}
                  height={80}
                  className="relative z-10 drop-shadow-md"
                />
              </div>
              
              <Link href="/" className="group">
                <h1 className="text-4xl font-bold text-white text-center">
                  Necesito{' '}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-cyan-300 transition-all duration-300">
                    Esto!
                  </span>
                </h1>
              </Link>
              
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-transparent rounded-full mt-4"></div>
            </div>

            {/* Welcome Text */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white mb-3">
                Panel Administrativo
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Gestiona y supervisa todas las actividades de tu plataforma desde un entorno seguro y moderno.
              </p>
            </div>

            {/* Login Button */}
            <div className="space-y-4">
              <Link 
                href="/sign-in" 
                className="block w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border border-blue-500/20"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Iniciar Sesión Administrativa</span>
                </span>
              </Link>

              {/* Optional: Link to main site */}
              <div className="text-center">
                <Link 
                  href="https://www.necesito-esto.com/" 
                  className="inline-block text-sm text-slate-400 hover:text-slate-200 transition-colors duration-200 py-2"
                >
                  ← Volver al sitio principal
                </Link>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Acceso restringido al personal autorizado
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
