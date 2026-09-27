#!/usr/bin/env bash
# Verificación ejecutable de changes/rediseno-landing-octubre.
# Cada bloque corresponde a un Scenario del spec delta en
# changes/rediseno-landing-octubre/specs/landing-publica/spec.md
set -uo pipefail
OUT="${1:-frontend/out}"
fail=0; pass=0

ok()   { printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass+1)); }
bad()  { printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail+1)); }
head_() { printf '\n\033[1m%s\033[0m\n' "$1"; }

# ausente <patron> <descripcion>  -> falla si el patron aparece en out/
ausente() {
  local n; n=$(grep -roF "$1" "$OUT" --include='*.html' --include='*.js' --include='*.txt' 2>/dev/null | wc -l | tr -d ' ')
  [ "$n" -eq 0 ] && ok "$2" || bad "$2 (aparece $n veces)"
}
# presente <patron> <descripcion>  -> en cualquier artefacto del build
presente() {
  grep -rqF "$1" "$OUT" --include='*.html' --include='*.js' --include='*.txt' 2>/dev/null \
    && ok "$2" || bad "$2 (no aparece)"
}
# visible <patron> <descripcion>  -> SOLO en el HTML servido; un dato que vive
# unicamente en un chunk JS no esta renderizado y no cuenta como visible
visible() {
  grep -qF "$1" "$OUT/index.html" 2>/dev/null \
    && ok "$2" || bad "$2 (no esta en el HTML servido)"
}
# ausente_visible <patron> <descripcion>  -> falla solo si aparece en el HTML servido.
# Util cuando el dato SI debe existir en el bundle (p.ej. el copy en ingles, que el
# selector EN necesita) pero NO debe estar pre-renderizado.
ausente_visible() {
  local n; n=$(grep -oF "$1" "$OUT/index.html" 2>/dev/null | wc -l | tr -d ' ')
  [ "$n" -eq 0 ] && ok "$2" || bad "$2 (aparece $n veces en index.html)"
}
# archivo <ruta> <descripcion>
archivo() { [ -f "$OUT/$1" ] && ok "$2" || bad "$2 (falta $1)"; }

[ -d "$OUT" ] || { echo "No existe $OUT — corre 'npm run build' en frontend/ primero"; exit 2; }

head_ "Requirement: Datos de contacto correctos"
ausente "995090170"          "el numero viejo 995090170 no aparece"
ausente "+593 99 509 0170"   "el numero viejo formateado no aparece"
presente "593978923586"      "el numero oficial 593978923586 si aparece"

head_ "Requirement: Afirmaciones sostenibles"
# Las cifras se buscan como aparecían en el copy ("99.2% de precisión", "85% reducción"):
# con el % y seguidas de espacio. Así no dan falso positivo una clase como w-[85%] ni
# los números de un trazado SVG.
for c in "99.2%" "85% " "40% " "30% " "95% "; do ausente "$c" "cifra inventada '$c' retirada"; done
ausente "SOC 2"          "sello SOC 2 retirado"
ausente "GDPR"           "sello GDPR retirado"
ausente "Empresa líder"  "superlativo 'Empresa líder' retirado"

head_ "Requirement: Idioma por defecto en español"
ausente_visible "Built for the work your team" "el HTML pre-renderizado no sale en ingles"
presente        "Built for the work your team" "el copy en ingles viaja en el bundle (el selector EN lo necesita)"

head_ "Requirement: Identidad geográfica ecuatoriana"
# "MX" solo aparecia por Mexico (addressCountry y es_MX): tras el cambio no debe quedar
# ninguna ocurrencia, en ninguna forma de escapado del payload RSC.
ausente  "MX"        "ninguna ocurrencia de MX (addressCountry ni es_MX)"
presente "es_EC"     "locale es_EC presente"
presente "Quito"     "la localidad Quito esta declarada"
ausente  "México"    "ninguna referencia a Mexico"

head_ "Requirement: Correo corporativo visible"
visible "contacto@aiworks.lat" "el correo corporativo se renderiza en el HTML"

head_ "Requirement: Ausencia de formulario sin destino"
ausente "Formulario de contacto" "el copy muerto del formulario se elimino"
ausente "Contact form"           "el copy muerto del formulario en ingles se elimino"

head_ "Requirement: Integridad horizontal del layout"
ausente "translate-x-10" "ningun bloque embarca traslacion horizontal"
grep -rq "overflow-x" "$OUT"/_next/static/chunks/*.css 2>/dev/null \
  && ok "existe una regla overflow-x como red de seguridad" \
  || bad "no hay ninguna regla overflow-x en el CSS compilado"

head_ "Requirement: Escritura del nombre de marca"
ausente "AIWorks" "variante AIWorks retirada"
ausente "AIWORKS" "variante AIWORKS retirada"

head_ "Requirement: Vista previa al compartir"
archivo "og-image.png"  "og-image.png existe"
archivo "icon-192.png"  "icon-192.png existe"
archivo "icon-512.png"  "icon-512.png existe"

head_ "Peso del bundle"
if [ -f "$OUT/videos/landing.mp4" ]; then
  bad "el video de 60 MB sigue en el build"
else
  ok "el video de 60 MB no esta en el build"
fi

printf '\n\033[1mResultado: %d pass, %d fail\033[0m\n' "$pass" "$fail"
[ "$fail" -eq 0 ]
