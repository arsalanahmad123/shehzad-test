import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-gray-900">
                Welcome to TodoApp
            </h1>
            <p className="text-gray-600 mt-2">
                A simple app to manage your daily tasks efficiently.
            </p>
            <div className="mt-6">
                <Link href="/sign-in">
                    <Button size="lg">Get Started</Button>
                </Link>
            </div>
        </div>
    );
}
