// app/api/register/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Define the schema for validation
const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long').max(30, 'Username must be less than 30 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate input data
    const parsedData = userSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: parsedData.email,
      },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered.' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await hash(parsedData.password, 10);

    // Create new user in the database
    const newUser = await prisma.user.create({
      data: {
        username: parsedData.username,
        email: parsedData.email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: 'Registration successful!', user: newUser }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      const validationErrors = error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json({ message: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
