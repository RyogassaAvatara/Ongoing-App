"use client";

import { Note as NoteModel } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import AddEditNoteInfo from "./AddEditNoteInfo";
import { useState } from "react";

interface NoteProps {
    note: NoteModel
}

export default function Note({note}: NoteProps) {
    const [showEditInfo, setShowEditInfo] = useState(false);

    const isUpdated = note.updatedAt > note.createdAt;

    const createdUpdatedTime = (
        isUpdated ? note.updatedAt : note.createdAt
    ).toDateString();

    return(
        <>
        <Card className="cursor-pointer transition-shadow hover:shadow-lg" 
        onClick={() => setShowEditInfo(true)}>
            <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>
                    {createdUpdatedTime}
                    {isUpdated && " (updated)"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-line">
                    {note.content}
                </p>
            </CardContent>
        </Card>
        <AddEditNoteInfo
            open={showEditInfo}
            setOpen={setShowEditInfo}
            noteEdit={note}
        />
        </>
    )
}