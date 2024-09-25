import { NextResponse } from 'next/server';
import prisma from '../../../libs/prisma'; // Adjust the path to your Prisma instance

// GET: Fetch apartments
export async function GET() {
  try {
    const apartments = await prisma.apartment.findMany(); // Fetch all apartments
    return NextResponse.json(apartments, { status: 200 });
  } catch (error) {
    console.error('Error fetching apartments:', error);
    return NextResponse.json({ message: 'Error fetching apartments' }, { status: 500 });
  }
}

// POST: Create a new apartment
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      name,
      minPrice,
      maxPrice,
      rentalType,
      starRating,
      propertyType,
      images,       // Should ideally handle image uploading via another method
      phoneNumber,
      email,
      address,
      userId        // Ensure the user ID exists in the User model
    } = data;

    // Validation for required fields
    if (!name || !minPrice || !maxPrice || !rentalType || !propertyType || !email) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Create the new apartment in the database
    const newApartment = await prisma.apartment.create({
      data: {
        name,
        minPrice,
        maxPrice,
        rentalType,
        starRating,
        propertyType,
        images,       // Ensure proper handling of image uploads
        phoneNumber,
        email,
        address,
        userId,       // Foreign key to User
      },
    });

    return NextResponse.json(newApartment, { status: 201 });
  } catch (error) {
    console.error('Error creating apartment:', error);
    return NextResponse.json({ message: 'Error creating apartment' }, { status: 500 });
  }
}
