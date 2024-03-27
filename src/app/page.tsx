import Image from 'next/image'
import logo from "@/assets/logo.png";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';


export default function Home() {
  const {userId} = auth();

  if (userId) redirect("/notes");

  return (
    <main className='flex flex-col h-screen items-center justify-center gap-5'>
      <div className='flex items-center gap-5'>
        <Image src={logo} alt='IntelliNote' width={100} height={100} />
        <span className='font-extrabold tracking-tight text-4xl lg:text-5xl'>
          IntelliNotes
        </span>
      </div>
      <p className='text-center max-w-prose'>
      Transform your notes app with an AI chatbot, 
      tailored from your saved notes, offering insightful assistance to boost productivity.
      </p>
      <Button size="lg" asChild>
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  )
}
