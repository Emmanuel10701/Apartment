import { NextResponse } from 'next/server';
import prisma from '../../../libs/prisma'; // Adjust the path to your Prisma instance

// GET: Fetch apartments
export async function GET() {
  try {
    const apartments = await prisma.apartment.findMany();
    
    // Transform the apartments to separate image fields
    const transformedApartments = apartments.map(apartment => ({
      id: apartment.id,
      name: apartment.name,
      minPrice: apartment.minPrice,
      maxPrice: apartment.maxPrice,
      rentalType: apartment.rentalType,
      starRating: apartment.starRating,
      propertyType: apartment.propertyType,
      kitchenImage: apartment.kitchenImage,
      livingRoomImage: apartment.livingRoomImage,
      bedroomImage: apartment.bedroomImage,
      apartmentImage: apartment.apartmentImage,
      phoneNumber: apartment.phoneNumber,
      email: apartment.email,
      address: apartment.address,
      createdAt: apartment.createdAt,
      updatedAt: apartment.updatedAt,
    }));

    return NextResponse.json(transformedApartments, { status: 200 });
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
      kitchenImage,
      livingRoomImage,
      bedroomImage,
      apartmentImage,
      phoneNumber,
      email,
      address,
      userId
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
        kitchenImage,      // Separate fields for each image
        livingRoomImage,
        bedroomImage,
        apartmentImage,
        phoneNumber,
        email,
        address,
        userId,
      },
    });

    return NextResponse.json(newApartment, { status: 201 });
  } catch (error) {
    console.error('Error creating apartment:', error);
    return NextResponse.json({ message: 'Error creating apartment' }, { status: 500 });
  }
}
