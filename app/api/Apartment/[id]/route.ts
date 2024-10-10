import { NextResponse } from 'next/server';
import prisma from '../../../../libs/prisma';

// GET: Fetch a single apartment by ID
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const apartment = await prisma.apartment.findUnique({
      where: { id: String(id) },
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
export async function PUT(req: Request) {
  const { id, ...data } = await req.json();

  try {
    const apartmentExists = await prisma.apartment.findUnique({
      where: { id: String(id) },
    });

    if (!apartmentExists) {
      return NextResponse.json({ message: 'Apartment not found' }, { status: 404 });
    }

    const updatedApartment = await prisma.apartment.update({
      where: { id: String(id) },
      data,
    });

    return NextResponse.json(updatedApartment, { status: 200 });
  } catch (error) {
    console.error('Error updating apartment:', error);
    return NextResponse.json({ message: 'Error updating apartment' }, { status: 500 });
  }
}

// DELETE: Delete an apartment
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    const apartmentExists = await prisma.apartment.findUnique({
      where: { id: String(id) },
    });

    if (!apartmentExists) {
      return NextResponse.json({ message: 'Apartment not found' }, { status: 404 });
    }

    await prisma.apartment.delete({
      where: { id: String(id) },
    });

    return NextResponse.json({ message: 'Apartment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting apartment:', error);
    return NextResponse.json({ message: 'Error deleting apartment' }, { status: 500 });
  }
}
