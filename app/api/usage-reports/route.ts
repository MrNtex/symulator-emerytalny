import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { UsageReport } from '@/shared/models/UsageReport';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Walidacja danych
    const requiredFields = ['date', 'time', 'expectedPension', 'age', 'gender', 'salary', 'includedSickPeriods', 'accountFunds', 'realPension', 'adjustedPension'];
    
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Brak wymaganego pola: ${field}` },
          { status: 400 }
        );
      }
    }

    // Przygotowanie danych do zapisu
    const usageReport: UsageReport = {
      date: body.date,
      time: body.time,
      expectedPension: Number(body.expectedPension),
      age: Number(body.age),
      gender: body.gender,
      salary: Number(body.salary),
      includedSickPeriods: Boolean(body.includedSickPeriods),
      accountFunds: Number(body.accountFunds),
      realPension: Number(body.realPension),
      adjustedPension: Number(body.adjustedPension),
      postalCode: body.postalCode || '', // Opcjonalny - pusty string jeśli nie podano
    };

    // Połączenie z MongoDB
    const client = await clientPromise;
    const db = client.db('zus_simulator');
    const collection = db.collection('usage_reports');

    // Zapisanie danych
    const result = await collection.insertOne(usageReport);

    return NextResponse.json(
      { 
        success: true, 
        id: result.insertedId,
        message: 'Raport użycia został zapisany' 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Błąd podczas zapisywania raportu:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas zapisywania danych' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('zus_simulator');
    const collection = db.collection('usage_reports');

    // Pobranie wszystkich raportów (dla admina)
    const reports = await collection.find({}).sort({ date: -1, time: -1 }).toArray();

    return NextResponse.json({ reports }, { status: 200 });

  } catch (error) {
    console.error('Błąd podczas pobierania raportów:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania danych' },
      { status: 500 }
    );
  }
}
