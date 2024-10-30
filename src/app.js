import express from 'express'
import router from './controller/createPodcastController.js';
const app = express();
const PORT = 3000;


app.use(express.json());

app.use(router);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
