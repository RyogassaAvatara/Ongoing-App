import { cn } from "@/lib/utils"; //  utility function for conditional class names
import { useChat } from "ai/react"; // seChat hook for chat functionality
import { Bot, Trash, XCircle } from "lucide-react"; //  icons from lucide-react
import { Input } from "./ui/input"; // Input component
import { Button } from "./ui/button"; // Button component
import { Message } from "ai"; // Message type
import { useUser } from "@clerk/nextjs"; // useUser hook for user information
import Image from "next/image"; // Image component for optimized images
import { useEffect, useRef } from "react"; // useEffect and useRef hooks

interface AiChatBox {
  open: boolean;
  onClose: () => void;
}

// AiChat component for chat interface
export default function AiChat({ open, onClose }: AiChatBox) {
  // Using useChat hook to manage chat state and functionality
  const {
    messages,           // Array of chat messages
    input,              // Current input val
    handleInputChange,  // Function handle input changes
    handleSubmit,       // Function handle form changes
    setMessages,        // Function set chat messages
    isLoading,          // Boolean indicating if ai is processing
    error,              // Error msg
  } = useChat(); 

  const inputRef = useRef<HTMLInputElement>(null); // Ref for input field
  const scrollRef = useRef<HTMLDivElement>(null); // Ref for scrolling chat container

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight; // Auto-scroll to bottom on new messages
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus(); // Focus input when chat opens
    }
  }, [open]);

  const lastMessageUser = messages[messages.length - 1]?.role === "user"; // Check if last message is from user

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed animate-fade-in" : "hidden",
      )}
    >
      <div className="flex justify-between items-center bg-card text-card-foreground rounded-t-md p-2 whitespace-pre-line border px-3 py-2">
        <div className="text-lg font-semibold">XYZ AI Assistant</div>
        <button onClick={onClose} className="hover:text-primary-foreground transition-colors">
          <XCircle size={30} />
        </button>
      </div>
      <div className="flex h-[600px] flex-col rounded border bg-card shadow-xl">
        <div className="mt-3 h-full overflow-y-auto px-3 custom-scrollbar" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
          {isLoading && lastMessageUser && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: "assistant",
                content: "Something went wrong. Please try again.",
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex h-full items-center justify-center gap-3 text-muted-foreground">
              <Bot />
              Ask me a question about your notes!
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-2">
          <Button
            title="Clear chat"
            variant="outline"
            size="icon"
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])} // Clear chat messages
          >
            <Trash />
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask something..."
            ref={inputRef} // Input reference for focusing
            className="flex-grow"
          />
          <Button type="submit" className="bg-primary text-primary-foreground">Send</Button>
        </form>
      </div>
    </div>
  );
}

// ChatMessage component to render individual messages
function ChatMessage({
  message: { role, content },
}: {
  message: Pick<Message, "role" | "content">;
}) {
  const { user } = useUser(); // Getting user information

  const isAiMessage = role === "assistant"; // Check if message is from assistant

  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAiMessage && <Bot className="mr-2 shrink-0" />}
      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-2",
          isAiMessage ? "bg-card" : "bg-primary text-primary-foreground",
        )}
      >
        {content}
      </p>
      {!isAiMessage && user?.imageUrl && (
        <Image
          src={user.imageUrl}
          alt="user image"
          width={40}
          height={40}
          className="ml-2 rounded-full object-cover"
        />
      )}
    </div>
  );
}
