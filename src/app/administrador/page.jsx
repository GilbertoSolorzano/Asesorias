"use client";
import HamburgerMenu from "@/components/HamburgerMenu";

const DashboardAdministrador = () => {
    return (

        <div className="flex h-screen relative">
        {/* Sidebar */}
        <aside className="bg-[#212227] w-20 flex flex-col items-center py-4">
            <HamburgerMenu  role="administrador"/>
        </aside>

        {/* Contenido principal */}
        <div className="flex-1 p-8 bg-white rounded-lg shadow-lg m-4">
        <h1 className="text-2xl font-bold text-center mb-8">Bienvenido, Administrador!</h1>

        {/* Tarjetas de Asesorías */}
        <div className="space-y-6">
            {/* Tarjeta Roja */}
            <div className="bg-red-500 text-white p-6 rounded-md shadow-md text-center">
            <p className="font-bold">Tema de asesoría</p>
            <p>Alumno</p>
            <p className="font-light">Estado: En espera</p>
            </div>

            {/* Tarjeta Amarilla */}
            <div className="bg-yellow-400 text-black p-6 rounded-md shadow-md text-center">
            <p className="font-bold">Tema de asesoría</p>
            <p>Alumno</p>
            <p className="font-light">Estado: En espera</p>
            </div>

            {/* Tarjeta Verde */}
            <div className="bg-green-500 text-white p-6 rounded-md shadow-md text-center">
            <p className="font-bold">Tema de asesoría</p>
            <p>Alumno</p>
            <p className="font-light">Estado: En espera</p>
            </div>

            {/* Tarjeta Azul */}
            <div className="bg-blue-400 text-white p-6 rounded-md shadow-md text-center">
            <p className="font-bold">Nombre</p>
            <p>Capacitación</p>
            <p className="font-light">Estado: En espera</p>
            </div>
        </div>
        </div>
    </div>
    );
    };

    export default DashboardAdministrador;
