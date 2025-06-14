import { googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';

const MessageSchema = z.object({
  senderId: z.string(),
  image: z.string().optional(),
  text: z.string().optional(),
  type: z.enum(['received', 'sent']),
});

const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.0-flash'),
});

export async function generateChatBotResponse(userText) {
  const prefix =
    "You are a helpful AI assistant and chatbot of Chatty. Answer the user's questions or conversations in a friendly and informative manner.";
  // const prompt = `
  //       ${prefix}
  //       Context:
  //       ${someContext}
  //     `;
  const chat = ai.chat({ system: prefix });
  const { text } = await chat.send(userText);
  return text;
}

const ChatBotFlowWithSchema = ai.defineFlow(
  {
    name: 'ChatBotFlowWithSchema',
    inputSchema: MessageSchema,
    outputSchema: MessageSchema,
  },
  async ({ senderId, image, text, type }) => {
    const { output } = await ai.generate({
      model: googleAI.model('gemini-2.0-flash'),
      prompt: `You are a helpful AI assistant and chatbot of Chatty. Answer the user's questions or conversations in a friendly and informative manner. The user might send you an image as a url, provided as ${image}, if it is null or undefined please ignore, so be sure to respond appropriately. They can also send you text messages, provided as: ${text}. If it is null or undefined please prompt the user politely and ask if there is anything you can do for the user. You are always to use the users ID as the senderId, this senderId is ${senderId} in your response and the type of message coming from you is ALWAYS 'received'. You are to respond with a JSON object that satisfies the schema you have been provided. Do not repeat the user's message in your response, just respond with the information you have been provided. If the user asks about this application, this is the context of the application: Chatty is a chat application that allows users to send and receive messages, images, and other media. It is designed to be user-friendly and efficient, providing a seamless messaging experience. It was built by Victor Abuka adapted from Codesistency for the genkit AI demo at Opolo Hub University of Ibadan.`,
      output: { schema: MessageSchema },
    });
    if (output == null) {
      throw new Error("Response doesn't satisfy schema.");
    }
    return output;
  }
);

export async function generateChatBotResponseV2(userMessage) {
  const { senderId, type, image, text } = await ChatBotFlowWithSchema(
    userMessage
  );
  return {
    senderId,
    type,
    image: image || null,
    text: text || null,
  };
}

async function main() {
  const { text } = await ai.generate(
    "Hello, Gemini! You're live at Build With AI at Opolo Hub University of Ibadan."
  );
  console.log(text);
}
