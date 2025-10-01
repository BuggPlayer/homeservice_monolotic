import { createServer } from 'http';
import app from './src/app';
import { config } from './src/config';
import { SocketService } from './src/services/SocketService';

const server = createServer(app);
const PORT = config.PORT;

// Initialize Socket.IO
const socketService = new SocketService(server);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Fixer API server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 Socket.IO enabled for real-time communication`);
});

// Export socket service for use in other modules
export { socketService };

export default app;
