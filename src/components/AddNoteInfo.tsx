import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loadingbutton";
import { useRouter } from "next/navigation";

interface addNoteInfoProps {
    open: boolean,
    setOpen: (open: boolean) => void,
}

export default function AddNoteInfo({open, setOpen}: addNoteInfoProps) {
    const router = useRouter();

    const form = useForm<CreateNoteSchema>({
        resolver: zodResolver(createNoteSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    })

    async function Submition(input:CreateNoteSchema) {
        try {
            const response = await fetch("/api/notes", {
                method: "POST",
                body: JSON.stringify(input)
            })    
            if (!response.ok) throw Error("Status code: " + response.status)
            form.reset();
            router.refresh();
            setOpen(false);
        
        } catch (error) {
            console.error(error);
            alert("Oh, something went wrong. Please try again.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle style={{ textAlign: 'center' }}>Add Note</DialogTitle>
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
                                    <Textarea placeholder="Start typing your note..." {...field} />
                                </FormControl>
                                <FormMessage />
                               </FormItem> 
                            )}
                        />
                        <DialogFooter>
                            <LoadingButton type="submit" loading={form.formState.isSubmitting} style={{ width: '100%' }}>
                            Submit
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}