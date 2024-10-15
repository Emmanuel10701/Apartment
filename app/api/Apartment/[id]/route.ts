import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../libs/prisma';

export async function GET(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop();

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

export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop();
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
      kitchenImage: body.kitchenImage,
      livingRoomImage: body.livingRoomImage,
      bedroomImage: body.bedroomImage,
      apartmentImage: body.apartmentImage,
      phoneNumber: body.phoneNumber,
      email: body.email,
      address: body.address,
      userId: body.userId,
    },
  });

  return NextResponse.json(updatedApartment);
}

export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const id = pathname.split('/').pop();

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
