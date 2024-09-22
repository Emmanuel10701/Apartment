import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailRequest {
  name: string;  // User's name
  email: string; // User's email
  message: string; // User's message
  to: string; // Recipient's email
  subject: string; // Email subject
  filters: {
    houseType: string; // Type of house
    starRating: string | number; // Star rating
    occupation: string; // User's occupation
    userLocation: string; // User's location
  };
}

export async function POST(request: Request) {
  try {
    const { name, email, message, to, subject, filters }: EmailRequest = await request.json();

    // Validate input
    if (!name || !email || !message || !to || !subject) {
      return NextResponse.json({ error: 'Name, email, message, recipient, and subject are required' }, { status: 400 });
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
      to: to, // Recipient address
      subject: subject, // Subject line
      text: `
        Message from: ${name}
        Email: ${email}

        ${message}

        Filters:
        House Type: ${filters.houseType}
        Star Rating: ${filters.starRating}
        Occupation: ${filters.occupation}
        Location: ${filters.userLocation}
      `, // Plain text body
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
          <h2 style="color: #333;">New Message from ${name}</h2>
          <p style="color: #555;">You have received a new message:</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <p><strong>Filters:</strong></p>
            <ul>
              <li><strong>House Type:</strong> ${filters.houseType}</li>
              <li><strong>Star Rating:</strong> ${filters.starRating}</li>
              <li><strong>Occupation:</strong> ${filters.occupation}</li>
              <li><strong>Location:</strong> ${filters.userLocation}</li>
            </ul>
          </div>
          <p style="color: #777; font-size: 12px; margin-top: 20px;">This email was sent from your contact form.</p>
        </div>
      `, // Enhanced HTML body
    };

    await transporter.sendMail(mailOptions); // Send email

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error); // Log the error
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
