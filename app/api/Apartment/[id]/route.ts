import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../libs/prisma'; // Adjust this path to your Prisma instance

// GET: Retrieve a single apartment by ID
export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract the apartment ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  const apartment = await prisma.apartment.findUnique({
    where: { id: String(id) },
  });

  if (!apartment) {
    return new NextResponse(
      JSON.stringify({ message: 'Apartment not found' }),
      { status: 404 }
    );
  }

  return NextResponse.json(apartment);
}

// PUT: Update an apartment by ID
export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract the apartment ID from the URL
  const body = await req.json();

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  const updatedApartment = await prisma.apartment.update({
    where: { id: String(id) },
    data: {
      name: body.name,
      minPrice: body.minPrice,
      maxPrice: body.maxPrice,
      rentalType: body.rentalType,
      starRating: body.starRating,
      propertyType: body.propertyType,
      images: body.images,
      phoneNumber: body.phoneNumber,
      email: body.email,
      address: body.address,
      userId: body.userId,  // Ensure user ID exists in the User model
    },
  });

  return NextResponse.json(updatedApartment);
}

// DELETE: Delete an apartment by ID
export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop(); // Extract the apartment ID from the URL

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'ID is required' }),
      { status: 400 }
    );
  }

  await prisma.apartment.delete({
    where: { id: String(id) },
  });

  return new NextResponse(null, { status: 204 });
}
