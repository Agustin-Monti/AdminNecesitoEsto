"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Folder,
  Tag,
  CreditCard,
  Home
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Inicio", icon: <Home className="h-5 w-5" /> },
    { href: "/demandas", label: "Demandas", icon: <ClipboardList className="h-5 w-5" /> },
    { href: "/categorias", label: "Categorías", icon: <Folder className="h-5 w-5" /> },
    { href: "/rubros", label: "Rubros", icon: <Tag className="h-5 w-5" /> },
    { href: "/pagos", label: "Pagos", icon: <CreditCard className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white shadow-lg">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Panel Admin</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  pathname === link.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
