import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer } from 'ws';
import { createWebSocketHandler } from './ws-handler';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Attach WebSocket server
  const wss = new WebSocketServer({ noServer: true });
  createWebSocketHandler(wss);

  // Handle upgrade requests for WebSocket
  server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url!, true);

    if (pathname === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  server.listen(port, () => {
    console.log(`\n  ┌─────────────────────────────────────────┐`);
    console.log(`  │  SIMULATION THEORY v0.1.0                │`);
    console.log(`  │  ─────────────────────────────────────── │`);
    console.log(`  │  HTTP: http://${hostname}:${port}        │`);
    console.log(`  │  WS:   ws://${hostname}:${port}/ws       │`);
    console.log(`  │  Mode: ${dev ? 'development' : 'production'}                      │`);
    console.log(`  └─────────────────────────────────────────┘\n`);
  });
});
