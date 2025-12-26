import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.json({ status: 'Backend running' });
});

app.listen(3000, () => {
  console.log(' Server running on port 3000');
});
