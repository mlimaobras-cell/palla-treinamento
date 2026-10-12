#!/bin/bash
# Renderiza vários roteiros em sequência. Uso: bash video/v2/render-lote.sh <arq1.json> <arq2.json> ...
export CHROMIUM_PATH=${CHROMIUM_PATH:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}
for f in "$@"; do TRABALHADORES=${TRABALHADORES:-3} npx tsx scripts/gerar-video-v2.ts "$f" video/v2/saida >> video/v2/log-render.txt 2>&1 || echo "FALHOU $f" >> video/v2/log-render.txt; done
echo FIM >> video/v2/log-render.txt
