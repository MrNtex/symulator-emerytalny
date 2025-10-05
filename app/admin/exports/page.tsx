'use client';

import { useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import DataTable from '../components/DataTable';
import { mockUsageReports } from '@/shared/data/mockData';
import { FileDown, FileJson } from 'lucide-react';

export default function ExportsPage() {
  const [reports] = useState(mockUsageReports);
  const [isExporting, setIsExporting] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGenerateMonthly = () => {
    alert('Funkcja generowania raportu miesięcznego zostanie wkrótce dodana!');
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);

      const response = await fetch('/api/users/export?format=csv');

      if (!response.ok) {
        throw new Error('Błąd podczas pobierania danych');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `baza_danych_uzytkownicy_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Błąd podczas eksportu do CSV:', error);
      alert('Wystąpił błąd podczas eksportu danych do CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      setIsExporting(true);

      const response = await fetch('/api/users/export?format=json');

      if (!response.ok) {
        throw new Error('Błąd podczas pobierania danych');
      }

      const data = await response.json();
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `baza_danych_uzytkownicy_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Błąd podczas eksportu do JSON:', error);
      alert('Wystąpił błąd podczas eksportu danych do JSON');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = () => {
    alert('Funkcja eksportu do PDF zostanie wkrótce dodana!');
  };

 const handleExportXLS = async () => {
  try {
    setIsExporting(true);

    const response = await fetch('/api/users/export?format=xls');

    if (!response.ok) {
      throw new Error('Błąd podczas pobierania danych');
    }

    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `baza_danych_uzytkownicy_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Błąd podczas eksportu do XLS:', error);
    alert('Wystąpił błąd podczas eksportu danych do XLS');
  } finally {
    setIsExporting(false);
  }
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
              disabled={isExporting}
              style={{
                padding: '10px 18px',
                backgroundColor: isExporting ? '#6b7280' : '#00416E',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s ease',
                opacity: isExporting ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!isExporting) {
                  e.currentTarget.style.backgroundColor = '#003d5c';
                }
              }}
              onMouseOut={(e) => {
                if (!isExporting) {
                  e.currentTarget.style.backgroundColor = '#00416E';
                }
              }}
            >
              <FileDown size={16} />
              CSV
            </button>

            <button
              onClick={handleExportJSON}
              disabled={isExporting}
              style={{
                padding: '10px 18px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s ease',
                opacity: isExporting ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!isExporting) {
                  e.currentTarget.style.backgroundColor = '#4b5563';
                }
              }}
              onMouseOut={(e) => {
                if (!isExporting) {
                  e.currentTarget.style.backgroundColor = '#6b7280';
                }
              }}
            >
              <FileJson size={16} />
              JSON
            </button>

            <button
              onClick={handleExportXLS}
              disabled={isExporting}
              style={{
                padding: '10px 18px',
                backgroundColor: isExporting ? '#6b7280' : '#00993F',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s ease',
                opacity: isExporting ? 0.7 : 1
              }}
              onMouseOver={(e) => {
                if (!isExporting) {
                  e.currentTarget.style.backgroundColor = '#008536';
                }
              }}
              onMouseOut={(e) => {
                if (!isExporting) {
                  e.currentTarget.style.backgroundColor = '#00993F';
                }
              }}
            >
              <FileDown size={16} />
              {isExporting ? 'Eksportowanie...' : 'XLS'}
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
