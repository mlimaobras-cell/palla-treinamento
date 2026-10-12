# Narração v2 (Kokoro pt-BR) com:
#  - dicionário de pronúncia (video/v2/pronuncia.json) aplicado só ao áudio, nunca à legenda;
#  - pausas explícitas: [[pausa:3]] insere 3 s de silêncio (perguntas ao aluno);
#  - marcas de sincronia: {nome} no texto registra o instante em que a frase seguinte começa;
#  - tempos reais de cada frase, gravados em <saida>.json para legendas sincronizadas.
# Entrada: JSON [{"texto": "...", "saida": "x.wav"}] em argv[1]; voz em argv[2]; velocidade em argv[3].
import json, re, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from pathlib import Path

AQUI = Path(__file__).parent
VOZ = sys.argv[2] if len(sys.argv) > 2 else "pf_dora"
VEL = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
k = Kokoro(str(AQUI.parent / "voz" / "kokoro.onnx"), str(AQUI.parent / "voz" / "voices.bin"))
PRON = json.load(open(AQUI / "pronuncia.json", encoding="utf-8"))
SR = 24000

def falar(texto):
    t = texto
    for de, para in PRON.items():
        t = re.sub(rf"(?<![\w-]){re.escape(de)}(?![\w-])", para, t)
    audio, _ = k.create(t, voice=VOZ, speed=VEL, lang="pt-br")
    return audio

def pedacos(texto):
    """Divide em frases, pausas e marcas, na ordem do texto."""
    texto = re.sub(r"\s+", " ", texto.strip())
    for tok in re.split(r"(\[\[pausa:[\d.]+\]\]|\{[a-z0-9_]+\})", texto):
        tok = tok.strip()
        if not tok:
            continue
        if tok.startswith("[[pausa:"):
            yield ("pausa", float(tok[8:-2]))
        elif tok.startswith("{"):
            yield ("marca", tok[1:-1])
        else:
            for f in re.findall(r"[^.!?;:]+[.!?;:]?", tok):
                if f.strip():
                    yield ("frase", f.strip())

for item in json.load(open(sys.argv[1], encoding="utf-8")):
    partes, frases, marcas, t = [], [], {}, 0.0
    for tipo, v in pedacos(item["texto"]):
        if tipo == "marca":
            marcas[v] = round(t, 3)
            continue
        if tipo == "pausa":
            n = int(SR * v)
            partes.append(np.zeros(n, dtype=np.float32)); t += n / SR
            continue
        a = falar(v)
        frases.append({"texto": v, "ini": round(t, 3), "fim": round(t + len(a) / SR, 3)})
        partes.append(a); t += len(a) / SR
        pausa = 0.5 if v.endswith((".", "!", "?")) else 0.28
        partes.append(np.zeros(int(SR * pausa), dtype=np.float32)); t += pausa
    audio = np.concatenate(partes) if partes else np.zeros(SR, dtype=np.float32)
    sf.write(item["saida"], audio, SR)
    json.dump({"frases": frases, "marcas": marcas, "duracao": round(len(audio) / SR, 3)},
              open(item["saida"] + ".json", "w", encoding="utf-8"), ensure_ascii=False)
    print("ok", item["saida"], flush=True)
