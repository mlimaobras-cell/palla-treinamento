import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegistrarApp } from "@/components/app-pwa";

export const metadata: Metadata = {
  title: { default: "Grupo Palla | Treinamento e Integração", template: "%s · Grupo Palla" },
  description: "Integração, treinamento, avaliação e certificação das equipes da Palla Construções.",
  icons: { icon: "/icones/favicon-48.png", apple: "/icones/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Palla Treinamento", statusBarStyle: "default" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1c2552" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh antialiased"><RegistrarApp />{children}</body>
    </html>
  );
}
