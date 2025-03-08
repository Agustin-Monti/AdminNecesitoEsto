
import { Roboto } from 'next/font/google'
import Link from "next/link";
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default async function Index() {
  

  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 {roboto.className}">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
              Bienvenido a la Pagina Administrativa
            </h2>
            <div className="flex items-center justify-center text-center w-full mb-20">
              <img
                        src="/logoprincipalsf.png"
                        alt="Logo de Necesito Esto!"
                        width={77}
                        height={77}
                      />
                      <Link href="/">
                        <h3 className="text-3xl font-bold ml-2">
                          Necesito <span className="text-blue-600">Esto!</span>
                        </h3>
                      </Link>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Link href="/sign-in" className="w-full text-center py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-300">
                        Iniciar Sesión
                      </Link>
                    </div>
                  </div>
      
                  
        </div>
      </main>
    </>
  );
}

