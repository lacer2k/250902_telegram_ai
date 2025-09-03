import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the project's root directory.
// In a real-world scenario, you'd typically serve from a 'dist' or 'public' directory after a build step.
app.use(express.static(__dirname));

// API endpoint to get the Google API key
app.get('/api/google-api-key', (req, res) => {
  const apiKey = process.env.API_KEY;
  if (apiKey) {
    res.json({ apiKey });
  } else {
    res.status(500).json({ error: 'Google API key is not configured on the server.' });
  }
});

// For any other request, serve index.html
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
