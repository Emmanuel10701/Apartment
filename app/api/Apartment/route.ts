import { NextResponse } from 'next/server';
import prisma from '../../../libs/prisma';

// POST method to create a new apartment
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
      kitchenImage,
      livingRoomImage,
      bedroomImage,
      apartmentImage,
    } = body;

    // Check for required fields
    if (!name || !minPrice || !maxPrice || !rentalType || !propertyType || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate image URLs
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

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create the new apartment
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
        user: {
          connect: { id: user.id }, // Connect the apartment to the user
        },
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

// GET method to retrieve apartmentsexport async function GET() {
  export async function GET() {
    try {
      const apartments = await prisma.apartment.findMany({
        orderBy: {
          createdAt: 'desc', // Sort by the createdAt field in descending order
        },
      });
      return NextResponse.json(apartments, { status: 200 });
    } catch (error: any) {
      console.error('Error fetching apartments:', error.message);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  
