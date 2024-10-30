import express from 'express';
import fs from 'fs/promises';
import { createPodcast } from '../services/createPodcastService.js';

const router = express.Router();

router.get('/podcast/:tema', async (req, res) => {
    const { tema } = req.params; 

    if (!tema) {
        return res.status(400).send('Falta el tema del podcast');
    }
    try {
        const mp3Path = await createPodcast(tema); 
        console.log(`Podcast sobre ${tema} creado en ${mp3Path}`);
        const mp3File = await fs.readFile(mp3Path)
        res.set('Content-Type', 'audio/mpeg');
        res.set('Content-Disposition', 'attachment; filename="tu_podcast_'+tema+'.mp3"');
        res.send(mp3File);
    } catch (error) {
        console.error('Error al convertir el audio:', error);
        res.status(500).send('Error al convertir el array en MP3');
    }
});


export default router;
