import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Grupo Palla | Treinamento e Integração",
    short_name: "Palla Treinamento",
    description: "Integração, treinamentos, avaliações e certificados das equipes da Palla Construções.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#F5F6FA",
    theme_color: "#1c2552",
    lang: "pt-BR",
    icons: [
      { src: "/icones/icone-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icones/icone-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icones/icone-mascara-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icones/icone-mascara-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Painel da equipe", url: "/admin", icons: [{ src: "/icones/icone-192.png", sizes: "192x192" }] },
      { name: "Minha trilha", url: "/colaborador", icons: [{ src: "/icones/icone-192.png", sizes: "192x192" }] },
    ],
  };
}
