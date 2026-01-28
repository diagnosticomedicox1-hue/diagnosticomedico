import React from "react";
import type { Metadata } from "next";
import "./globals.css"; // Tailwind (base, components, utilities)

export const metadata: Metadata = {
  title: "Sistema de IA generativa para el Prediagnóstico Médico",
  description: "Asistente de diagnóstico preliminar para dengue y afecciones respiratorias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
