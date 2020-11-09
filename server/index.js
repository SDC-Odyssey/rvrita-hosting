const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
  return;
}

const app = require('./server');
const PORT = 3006;
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
