import { notesIndex } from "@/lib/db/pinecone"; // Importing Pinecone index for note embeddings
import prisma from "@/lib/db/prisma"; // Importing Prisma client for database operations
import { getEmbedding } from "@/lib/openai"; // Importing function to get embeddings from OpenAI
import { createNoteSchema, deleteNoteSchema, updateNoteSchema } from "@/lib/validation/note"; // Importing validation schemas for note operations
import { auth } from "@clerk/nextjs"; // Importing authentication from Clerk

// POST request handler for creating a new note
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parsing request body as JSON

    const parseResult = createNoteSchema.safeParse(body); // Validating request body with schema

    if (!parseResult.success) {
      console.error(parseResult.error); // Logging validation error
      return Response.json({ error: "Invalid Input" }, { status: 400 }); // Returning validation error response
    }

    const { title, content } = parseResult.data; // Destructuring title and content from validated data

    const { userId } = auth(); // Getting authenticated user ID

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 }); // Returning unauthorized response if user not authenticated
    }

    const embedding = await getEmbeddingNote(title, content); // Getting embedding for note content

    const note = await prisma.$transaction(async (tx) => {
      // Start a database transaction to ensure atomicity

      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      });
      // Create a new note in the database with the provided title, content, and userId

      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      // Insert the note's embedding into the Pinecone index for retrieval and search

      return note;
    });

    return Response.json({ note }, { status: 201 }); // Returning created note response
  } catch (error) {
    console.error(error); // Logging error
    return Response.json({ error: "Internal server error" }, { status: 500 }); // Returning internal server error response
  }
}

// PUT request handler for updating an existing note
export async function PUT(req: Request) {
  try {
    const body = await req.json(); // Parsing request body as JSON

    const parseResult = updateNoteSchema.safeParse(body); // Validating request body with schema

    if (!parseResult.success) {
      console.error(parseResult.error); // Logging validation error
      return Response.json({ error: "Invalid Input" }, { status: 400 }); // Returning validation error response
    }

    const { id, title, content } = parseResult.data; // Destructuring id, title, and content from validated data

    const note = await prisma.note.findUnique({ where: { id } }); // Finding note by ID

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 }); // Returning not found response if note doesn't exist
    }

    const { userId } = auth(); // Getting authenticated user ID

    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 }); // Returning unauthorized response if user not authenticated or not the owner
    }

    const updateNote = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
      },
    });

    return Response.json({ updateNote }, { status: 200 }); // Returning updated note response
  } catch (error) {
    console.error(error); // Logging error
    return Response.json({ error: "Internal server error" }, { status: 500 }); // Returning internal server error response
  }
}

// DELETE request handler for deleting an existing note
export async function DELETE(req: Request) {
  try {
    const body = await req.json(); // Parsing request body as JSON

    const parseResult = deleteNoteSchema.safeParse(body); // Validating request body with schema

    if (!parseResult.success) {
      console.error(parseResult.error); // Logging validation error
      return Response.json({ error: "Invalid Input" }, { status: 400 }); // Returning validation error response
    }

    const { id } = parseResult.data; // Destructuring id from validated data

    const note = await prisma.note.findUnique({ where: { id } }); // Finding note by ID

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 }); // Returning not found if note doesn't exist
    }

    const { userId } = auth(); // Getting authenticated user ID

    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 }); // Returning unauthorized response if user not authenticated or not the owner
    }

    await prisma.note.delete({ where: { id } }); // Deleting note by ID

    return Response.json({ message: "Note deleted" }, { status: 200 }); // Returning successful deletion response
  } catch (error) {
    console.error(error); // Logging error
    return Response.json({ error: "Internal server error" }, { status: 500 }); // Returning internal server error response
  }
}

// GET request handler for fetching all notes of the authenticated user
export async function GET(req: Request) {
  try {
    const { userId } = auth(); // Getting authenticated user ID

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 }); // Returning unauthorized response if user not authenticated
    }

    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return Response.json({ notes }, { status: 200 }); // Returning notes response
  } catch (error) {
    console.error(error); // Logging error
    return Response.json({ error: "Internal server error" }, { status: 500 }); // Returning internal server error response
  }
}

// Helper function to get embedding for note content
async function getEmbeddingNote(title: string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}
