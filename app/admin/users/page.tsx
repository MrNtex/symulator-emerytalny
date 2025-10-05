'use client';

import { useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import DataTable from '../components/DataTable';
import { mockUserReports } from '../mockData';
import { Download, Search } from 'lucide-react';

export default function UsersReportsPage() {
  const [reports] = useState(mockUserReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Data', 'Rok startu', 'Rok emerytury', 'Płeć', 'Wynagrodzenie', 'Emerytura', 'Stopa zastąpienia', 'PDF'];
    const rows = filteredReports.map(r => [
      r.id,
      new Date(r.created_at).toLocaleDateString('pl-PL'),
      r.start_year,
      r.retirement_year,
      r.gender,
      r.salary,
      r.pension_amount,
      `${r.replacement_rate}%`,
      r.pdf_downloaded ? 'Tak' : 'Nie'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `raporty_uzytkownikow_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredReports = reports.filter(report => {
    const matchesGender = genderFilter === 'all' || report.gender === genderFilter;
    const matchesYear = yearFilter === 'all' || report.retirement_year.toString() === yearFilter;
    const matchesSearch = searchTerm === '' ||
      report.id.includes(searchTerm) ||
      report.salary.toString().includes(searchTerm);

    return matchesGender && matchesYear && matchesSearch;
  });

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'created_at',
      label: 'Data',
      render: (value: unknown) => new Date(String(value)).toLocaleDateString('pl-PL')
    },
    { key: 'start_year', label: 'Rok startu' },
    { key: 'retirement_year', label: 'Rok emerytury' },
    {
      key: 'gender',
      label: 'Płeć',
      render: (value: unknown) => (
        <span style={{
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: String(value) === 'M' ? '#dbeafe' : '#fce7f3',
          color: String(value) === 'M' ? '#1e40af' : '#be185d'
        }}>
          {String(value) === 'M' ? 'Mężczyzna' : 'Kobieta'}
        </span>
      )
    },
    {
      key: 'salary',
      label: 'Wynagrodzenie',
      render: (value: unknown) => `${Number(value).toLocaleString('pl-PL')} zł`
    },
    {
      key: 'pension_amount',
      label: 'Emerytura',
      render: (value: unknown) => (
        <span style={{ fontWeight: '600', color: '#00993F' }}>
          {Number(value).toLocaleString('pl-PL')} zł
        </span>
      )
    },
    {
      key: 'replacement_rate',
      label: 'Stopa zastąpienia',
      render: (value: unknown) => `${Number(value)}%`
    },
    {
      key: 'pdf_downloaded',
      label: 'PDF',
      render: (value: unknown) => (
        <span style={{
          padding: '4px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600',
          backgroundColor: value ? '#dcfce7' : '#fee2e2',
          color: value ? '#166534' : '#991b1b'
        }}>
          {value ? '✓' : '✗'}
        </span>
      )
    },
  ];

  return (
    <div>
      <AdminHeader title="Raporty użytkowników" onRefresh={handleRefresh} />

      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #dce7dc',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 6px rgba(0, 65, 110, 0.08)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr auto',
          gap: '16px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{
              display: 'block',
              color: '#00416E',
              fontWeight: '600',
              marginBottom: '6px',
              fontSize: '14px'
            }}>
              Wyszukaj
            </label>
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280'
                }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ID lub wynagrodzenie..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: '1px solid #bcd9c2',
                  borderRadius: '6px',
                  fontSize: '14px',
                  color: '#00416E',
                  backgroundColor: '#f9fdf9'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#00416E',
              fontWeight: '600',
              marginBottom: '6px',
              fontSize: '14px'
            }}>
              Płeć
            </label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #bcd9c2',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#00416E',
                backgroundColor: '#f9fdf9'
              }}
            >
              <option value="all">Wszystkie</option>
              <option value="M">Mężczyzna</option>
              <option value="K">Kobieta</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              color: '#00416E',
              fontWeight: '600',
              marginBottom: '6px',
              fontSize: '14px'
            }}>
              Rok emerytury
            </label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #bcd9c2',
                borderRadius: '6px',
                fontSize: '14px',
                color: '#00416E',
                backgroundColor: '#f9fdf9'
              }}
            >
              <option value="all">Wszystkie</option>
              <option value="2051">2051</option>
              <option value="2052">2052</option>
              <option value="2053">2053</option>
              <option value="2054">2054</option>
              <option value="2055">2055</option>
              <option value="2056">2056</option>
              <option value="2057">2057</option>
              <option value="2060">2060</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#00993F',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#008536';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#00993F';
            }}
          >
            <Download size={16} />
            Eksportuj CSV
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={filteredReports} itemsPerPage={10} />

      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '6px'
      }}>
        <p style={{
          color: '#6b7280',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          Znaleziono: <strong style={{ color: '#00416E' }}>{filteredReports.length}</strong> raportów
        </p>
      </div>
    </div>
  );
}
