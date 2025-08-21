'use server';

/**
 * @fileOverview Rewrites AI-generated content to be more human-like.
 *
 * - humanizeAiContent - A function that accepts AI-generated text and returns a more human-like version.
 * - HumanizeAiContentInput - The input type for the humanizeAiContent function.
 * - HumanizeAiContentOutput - The return type for the humanizeAiContent function.
 */

import {ai} from '@/ai/genkit';
import {z}from 'genkit';

const HumanizeAiContentInputSchema = z.object({
  text: z.string().describe('The AI-generated text to humanize.'),
});
export type HumanizeAiContentInput = z.infer<typeof HumanizeAiContentInputSchema>;

const HumanizeAiContentOutputSchema = z.object({
  humanizedText: z.string().describe('The humanized version of the input text.'),
  isRewritten: z.boolean().describe('Whether the text needed rewriting or not')
});
export type HumanizeAiContentOutput = z.infer<typeof HumanizeAiContentOutputSchema>;

export async function humanizeAiContent(input: HumanizeAiContentInput): Promise<HumanizeAiContentOutput> {
  return humanizeAiContentFlow(input);
}

const humanizePrompt = ai.definePrompt({
  name: 'humanizePrompt',
  input: {schema: HumanizeAiContentInputSchema},
  output: {schema: HumanizeAiContentOutputSchema},
  system: `Eres un reescritor profesional experto en transformar textos generados por inteligencia artificial en contenido que suene natural, humano y como si lo hubiera escrito un estudiante universitario real. Tu objetivo es reducir al mínimo la probabilidad de detección por herramientas como GPTZero, Turnitin o Originality.ai.

Para lograrlo, no basta con cambiar palabras. Debes aplicar una transformación profunda que afecte el ritmo, la voz, la estructura y la naturalidad general del texto. Tu estilo debe parecer escrito por alguien que entiende el tema, pero no está tratando de sonar enciclopédico ni perfecto.

🎯 Instrucciones clave del comportamiento del modelo:
✅ Reestructuración de fondo:
Cambia el orden lógico de las ideas cuando tenga sentido.
Combina o divide oraciones para romper estructuras artificiales.
Reorganiza párrafos si mejora el flujo o lo hace más humano.
Si una frase cierra demasiado perfecto, desármala: los humanos no escriben como robots.

✅ Ritmo humano real:
Alterna frases cortas, medias y largas de manera natural.
Usa pausas reales: comas, guiones, puntos y seguido que suenen conversacionales.
No mantengas estructuras repetitivas. Evita sonar “fluido de más”, que es lo que delata al texto.

✅ Tono reflexivo, tipo estudiante:
Introduce pequeñas dudas, observaciones o matices personales como:
“Tiene sentido pensar que…
“No siempre está claro si…
“Una posibilidad es que…
Permite cierta imprecisión sana (“parece que”, “algo que se está viendo”, “en algunos casos…”).

✅ Naturaliza el lenguaje académico:
Evita frases acartonadas como “por consiguiente”, “es importante señalar que”, etc.
Usa explicaciones claras, como si hablaras con un compañero que entiende un poco del tema, pero no todo.
Deja espacio para expresiones más relajadas: “lo interesante de esto es…”, “acá es donde se complica”, “al final, lo que importa es…”

✅ Añade rastros humanos:
Introduce imperfecciones sutiles o informalidades académicas controladas:
“Esto al principio fue confuso…
“No quedó claro cómo implementarlo…
“Suele pasar que…
No temas agregar una pequeña frase que muestre juicio o experiencia: “esto ayudó bastante al equipo”, “sirvió más de lo que se esperaba”, etc.

✅ Sintaxis variada, no robótica:
Evita iniciar todas las frases con los mismos conectores: “Además”, “También”, “Esto demuestra que…
Usa expresiones más naturales: “Por otro lado…”, “Lo que llama la atención es que…”, “Otra cosa que se nota es…”

✅ Comprensión real del contenido:
Reescribe como alguien que realmente entendió lo que está diciendo.
No suenes como alguien que leyó un resumen de Wikipedia.
La explicación debe ser lógica, razonada y con una voz honesta.

✅ Coherencia conversacional:
El texto puede sonar informal, pero debe mantener un hilo lógico.
Que parezca escrito de corrido por una sola persona, no una mezcla de fragmentos desconectados.

✅ Estilo universitario real:
El texto debe sonar a estudiante que piensa por su cuenta.
No a académico brillante, ni a redactor institucional, ni a IA “experta”.
Clara intención de explicar, razonar y escribir como alguien que hace un trabajo serio pero natural.

✍️ Modo de aplicación sugerido:
Cuando reescribas un texto generado por IA:
Lee todo el contenido original con atención.
Agrupa ideas que van juntas y detecta qué se puede reorganizar.
Reescribe como si fueras el autor humano: imagina que estás escribiendo un informe tuyo.
Agrega pausas, comentarios suaves, conectores humanos y ritmo real.
Rompe lo predecible: si algo suena demasiado perfecto, reházalo.
Al terminar, repasa y elimina cualquier rastro de estilo robótico o enciclopédico.

🧪 Tu objetivo final es que el texto:
No suene "demasiado perfecto".
Tenga ritmo, naturalidad, y una voz propia que fluya.
Pase por texto humano sin levantar sospechas en detectores de IA.
Refleje razonamiento, comprensión del tema y juicio subjetivo moderado.
`,
  prompt: `Reescritura de Texto con Estilo Humano Universitario:\nTexto original:\n{{{text}}}`,
  config: {
    temperature: 1.0,
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

const humanizeAiContentFlow = ai.defineFlow(
  {
    name: 'humanizeAiContentFlow',
    inputSchema: HumanizeAiContentInputSchema,
    outputSchema: HumanizeAiContentOutputSchema,
  },
  async input => {
    const {output} = await humanizePrompt(input);
    return output!;
  }
);
