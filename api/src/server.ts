import app from "./app";
import Logger from "./utils/logger";
import { createServer } from 'http';
import { initializeWebSocket } from './services/websocket'; 

const port = process.env.PORT || 5000;

const server = createServer(app);

// Initialize WebSocket server using the HTTP server
initializeWebSocket(server);

// Start listening for HTTP and WebSocket connections
server.listen(port, () => Logger.info(`Server running at http://127.0.0.1:${port}`));