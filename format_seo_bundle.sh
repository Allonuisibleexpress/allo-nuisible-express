#!/bin/bash
set -euo pipefail

files=(
  deratisation-thiais.html
  punaises-lit-thiais.html
  cafards-thiais.html
  rats-thiais.html
  souris-thiais.html
  guepes-thiais.html
  frelons-thiais.html
  syndrome-diogene-thiais.html
  depigeonnage-thiais.html
  nuisibles-rungis.html
  deratisation-rungis.html
  punaises-lit-rungis.html
  cafards-rungis.html
  rats-rungis.html
  souris-rungis.html
  guepes-rungis.html
  frelons-rungis.html
  syndrome-diogene-rungis.html
  depigeonnage-rungis.html
)

out="seo-local-pages-ready.txt"
: > "$out"

for f in "${files[@]}"; do
  [ -f "$f" ] || continue
  slug="/${f%.html}"
  title=$(sed -n 's#.*<title>\(.*\)</title>.*#\1#p' "$f" | head -n1)
  desc=$(sed -n 's#.*<meta name="description" content="\(.*\)">.*#\1#p' "$f" | head -n1)
  h1=$(sed -n 's#.*<h1>\(.*\)</h1>.*#\1#p' "$f" | head -n1)

  {
    echo "=== NOUVELLE PAGE ==="
    echo "URL :"
    echo "$slug"
    echo
    echo "META TITLE :"
    echo "$title"
    echo
    echo "META DESCRIPTION :"
    echo "$desc"
    echo
    echo "H1 :"
    echo "$h1"
    echo
    echo "CONTENU :"
    cat "$f"
    echo
  } >> "$out"
done

echo "Updated $out"
