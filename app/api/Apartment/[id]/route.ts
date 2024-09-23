import { NextResponse } from 'next/server';
import prisma from '../../../../libs/prisma'; // Adjust the path to your Prisma instance

// GET: Fetch a specific apartment by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const apartment = await prisma.apartment.findUnique({
      where: { id: String(id) }, // Assuming the ID is numeric
    });

    if (!apartment) {
      return NextResponse.json({ message: 'Apartment not found' }, { status: 404 });
    }

    return NextResponse.json(apartment, { status: 200 });
  } catch (error) {
    console.error('Error fetching apartment:', error);
    return NextResponse.json({ message: 'Error fetching apartment' }, { status: 500 });
  }
}

// PUT: Update an existing apartment
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const data = await req.json();
    const { name, minPrice, maxPrice, rentalType, starRating, propertyType, images, phoneNumber, email, address } = data;

    // Validation can be added here as needed
    if (!name || !minPrice || !maxPrice || !rentalType || !propertyType || !email) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const updatedApartment = await prisma.apartment.update({
      where: { id: String(id) },
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

    return NextResponse.json(updatedApartment, { status: 200 });
  } catch (error) {
    console.error('Error updating apartment:', error);
    return NextResponse.json({ message: 'Error updating apartment' }, { status: 500 });
  }
}

// DELETE: Delete an apartment
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await prisma.apartment.delete({
      where: { id: String(id) },
    });

    return NextResponse.json({ message: 'Apartment deleted successfully' }, { status: 204 });
  } catch (error) {
    console.error('Error deleting apartment:', error);
    return NextResponse.json({ message: 'Error deleting apartment' }, { status: 500 });
  }
}
