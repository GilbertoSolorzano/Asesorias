"use client";
import HamburgerMenu from "@/components/HamburgerMenu";

const historial = () => {
    return (

        <div className="flex h-screen relative">
        {/* Sidebar */}
        <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
            <HamburgerMenu  role="administrador"/>
        </aside>

        {/* Contenido principal */}
        <div className="flex-1 p-8 bg-white rounded-lg shadow-lg m-4">
        <h1 className="text-2xl font-bold text-center mb-8">Asesorias finalizadas</h1>

        {/* Tarjetas de Asesorías */}
        <div className="space-y-6">
             {/* Tarjeta Azul */}
             <div className="bg-blue-400 text-white p-6 rounded-md shadow-md text-center">
            <p className="font-bold">Nombre</p>
            <p>Capacitación</p>
            <p className="font-light">Estado: completado</p>
            </div>
             {/* Tarjeta Azul */}
             <div className="bg-blue-400 text-white p-6 rounded-md shadow-md text-center">
            <p className="font-bold">Nombre</p>
            <p>Capacitación</p>
            <p className="font-light">Estado: completado</p>
            </div>

            {/* Tarjeta Azul */}
            <div className="bg-blue-400 text-white p-6 rounded-md shadow-md text-center">
            <p className="font-bold">Nombre</p>
            <p>Capacitación</p>
            <p className="font-light">Estado: completado</p>
            </div>
        </div>
        </div>
    </div>
    );
    };

    export default historial;
