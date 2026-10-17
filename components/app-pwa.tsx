"use client";
import { useEffect, useState } from "react";

/** Registra o service worker (app instalável + notificações). */
export function RegistrarApp() {
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}

type EventoInstalar = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/** Botão "Instalar app": Android/Chrome/Edge usam o pedido nativo; no iPhone mostra como adicionar à tela inicial. */
export function InstalarApp({ className = "", claro = false }: { className?: string; claro?: boolean }) {
  const [evento, setEvento] = useState<EventoInstalar | null>(null);
  const [ios, setIos] = useState(false);
  const [instalado, setInstalado] = useState(true);
  const [ajuda, setAjuda] = useState(false);
  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
    setInstalado(standalone);
    setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    const aoPedir = (e: Event) => { e.preventDefault(); setEvento(e as EventoInstalar); };
    const aoInstalar = () => setInstalado(true);
    window.addEventListener("beforeinstallprompt", aoPedir);
    window.addEventListener("appinstalled", aoInstalar);
    return () => { window.removeEventListener("beforeinstallprompt", aoPedir); window.removeEventListener("appinstalled", aoInstalar); };
  }, []);
  if (instalado || (!evento && !ios)) return null;
  const estilo = claro ? "text-white/80 hover:text-white" : "text-palla-azul hover:underline";
  return (
    <div className={className}>
      <button type="button" className={`inline-flex items-center gap-1.5 text-sm font-semibold ${estilo}`}
        onClick={async () => { if (evento) { await evento.prompt(); await evento.userChoice; setEvento(null); } else setAjuda((v) => !v); }}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" /></svg>
        Instalar app
      </button>
      {ajuda && ios && (
        <p className={`mt-2 max-w-xs rounded-lg p-3 text-xs leading-relaxed ${claro ? "bg-white/10 text-white" : "bg-palla-azul-claro text-palla-azul-escuro"}`}>
          No iPhone: abra este site no <strong>Safari</strong>, toque em <strong>Compartilhar</strong> (quadrado com seta) e depois em <strong>Adicionar à Tela de Início</strong>.
        </p>
      )}
    </div>
  );
}
