# Biblioteca comum dos geradores de roteiro (antes em gerar-roteiros-int-nr.py)
# Gera os roteiros (cenas JSON) dos vídeos da Integração (INT-01), da Segurança na montagem (PAL-52)
# e das apresentações de NR-17, NR-23, NR-26 e NR-33. Uso: python3 video/v2/gerar-roteiros-int-nr.py
# Conteúdo tirado de db/conteudo/integracao.ts, db/conteudo/montagem-segura.ts e db/catalogo.ts (não inventar requisitos).
import json, os

AQUI = os.path.dirname(os.path.abspath(__file__))
F = "fotos/institucional/"
SCRIPTS = ["ilustracoes/icones.js"]


def foto(fotos, narr, titulo=None, cap=None, itens=None, layout=None):
    c = {"tipo": "foto", "fotos": [{"src": F + f[0], **({"m": f[1]} if len(f) > 1 and f[1] else {}), **({"legenda": f[2]} if len(f) > 2 else {})} for f in fotos], "narracao": narr}
    if titulo: c["titulo"] = titulo
    if cap: c["cap"] = cap
    if itens: c["itens"] = [{"m": m, "texto": t} for m, t in itens]
    if layout: c["layout"] = layout
    return c


def cartoes(titulo, cards, narr, sub=None, linha=False, colunas=None, aviso=None):
    c = {"tipo": "cartoes", "titulo": titulo, "cards": [dict(zip(["m", "icone", "titulo", "texto", "cor"], k)) for k in cards], "narracao": narr}
    for k in c["cards"]:
        if k.get("texto") is None: k.pop("texto", None)
        if k.get("cor") is None: k.pop("cor", None)
    if sub: c["sub"] = sub
    if linha: c["linha"] = True
    if colunas: c["colunas"] = colunas
    if aviso: c["aviso"] = aviso
    return c


def colunas(titulo, cols, narr, sub=None):
    return {"tipo": "colunas", "titulo": titulo, **({"sub": sub} if sub else {}), "narracao": narr,
            "colunas": [{"titulo": t, "icone": i, "cor": cor, "itens": [{"m": m, "texto": x} for m, x in its]} for t, i, cor, its in cols]}


def etapas(titulo, ets, narr, sub=None, forma=None):
    c = {"tipo": "etapas", "titulo": titulo, "narracao": narr, "etapas": [dict(zip(["m", "titulo", "texto", "icone", "cor"], e)) for e in ets]}
    for e in c["etapas"]:
        for k in ("texto", "icone", "cor"):
            if e.get(k) is None: e.pop(k, None)
    if sub: c["sub"] = sub
    if forma: c["forma"] = forma
    return c


def pergunta(p, resp, conta, narr):
    return {"tipo": "pergunta", "pergunta": p, "resposta": resp, "conta": conta, "narracao": narr}


def checklist(itens, rodape, narr, titulo="Leve para a obra"):
    return {"tipo": "checklist", "titulo": titulo, "itens": [{"texto": t, "chave": f"c{i + 1}"} for i, t in enumerate(itens)], "rodape": rodape, "narracao": narr}


def abertura(icone, objetivo, narr):
    return {"tipo": "abertura", "icone": icone, "objetivo": objetivo, "narracao": narr}


def roteiro(codigo, titulo, capitulo, eyebrow, fontes, cenas, pendencias=()):
    d = {"codigo": codigo, "titulo": titulo, "capitulo": capitulo, "eyebrow": eyebrow, "scripts": SCRIPTS, "fontes": fontes, "pendencias": list(pendencias), "cenas": cenas}
    nome = codigo.lower() + ".json"
    with open(os.path.join(AQUI, "cenas", nome), "w") as f:
        json.dump(d, f, ensure_ascii=False, indent=2)
    return nome




def caso(foto_arq, texto_itens, narr, titulo="Na prática"):
    """Cena de situação real (vira o campo 'exemplo' da aula)."""
    c = foto([(foto_arq,)], narr, titulo=titulo, itens=texto_itens)
    c["caso"] = True
    return c


def roteiro_curso(codigo, titulo, curso, aula_n, eyebrow, fontes, cenas, pendencias=(), nota=None):
    d = {"codigo": codigo, "titulo": titulo, "capitulo": f"{curso} · Aula {aula_n}", "eyebrow": eyebrow, "scripts": SCRIPTS,
         "fontes": fontes, "pendencias": list(pendencias), "cenas": cenas}
    if nota: d["nota"] = nota
    nome = codigo.lower() + ".json"
    with open(os.path.join(AQUI, "cenas", nome), "w") as f:
        json.dump(d, f, ensure_ascii=False, indent=2)
    return nome
