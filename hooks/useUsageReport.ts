import { useState } from 'react';
import { UsageReport } from '@/shared/models/UsageReport';

interface UseUsageReportReturn {
  sendUsageReport: (data: Partial<UsageReport>) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const useUsageReport = (): UseUsageReportReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendUsageReport = async (data: Partial<UsageReport>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/usage-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Błąd podczas wysyłania danych');
      }

      const result = await response.json();
      console.log('Raport użycia zapisany:', result);
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Nieznany błąd';
      setError(errorMessage);
      console.error('Błąd wysyłania raportu:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendUsageReport,
    isLoading,
    error,
  };
};
