#!/usr/bin/env bash
# Construit index.html (application complète en un seul fichier) à partir de src/
set -e
cd "$(dirname "$0")"
SRC="rules.js vocab.js texts.js data.js content2.js speech.js tr1.js tr2.js tr3.js tr4.js bank1.js bank2.js bank3.js app.js"
BODY=$( { cat src/shell.html; echo '<script>'; for f in $SRC; do cat "src/$f"; done; echo '</script>'; } )
{ echo '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#2e47f0"><link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icon-192.png"><link rel="apple-touch-icon" href="icon-192.png"><meta name="apple-mobile-web-app-capable" content="yes"><style>:root{padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}img{max-width:100%}</style></head><body>'; echo "$BODY"; echo '</body></html>'; } > index.html
( for f in $SRC; do cat "src/$f"; echo; done ) > /tmp/atelier-check.js && node --check /tmp/atelier-check.js && echo "index.html construit"
