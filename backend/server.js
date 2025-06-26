const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 4000;

app.use(cors());

app.get('/api/coverage', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'coverage.json'));
});

app.get('/api/teams', (req, res) => {
  res.sendFile(path.join(__dirname, 'data', 'teams.json'));
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
