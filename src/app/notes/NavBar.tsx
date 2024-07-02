"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddNoteInfo from "@/components/AddEditNoteInfo";
import AiButton from "@/components/AiButton";

export default function NavBar() {
  const [showAddEditNoteInfo, setShowAddEditNoteInfo] = useState(false);

  return (
    <>
      <div className="navbar-wrapper sticky top-0 z-50">
        <div className="p-4 shadow navbar bg-background">
          <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <Link href="/notes" className="flex items-center gap-3">
              <Image src={logo} alt="XYZ Logo" width={40} height={40} />
              <span className="font-bold">XYZ</span>
            </Link>
            <div className="flex items-center gap-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
                }}
              />
              <Button onClick={() => setShowAddEditNoteInfo(true)}>
                <Plus size={20} className="mr-2" />
                Add Note
              </Button>
              <AiButton />
            </div>
          </div>
        </div>
      </div>
      <AddNoteInfo
        open={showAddEditNoteInfo}
        setOpen={setShowAddEditNoteInfo}
      />
    </>
  );
}
