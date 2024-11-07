import generateAudio from "./scriptToAudio.js";
import generateScript from "./topicToScript.js"
export class TopicToPodcast{
    topic = null;
    audioPath = null;
    constructor(topic){
        this.topic = topic;
    }

    async generate(){
        console.log(`Creando podcast sobre ${this.topic}...`);
        //generar script
        const scriptArray = await generateScript(this.topic);

        //generar audio
        this.audioPath = await generateAudio(scriptArray);
        console.log(`Podcast sobre ${this.topic} guardado en ${this.audioPath}`);
    }

    getPath(){
        return this.audioPath;
    }
}