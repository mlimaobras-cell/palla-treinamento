# Monta a página de videoaulas a partir dos vídeos prontos (public/videos/curso/web).
import json, shutil, datetime
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
CURSO = RAIZ / "public/videos/curso"
PAG = Path(__file__).parent
(PAG / "videos").mkdir(exist_ok=True)

BASE = [
    ("M1", "M1-fundamentos", 8, "Todas as trilhas", "UL59PQitCJj4BSCr7VNhzC", "48eb4367-af2a-4f3c-b297-28f47adbb04b", False),
    ("M2", "M2-projetos", 8, "Todas as trilhas", "FXFogSsANS8Dh1KdSFpafW", "5b602fdd-53b2-486b-b6e0-18674cfd0142", False),
    ("M3", "M3-montagem", 16, "Auxiliar (parte), Montador, Encarregado", "3BevveZfonURKTwPSHgqwH", "caca6f13-56ea-4484-8cca-51f2ef671efa", False),
    ("M4", "M4-parafusos", 12, "Montador, Encarregado", "7ewDHePamHgkn48g97TqAB", "58622b68-d230-49ce-b349-b0f7a712e6c0", False),
    ("M5", "M5-soldagem", 12, "Soldador, Montador, Encarregado", "UsVs7st1rQY4s7xnjVQP4e", "e252d412-8b9c-4a51-afe5-838e50d4bb54", False),
    ("M6", "M6-metrologia", 12, "Encarregado", "3z9XBuBhX4ikG7Qc3QJMye", "f550d515-82c2-48a2-b6b6-8c9776519aee", False),
    ("M7", "M7-seguranca", 12, "Todas as trilhas", "Y26EWBc4fmLqfKMkzQKWcg", "79ab2cfe-dd52-42b8-bb4a-4ef1c2e50b74", False),
    ("M8", "M8-cobertura", 8, "Montador, Encarregado", "HC6EKNH3Q8YZakBx2DFBQ2", "233e57e3-7985-4dd3-b40d-bef9356e955b", True),
    ("NR35", "NR35-apoio", 8, "Apoio ao treinamento presencial de NR-35 (todas as funções em altura)", None, "bf0dd5ba-a9f5-488a-aefb-e8684b8bd81e", False),
]

dados, arquivos = [], {"logo-palla-branco.png": "video/pagina/logo-palla-branco.png"}
for mid, cod, horas, trilhas, slides, caderno, opc in BASE:
    titulo = json.load(open(RAIZ / f"video/cenas/{cod.lower()}.json", encoding="utf-8"))["titulo"]
    m = {"id": mid, "titulo": titulo, "horas": horas, "trilhas": trilhas, "opcional": opc,
         "slides": f"https://claude.ai/artifact/{slides}" if slides else None, "caderno": f"https://claude.ai/code/artifact/{caderno}"}
    web = CURSO / "web" / f"{cod}.mp4"
    log = (RAIZ / "video/log-web.txt").read_text() if (RAIZ / "video/log-web.txt").exists() else ""
    if web.exists() and (CURSO / f"{cod}.json").exists() and (cod in log or cod.startswith("M1")):
        info = json.load(open(CURSO / f"{cod}.json"))
        for ext, src in (("mp4", web), ("vtt", CURSO / f"{cod}.vtt"), ("jpg", CURSO / f"{cod}.jpg")):
            nome = f"{cod}.vtt.txt" if ext == "vtt" else f"{cod}.{ext}"
            dst = PAG / "videos" / nome
            if not dst.exists() or dst.stat().st_mtime < src.stat().st_mtime:
                shutil.copy2(src, dst)
            arquivos[f"videos/{nome}"] = f"video/pagina/videos/{nome}"
        m.update(video=f"videos/{cod}.mp4", legenda=f"videos/{cod}.vtt.txt", capa=f"videos/{cod}.jpg", duracao=round(info["duracao"]))
    dados.append(m)

html = (PAG / "modelo.html").read_text(encoding="utf-8")
html = html.replace("__DADOS__", json.dumps(dados, ensure_ascii=False)).replace("__DATA__", datetime.date.today().strftime("%d/%m/%Y"))
(PAG / "index.html").write_text(html, encoding="utf-8")
json.dump(arquivos, open(PAG / "arquivos.json", "w"), indent=1)
print(len([d for d in dados if "video" in d]), "vídeos;", json.dumps(arquivos))
