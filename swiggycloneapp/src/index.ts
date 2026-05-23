import { Server } from './server';

const server = new Server();

server.app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});
