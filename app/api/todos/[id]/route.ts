import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';

const todoSchema = z.object({
    content: z.string().min(1, 'Content cannot be empty'),
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {

        const id = (await params).id; 

        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const todo = await db.task.findUnique({
            where: { id: id, userId: user.id },
        });

        if (!todo) {
            return NextResponse.json(
                { error: 'Todo not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ todo });
    } catch (error) {
        console.error('Failed to fetch todo:', error);
        return NextResponse.json(
            { error: 'Failed to fetch todo' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id; 
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const json = await request.json();
        const validatedFields = todoSchema.parse(json);

        const todo = await db.task.update({
            where: { id: id, userId: user.id },
            data: { content: validatedFields.content },
        });

        return NextResponse.json({ todo });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }
        console.error('Failed to update todo:', error);
        return NextResponse.json(
            { error: 'Failed to update todo' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await db.task.delete({
            where: { id: id, userId: user.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete todo:', error);
        return NextResponse.json(
            { error: 'Failed to delete todo' },
            { status: 500 }
        );
    }
}
