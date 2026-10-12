#!/bin/bash
# Gera os vídeos dos módulos em ordem, esperando cada roteiro ficar pronto.
cd /home/claude/palla-treinamento
# M1 ja gerado
export CHROMIUM_PATH=$(ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1)
for m in m2-projetos m3-montagem m4-parafusos m5-soldagem m6-metrologia m7-seguranca m8-cobertura; do
  while [ ! -f video/cenas/$m.json ]; do sleep 20; done
  sleep 5
  npx tsx scripts/gerar-video.ts video/cenas/$m.json public/videos/curso >> video/log-fila.txt 2>&1
done
echo FIM >> video/log-fila.txt
