import bcrypt from 'bcryptjs'; // Ensure consistency with your previous setup
import prisma from '../../libs/prisma';
import { NextResponse } from 'next/server';

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body: RegisterRequestBody = await request.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse('Missing Fields', { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse('Email already exists', { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword, // Ensure this matches the Prisma schema
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
