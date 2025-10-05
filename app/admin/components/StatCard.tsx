import { Video as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
<<<<<<< HEAD
  icon: typeof LucideIcon;
=======
  icon: LucideIcon;
>>>>>>> ad5475a7ad2f6ff6f5fc0764adf30d77c4176cde
  subtitle?: string;
  color?: string;
}

export default function StatCard({ title, value, icon: Icon, subtitle, color = '#00993F' }: StatCardProps) {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #dce7dc',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 6px rgba(0, 65, 110, 0.08)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 65, 110, 0.12)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 65, 110, 0.08)';
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <h3 style={{
          color: '#00416E',
          fontSize: '14px',
          fontWeight: '600',
          opacity: 0.8
        }}>
          {title}
        </h3>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: `${color}15`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={22} color={color} />
        </div>
      </div>

      <div style={{
        fontSize: '28px',
        fontWeight: '700',
        color: color,
        marginBottom: '4px'
      }}>
        {value}
      </div>

      {subtitle && (
        <p style={{
          color: '#6b7280',
          fontSize: '13px',
          fontWeight: '500'
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
