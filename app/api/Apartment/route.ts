import { NextResponse } from 'next/server';
import  prisma  from '../../../libs/prisma'; // Adjust the path to your Prisma instance

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
    const { name, minPrice, maxPrice, rentalType, starRating, propertyType, images, phoneNumber, email, address, userId } = data;

    // Validation can be added here as needed
    if (!name || !minPrice || !maxPrice || !rentalType || !propertyType || !email) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
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
        images,
        phoneNumber,
        email,
        address,
        userId, // Foreign key to User
      },
    });

    return NextResponse.json(newApartment, { status: 201 });
  } catch (error) {
    console.error('Error creating apartment:', error);
    return NextResponse.json({ message: 'Error creating apartment' }, { status: 500 });
  }
}
