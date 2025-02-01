'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';

const createTodoSchema = z.object({
    content: z.string().min(1, 'Content cannot be empty'),
});

const updateTodoSchema = z.object({
    id: z.string().uuid(),
    content: z.string().min(1, 'Content cannot be empty'),
});

export async function getTodos() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error('Unauthorized');
        }

        const todos = await db.task.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        return { success: true, todos };
    } catch (error) {
        console.error('Failed to fetch todos:', error);
        return { success: false, error: 'Failed to fetch todos' };
    }
}

export async function createTodo(formData: FormData) {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error('Unauthorized');
        }

        const content = formData.get('content');
        const validatedFields = createTodoSchema.parse({ content });

        const todo = await db.task.create({
            data: {
                content: validatedFields.content,
                userId: user.id,
            },
        });

        revalidatePath('/dashboard');
        return { success: true, todo };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message };
        }
        console.error('Failed to create todo:', error);
        return { success: false, error: 'Failed to create todo' };
    }
}

export async function updateTodo(formData: FormData) {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error('Unauthorized');
        }

        const id = formData.get('id') as string;
        const content = formData.get('content') as string;
        const validatedFields = updateTodoSchema.parse({ id, content });

        const todo = await db.task.update({
            where: { id: validatedFields.id, userId: user.id },
            data: { content: validatedFields.content },
        });

        revalidatePath('/dashboard');
        return { success: true, todo };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message };
        }
        console.error('Failed to update todo:', error);
        return { success: false, error: 'Failed to update todo' };
    }
}

export async function deleteTodo(formData: FormData) {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error('Unauthorized');
        }

        const id = formData.get('id') as string;

        await db.task.delete({
            where: { id, userId: user.id },
        });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete todo:', error);
        return { success: false, error: 'Failed to delete todo' };
    }
}
