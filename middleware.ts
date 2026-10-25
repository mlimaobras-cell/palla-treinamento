import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Bloqueio rápido das áreas restritas; a verificação de perfil e permissão acontece no servidor.
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("palla_sessao")?.value;
  const ok = token
    ? await jwtVerify(token, new TextEncoder().encode(process.env.SESSION_SECRET ?? "")).then(() => true, () => false)
    : false;
  if (!ok) {
    const url = new URL("/login", req.url);
    url.searchParams.set("voltar", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/colaborador/:path*", "/api/certificados/:path*", "/api/documentos/:path*", "/api/sst/:path*", "/imprimir/:path*"] };
