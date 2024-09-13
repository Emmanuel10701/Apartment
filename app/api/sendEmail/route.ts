// src/app/api/sendEmail/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailRequest {
  email: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const { email, message }: EmailRequest = await request.json();

    // Validate input
    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or any other email service
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS  // your email password
      }
    });

    // Email options
    const mailOptions = {
      from: email, // recipient address
      to: process.env.EMAIL_USER, // sender address
      subject: 'Important Update', // Subject line
      text: message, // plain text body
      html: `<p>${message}</p>` // HTML body
    };

    await transporter.sendMail(mailOptions); // Send email

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error); // Log the error
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
