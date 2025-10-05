'use client';

import { useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import DataTable from '../components/DataTable';
import { mockSystemErrors } from '../mockData';
import { CheckCircle, Filter } from 'lucide-react';

export default function ErrorsPage() {
  const [errors, setErrors] = useState(mockSystemErrors);
  const [typeFilter, setTypeFilter] = useState('all');

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleResolve = (id: string) => {
    setErrors(prev =>
      prev.map(err =>
        err.id === id
          ? { ...err, resolved: true, resolved_at: new Date().toISOString() }
          : err
      )
    );
  };

  const filteredErrors = errors.filter(error => {
    if (typeFilter === 'all') return true;
    return error.error_type === typeFilter;
  });

  const unresolvedCount = errors.filter(e => !e.resolved).length;

  const columns = [
    {
      key: 'created_at',
      label: 'Data',
      render: (value: unknown) => (
        <div>
          <div style={{ fontWeight: '500', color: '#374151' }}>
            {new Date(String(value)).toLocaleDateString('pl-PL')}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {new Date(String(value)).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    },
    {
      key: 'error_type',
      label: 'Typ',
      render: (value: unknown) => {
        const valueStr = String(value);
        const colors: { [key: string]: { bg: string; text: string } } = {
          api_error: { bg: '#fee2e2', text: '#991b1b' },
          pdf_error: { bg: '#fef3c7', text: '#92400e' },
          data_missing: { bg: '#e0e7ff', text: '#3730a3' },
          calculation_error: { bg: '#fce7f3', text: '#831843' },
        };

        const labels: { [key: string]: string } = {
          api_error: 'Błąd API',
          pdf_error: 'Błąd PDF',
          data_missing: 'Brak danych',
          calculation_error: 'Błąd obliczeń',
        };

        return (
          <span style={{
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            backgroundColor: colors[valueStr]?.bg || '#f3f4f6',
            color: colors[valueStr]?.text || '#374151'
          }}>
            {labels[valueStr] || valueStr}
          </span>
        );
      }
    },
    {
      key: 'message',
      label: 'Komunikat',
      render: (value: unknown) => (
        <div style={{
          maxWidth: '300px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          color: '#374151',
          fontSize: '14px'
        }}>
          {String(value)}
        </div>
      )
    },
    {
      key: 'module',
      label: 'Moduł',
      render: (value: unknown) => (
        <span style={{
          fontWeight: '500',
          color: '#00416E',
          fontSize: '13px'
        }}>
          {String(value)}
        </span>
      )
    },
    {
      key: 'user_id',
      label: 'Użytkownik',
      render: (value: unknown) => (
        <span style={{
          fontSize: '13px',
          color: value ? '#6b7280' : '#9ca3af',
          fontStyle: value ? 'normal' : 'italic'
        }}>
          {value ? String(value) : 'System'}
        </span>
      )
    },
    {
      key: 'resolved',
      label: 'Status',
      render: (value: unknown, row: Record<string, unknown>) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {value ? (
            <div>
              <div style={{
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: '#dcfce7',
                color: '#166534',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle size={14} />
                Rozwiązany
              </div>
              {(() => {
                if (row.resolved_at && typeof row.resolved_at === 'string') {
                  return (
                    <div style={{
                      fontSize: '11px',
                      color: '#6b7280',
                      marginTop: '4px'
                    }}>
                      {new Date(row.resolved_at).toLocaleDateString('pl-PL')}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          ) : (
            <button
              onClick={() => handleResolve(String(row.id))}
              style={{
                padding: '6px 12px',
                backgroundColor: '#00993F',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#008536';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#00993F';
              }}
            >
              <CheckCircle size={14} />
              Oznacz jako rozwiązany
            </button>
          )}
        </div>
      )
    },
  ];

  return (
    <div>
      <AdminHeader title="Błędy i logi" onRefresh={handleRefresh} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #dce7dc',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 6px rgba(0, 65, 110, 0.08)'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Wszystkie błędy
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#00416E' }}>
            {errors.length}
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #dce7dc',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 6px rgba(0, 65, 110, 0.08)'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Nierozwiązane
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#dc2626' }}>
            {unresolvedCount}
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          border: '1px solid #dce7dc',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 6px rgba(0, 65, 110, 0.08)'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Rozwiązane
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#00993F' }}>
            {errors.length - unresolvedCount}
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #dce7dc',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 6px rgba(0, 65, 110, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Filter size={18} color="#00416E" />
          <label style={{
            color: '#00416E',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            Filtruj po typie błędu:
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #bcd9c2',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#00416E',
              backgroundColor: '#f9fdf9',
              minWidth: '200px'
            }}
          >
            <option value="all">Wszystkie błędy</option>
            <option value="api_error">Błędy API</option>
            <option value="pdf_error">Błędy PDF</option>
            <option value="data_missing">Brak danych</option>
            <option value="calculation_error">Błędy obliczeń</option>
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={filteredErrors} itemsPerPage={10} />
    </div>
  );
}
