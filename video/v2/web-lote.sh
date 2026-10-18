#!/bin/bash
# Versão leve de vídeos v2 escolhidos para a plataforma: bash video/v2/web-lote.sh <codigo> [<codigo> ...]
# Fotos (INT-*): -tune film; demais: -tune animation. Atualiza public/videos/v2/duracoes.json.
cd /home/claude/palla-treinamento
for n in "$@"; do
  f=video/v2/saida/$n.mp4; [ -f "$f" ] || { echo "falta $f"; continue; }
  case $n in INT-*) tune=film; crf=27;; *) tune=animation; crf=28;; esac
  ffmpeg -v error -y -i $f -c:v libx264 -crf $crf -preset slow -tune $tune -c:a aac -b:a 80k -ac 1 -movflags +faststart public/videos/v2/$n.mp4
  ffmpeg -v error -y -ss 3 -i $f -frames:v 1 -vf scale=640:-1 -q:v 4 public/videos/v2/$n.jpg
  cp video/v2/saida/$n.vtt public/videos/v2/$n.vtt
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 public/videos/v2/$n.mp4)
  python3 -c "import json,sys;p='public/videos/v2/duracoes.json';j=json.load(open(p));j[sys.argv[1]]=round(float(sys.argv[2]),1);json.dump(j,open(p,'w'),ensure_ascii=False,indent=2)" $n $d
  echo "$n $d $(stat -c%s public/videos/v2/$n.mp4)"
done
