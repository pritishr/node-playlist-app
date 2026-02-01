const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check (K8s readiness/liveness)
app.get('/health', (req, res) => {
  console.log(JSON.stringify({
    level: "info",
    message: "Health check successful"
  }));
  res.status(200).json({ status: "UP" });
});

// Sample API
app.get('/api/hello', (req, res) => {
  console.log(JSON.stringify({
    level: "info",
    message: "Hello API called",
    timestamp: new Date().toISOString()
  }));
  res.json({
    message: "Hello from Node.js app!",
    hostname: require('os').hostname()
  });
});

// Graceful shutdown (important for K8s)
process.on('SIGTERM', () => {
  console.log(JSON.stringify({
    level: "info",
    message: "SIGTERM received. Shutting down gracefully..."
  }));
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(JSON.stringify({
    level: "info",
    message: `Server started on port ${PORT}`
  }));
});
