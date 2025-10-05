interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #dce7dc',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 6px rgba(0, 65, 110, 0.08)'
    }}>
      <h3 style={{
        color: '#00416E',
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '20px'
      }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
