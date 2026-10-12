#!/bin/bash
# Gera só a narração de um roteiro (para prévias): bash video/v2/tts-cenas.sh video/v2/cenas/<arq>.json
set -e
COD=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['codigo'])" "$1")
T=video/tmp/v2-$COD; mkdir -p $T
python3 - "$1" "$T" <<'PY'
import json,sys
d=json.load(open(sys.argv[1]))
json.dump([{"texto":c["narracao"],"saida":f"{sys.argv[2]}/{i+1}.wav"} for i,c in enumerate(d["cenas"])],open(f"{sys.argv[2]}/lote.json","w"),ensure_ascii=False)
PY
python3 video/v2/tts_v2.py $T/lote.json ${VOZ:-pf_dora} ${VELOCIDADE:-1.0} > /dev/null 2>&1
python3 -c "
import json,glob,sys
t=0
for f in sorted(glob.glob('$T/*.wav.json'), key=lambda x:int(x.split('/')[-1].split('.')[0])):
  d=json.load(open(f)); t+=d['duracao']+1.5
print('$COD', round(t,1),'s')"
