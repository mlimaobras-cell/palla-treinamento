import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Grupo Palla | Treinamento e Integração", template: "%s · Grupo Palla" },
  description: "Integração, treinamento, avaliação e certificação das equipes da Palla Construções.",
  icons: { icon: "/logo-palla.png" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1c2552" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
