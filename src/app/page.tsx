import Image from 'next/image';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { FaBrain, FaFolderOpen, FaLock } from 'react-icons/fa';

export default function Home() {
  const { userId } = auth();

  if (userId) redirect("/notes");

  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex flex-col flex-grow items-center justify-center bg-background text-foreground p-5'>
        <header className='w-full bg-background p-5 text-center animate-fade-in'>
          <Image 
            src={logo} 
            alt='XYZ' 
            width={80} 
            height={80} 
            className='inline-block animate-spin-slow' 
          />
          <h1 className='font-extrabold tracking-tight text-5xl lg:text-6xl text-primary mt-4'>
            Project XYZ
          </h1>
          <p className='text-lg lg:text-xl text-muted-foreground mt-2'>
            Revolutionize your notes app with an AI assistant that learns from your saved notes, providing personalized insights to elevate your productivity.
          </p>
          <Button 
            size="lg" 
            asChild 
            className='mt-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors duration-300 transform hover:scale-105'
          >
            <Link href="/notes">Get Started</Link>
          </Button>
        </header>

        <section className='w-full flex flex-col items-center bg-background text-foreground p-10'>
          <h2 className='font-extrabold tracking-tight text-4xl lg:text-5xl text-primary mb-8 animate-fade-in-delay'>
            Features
          </h2>
          <div className='flex flex-wrap justify-center gap-8'>
            <div className='bg-card p-6 rounded-lg shadow-lg max-w-sm text-center transform transition-transform duration-300 hover:scale-105'>
              <FaBrain className='text-4xl text-primary mb-4 mx-auto' />
              <h3 className='font-bold text-2xl text-primary mb-4'>AI-Powered Insights</h3>
              <p className='text-md text-muted-foreground'>Get personalized insights based on your notes to improve productivity.</p>
            </div>
            <div className='bg-card p-6 rounded-lg shadow-lg max-w-sm text-center transform transition-transform duration-300 hover:scale-105'>
              <FaFolderOpen className='text-4xl text-primary mb-4 mx-auto' />
              <h3 className='font-bold text-2xl text-primary mb-4'>Organized Notes</h3>
              <p className='text-md text-muted-foreground'>Keep your notes neatly organized with our intuitive interface.</p>
            </div>
            <div className='bg-card p-6 rounded-lg shadow-lg max-w-sm text-center transform transition-transform duration-300 hover:scale-105'>
              <FaLock className='text-4xl text-primary mb-4 mx-auto' />
              <h3 className='font-bold text-2xl text-primary mb-4'>Secure Storage</h3>
              <p className='text-md text-muted-foreground'>Your notes are stored securely with state-of-the-art encryption.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className='w-full' style={{ backgroundColor: '#7ffb64' }}>
        <p className='text-md text-gray-900 p-5 text-center'>&copy; 2024 XYZ. All rights reserved.</p>
      </footer>
    </div>
  );
}
