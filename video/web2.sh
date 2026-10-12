#!/bin/bash
# Originais em alta qualidade ficam em video/originais/ (fora de public/, não vão para a publicação). Após gerar um vídeo novo, mova o .mp4 para lá.
# Versões leves (<14,5 MB) dos vídeos M4–M8; sobe o CRF até caber.
cd /home/claude/palla-treinamento
for m in M4-parafusos M5-soldagem M6-metrologia M7-seguranca M8-cobertura; do
  while [ ! -f public/videos/curso/$m.json ]; do sleep 30; done
  for crf in 30 32 34 36; do
    ffmpeg -v error -y -i video/originais/$m.mp4 -c:v libx264 -crf $crf -preset medium -tune stillimage -c:a aac -b:a 64k -ac 1 -movflags +faststart public/videos/curso/web/$m.mp4
    [ $(stat -c%s public/videos/curso/web/$m.mp4) -lt 14500000 ] && break
  done
  echo "$m crf$crf $(stat -c%s public/videos/curso/web/$m.mp4)" >> video/log-web.txt
done
echo FIM >> video/log-web.txt
