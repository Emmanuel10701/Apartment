// app/api/apartments/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../libs/prisma';

export async function GET() {
  try {
    const apartments = await prisma.apartment.findMany();
    return NextResponse.json(apartments);
  } catch (error: unknown) { // Type the error as unknown
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch apartments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name,maxPrice, minPrice, rentalType, starRating, propertyType, images, phoneNumber, email, address } = await request.json();

  // Input validation
  if (!name || !minPrice ||!maxPrice || !rentalType || !starRating || !propertyType || !images || !phoneNumber || !email || !address) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  try {
    const apartment = await prisma.apartment.create({
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
      },
    });
    return NextResponse.json(apartment, { status: 201 });
  } catch (error: unknown) { // Type the error as unknown
    console.error(error); // Log the error for debugging
    const errorMessage = (error as Error).message || 'Failed to create apartment'; // Safely access the error message
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
