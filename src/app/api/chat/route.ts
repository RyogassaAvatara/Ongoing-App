import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionMessage } from "openai/resources/index.mjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncated = messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    const { userId } = auth();

    const vectorQuery = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const relatedNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQuery.matches.map((match) => match.id),
        },
      },
    });

    console.log("Related notes found: ", relatedNotes);

    const systemMessage: ChatCompletionMessage = {
      role: "system",
      content:
        `You're a helpful AI note-taking assistant. You answer questions using the user's notes. Please provide any information you want me to retrieve and deliver to you." The related notes for this query are:\n` +
        relatedNotes
          .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join("\n\n"),
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
