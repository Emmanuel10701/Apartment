import { NextResponse } from 'next/server';
import prisma from '../../../libs/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      minPrice,
      maxPrice,
      rentalType,
      starRating,
      propertyType,
      phoneNumber,
      email,
      address,
      userId,
      kitchenImage,
      livingRoomImage,
      bedroomImage,
      apartmentImage,
    } = body;

    if (!name || !minPrice || !maxPrice || !rentalType || !propertyType || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isValidURL = (url: string) => {
      const pattern = /^(http|https):\/\/[^\s]+/;
      return pattern.test(url);
    };

    const imageUrls = [kitchenImage, livingRoomImage, bedroomImage, apartmentImage];
    for (const url of imageUrls) {
      if (url && !isValidURL(url)) {
        return NextResponse.json({ error: `Invalid image URL: ${url}` }, { status: 400 });
      }
    }

    const newApartment = await prisma.apartment.create({
      data: {
        name,
        minPrice: parseFloat(minPrice),
        maxPrice: parseFloat(maxPrice),
        rentalType,
        starRating: starRating ? parseInt(starRating) : 0,
        propertyType,
        phoneNumber,
        email,
        address,
        userId,
        kitchenImage,
        livingRoomImage,
        bedroomImage,
        apartmentImage,
      },
    });

    return NextResponse.json(newApartment, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const apartments = await prisma.apartment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(apartments);
  } catch (dbError: any) {
    console.error('Database operation error:', dbError.message);
    return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
  }
}
