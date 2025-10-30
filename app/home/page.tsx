// app/home/page.tsx
"use client";

import HeaderAdmin from "@/components/HeaderAdmin";
import Sidebar from "@/components/Sidebar";
import Inicio from "@/components/Inicio";

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <HeaderAdmin />
        
        <div className="p-6">
          <Inicio />
        </div>
      </div>
    </div>
  );
}