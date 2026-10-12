#!/bin/bash
# Folha de conferência: quadros a 55% e no fim de cada cena. Uso: bash video/v2/folha.sh <cenas.json> <saida.png>
set -e
COD=$(python3 -c "import json,sys;print(json.load(open(sys.argv[1]))['codigo'])" "$1")
D=$(mktemp -d)
CHROMIUM_PATH=${CHROMIUM_PATH:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome} npx tsx video/v2/previa.ts "$1" video/tmp/v2-$COD $D auto 2>&1 | grep -i "erro" || true
ls $D/*.png | sort -V > $D/lista.txt
ffmpeg -v error -y -f concat -safe 0 -i <(sed "s/^/file '/;s/$/'/" $D/lista.txt) -vf "scale=640:360,tile=4x4:padding=6:color=white" -frames:v 1 "$2"
rm -rf $D
