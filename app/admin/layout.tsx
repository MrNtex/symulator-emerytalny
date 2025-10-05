import AdminSidebar from './components/AdminSidebar';

export const metadata = {
  title: 'Panel Admina - ZUS Symulator',
  description: 'Panel administratora symulatora emerytalnego ZUS',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f9fdf9'
    }}>
      <AdminSidebar />
      <main style={{
        flex: 1,
        padding: '32px',
        maxWidth: '1400px',
        width: '100%'
      }}>
        {children}
      </main>
    </div>
  );
}
