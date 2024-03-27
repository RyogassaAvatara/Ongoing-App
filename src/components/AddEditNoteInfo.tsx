import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loadingbutton";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
import { useState } from "react";

interface addEditNoteInfoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteEdit?: Note;
}

export default function AddEditNoteInfo({
  open,
  setOpen,
  noteEdit
}: addEditNoteInfoProps) {
    const [deleteProgress, setDeleteProgress] = useState(false);

  const router = useRouter();

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteEdit?.title || "",
      content: noteEdit?.content || "",
    },
  });

  async function Submition(input: CreateNoteSchema) {
    try {
        if (noteEdit) {
            const response = await fetch("/api/notes", {
                method: "PUT",
                body: JSON.stringify({
                    id: noteEdit.id,
                    ...input
                })
            })
            if (!response.ok) throw Error("Status code: " + response.status);
        } else {
            const response = await fetch("/api/notes", {
                method: "POST",
                body: JSON.stringify(input),
              });
              if (!response.ok) throw Error("Status code: " + response.status);
              form.reset();
        }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Oh, something went wrong. Please try again.");
    }
  }
async function deleteNote() {
    if (!noteEdit) return;
    setDeleteProgress(true);
    try {
        const response = await fetch("/api/notes", {
            method: "DELETE",
            body: JSON.stringify({
                id: noteEdit.id
            })
        })
        if (!response.ok) throw Error("Status code: " + response.status);
        router.refresh();
        setOpen(false);
    } catch (error) {
        console.error(error);
        alert("Oh, something went wrong. Please try again.");
    } finally {
        setDeleteProgress(false);
    }
}


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ textAlign: "center" }}>{noteEdit ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(Submition)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title..." {...field} />
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
                    <Textarea
                      placeholder="Start typing your note..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
                {noteEdit && (
                    <LoadingButton
                    variant="destructive"
                    loading={deleteProgress}
                    disabled={form.formState.isSubmitting}
                    onClick={deleteNote}
                    type="button"
                    >
                        Delete Note
                    </LoadingButton>
                )}
                <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                style={{ width: "100%" }}
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
