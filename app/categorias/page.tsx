"use client";

import HeaderAdmin from "@/components/HeaderAdmin";
import Sidebar from "@/components/Sidebar";



export default function CategoryPage() {


return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <HeaderAdmin />
        
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Proximamente...</h1>
        </div>
      </div>
    </div>
  );
}

