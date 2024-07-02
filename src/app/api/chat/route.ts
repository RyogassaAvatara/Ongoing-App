import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionMessage } from "openai/resources/index.mjs";

export async function POST(req: Request) {
  try {
    // Parse Request Body
    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    // Truncate Messages to Last 6
    const messagesTruncated = messages.slice(-6);

    // Generate Embedding for the Messages
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    // Authenticate User
    const { userId } = auth();

    // Perform a vector search query on the Pinecone index to find the top 4 most similar notes for the given embedding, restricted to the authenticated user's notes
    const vectorQuery = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    // Fetch Related Notes from Database
    const relatedNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQuery.matches.map((match) => match.id), // Filter notes by ID
        },
      },
    });

    console.log("Related notes found: ", relatedNotes);

    // // Defining a system message for the AI assistant, including a list of related notes formatted with their titles and contents
    const systemMessage: ChatCompletionMessage = {
      role: "system",
      content:
        `You're a helpful AI note-taking assistant. You answer questions using the user's notes. The related notes for this query are:\n` +
        relatedNotes
          .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
          .join("\n\n"),
    };
    // Generate AI Response
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
