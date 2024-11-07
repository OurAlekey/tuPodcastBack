import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const client = new textToSpeech.TextToSpeechClient({
    keyFilename: path.join(process.cwd(), './keys/podcast-440120-4eabc308ae88.json'),
});

export default async function generateAudio(array) {


    if (!array || !Array.isArray(array) || array.length === 0) {
        throw new Error('Invalid Array');
    }

    // Define la ruta del directorio y el archivo
    const outputDir = path.join(process.cwd(), 'output');
    const finalOutputPath = path.join(outputDir, `podcast-${uuidv4()}.mp3`);

    // Crea el directorio "output" si no existe
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Crea el flujo de escritura para el archivo
    const writeStream = fs.createWriteStream(finalOutputPath, { flags: 'a' });

    for (const item of array) {

        const config = setVoiceConfig(item.sex,item.message);
        console.log(config);
        const [response] = await client.synthesizeSpeech(config);
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

function setVoiceConfig(sex,text){
    const config = {
        input: { text: `${text}` },
        voice: {
            languageCode: 'es-US',
            name: sex === 'male' ? 'es-US-Studio-B' : 'es-US-Journey-F',
            ssmlGender: sex === 'male' ? 'MALE' : 'FEMALE',
        },
        audioConfig: {
            audioEncoding: 'MP3',
            //speakingRate: 1.0,
            //pitch: 0.0,
        },
    };

    if(sex=='male'){
        config.audioConfig["speakingRate"] = 1.25
    }
    return config;
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
