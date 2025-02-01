import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import './globals.css';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Toaster } from '@/components/ui/toaster';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Todo App',
    description: 'A simple todo management app',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <ClerkProvider>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} bg-gray-50 antialiased`}
                >
                    <Toaster />
                    {/* Navbar */}
                    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
                        <div className="flex gap-4">
                            <Link
                                href="/"
                                className="text-lg font-semibold text-gray-900"
                            >
                                TodoApp
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <SignedIn>
                                <Link href="/todos">
                                    <Button variant="outline">
                                        Todos 
                                    </Button>
                                </Link>
                                <UserButton />
                            </SignedIn>
                            <SignedOut>
                                <Link href="/sign-in">
                                    <Button>Sign In</Button>
                                </Link>
                            </SignedOut>
                        </div>
                    </nav>

                    <main className="container mx-auto p-6">{children}</main>
                </body>
            </ClerkProvider>
        </html>
    );
}
