"use client";
import { useEffect, useState } from "react";

const b64 = (s: string) => { const p = "=".repeat((4 - (s.length % 4)) % 4); const r = atob((s + p).replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from([...r].map((c) => c.charCodeAt(0))); };

/** Liga/desliga, NESTE aparelho, o aviso de login de colaborador (notificação do sistema). */
export function AvisosPush({ chave }: { chave: string }) {
  const [estado, setEstado] = useState<"carregando" | "sem-suporte" | "ios-instalar" | "bloqueado" | "ligado" | "desligado">("carregando");
  const [msg, setMsg] = useState("");
  useEffect(() => {
    (async () => {
      const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return setEstado(ios && !standalone ? "ios-instalar" : "sem-suporte");
      if (Notification.permission === "denied") return setEstado("bloqueado");
      const reg = await navigator.serviceWorker.ready;
      setEstado((await reg.pushManager.getSubscription()) ? "ligado" : "desligado");
    })().catch(() => setEstado("sem-suporte"));
  }, []);

  async function ligar() {
    setMsg("");
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { setEstado(perm === "denied" ? "bloqueado" : "desligado"); return; }
      const reg = await navigator.serviceWorker.ready;
      const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(chave) }));
      const r = await fetch("/api/push", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(sub) });
      if (!r.ok) throw new Error((await r.json()).erro ?? "Falha ao ativar.");
      setEstado("ligado"); setMsg("Pronto: este aparelho vai receber um aviso sempre que um colaborador entrar.");
    } catch (e) { setMsg((e as Error).message); }
  }
  async function desligar() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) { await fetch("/api/push", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint }) }); await sub.unsubscribe(); }
    setEstado("desligado"); setMsg("Avisos desligados neste aparelho.");
  }
  async function testar() {
    const r = await fetch("/api/push/teste", { method: "POST" });
    setMsg(r.ok ? `Aviso de teste enviado (${(await r.json()).enviados} aparelho(s)). Deve chegar em alguns segundos.` : "Não foi possível enviar o teste.");
  }

  const botao = "inline-flex min-h-10 items-center rounded-lg px-4 py-2 text-sm font-semibold";
  return (
    <div className="space-y-3 text-sm">
      {estado === "carregando" && <p className="text-tinta-suave">Verificando este aparelho…</p>}
      {estado === "ligado" && (
        <>
          <p className="font-medium text-emerald-700">● Avisos ligados neste aparelho.</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={testar} className={`${botao} bg-palla-azul text-white hover:bg-palla-azul-escuro`}>Enviar aviso de teste</button>
            <button onClick={desligar} className={`${botao} text-palla-vermelho ring-1 ring-inset ring-linha hover:bg-slate-50`}>Desligar</button>
          </div>
        </>
      )}
      {estado === "desligado" && <button onClick={ligar} className={`${botao} bg-palla-azul text-white hover:bg-palla-azul-escuro`}>Ligar avisos neste aparelho</button>}
      {estado === "bloqueado" && <p>As notificações deste site estão <strong>bloqueadas</strong> no navegador. Libere em Configurações do site → Notificações → Permitir, e recarregue a página.</p>}
      {estado === "ios-instalar" && <p>No iPhone, os avisos só funcionam com o app instalado: abra no <strong>Safari</strong>, toque em <strong>Compartilhar</strong> → <strong>Adicionar à Tela de Início</strong>, abra o app pelo ícone e volte a esta página.</p>}
      {estado === "sem-suporte" && <p>Este navegador não recebe notificações. Use o Chrome ou o Edge (Android, Windows, Mac) ou o app instalado no iPhone.</p>}
      {msg && <p className="rounded-md bg-palla-azul-claro px-3 py-2 text-palla-azul-escuro">{msg}</p>}
    </div>
  );
}
