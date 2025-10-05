import Dashboard from '@/components/Dashboard/Dashboard';
import balanceDataJson from '@/shared/data/balance.json';

export default function Page() {
  return <Dashboard balanceData={balanceDataJson} />;
}
