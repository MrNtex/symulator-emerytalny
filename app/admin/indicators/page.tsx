'use client';

import { useState } from 'react';
import AdminHeader from '../components/AdminHeader';
import { mockEconomicIndicators } from '@/shared/data/mockData';
import { CreditCard as Edit2, Save, X } from 'lucide-react';

type IndicatorType = 'wage_growth' | 'inflation' | 'pension_valorization' | 'life_expectancy';

export default function IndicatorsPage() {
  const [indicators, setIndicators] = useState(mockEconomicIndicators);
  const [activeTab, setActiveTab] = useState<IndicatorType>('wage_growth');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const handleRefresh = () => {
    window.location.reload();
  };

  const tabs: { id: IndicatorType; label: string; emoji: string }[] = [
    { id: 'wage_growth', label: 'Wzrost płac', emoji: '📈' },
    { id: 'inflation', label: 'Inflacja (CPI)', emoji: '💸' },
    { id: 'pension_valorization', label: 'Waloryzacja ZUS', emoji: '💰' },
    { id: 'life_expectancy', label: 'Tablice trwania życia', emoji: '🧓' },
  ];

  const filteredIndicators = indicators
    .filter(ind => ind.indicator_type === activeTab)
    .sort((a, b) => b.year - a.year);

  const handleEdit = (id: string, currentValue: number) => {
    setEditingId(id);
    setEditValue(currentValue.toString());
  };

  const handleSave = (id: string) => {
    setIndicators(prev =>
      prev.map(ind =>
        ind.id === id
          ? { ...ind, value: parseFloat(editValue), updated_at: new Date().toISOString() }
          : ind
      )
    );
    setEditingId(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  return (
    <div>
      <AdminHeader title="Wskaźniki makroekonomiczne" onRefresh={handleRefresh} />

      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #dce7dc',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 6px rgba(0, 65, 110, 0.08)'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #dce7dc'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '16px 20px',
                backgroundColor: activeTab === tab.id ? '#00416E' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#00416E',
                border: 'none',
                borderBottom: activeTab === tab.id ? 'none' : '2px solid transparent',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 153, 63, 0.05)';
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '24px' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                borderBottom: '2px solid #dce7dc'
              }}>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: '#00416E',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Rok
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: '#00416E',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Wartość
                </th>
                {activeTab === 'life_expectancy' && (
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    color: '#00416E',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Płeć
                  </th>
                )}
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: '#00416E',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Źródło
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: '#00416E',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Ostatnia aktualizacja
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  color: '#00416E',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Akcje
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredIndicators.map((indicator) => (
                <tr
                  key={indicator.id}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fdf9';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    {indicator.year}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px'
                  }}>
                    {editingId === indicator.id ? (
                      <input
                        type="number"
                        step="0.1"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        style={{
                          width: '100px',
                          padding: '6px 10px',
                          border: '1px solid #00993F',
                          borderRadius: '4px',
                          fontSize: '14px',
                          color: '#00416E'
                        }}
                        autoFocus
                      />
                    ) : (
                      <span style={{ fontWeight: '600', color: '#00993F' }}>
                        {indicator.value}{activeTab === 'life_expectancy' ? ' lat' : '%'}
                      </span>
                    )}
                  </td>
                  {activeTab === 'life_expectancy' && (
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: indicator.gender === 'M' ? '#dbeafe' : '#fce7f3',
                        color: indicator.gender === 'M' ? '#1e40af' : '#be185d'
                      }}>
                        {indicator.gender === 'M' ? 'M' : 'K'}
                      </span>
                    </td>
                  )}
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    {indicator.source}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    color: '#6b7280'
                  }}>
                    {new Date(indicator.updated_at).toLocaleDateString('pl-PL')}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    textAlign: 'center'
                  }}>
                    {editingId === indicator.id ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleSave(indicator.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#00993F',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Save size={14} />
                          Zapisz
                        </button>
                        <button
                          onClick={handleCancel}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#f3f4f6',
                            color: '#00416E',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <X size={14} />
                          Anuluj
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(indicator.id, indicator.value)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#00416E',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit2 size={14} />
                        Edytuj
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '6px'
      }}>
        <p style={{
          color: '#856404',
          fontSize: '14px',
          fontWeight: '500',
          margin: 0
        }}>
          <strong>Uwaga:</strong> Zmiany w wskaźnikach wpłyną na wszystkie nowe obliczenia emerytur. Upewnij się, że wartości są poprawne przed zapisem.
        </p>
      </div>
    </div>
  );
}
