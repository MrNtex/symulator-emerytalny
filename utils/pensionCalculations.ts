interface BalanceData {
    mainBalance: number;
    subBalance: number;
  }
  
  interface BalanceRecord {
    [year: string]: BalanceData;
  }
  
  export function calculateTotalBalance(balanceData: BalanceRecord): {
    totalMain: number;
    totalSub: number;
    total: number;
  } {
    let totalMain = 0;
    let totalSub = 0;
  
    Object.values(balanceData).forEach(data => {
      totalMain += data.mainBalance;
      totalSub += data.subBalance;
    });
  
    return {
      totalMain: Math.round(totalMain * 100) / 100,
      totalSub: Math.round(totalSub * 100) / 100,
      total: Math.round((totalMain + totalSub) * 100) / 100
    };
  }
  
  export function getLatestBalance(balanceData: BalanceRecord): {
    year: string;
    mainBalance: number;
    subBalance: number;
    total: number;
  } {
    const years = Object.keys(balanceData)
      .filter(year => !isNaN(parseInt(year)))
      .sort((a, b) => parseInt(b) - parseInt(a));
  
    if (years.length === 0) {
      return { year: '0', mainBalance: 0, subBalance: 0, total: 0 };
    }
  
    const latestYear = years[0];
    const data = balanceData[latestYear];
  
    return {
      year: latestYear,
      mainBalance: Math.round(data.mainBalance * 100) / 100,
      subBalance: Math.round(data.subBalance * 100) / 100,
      total: Math.round((data.mainBalance + data.subBalance) * 100) / 100
    };
  }
  
  export function getBalanceByYear(balanceData: BalanceRecord, year: string): {
    mainBalance: number;
    subBalance: number;
    total: number;
  } {
    const data = balanceData[year];
  
    if (!data) {
      return { mainBalance: 0, subBalance: 0, total: 0 };
    }
  
    return {
      mainBalance: Math.round(data.mainBalance * 100) / 100,
      subBalance: Math.round(data.subBalance * 100) / 100,
      total: Math.round((data.mainBalance + data.subBalance) * 100) / 100
    };
  }
  
  export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pl-PL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
  