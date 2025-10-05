'use client';

import { useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import DataTable from '../components/DataTable';
import { mockMonthlyReports } from '../mockData';
import { FileDown, FileText, FileJson } from 'lucide-react';

export default function ExportsPage() {
  const [reports] = useState(mockMonthlyReports);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGenerateMonthly = () => {
    alert('Funkcja generowania raportu miesięcznego zostanie wkrótce dodana!');
  };

  const handleExportCSV = () => {
    const headers = ['Miesiąc', 'Śr. emerytura (zł)', 'Śr. stopa zastąpienia (%)', 'Liczba raportów'];
    const rows = reports.map(r => [
      new Date(r.month).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long' }),
      r.avg_pension,
      r.avg_replacement_rate,
      r.report_count
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `raporty_miesieczne_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(reports, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `raporty_miesieczne_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleExportPDF = () => {
    alert('Funkcja eksportu do PDF zostanie wkrótce dodana!');
  };

  const columns = [
    {
      key: 'month',
      label: 'Miesiąc',
      render: (value: unknown) => (
        <span style={{ fontWeight: '600', color: '#00416E', fontSize: '14px' }}>
          {new Date(String(value)).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long' })}
        </span>
      )
    },
    {
      key: 'avg_pension',
      label: 'Śr. emerytura (urealniona)',
      render: (value: unknown) => (
        <span style={{ fontWeight: '600', color: '#00993F', fontSize: '15px' }}>
          {Number(value).toLocaleString('pl-PL')} zł
        </span>
      )
    },
    {
      key: 'avg_replacement_rate',
      label: 'Śr. stopa zastąpienia',
      render: (value: unknown) => (
        <span style={{ fontWeight: '600', color: '#00416E' }}>
          {Number(value)}%
        </span>
      )
    },
    {
      key: 'report_count',
      label: 'Liczba raportów',
      render: (value: unknown) => (
        <span style={{
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '13px',
          fontWeight: '600',
          backgroundColor: '#e0e7ff',
          color: '#3730a3'
        }}>
          {Number(value)}
        </span>
      )
    },
    {
      key: 'generated_at',
      label: 'Data wygenerowania',
      render: (value: unknown) => (
        <span style={{ fontSize: '13px', color: '#6b7280' }}>
          {new Date(String(value)).toLocaleDateString('pl-PL')}
        </span>
      )
    },
  ];

  return (
    <div>
      <AdminHeader title="Eksport i raporty" onRefresh={handleRefresh} />

      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #dce7dc',
        borderRadius: '8px',
        padding: '28px',
        marginBottom: '32px',
        boxShadow: '0 2px 6px rgba(0, 65, 110, 0.08)'
      }}>
        <h3 style={{
          color: '#00416E',
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          Generowanie raportów
        </h3>
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          marginBottom: '20px'
        }}>
          Wygeneruj zbiorczy raport miesięczny zawierający wszystkie dane statystyczne.
        </p>
        <button
          onClick={handleGenerateMonthly}
          style={{
            padding: '12px 24px',
            backgroundColor: '#00993F',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#008536';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#00993F';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <FileText size={18} />
          Generuj raport miesięczny
        </button>
      </div>

      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #dce7dc',
        borderRadius: '8px',
        padding: '28px',
        marginBottom: '32px',
        boxShadow: '0 2px 6px rgba(0, 65, 110, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{
            color: '#00416E',
            fontSize: '18px',
            fontWeight: '600',
            margin: 0
          }}>
            Eksportuj dane
          </h3>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleExportPDF}
              style={{
                padding: '10px 18px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#b91c1c';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
            >
              <FileDown size={16} />
              PDF
            </button>

            <button
              onClick={handleExportCSV}
              style={{
                padding: '10px 18px',
                backgroundColor: '#00416E',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#003d5c';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#00416E';
              }}
            >
              <FileDown size={16} />
              CSV
            </button>

            <button
              onClick={handleExportJSON}
              style={{
                padding: '10px 18px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#4b5563';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#6b7280';
              }}
            >
              <FileJson size={16} />
              JSON
            </button>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #dce7dc',
        borderRadius: '8px',
        padding: '28px',
        boxShadow: '0 2px 6px rgba(0, 65, 110, 0.08)'
      }}>
        <h3 style={{
          color: '#00416E',
          fontSize: '18px',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          Raporty miesięczne
        </h3>
        <DataTable columns={columns} data={reports} itemsPerPage={10} />
      </div>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '6px'
      }}>
        <p style={{
          color: '#075985',
          fontSize: '14px',
          fontWeight: '500',
          margin: 0
        }}>
          <strong>Informacja:</strong> Raporty miesięczne są generowane automatycznie pierwszego dnia każdego miesiąca. Możesz również wygenerować raport ręcznie za pomocą przycisku powyżej.
        </p>
      </div>
    </div>
  );
}
