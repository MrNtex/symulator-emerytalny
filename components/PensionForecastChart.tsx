'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BalanceData {
  mainBalance: number;
  subBalance: number;
}

interface PensionForecastChartProps {
  balanceData: { [year: string]: BalanceData };
  startYear?: number;
  endYear?: number;
}

export default function PensionForecastChart({
  balanceData,
  startYear,
  endYear
}: PensionForecastChartProps) {
  const [showCombined, setShowCombined] = useState(true);
  const years = Object.keys(balanceData)
    .filter(year => !isNaN(parseInt(year)) && parseInt(year) >= 2020)
    .sort((a, b) => parseInt(a) - parseInt(b));

  const filteredYears = years.filter(year => {
    const y = parseInt(year);
    if (startYear && y < startYear) return false;
    if (endYear && y > endYear) return false;
    return true;
  });

  const chartData = filteredYears.map(year => {
    const data = balanceData[year];
    return {
      year: year,
      'Saldo główne': Math.round(data.mainBalance),
      'Subsaldo': Math.round(data.subBalance),
      'Łącznie': Math.round(data.mainBalance + data.subBalance)
    };
  });

  const sampleEveryN = Math.ceil(filteredYears.length / 15);
  const sampledData = chartData.filter((_, index) => index % sampleEveryN === 0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M zł`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k zł`;
    }
    return `${value.toFixed(0)} zł`;
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '16px',
        gap: '8px'
      }}>
        <button
          onClick={() => setShowCombined(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: showCombined ? '#00993F' : '#f1f5f9',
            color: showCombined ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
        >
          Podwójne słupki
        </button>
        <button
          onClick={() => setShowCombined(false)}
          style={{
            padding: '8px 16px',
            backgroundColor: !showCombined ? '#00993F' : '#f1f5f9',
            color: !showCombined ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s ease'
          }}
        >
          Suma
        </button>
      </div>

      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={sampledData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#64748b', fontSize: 12 }}
              stroke="#cbd5e1"
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fill: '#64748b', fontSize: 12 }}
              stroke="#cbd5e1"
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px'
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
            {showCombined ? (
              <>
                <Bar dataKey="Saldo główne" fill="#00993F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Subsaldo" fill="#00416E" radius={[4, 4, 0, 0]} />
              </>
            ) : (
              <Bar dataKey="Łącznie" fill="#2563eb" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
