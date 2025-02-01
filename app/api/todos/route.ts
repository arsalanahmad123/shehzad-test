import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';

const todoSchema = z.object({
    content: z.string().min(1, 'Content cannot be empty'),
});

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const todos = await db.task.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ todos });
    } catch (error) {
        console.error('Failed to fetch todos:', error);
        return NextResponse.json(
            { error: 'Failed to fetch todos' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const json = await request.json();
        const validatedFields = todoSchema.parse(json);


        const todo = await db.task.create({
            data: {
                content: validatedFields.content,
                userId: user.id,
            },
        });

        return NextResponse.json({ todo });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }
        console.error('Failed to create todo:', error);
        return NextResponse.json(
            { error: 'Failed to create todo' },
            { status: 500 }
        );
    }
}
