'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, TrendingUp, TriangleAlert as AlertTriangle, FileText } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Raporty użytkowników', icon: Users },
    { href: '/admin/indicators', label: 'Wskaźniki', icon: TrendingUp },
    { href: '/admin/errors', label: 'Błędy', icon: AlertTriangle },
    { href: '/admin/exports', label: 'Eksport', icon: FileText },
  ];

  return (
    <aside style={{
      width: '260px',
      minHeight: '100vh',
      backgroundColor: '#fff',
      borderRight: '1px solid #dce7dc',
      padding: '24px 0',
      position: 'sticky',
      top: 0,
      boxShadow: '2px 0 6px rgba(0, 65, 110, 0.05)'
    }}>
      <div style={{ padding: '0 20px', marginBottom: '32px' }}>
        <h2 style={{
          color: '#00416E',
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '4px'
        }}>
          Panel Admina
        </h2>
        <p style={{
          color: '#00993F',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          ZUS Symulator
        </p>
      </div>

      <nav>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 20px',
                color: isActive ? '#00416E' : '#6b7280',
                backgroundColor: isActive ? 'rgba(0, 153, 63, 0.08)' : 'transparent',
                borderLeft: isActive ? '4px solid #00993F' : '4px solid transparent',
                fontWeight: isActive ? '600' : '500',
                fontSize: '15px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
