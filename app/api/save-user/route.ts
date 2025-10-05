import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db('emerytura');
    const collection = db.collection('users');

    const userData = {
      ...body,
      createdAt: new Date(),
      timestamp: Date.now(),
    };

    const result = await collection.insertOne(userData);

    return NextResponse.json(
      {
        success: true,
        message: 'Dane użytkownika zostały zapisane',
        id: result.insertedId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving user data to MongoDB:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Błąd podczas zapisywania danych',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
