import { NextResponse } from 'next/server';
import prisma from '../../libs/prisma'; // Adjust the import according to your project structure

export async function POST(request: Request) {
  const { email } = await request.json();

  // Validate email
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  try {
    // Create a new subscription
    const subscription = await prisma.subscription.create({
      data: {
        email,
      },
    });

    return NextResponse.json({ message: 'Subscription successful!', subscription }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: 'Subscription failed. Email might already exist.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Fetch all subscriptions
    const subscriptions = await prisma.subscription.findMany();

    return NextResponse.json(subscriptions, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch subscriptions.' }, { status: 500 });
  }
}
