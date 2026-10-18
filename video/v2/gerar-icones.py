# Gera video/v2/ilustracoes/icones.js com o miolo dos ícones Lucide (ISC) usados nas cenas "cartoes", "colunas" e "etapas".
import json, os, re, sys
pasta = "node_modules/lucide-static/icons"
mapa = {}
for f in sorted(os.listdir(pasta)):
    if not f.endswith(".svg"): continue
    s = open(os.path.join(pasta, f)).read()
    m = re.search(r"<svg[^>]*>(.*)</svg>", s, re.S)
    mapa[f[:-4]] = re.sub(r"\s+", " ", m.group(1)).strip()
open("video/v2/ilustracoes/icones.js", "w").write("// Ícones Lucide (lucide-static 0.460.0, licença ISC). Gerado por video/v2/gerar-icones.py.\nwindow.ICONES = " + json.dumps(mapa, ensure_ascii=False) + ";\n")
print(len(mapa))
