import { NextResponse } from 'next/server';
import prisma from '../../../libs/prisma'; // Adjust the path as needed
import path from 'path';
import fs from 'fs';

// POST request handler to create a new apartment
export async function POST(request: Request) {
  try {
    const body = await request.json(); // Read JSON body

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
      kitchenImageFile,
      livingRoomImageFile,
      bedroomImageFile,
      apartmentImageFile,
    } = body;

    // Validate required fields
    if (!name || !minPrice || !maxPrice || !rentalType || !propertyType || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Function to handle file uploads
    const handleFileUpload = async (imageFile: File): Promise<string | null> => {
      if (!imageFile) return null;

      try {
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, imageFile.name);
        const buffer = Buffer.from(await imageFile.arrayBuffer());

        fs.writeFileSync(filePath, buffer);
        return `/uploads/${imageFile.name}`; // Return the URL to access the image
      } catch (fileError: any) {
        console.error('File upload error:', fileError.message);
        throw new Error('File upload failed');
      }
    };

    // Upload images
    const kitchenImageUrl = await handleFileUpload(kitchenImageFile);
    const livingRoomImageUrl = await handleFileUpload(livingRoomImageFile);
    const bedroomImageUrl = await handleFileUpload(bedroomImageFile);
    const apartmentImageUrl = await handleFileUpload(apartmentImageFile);

    // Create the new apartment in the database
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
        kitchenImage: kitchenImageUrl,
        livingRoomImage: livingRoomImageUrl,
        bedroomImage: bedroomImageUrl,
        apartmentImage: apartmentImageUrl,
      },
    });

    return NextResponse.json(newApartment, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET request handler to fetch all apartments
export async function GET() {
  try {
    const apartments = await prisma.apartment.findMany({
      orderBy: {
        createdAt: 'desc', // Order apartments by `createdAt` field in descending order
      },
    });

    return NextResponse.json(apartments);
  } catch (dbError: any) {
    console.error('Database operation error:', dbError.message);
    return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
  }
}
