import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../libs/prisma'; // Adjust the path if needed

// GET request: Retrieve a single apartment by ID
export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: 'Apartment ID is required.' }),
      { status: 400 }
    );
  }

  try {
    const apartment = await prisma.apartment.findUnique({
      where: { id: String(id) },
    });

    if (!apartment) {
      return new NextResponse(
        JSON.stringify({ error: 'Apartment not found.' }),
        { status: 404 }
      );
    }

    return NextResponse.json(apartment);
  } catch (error: any) {
    console.error('Error fetching apartment:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error fetching apartment.' }),
      { status: 500 }
    );
  }
}

// PUT request: Update an apartment by ID
export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL
  const body = await req.json();
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

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: 'Apartment ID is required.' }),
      { status: 400 }
    );
  }

  try {
    const updatedApartment = await prisma.apartment.update({
      where: { id: String(id) },
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
        kitchenImage,
        livingRoomImage,
        bedroomImage,
        apartmentImage,
      },
    });

    return NextResponse.json(updatedApartment);
  } catch (error: any) {
    console.error('Error updating apartment:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error updating apartment.' }),
      { status: 500 }
    );
  }
}

// DELETE request: Delete a single apartment by ID
export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ error: 'Apartment ID is required.' }),
      { status: 400 }
    );
  }

  try {
    const deletedApartment = await prisma.apartment.delete({
      where: { id: String(id) },
    });

    return NextResponse.json({ message: 'Apartment deleted successfully.', apartment: deletedApartment });
  } catch (error: any) {
    console.error('Error deleting apartment:', error);
    if (error.code === 'P2025') { // Prisma error code for not found
      return new NextResponse(JSON.stringify({ error: 'Apartment not found.' }), { status: 404 });
    }
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete apartment. Please try again later.', details: error.message }),
      { status: 500 }
    );
  }
}
