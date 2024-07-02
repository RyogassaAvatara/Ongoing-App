import { useState } from "react";
import AiChat from "./AiChat";
import { Bot } from "lucide-react";
import { Button } from "./ui/button";

export default function AiButton() {
    const [chatBoxOpen, setChatBoxOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setChatBoxOpen(true)}>
                <Bot size={20} className="mr-2" />
                Ask Assistant
            </Button>
            <AiChat open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
        </>
    );
}