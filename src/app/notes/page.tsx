import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title:"IntelliNotes - Notes",
};

export default async function AppPage() {
    const { userId } = auth();

    if (!userId) throw Error("userId is undefined")

    const allNotes = await prisma.note.findMany({where: {userId}})

    return <div>{JSON.stringify(allNotes)}</div>;
}; 