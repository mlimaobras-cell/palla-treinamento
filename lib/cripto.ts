// Proteção de dados pessoais (LGPD): o CPF é guardado cifrado (AES-256-GCM)
// e indexado por HMAC, de modo que o banco nunca expõe o CPF em claro.
import { createCipheriv, createDecipheriv, createHmac, randomBytes, createHash } from "node:crypto";

function chave(): Buffer {
  const hex = process.env.CPF_KEY_HEX;
  if (!hex || hex.length !== 64) throw new Error("CPF_KEY_HEX ausente ou inválida (64 caracteres hex).");
  return Buffer.from(hex, "hex");
}

export function somenteDigitos(v: string) {
  return v.replace(/\D/g, "");
}

/** Valida CPF pelos dígitos verificadores. */
export function cpfValido(cpf: string): boolean {
  const d = somenteDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const calc = (base: string, pesoInicial: number) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (pesoInicial - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return calc(d.slice(0, 9), 10) === Number(d[9]) && calc(d.slice(0, 10), 11) === Number(d[10]);
}

export function cifrarCpf(cpf: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", chave(), iv);
  const enc = Buffer.concat([c.update(somenteDigitos(cpf), "utf8"), c.final()]);
  return [iv.toString("base64"), c.getAuthTag().toString("base64"), enc.toString("base64")].join(".");
}

export function decifrarCpf(valor: string): string {
  const [iv, tag, enc] = valor.split(".").map((p) => Buffer.from(p, "base64"));
  const d = createDecipheriv("aes-256-gcm", chave(), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(enc), d.final()]).toString("utf8");
}

export function hashCpf(cpf: string): string {
  return createHmac("sha256", process.env.CPF_HMAC_KEY ?? "").update(somenteDigitos(cpf)).digest("hex");
}

/** Exibição mascarada: ***.***.*89-01 → mostra só os dois últimos dígitos. */
export function mascararCpf(final2: string): string {
  return `***.***.***-${final2}`;
}

export function sha256(dados: Buffer | string): string {
  return createHash("sha256").update(dados).digest("hex");
}

const ALFABETO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem 0/O/1/I
export function codigoAleatorio(tamanho = 10): string {
  const bytes = randomBytes(tamanho);
  let s = "";
  for (let i = 0; i < tamanho; i++) s += ALFABETO[bytes[i] % ALFABETO.length];
  return s;
}

export function tokenConvite(): string {
  return randomBytes(24).toString("base64url");
}
