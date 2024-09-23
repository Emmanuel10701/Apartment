import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '../../../libs/prisma'; // Adjust the path as needed
import { v4 as uuidv4 } from 'uuid';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 400 });
    }

    const token = uuidv4(); // Generate a unique token
    const resetLink = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${token}`;

    // Store the token and associate it with the user in the database
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        // Optionally, add an expiration date
      },
    });

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    });

    return NextResponse.json({ message: 'Password reset link sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
