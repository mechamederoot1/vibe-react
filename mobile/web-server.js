const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath;

  // Route to app demo or instructions
  if (req.url === '/app' || req.url === '/') {
    filePath = path.join(__dirname, 'web', 'app.html');
  } else if (req.url === '/instructions') {
    filePath = path.join(__dirname, 'web', 'index.html');
  } else {
    filePath = path.join(__dirname, 'web', 'app.html'); // Default to app
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Demo server running at http://localhost:${PORT}`);
  console.log('Metro bundler running at http://localhost:8081');
});
