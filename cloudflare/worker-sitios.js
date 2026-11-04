// Worker de Cloudflare para los sitios web de Ventor (dominio propio + SEO).
// Una sola vez: se despliega aquí y atiende los dominios de TODOS los clientes.
const GH = "https://martincv928-commits.github.io/ventor-factura"; // donde están sitio.html, tienda.html, app/, etc.
const API = "https://rhdsbymoxllfegderalu.supabase.co/functions/v1/ventor-sitio";
const KEY = "sb_publishable_p0-ZWH8XPPyC_KSTOzG9vw_OENVq8o-";

const api = async (body) => {
  const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json", apikey: KEY }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, j };
};
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    // www -> sin www
    if (url.hostname.toLowerCase().startsWith("www.")) { url.hostname = host; return Response.redirect(url.toString(), 301); }

    // ¿de qué empresa es este dominio? (cache 5 min)
    const cache = caches.default;
    const kCod = new Request("https://cache.local/dom/" + host);
    let codigo = null;
    const hit = await cache.match(kCod);
    if (hit) codigo = await hit.text();
    if (!codigo) {
      const r = await api({ accion: "dominio", host });
      if (!r.ok || !r.j.codigo) return new Response("Sitio no encontrado", { status: 404 });
      codigo = r.j.codigo;
      ctx.waitUntil(cache.put(kCod, new Response(codigo, { headers: { "Cache-Control": "max-age=300" } })));
    }

    const path = url.pathname;

    // Archivos del sistema (tienda, portal, app) -> se sirven desde GitHub Pages
    if (/^\/(app\/|tienda\.html|portal\.html|proveedor\.html|agenda\.html|cotizacion\.html|distribuidor\.html|encuesta\.html|seguimiento\.html)/.test(path)) {
      const u = GH + path + url.search;
      const r = await fetch(u, { cf: { cacheTtl: 300 } });
      let body = r.body;
      const ct = r.headers.get("content-type") || "";
      // tienda/portal... reciben el código de empresa para no depender de ?e=
      if (ct.includes("text/html") && /^\/(tienda|portal|proveedor|agenda|cotizacion|distribuidor|encuesta|seguimiento)\.html/.test(path)) {
        let t = await r.text();
        t = t.replace("<head>", "<head><script>window.__E=" + JSON.stringify(codigo) + "</script>");
        return new Response(t, { status: r.status, headers: { "content-type": "text/html; charset=utf-8" } });
      }
      return new Response(body, { status: r.status, headers: r.headers });
    }

    if (path === "/robots.txt") {
      return new Response("User-agent: *\nAllow: /\nDisallow: /app/\nSitemap: https://" + host + "/sitemap.xml\n", { headers: { "content-type": "text/plain" } });
    }
    if (path === "/sitemap.xml") {
      const r = await api({ accion: "sitemap", e: codigo, host });
      return new Response(r.j.xml || "", { status: r.ok ? 200 : 404, headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "max-age=3600" } });
    }
    if (/\.[a-z0-9]{2,5}$/i.test(path)) { // otros archivos estáticos
      return fetch(GH + path, { cf: { cacheTtl: 300 } });
    }

    // Páginas del sitio: sitio.html + SEO en el servidor
    const ruta = decodeURIComponent(path).replace(/^\/+|\/+$/g, "");
    const [seoR, pagR] = await Promise.all([
      api({ accion: "seo", e: codigo, host, ruta }),
      fetch(GH + "/sitio.html", { cf: { cacheTtl: 300 } }),
    ]);
    if (!pagR.ok) return new Response("Sitio en mantenimiento", { status: 503 });
    let html = await pagR.text();
    const s = seoR.j || {};
    if (!seoR.ok || !s.ok) return new Response(s.error || "Sitio no disponible", { status: seoR.ok ? 200 : 404 });
    const head =
      "<script>window.__E=" + JSON.stringify(codigo) + "</script>" +
      "<title>" + esc(s.title) + "</title>" +
      '<meta name="description" content="' + esc(s.desc) + '">' +
      '<link rel="canonical" href="https://' + host + (ruta ? "/" + esc(ruta) : "/") + '">' +
      '<meta property="og:title" content="' + esc(s.title) + '"><meta property="og:description" content="' + esc(s.desc) + '">' +
      '<meta property="og:type" content="website"><meta property="og:site_name" content="' + esc(s.nombre) + '">' +
      (s.og ? '<meta property="og:image" content="' + esc(s.og) + '">' : "") +
      '<meta name="twitter:card" content="summary_large_image">' +
      (s.jsonld || []).map((o) => '<script type="application/ld+json">' + JSON.stringify(o).replace(/</g, "\\u003c") + "</script>").join("");
    html = html.replace(/<title>[^<]*<\/title>/, "").replace("<head>", "<head>" + head);
    // Contenido para buscadores dentro de #app (se reemplaza al cargar el sitio)
    html = html.replace('<div id="app"><div class="cargando">Cargando…</div></div>', '<div id="app">' + s.html + "</div>");
    return new Response(html, { status: s.status || 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60" } });
  },
};
