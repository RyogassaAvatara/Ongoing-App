"use client";

import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note"; // Importing note validation schemas
import { useForm } from "react-hook-form"; // Importing useForm from react-hook-form for form handling
import { zodResolver } from "@hookform/resolvers/zod"; // Importing zodResolver for schema validation
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "./ui/dialog"; // Importing UI components for the dialog
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"; // Importing UI components for the form
import { Input } from "./ui/input"; // Importing Input component
import LoadingButton from "./ui/loadingbutton"; // Importing LoadingButton component
import { useRouter } from "next/navigation"; // Importing useRouter for navigation
import { Note } from "@prisma/client"; // Importing Note type from Prisma client
import { useState } from "react"; // Importing useState for state management
import dynamic from "next/dynamic"; // Importing dynamic for dynamic imports
import 'react-quill/dist/quill.snow.css'; // Importing CSS for ReactQuill

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }); // Dynamically importing ReactQuill with SSR disabled

interface AddEditNoteInfoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteEdit?: Note;
}

// AddEditNoteInfo component handles adding and editing notes
export default function AddEditNoteInfo({
  open,
  setOpen,
  noteEdit,
}: AddEditNoteInfoProps) {
  const [deleteProgress, setDeleteProgress] = useState(false); // State for delete button progress
  const router = useRouter(); // Router for navigation

  // Initializing form with react-hook-form and zod validation schema
  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteEdit?.title || "",
      content: noteEdit?.content || "",
    },
  });

  // Function to handle form submission for adding/editing note
  async function onSubmit(input: CreateNoteSchema) {
    try {
      if (noteEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({
            id: noteEdit.id,
            ...input,
          }),
        });
        if (!response.ok) throw new Error("Status code: " + response.status);
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });
        if (!response.ok) throw new Error("Status code: " + response.status);
        form.reset(); // Reset form after successful submission
      }

      router.refresh(); // Refresh page to show updated notes
      setOpen(false); // Close the dialog
    } catch (error) {
      console.error(error);
      alert("Oh, something went wrong. Please try again."); // Show error message
    }
  }

  // Function to handle note deletion
  async function deleteNote() {
    if (!noteEdit) return;
    setDeleteProgress(true); // Show delete button progress
    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({
          id: noteEdit.id,
        }),
      });
      if (!response.ok) throw new Error("Status code: " + response.status);
      router.refresh(); // Refresh page to show updated notes
      setOpen(false); // Close the dialog
    } catch (error) {
      console.error(error);
      alert("Oh, something went wrong. Please try again."); // Show error message
    } finally {
      setDeleteProgress(false); // Hide delete button progress
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl w-full h-auto p-5 rounded-lg shadow-lg mx-auto my-10">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {noteEdit ? "Edit Note" : "Add Note"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Title..."
                      {...field}
                      className="border-gray-300 rounded-md shadow-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <div className="h-[55vh] custom-scrollbar quill-container">
                      <ReactQuill
                        value={field.value}
                        onChange={field.onChange}
                        className="h-full"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-between items-center gap-4 pt-4">
              {noteEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteNote}
                  type="button"
                  className="w-1/2 bg-red-500 hover:bg-red-600 text-white rounded-md py-2"
                >
                  Delete Note
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2"
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
