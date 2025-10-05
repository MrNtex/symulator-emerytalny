import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    const client = await clientPromise;
    const db = client.db('emerytura');
    const collection = db.collection('users');

    const users = await collection.find({}).sort({ createdAt: -1 }).toArray();

    if (format === 'xls') {
      const headers = [
        'ID',
        'Data utworzenia',
        'Wiek',
        'Płeć',
        'Wynagrodzenie brutto',
        'Rok rozpoczęcia pracy',
        'Planowany rok emerytury',
        'Dni chorobowe rocznie',
        'Uwzględnić choroby',
        'Uwzględnić opóźnioną emeryturę'
      ];

      const rows = users.map(user => [
        user._id.toString(),
        new Date(user.createdAt).toLocaleString('pl-PL'),
        user.age || '',
        user.sex || '',
        user.GrossSalary || '',
        user.StartYear || '',
        user.PlannedRetirementYear || '',
        user.sickDaysPerYear || '',
        user.includeSickDays ? 'Tak' : 'Nie',
        user.includeDelayedRetirement ? 'Tak' : 'Nie'
      ]);

      let table = '<table border="1" style="border-collapse:collapse;">';
      table += '<thead><tr>' + headers.map(h => `<th style="background:#00993F;color:white;padding:8px 12px;font-weight:bold;">${h}</th>`).join('') + '</tr></thead>';
      table += '<tbody>';
      rows.forEach((row, index) => {
        const bgColor = index % 2 === 0 ? '#f9fafb' : '#ffffff';
        table += '<tr style="background:' + bgColor + ';">' + row.map(cell => `<td style="padding:6px 10px;border:1px solid #ddd;">${cell}</td>`).join('') + '</tr>';
      });
      table += '</tbody></table>';

      const xlsContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="utf-8">
          <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Użytkownicy</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head>
        <body>
          ${table}
        </body>
        </html>
      `;

      return new NextResponse(`\uFEFF${xlsContent}`, {
        headers: {
          'Content-Type': 'application/vnd.ms-excel',
          'Content-Disposition': `attachment; filename="baza_danych_uzytkownicy_${new Date().toISOString().split('T')[0]}.xls"`
        }
      });
    }

    if (format === 'csv') {
      const headers = [
        'ID',
        'Data utworzenia',
        'Wiek',
        'Płeć',
        'Wynagrodzenie brutto',
        'Rok rozpoczęcia pracy',
        'Planowany rok emerytury',
        'Dni chorobowe rocznie',
        'Uwzględnić choroby',
        'Uwzględnić opóźnioną emeryturę'
      ];

      const csvRows = [
        headers.join(','),
        ...users.map(user => [
          user._id.toString(),
          new Date(user.createdAt).toLocaleString('pl-PL'),
          user.age || '',
          user.sex || '',
          user.GrossSalary || '',
          user.StartYear || '',
          user.PlannedRetirementYear || '',
          user.sickDaysPerYear || '',
          user.includeSickDays ? 'Tak' : 'Nie',
          user.includeDelayedRetirement ? 'Tak' : 'Nie'
        ].join(','))
      ];

      const csvContent = csvRows.join('\n');

      return new NextResponse(`\uFEFF${csvContent}`, {
        headers: {
          'Content-Type': 'text/csv;charset=utf-8;',
          'Content-Disposition': `attachment; filename="baza_danych_uzytkownicy_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    return NextResponse.json({
      users,
      total: users.length,
      exportedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Błąd podczas eksportu użytkowników:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas eksportu danych' },
      { status: 500 }
    );
  }
}
