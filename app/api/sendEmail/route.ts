// src/app/api/sendEmail/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailRequest {
  name: string;  // Added name to the interface
  email: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const { name, email, message }: EmailRequest = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Replace with your email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your email address
      to: process.env.EMAIL_USER, // Recipient address
      subject: 'New Message from ' + name, // Subject line
      text: `Message from: ${name}\n\n${message}`, // Plain text body
      html: `<p>Message from: <strong>${name}</strong></p><p>${message}</p>`, // HTML body
    };

    await transporter.sendMail(mailOptions); // Send email

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error); // Log the error
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
