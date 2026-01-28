import React from "react";

export default function CatchAllPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">IADoctor-Next</h1>
                    <p className="text-gray-600 mb-4">Sistema de Pre-diagnóstico Médico</p>
                    <p className="text-sm text-gray-500">La aplicación está cargando...</p>
                </div>
            </div>
        </div>
    );
}

export function generateStaticParams() {
    return [{ slug: [] }];
}