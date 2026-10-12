#!/bin/bash
# Versões leves dos vídeos v2 para a plataforma (public/videos/v2): H.264 CRF 28, áudio mono 80 kbps, faststart; legenda e capa.
cd /home/claude/palla-treinamento
mkdir -p public/videos/v2
for f in video/v2/saida/*.mp4; do
  b=$(basename $f .mp4)
  [ "$b" = "M3-piloto-lingada" ] && n="M3-4-lingada" || n="$b"
  ffmpeg -v error -y -i $f -c:v libx264 -crf 28 -preset slow -tune animation -c:a aac -b:a 80k -ac 1 -movflags +faststart public/videos/v2/$n.mp4
  ffmpeg -v error -y -ss 3 -i $f -frames:v 1 -vf scale=640:-1 -q:v 4 public/videos/v2/$n.jpg
  cp video/v2/saida/$b.vtt public/videos/v2/$n.vtt
  echo "$n $(stat -c%s public/videos/v2/$n.mp4)" >> video/v2/log-web.txt
done
echo FIM >> video/v2/log-web.txt
