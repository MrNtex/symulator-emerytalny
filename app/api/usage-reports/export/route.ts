import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const client = await clientPromise;
    const db = client.db('emerytura');
    const collection = db.collection('usage_reports');

    // Budowanie filtra dat
    const filter: Record<string, any> = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    // Pobranie danych
    const reports = await collection.find(filter).sort({ date: -1, time: -1 }).toArray();

    if (format === 'csv') {
      // Eksport do CSV
      const headers = [
        'Data',
        'Godzina',
        'Emerytura oczekiwana',
        'Wiek',
        'Płeć',
        'Wynagrodzenie',
        'Uwzględniono choroby',
        'Środki na kontach',
        'Emerytura rzeczywista',
        'Emerytura urealniona',
        'Kod pocztowy'
      ];

      const csvRows = [
        headers.join(','),
        ...reports.map(report => [
          report.date,
          report.time,
          report.expectedPension,
          report.age,
          report.gender,
          report.salary,
          report.includedSickPeriods ? 'Tak' : 'Nie',
          report.accountFunds,
          report.realPension,
          report.adjustedPension,
          report.postalCode || ''
        ].join(','))
      ];

      const csvContent = csvRows.join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="raport-zainteresowania-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Eksport do JSON
    return NextResponse.json({
      reports,
      total: reports.length,
      exportedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Błąd podczas eksportu raportów:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas eksportu danych' },
      { status: 500 }
    );
  }
}
