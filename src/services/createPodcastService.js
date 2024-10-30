import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const client = new textToSpeech.TextToSpeechClient({
    keyFilename: path.join(process.cwd(), 'keys/podcast-440120-4eabc308ae88.json'),
});

export async function createPodcast(tema) {

    console.log(`Creando podcast sobre ${tema}...`);

    const array = [{
      genero: "F",
      message: "Hola Eduardo, hoy estamos aquí para abrir nuestro primer podcast."
  },
  {
      genero: "M",
      message: "¡Hola! Estoy emocionado de empezar este viaje juntos."
  },
  {
      genero: "F",
      message: "Sí, y hoy vamos a hablar sobre nuestras películas favoritas."
  },
  {
      genero: "M",
      message: "Perfecto, tengo algunas en mente que estoy seguro que te encantarán."
  }]

    if (!array || !Array.isArray(array) || array.length === 0) {
        throw new Error('El array no es válido');
    }

    const finalOutputPath = path.join(process.cwd(), `output/podcast-${uuidv4()}.mp3`);
    const writeStream = fs.createWriteStream(finalOutputPath, { flags: 'a' }); 
    for (const item of array) {
        const ssmlMessage = textoANatualSSML(item.message);
        if (!ssmlMessage) {
            continue;
        }

        const request = {
            input: { ssml: `<speak>${ssmlMessage}</speak>` },
            voice: {
                languageCode: 'es-ES',
                name: item.genero === 'M' ? 'es-ES-Studio-F' : 'es-ES-Standard-C',
                ssmlGender: item.genero === 'M' ? 'MALE' : 'FEMALE',
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 1.0,
                pitch: 0.0,
            },
        };

        const [response] = await client.synthesizeSpeech(request);
        await writeToFile(writeStream, response.audioContent);
    }

    return new Promise((resolve, reject) => {
        writeStream.end(() => {
            resolve(finalOutputPath);
        });
        writeStream.on('error', (err) => {
            reject(err);
        });
    });

}

function writeToFile(writeStream, audioContent) {
    return new Promise((resolve, reject) => {
        writeStream.write(audioContent, 'binary', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function textoANatualSSML(texto) {
    return texto
        .replace(/,/g, '<break time="300ms"/>')
        .replace(/\./g, '<break time="500ms"/>')
        .replace(/¡/g, '<break time="300ms"/>')
        .replace(/!/g, '<break time="500ms"/>')
        .replace(/¿/g, '<break time="300ms"/>')
        .replace(/\?/g, '<break time="500ms"/>');
}
