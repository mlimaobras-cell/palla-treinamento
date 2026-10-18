# Confere ícones, fotos e marcas de sincronia dos roteiros. Uso: python3 video/v2/validar-roteiros.py cenas/a.json ...
import json, re, sys, os
AQUI = os.path.dirname(os.path.abspath(__file__))
ks = set(re.findall(r'"([a-z0-9-]+)": "', open(os.path.join(AQUI, "ilustracoes/icones.js")).read()))
erros = 0
for f in sys.argv[1:]:
    d = json.load(open(f))
    for n, c in enumerate(d["cenas"], 1):
        ic = [k.get("icone") for k in c.get("cards", []) + c.get("etapas", [])] + [c.get("icone")]
        cols = c.get("colunas") if isinstance(c.get("colunas"), list) else []
        ic += [col["icone"] for col in cols]
        for i in ic:
            if i and i not in ks: print(f"{f} cena {n}: ícone inexistente {i}"); erros += 1
        for fz in c.get("fotos", []):
            if not os.path.exists(os.path.join(AQUI, fz["src"])): print(f"{f} cena {n}: foto {fz['src']} não existe"); erros += 1
        marcas = set(re.findall(r"\{(\w+)\}", c["narracao"]))
        req = {x.get("m") for x in c.get("cards", []) + c.get("etapas", []) + c.get("itens", []) if isinstance(x, dict) and x.get("m")}
        for col in cols: req |= {i["m"] for i in col["itens"]}
        req |= {fz.get("m") for fz in c.get("fotos", []) if fz.get("m")}
        if c["tipo"] == "checklist": req |= {i["chave"] for i in c["itens"]} | {"fim"}
        if c["tipo"] == "pergunta": req |= {"pensa", "resp"}
        if req - marcas: print(f"{f} cena {n} ({c['tipo']}): marcas faltando {req - marcas}"); erros += 1
print("OK" if not erros else f"{erros} problema(s)")
