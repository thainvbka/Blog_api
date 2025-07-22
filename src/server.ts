import express from 'express';
import config from './config';

const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'Hello world!',
  });
});

app.listen(config.PORT, () => {
  console.log(`Server running: http://localhost:${config.PORT}`);
});
