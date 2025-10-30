"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Folder,
  Tag,
  CreditCard,
  Home,
  Users,
  Layers
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/home", label: "Inicio", icon: <Home className="h-5 w-5" /> },
    { href: "/demandas", label: "Demandas", icon: <ClipboardList className="h-5 w-5" /> },
    { href: "/categorias", label: "Categorías", icon: <Folder className="h-5 w-5" /> },
    { href: "/rubros", label: "Rubros", icon: <Tag className="h-5 w-5" /> },
    { href: "/tipos", label: "Tipos", icon: <Layers className="h-5 w-5" /> },
    { href: "/pagos", label: "Pagos", icon: <CreditCard className="h-5 w-5" /> },
    { href: "/usuarios", label: "Usuarios", icon: <Users className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-semibold text-white">Panel Admin</h1>
        <p className="text-sm text-slate-400 mt-1">Gestión de contenido</p>
      </div>
      
      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent"
                  }`}
                >
                  <span className={`mr-3 transition-colors ${
                    isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}>
                    {link.icon}
                  </span>
                  <span className="font-medium text-sm">{link.label}</span>
                  
                  {/* Indicador activo */}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
