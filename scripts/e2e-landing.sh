#!/usr/bin/env bash
# E2E de la landing en navegador real (Chrome headless) sobre el build estático.
# Sirve frontend/out, mide desbordamiento horizontal en varios viewports y captura pantalla.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/frontend/out"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=8899
SHOTS="${1:-$ROOT/.e2e}"

[ -d "$OUT" ] || { echo "No existe $OUT — corre 'npm run build' en frontend/"; exit 2; }
[ -x "$CHROME" ] || { echo "No encuentro Chrome"; exit 2; }
mkdir -p "$SHOTS"

# Sonda: mide el desbordamiento horizontal dentro de IFRAMES de ancho exacto.
# Chrome headless en macOS impone un ancho MINIMO de ventana de 500px, asi que
# --window-size=390 NO produce un viewport de 390 y daria un falso PASS justo en
# el ancho donde se reporto el bug. El iframe si respeta el ancho pedido.
cat > "$OUT/_sonda.html" <<'PROBE'
<!doctype html><meta charset="utf-8"><title>midiendo</title>
<style>html,body{margin:0}iframe{border:0;display:block;height:800px}</style>
<body>
<script>
const ANCHOS=[320,360,390,414,768,1024,1440];
const res=[];
let pendientes=ANCHOS.length;
ANCHOS.forEach(w=>{
  const f=document.createElement('iframe');
  f.width=w; f.src='index.html';
  f.onload=()=>{
    setTimeout(()=>{
      try{
        const d=f.contentDocument, win=f.contentWindow;
        const vw=win.innerWidth;
        const sw=Math.max(d.documentElement.scrollWidth,d.body.scrollWidth);
        const culpables=[...d.querySelectorAll('*')].filter(el=>{
          const r=el.getBoundingClientRect();
          return r.width>0 && (r.right>vw+1 || r.left<-1);
        }).slice(0,4).map(el=>el.tagName.toLowerCase()+(typeof el.className==='string'&&el.className?'.'+el.className.trim().split(/\s+/).slice(0,2).join('.'):''));
        res.push(w+':vw='+vw+',sw='+sw+','+(sw>vw?'DESBORDA['+(culpables.join('/')||'?')+']':'ok'));
      }catch(e){res.push(w+':error='+e.message)}
      if(--pendientes===0){res.sort((a,b)=>parseInt(a)-parseInt(b));document.title='MEDIDA '+res.join(' | ')}
    },1500);
  };
  document.body.appendChild(f);
});
</script>
PROBE

python3 -m http.server $PORT --directory "$OUT" >/dev/null 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null; rm -f "$OUT/_sonda.html"' EXIT
for i in $(seq 1 30); do curl -sf "http://localhost:$PORT/index.html" >/dev/null && break; done

printf '\n\033[1mDesbordamiento horizontal por ancho de viewport\033[0m\n'
dom=$("$CHROME" --headless --disable-gpu --hide-scrollbars --no-sandbox \
      --force-device-scale-factor=1 --virtual-time-budget=15000 \
      --window-size=1600,1000 --dump-dom "http://localhost:$PORT/_sonda.html" 2>/dev/null)
titulo=$(printf '%s' "$dom" | grep -o '<title>MEDIDA[^<]*' | sed 's/<title>MEDIDA //')
if [ -z "$titulo" ]; then
  printf '  \033[31mno se pudo medir\033[0m\n'
else
  printf '%s' "$titulo" | tr '|' '\n' | while read -r linea; do
    [ -z "$linea" ] && continue
    ancho=${linea%%:*}
    if printf '%s' "$linea" | grep -q 'DESBORDA'; then
      printf '  \033[31mFAIL\033[0m  %4spx  %s\n' "$ancho" "${linea#*:}"
    elif printf '%s' "$linea" | grep -q 'error='; then
      printf '  \033[33m????\033[0m  %4spx  %s\n' "$ancho" "${linea#*:}"
    else
      printf '  \033[32mPASS\033[0m  %4spx  %s\n' "$ancho" "${linea#*:}"
    fi
  done
fi

# Capturas. Aqui el ancho minimo de Chrome no importa: son para revision visual.
printf '\n\033[1mCapturas\033[0m\n'
for par in "movil-500 500 2600" "tablet-768 768 2200" "escritorio-1440 1440 2000"; do
  set -- $par
  "$CHROME" --headless --disable-gpu --hide-scrollbars --no-sandbox \
    --force-device-scale-factor=1 --virtual-time-budget=8000 \
    --window-size="$2,$3" --screenshot="$SHOTS/$1.png" \
    "http://localhost:$PORT/index.html" >/dev/null 2>&1
  printf '  %s  ->  %s/%s.png\n' "$1" "$SHOTS" "$1"
done

# Peso de lo que descarga el visitante en la primera vista
printf '\n\033[1mPeso del build\033[0m\n'
printf '  total out/: %s\n' "$(du -sh "$OUT" | cut -f1)"
printf '  index.html: %s\n' "$(du -h "$OUT/index.html" | cut -f1)"
printf '  JS+CSS:     %s\n' "$(du -sh "$OUT/_next" | cut -f1)"
