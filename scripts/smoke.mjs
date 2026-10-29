import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:net";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

// Exercise the actual production server without interrupting an existing dev server.
const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const manifest = JSON.parse(await readFile(path.join(root, ".next/prerender-manifest.json"), "utf8"));
const routes = Object.keys(manifest.routes).filter(route => !route.startsWith("/_") && !route.includes("[") && !/\.[a-z]+$/i.test(route));
for (const route of ["/", "/safety", "/fleet", "/fleet/portal", "/fleet/portal/login", "/fleet/portal/settings/support/sr-202612"]) {
  assert(routes.includes(route), `Critical route is absent from production build: ${route}`);
}

const reservation = createServer();
await new Promise((resolve, reject) => { reservation.once("error", reject); reservation.listen(0, "127.0.0.1", resolve); });
const { port } = reservation.address();
await new Promise(resolve => reservation.close(resolve));
const base = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(port)], { cwd: root, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
let logs = "";
let launchError;
server.on("error", error => { launchError = error; });
for (const stream of [server.stdout, server.stderr]) stream.on("data", chunk => { logs = (logs + chunk).slice(-4000); });

try {
  let ready = false;
  for (let i = 0; i < 150; i++) {
    if (launchError) throw launchError;
    if (server.exitCode !== null) throw new Error(`Production server exited: ${logs}`);
    try { const response = await fetch(base, { signal: AbortSignal.timeout(1000) }); if (response.ok) { ready = true; break; } } catch { /* Server is starting. */ }
    await delay(200);
  }
  assert(ready, `Production server did not become ready: ${logs}`);

  let checked = 0;
  for (const route of routes) {
    const response = await fetch(`${base}${route}`, { redirect: "manual", signal: AbortSignal.timeout(15000) });
    if (route === "/fleet/apply") {
      assert.equal(response.status, 307, "Legacy fleet application must redirect");
      assert.equal(response.headers.get("location"), "/fleet/portal/login");
    } else {
      assert.equal(response.status, 200, `Route failed: ${route}`);
      const html = await response.text();
      assert(html.length > 500 && !html.includes("Application error: a server-side exception"), `Invalid page response: ${route}`);
      if (route === "/fleet") assert(html.includes("/fleet/portal/login"), "Fleet CTA must link to portal login");
      if (route === "/fleet/portal/login") assert(html.includes("Explore the fleet portal"), "Login must expose the explicit preview entry");
    }
    checked++;
  }

  const missing = await fetch(`${base}/fleet/portal/does-not-exist`, { signal: AbortSignal.timeout(15000) });
  assert.equal(missing.status, 404, "Unknown portal paths must return 404");
  const assets = JSON.parse(await readFile(path.join(root, "src/lib/fleet-portal-assets.json"), "utf8"));
  const files = [...new Set(Object.values(assets).flatMap(Object.values))];
  for (const file of files) {
    assert(file.startsWith("/images/fleet-portal/"), `Unexpected runtime asset source: ${file}`);
    assert((await stat(path.join(root, "public", file))).size > 0, `Empty asset: ${file}`);
  }
  const portalCount = routes.filter(route => route.startsWith("/fleet/portal")).length;
  console.log(`PASS: ${checked} production routes (${portalCount} fleet portal routes), Fleet CTA/redirect, unknown-route 404, and ${files.length} local assets.`);
} finally {
  server.kill();
}
