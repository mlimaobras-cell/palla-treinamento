#!/bin/bash
# Gera versões leves (<15 MB) dos vídeos do curso para publicação.
cd /home/claude/palla-treinamento
mkdir -p public/videos/curso/web
for m in M2-projetos M3-montagem M4-parafusos M5-soldagem M6-metrologia M7-seguranca M8-cobertura; do
  while [ ! -f public/videos/curso/$m.json ]; do sleep 30; done
  ffmpeg -v error -y -i video/originais/$m.mp4 -c:v libx264 -crf 30 -preset medium -tune stillimage -c:a aac -b:a 64k -ac 1 -movflags +faststart public/videos/curso/web/$m.mp4
  echo "$m $(du -h public/videos/curso/web/$m.mp4 | cut -f1)" >> video/log-web.txt
done
echo FIM >> video/log-web.txt
