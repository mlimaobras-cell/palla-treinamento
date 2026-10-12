# Narração com Kokoro (voz pt-BR "pf_dora"). Entrada: JSON [{"texto": "...", "saida": "x.wav"}] via argv[1].
# Divide em frases, gera cada uma e junta com pausas naturais (evita leitura "travada").
import json, re, sys
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
from pathlib import Path

BASE = Path(__file__).parent / "voz"
VOZ = sys.argv[2] if len(sys.argv) > 2 else "pf_dora"
VEL = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
k = Kokoro(str(BASE / "kokoro.onnx"), str(BASE / "voices.bin"))

def frases(t):
    t = re.sub(r"\s+", " ", t.strip())
    return [p.strip() for p in re.findall(r"[^.!?;]+[.!?;]?", t) if p.strip()]

for item in json.load(open(sys.argv[1], encoding="utf-8")):
    partes, sr = [], 24000
    for f in frases(item["texto"]):
        audio, sr = k.create(f, voice=VOZ, speed=VEL, lang="pt-br")
        partes.append(audio)
        pausa = 0.42 if f.endswith((".", "!", "?")) else 0.22
        partes.append(np.zeros(int(sr * pausa), dtype=np.float32))
    sf.write(item["saida"], np.concatenate(partes[:-1]) if partes else np.zeros(sr), sr)
    print("ok", item["saida"], flush=True)
