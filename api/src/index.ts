import { createServer } from "node:http";

const port = Number(process.env.PORT ?? 3000);

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");

  if (req.method === "GET" && url.pathname === "/api/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, time: new Date().toISOString() }));
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not found" }));
});

server.listen(port, () => {
  console.log(`api listening on :${port}`);
});

// docker stop 发的是 SIGTERM，收到后关掉监听再退出
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
