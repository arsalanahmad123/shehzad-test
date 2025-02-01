'use client';
import { useState, useEffect,use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function EditTodo({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const [content, setContent] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    const { id } = use(params);

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const response = await fetch(`/api/todos/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch the task');
                }
                const todo = await response.json();
                setContent(todo?.todo.content); 
            } catch{
                toast({
                    title: 'Error',
                    description: 'Failed to fetch the task. Please try again.',
                    variant: 'destructive',
                });
                router.push('/todos');
            }
        };

        fetchTodo();
    }, [id, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error('Failed to update the task');
            }

            toast({
                title: 'Success',
                description: 'Task updated successfully!',
                variant: 'default',
            });

            router.push('/todos');
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to update the task. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="max-w-md mx-auto py-10">
            <Card>
                <CardHeader>
                    <h1 className="text-2xl font-semibold">Edit Task</h1>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <Input
                            type="text"
                            placeholder="Enter task content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/todos')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Update Task</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
