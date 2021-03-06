import express from 'express';
import { router } from './routes';

const app = express();
const port = process.env.PORT || 5000;

app.use(router);
app.listen(port, () => {
  console.log(`App rodando na porta: ${port}`);
});
