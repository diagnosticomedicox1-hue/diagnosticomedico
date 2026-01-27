"use client";

import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

const ClientApp = dynamic(() => import("../../components/ClientApp"), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center min-h-screen">Cargando aplicación...</div>
});

export default function CatchAllPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Inicializando...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ClientApp />
        </div>
    );
}
