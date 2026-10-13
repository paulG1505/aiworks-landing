#!/usr/bin/env bash
# Headless-Chrome E2E over the static build: horizontal overflow at several widths plus screenshots.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/frontend/out"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=8899
SHOTS="${1:-$ROOT/.e2e}"

[ -d "$OUT" ] || { echo "$OUT does not exist: run 'npm run build' in frontend/"; exit 2; }
[ -x "$CHROME" ] || { echo "Chrome not found"; exit 2; }
mkdir -p "$SHOTS"

# Probed inside iframes: headless Chrome on macOS enforces a 500px minimum window width.
cat > "$OUT/_probe.html" <<'PROBE'
<!doctype html><meta charset="utf-8"><title>measuring</title>
<style>html,body{margin:0}iframe{border:0;display:block;height:800px}</style>
<body>
<script>
const WIDTHS=[320,360,390,414,768,1024,1440];
const res=[];
let pending=WIDTHS.length;
WIDTHS.forEach(w=>{
  const f=document.createElement('iframe');
  f.width=w; f.src='index.html';
  f.onload=()=>{
    setTimeout(()=>{
      try{
        const d=f.contentDocument, win=f.contentWindow;
        const vw=win.innerWidth;
        const sw=Math.max(d.documentElement.scrollWidth,d.body.scrollWidth);
        const culprits=[...d.querySelectorAll('*')].filter(el=>{
          const r=el.getBoundingClientRect();
          return r.width>0 && (r.right>vw+1 || r.left<-1);
        }).slice(0,4).map(el=>el.tagName.toLowerCase()+(typeof el.className==='string'&&el.className?'.'+el.className.trim().split(/\s+/).slice(0,2).join('.'):''));
        res.push(w+':vw='+vw+',sw='+sw+','+(sw>vw?'OVERFLOW['+(culprits.join('/')||'?')+']':'ok'));
      }catch(e){res.push(w+':error='+e.message)}
      if(--pending===0){res.sort((a,b)=>parseInt(a)-parseInt(b));document.title='MEASURED '+res.join(' | ')}
    },1500);
  };
  document.body.appendChild(f);
});
</script>
PROBE

python3 -m http.server $PORT --directory "$OUT" >/dev/null 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null; rm -f "$OUT/_probe.html"' EXIT
for i in $(seq 1 30); do curl -sf "http://localhost:$PORT/index.html" >/dev/null && break; done

printf '\n\033[1mDesbordamiento horizontal por width de viewport\033[0m\n'
dom=$("$CHROME" --headless --disable-gpu --hide-scrollbars --no-sandbox \
      --force-device-scale-factor=1 --virtual-time-budget=15000 \
      --window-size=1600,1000 --dump-dom "http://localhost:$PORT/_probe.html" 2>/dev/null)
result=$(printf '%s' "$dom" | grep -o '<title>MEASURED[^<]*' | sed 's/<title>MEASURED //')
if [ -z "$result" ]; then
  printf '  \033[31mcould not measure\033[0m\n'
else
  printf '%s' "$result" | tr '|' '\n' | while read -r row; do
    [ -z "$row" ] && continue
    width=${row%%:*}
    if printf '%s' "$row" | grep -q 'OVERFLOW'; then
      printf '  \033[31mFAIL\033[0m  %4spx  %s\n' "$width" "${row#*:}"
    elif printf '%s' "$row" | grep -q 'error='; then
      printf '  \033[33m????\033[0m  %4spx  %s\n' "$width" "${row#*:}"
    else
      printf '  \033[32mPASS\033[0m  %4spx  %s\n' "$width" "${row#*:}"
    fi
  done
fi

printf '\n\033[1mScreenshots\033[0m\n'
for par in "mobile-500 500 2600" "tablet-768 768 2200" "desktop-1440 1440 2000"; do
  set -- $par
  "$CHROME" --headless --disable-gpu --hide-scrollbars --no-sandbox \
    --force-device-scale-factor=1 --virtual-time-budget=8000 \
    --window-size="$2,$3" --screenshot="$SHOTS/$1.png" \
    "http://localhost:$PORT/index.html" >/dev/null 2>&1
  printf '  %s  ->  %s/%s.png\n' "$1" "$SHOTS" "$1"
done

printf '\n\033[1mBuild weight\033[0m\n'
printf '  total out/: %s\n' "$(du -sh "$OUT" | cut -f1)"
printf '  index.html: %s\n' "$(du -h "$OUT/index.html" | cut -f1)"
printf '  JS+CSS:     %s\n' "$(du -sh "$OUT/_next" | cut -f1)"
