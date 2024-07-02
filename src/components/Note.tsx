"use client";

import { Note as NoteModel } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import AddEditNoteInfo from "./AddEditNoteInfo";
import { useState } from "react";
import { MdEdit } from "react-icons/md";

interface NoteProps {
  note: NoteModel;
}
// Note component to display individual note contents
export default function Note({ note }: NoteProps) {
  const [showEditInfo, setShowEditInfo] = useState(false);

  const isUpdated = note.updatedAt > note.createdAt;
  // Display time for creation or last update
  const createdUpdatedTime = (
    isUpdated ? note.updatedAt : note.createdAt
  ).toDateString();

  return (
    <>
      <Card
        className="group relative cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 p-5 rounded-lg bg-card text-card-foreground min-h-[400px] max-h-[500px] overflow-hidden before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-12 before:bg-gradient-to-t before:from-black before:to-transparent before:opacity-60"
        onClick={() => setShowEditInfo(true)}
      >
        <CardHeader className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <CardTitle className="text-xl font-semibold">{note.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {createdUpdatedTime}
              {isUpdated && " (Updated)"}
            </CardDescription>
          </div>
          <div className="flex items-center text-muted-foreground hover:text-primary transition-colors duration-300 absolute top-4 right-4 opacity-0 group-hover:opacity-100">
            <MdEdit size={24} />
            <span className="ml-1 text-sm">Edit</span>
          </div>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <div
            className="whitespace-pre-wrap text-base overflow-hidden"
            dangerouslySetInnerHTML={{ __html: note.content as string }}
          ></div>
        </CardContent>
      </Card>
      <AddEditNoteInfo open={showEditInfo} setOpen={setShowEditInfo} noteEdit={note} />
    </>
  );
}
