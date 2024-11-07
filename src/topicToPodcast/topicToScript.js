import OpenAI from 'openai';
import 'dotenv/config'

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
  });
  
export default async function generateScript(tema){
    console.log("el tema es",tema)
    const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [
        {
        role: "system",
        content: "You are a helpful assistant designed to output JSON.",
        },
        { role: "user", content: `Genera un script en español para un podcast donde estan interactuando una mujer y un hombre. El podcast es de parte de UVG Altiplano. - El tema es:${tema}. - Please respond only in the format {"dialogue":[{sex:"",message:""}]} where sex can be only male and female` },
    ],
    max_tokens: 4000,  // Límite máximo de tokens en la respuesta
        //temperature: 0.7,
    response_format: { type: "json_object" },
    });

    const jsonObject = JSON.parse(response.choices[0].message["content"]);
    console.log(jsonObject)
    return jsonObject["dialogue"];
    return array;
}