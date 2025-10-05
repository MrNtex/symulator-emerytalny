'use client';

import { useState } from 'react';
import AdminHeader from './components/AdminHeader';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';
import { ChartBar as BarChart3, DollarSign, TrendingUp, FileDown, TriangleAlert as AlertTriangle, Clock } from 'lucide-react';
import { mockDashboardStats, mockChartData } from './mockData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats] = useState(mockDashboardStats);
  const [chartData] = useState(mockChartData);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div>
      <AdminHeader title="Dashboard" onRefresh={handleRefresh} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <StatCard
          title="Wygenerowane raporty"
          value={stats.totalReports}
          icon={BarChart3}
          subtitle="Wszystkie raporty"
          color="#00993F"
        />
        <StatCard
          title="Średnia emerytura"
          value={`${stats.avgPension.toLocaleString('pl-PL')} zł`}
          icon={DollarSign}
          subtitle="Urealniona"
          color="#00416E"
        />
        <StatCard
          title="Średnia stopa zastąpienia"
          value={`${stats.avgReplacementRate}%`}
          icon={TrendingUp}
          subtitle="Procent wynagrodzenia"
          color="#00993F"
        />
        <StatCard
          title="Pobrania PDF"
          value={stats.pdfDownloads}
          icon={FileDown}
          subtitle="Wszystkie pobrania"
          color="#00416E"
        />
        <StatCard
          title="Błędy systemowe"
          value={stats.systemErrors}
          icon={AlertTriangle}
          subtitle="Nierozwiązane"
          color="#dc2626"
        />
        <StatCard
          title="Ostatnia aktualizacja"
          value={new Date(stats.lastUpdate).toLocaleDateString('pl-PL')}
          icon={Clock}
          subtitle={new Date(stats.lastUpdate).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
          color="#6b7280"
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <ChartCard title="Wzrost płac vs Inflacja">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.wageVsInflation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dce7dc" />
              <XAxis dataKey="year" stroke="#00416E" />
              <YAxis stroke="#00416E" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #dce7dc',
                  borderRadius: '6px',
                  padding: '8px 12px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="wzrostPlac"
                stroke="#00993F"
                strokeWidth={2}
                name="Wzrost płac (%)"
                dot={{ fill: '#00993F', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="inflacja"
                stroke="#dc2626"
                strokeWidth={2}
                name="Inflacja (%)"
                dot={{ fill: '#dc2626', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Liczba raportów na miesiąc">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.reportsPerMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dce7dc" />
              <XAxis dataKey="month" stroke="#00416E" />
              <YAxis stroke="#00416E" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #dce7dc',
                  borderRadius: '6px',
                  padding: '8px 12px'
                }}
              />
              <Bar
                dataKey="count"
                fill="#00416E"
                name="Liczba raportów"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
