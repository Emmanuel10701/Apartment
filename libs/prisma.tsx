// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// Log connection success
async function connect() {
  try {
    await prisma.$connect();
    console.log('Connected to the database successfully.');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

// Call the connect function to log the connection status
connect();

export default prisma;
