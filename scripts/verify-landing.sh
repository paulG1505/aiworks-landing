#!/usr/bin/env bash
# Executable checks over the static build (frontend/out); each block is one requirement.
set -uo pipefail
OUT="${1:-frontend/out}"
fail=0; pass=0

ok()      { printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass+1)); }
bad()     { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail+1)); }
heading() { printf '\n\033[1m%s\033[0m\n' "$1"; }

# absent <pattern> <description>: fails if the pattern appears anywhere in the build
absent() {
  local n; n=$(grep -roF "$1" "$OUT" --include='*.html' --include='*.js' --include='*.txt' 2>/dev/null | wc -l | tr -d ' ')
  [ "$n" -eq 0 ] && ok "$2" || bad "$2 (found $n times)"
}
# present <pattern> <description>: appears in any build artifact
present() {
  grep -rqF "$1" "$OUT" --include='*.html' --include='*.js' --include='*.txt' 2>/dev/null \
    && ok "$2" || bad "$2 (not found)"
}
# in_html <pattern> <description>: only the served HTML counts; data living in a JS chunk is not rendered
in_html() {
  grep -qF "$1" "$OUT/index.html" 2>/dev/null \
    && ok "$2" || bad "$2 (not in the served HTML)"
}
# absent_in_html <pattern> <description>: may exist in the bundle but must not be pre-rendered
absent_in_html() {
  local n; n=$(grep -oF "$1" "$OUT/index.html" 2>/dev/null | wc -l | tr -d ' ')
  [ "$n" -eq 0 ] && ok "$2" || bad "$2 (found $n times in index.html)"
}
file_exists() { [ -f "$OUT/$1" ] && ok "$2" || bad "$2 (missing $1)"; }

[ -d "$OUT" ] || { echo "$OUT does not exist: run 'npm run build' in frontend/ first"; exit 2; }

heading "Requirement: correct contact data"
absent "995090170"          "old number 995090170 is gone"
absent "+593 99 509 0170"   "old formatted number is gone"
present "593978923586"      "official number 593978923586 is present"

heading "Requirement: only defensible claims"
# Figures are searched as they appeared in the copy ("99.2% de precisión"), so a class like w-[85%] is not a false positive.
for c in "99.2%" "85% " "40% " "30% " "95% "; do absent "$c" "invented figure '$c' removed"; done
absent "SOC 2"          "SOC 2 badge removed"
absent "GDPR"           "GDPR badge removed"
absent "Empresa líder"  "superlative 'Empresa líder' removed"

heading "Requirement: Spanish by default"
absent_in_html "Built for the work your team" "pre-rendered HTML is not in English"
present        "Built for the work your team" "English copy ships in the bundle (the EN selector needs it)"

heading "Requirement: Ecuadorian geographic identity"
absent  "MX"        "no MX occurrence (addressCountry or es_MX)"
present "es_EC"     "locale es_EC present"
present "Quito"     "locality Quito declared"
absent  "México"    "no reference to Mexico"

heading "Requirement: corporate email visible"
in_html "contacto@aiworks.lat" "corporate email rendered in the HTML"

heading "Requirement: no form without a destination"
absent "Formulario de contacto" "dead form copy removed"
absent "Contact form"           "dead English form copy removed"

heading "Requirement: horizontal layout integrity"
absent "translate-x-10" "no block ships a horizontal translation"
grep -rq "overflow-x" "$OUT"/_next/static/chunks/*.css 2>/dev/null \
  && ok "an overflow-x safety rule exists" \
  || bad "no overflow-x rule in the compiled CSS"

heading "Requirement: brand name spelling"
absent "AIWorks" "variant AIWorks removed"
absent "AIWORKS" "variant AIWORKS removed"

heading "Requirement: share preview"
file_exists "og-image.png"  "og-image.png exists"
file_exists "icon-192.png"  "icon-192.png exists"
file_exists "icon-512.png"  "icon-512.png exists"

heading "Bundle weight"
if [ -f "$OUT/videos/landing.mp4" ]; then
  bad "the 60 MB video is still in the build"
else
  ok "the 60 MB video is not in the build"
fi

printf '\n\033[1mResult: %d pass, %d fail\033[0m\n' "$pass" "$fail"
[ "$fail" -eq 0 ]
