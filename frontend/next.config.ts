import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    // Next 16.1 guarda por defecto una caché de Turbopack en disco para `next dev`, que
    // sobrevive a reinicios. En este proyecto sirvió dos veces un globals.css viejo (la
    // cinta sin animar, el petróleo y el modo oscuro sin aplicar). Se desactiva: el
    // arranque en frío es un poco más lento, pero lo que se ve es siempre lo que hay.
    turbopackFileSystemCacheForDev: false,
  },
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
