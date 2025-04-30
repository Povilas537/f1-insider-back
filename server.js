// server.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Hello, F1 News Backend!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
