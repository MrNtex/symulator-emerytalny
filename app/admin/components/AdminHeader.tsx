'use client';

import { RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  onRefresh?: () => void;
}

export default function AdminHeader({ title, onRefresh }: AdminHeaderProps) {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      paddingBottom: '16px',
      borderBottom: '2px solid #00993F'
    }}>
      <h1 style={{
        color: '#00416E',
        fontSize: '28px',
        fontWeight: '700'
      }}>
        {title}
      </h1>

      {onRefresh && (
        <button
          onClick={onRefresh}
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
          <RefreshCw size={16} />
          Odśwież dane
        </button>
      )}
    </header>
  );
}
