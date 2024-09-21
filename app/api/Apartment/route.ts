// app/api/apartments/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../libs/prisma';

export async function GET() {
  try {
    const apartments = await prisma.apartment.findMany();
    return NextResponse.json(apartments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch apartments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { name, minPrice, rentalType, starRating, propertyType, images, phoneNumber, email, address } = await request.json();

  try {
    const apartment = await prisma.apartment.create({
      data: {
        name,
        minPrice,
        rentalType,
        starRating,
        propertyType,
        images,
        phoneNumber,
        email,
        address, // Include address here
      },
    });
    return NextResponse.json(apartment, { status: 201 });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to create apartment' }, { status: 500 });
  }
}
