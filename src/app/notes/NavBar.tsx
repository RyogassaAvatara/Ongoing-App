"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddNoteInfo from "@/components/AddEditNoteInfo";

export default function NavBar() {
    const [showAddEditNoteInfo, setShowAddEditNoteInfo] = useState(false);

    return (
        <>
        <div className="p-4 shadow"> 
            <div className="max-w-7xl m-auto flex flex-wrap gap-3 items-center justify-between">
                <Link href="/notes" className="flex items-center gap-3">
                    <Image src={logo} alt="IntelliNote Logo" width={40} height={40} />
                    <span className="font-bold">IntelliNotes</span>
                </Link>
                <div className="flex items-center gap-2">
                    <UserButton afterSignOutUrl="/"
                    appearance={{
                        elements: { avatarBox: { width: "2.5rem", height:"2.5rem" } }
                    }}
                    />
                    <Button onClick={() => setShowAddEditNoteInfo(true)}>
                        <Plus size={20} className="mr-2" />
                        Add Note
                    </Button>
                </div>
            </div>
        </div>
        <AddNoteInfo open={showAddEditNoteInfo} setOpen={setShowAddEditNoteInfo} />
        </>
    );
}