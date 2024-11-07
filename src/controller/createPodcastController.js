import express from 'express';
import fs from 'fs/promises';
import { TopicToPodcast } from '../topicToPodcast/initializer.js';

const router = express.Router();

router.get('/podcast', async (req, res) => {
    const { topic } = req.query; 

    if (!topic) {
        return res.status(400).send('Falta el topic del podcast');
    }
    try {
        //Generar podcast 
        const podcast = new TopicToPodcast(topic);
        await podcast.generate();
        const mp3Path = podcast.getPath();

        //descargar
        const mp3File = await fs.readFile(mp3Path)
        res.set('Content-Type', 'audio/mpeg');
        res.set('Content-Disposition', 'attachment; filename="tu_podcast_'+topic+'.mp3"');
        res.send(mp3File);
        
    } catch (error) {
        console.error('Error al generar el podcast:', error);
        res.status(500).send('Ha ocurrido un error');
    }
});


export default router;
