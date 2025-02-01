'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EditIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';

interface Todo {
    id: string;
    content: string;
    createdAt: string;
}

export default function Dashboard() {
    const [tasks, setTasks] = useState<Todo[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/todos');
            const data = await response.json();
            if (response.ok) {
                setTasks(data.todos);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch tasks. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const content = formData.get('content') as string;

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });
            const data = await response.json();
            if (response.ok) {
                setTasks((prevTasks) => [data.todo, ...prevTasks]);
                setIsDialogOpen(false);
                toast({
                    title: 'Task Created',
                    description: 'New task has been created successfully.',
                    variant: 'default',
                });
                form.reset();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Failed to create the task. Please try again.',
                variant: 'destructive',
            });
        }
    };

    
    const handleDeleteTask = async (id: string) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setTasks((prevTasks) =>
                    prevTasks.filter((task) => task.id !== id)
                );
                toast({
                    title: 'Task Deleted',
                    description: 'Task has been deleted successfully.',
                    variant: 'default',
                });
            } else {
                const data = await response.json();
                throw new Error(data.error);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Failed to delete the task. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold">Your Tasks</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" /> Add New Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateTask}>
                            <Input
                                type="text"
                                name="content"
                                placeholder="Enter task content"
                                className="mb-4"
                                required
                            />
                            <div className="flex justify-end">
                                <Button type="submit">Create Task</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            {tasks.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                        <Card
                            key={task.id}
                            className="bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-all"
                        >
                            <CardHeader className="flex justify-between items-center">
                                
                                        <h2 className="text-xl font-medium text-gray-900">
                                            {task.content}
                                        </h2>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="text-gray-500 hover:text-gray-700"
                                                asChild
                                            >
                                                <Link href={`/todos/${task.id}/edit`}>
                                                    <EditIcon />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() =>
                                                    handleDeleteTask(task.id)
                                                }
                                            >
                                                <TrashIcon />
                                            </Button>
                                        </div>
                                  
                            </CardHeader>
                            <CardContent className="p-4">
                                <p className="text-gray-700">
                                    Created at:{' '}
                                    {new Date(task.createdAt).toLocaleString()}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-center">No tasks available.</p>
            )}
        </div>
    );
}
