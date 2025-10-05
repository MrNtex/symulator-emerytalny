interface SalaryGrowthData {
    [year: string]: string;
  }
  
  interface LifeExpectancyData {
    [age: string]: number;
  }
  
  interface AverageSalaryData {
    [year: string]: number;
  }
  
  export interface TimelineEvent {
    id: string;
    type: 'salary' | 'sickLeave' | 'subAccountDeposit';
    date?: string;
    startDate?: string;
    endDate?: string;
    amount?: number;
    title: string;
  }
  
  export interface YearlyBalance {
    year: number;
    mainBalance: number;
    subBalance: number;
    salary: number;
    contribution: number;
    sickDays: number;
  }
  
  interface CalculationParams {
    monthlyIncome: number;
    yearWorkStart: number;
    yearRetirement: number;
    gender: 'male' | 'female';
    includeSickDays?: boolean;
    sickDaysPerYear?: number;
    includeDelayedRetirement?: boolean;
    targetPension?: number;
  }
  
  const contributionRate = 0.1952;
  const monthsInYear = 12;
  const workingDaysPerMonth = 22;
  const inflationRate = 0.025;
  
  const parsePercentage = (percentageStr: string): number => {
    return parseFloat(percentageStr.replace('%', '')) / 100 - 1;
  };
  
  export function calculatePensionWithEvents(
    params: CalculationParams,
    events: TimelineEvent[],
    salaryGrowthData: SalaryGrowthData,
    averageSalaryData: AverageSalaryData
  ): {
    yearlyBalances: YearlyBalance[];
    totalMainBalance: number;
    totalSubBalance: number;
  } {
    const {
      monthlyIncome,
      yearWorkStart,
      yearRetirement,
      includeSickDays = false,
      sickDaysPerYear = 34,
    } = params;
  
    const yearlyBalances: YearlyBalance[] = [];
    let totalMainBalance = 0;
    let totalSubBalance = 0;
    let currentSalary = monthlyIncome;
  
    const salaryChanges = new Map<number, number>();
    events
      .filter((e) => e.type === 'salary' && e.date && e.amount)
      .forEach((e) => {
        const year = new Date(e.date!).getFullYear();
        salaryChanges.set(year, e.amount!);
      });
  
    const sickLeaves = new Map<number, number>();
    events
      .filter((e) => e.type === 'sickLeave' && e.startDate && e.endDate)
      .forEach((e) => {
        const startDate = new Date(e.startDate!);
        const endDate = new Date(e.endDate!);
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();
  
        for (let year = startYear; year <= endYear; year++) {
          let daysInYear = 0;
  
          if (year === startYear && year === endYear) {
            daysInYear = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          } else if (year === startYear) {
            const yearEnd = new Date(year, 11, 31);
            daysInYear = Math.ceil((yearEnd.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          } else if (year === endYear) {
            const yearStart = new Date(year, 0, 1);
            daysInYear = Math.ceil((endDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
          } else {
            daysInYear = 365;
          }
  
          sickLeaves.set(year, (sickLeaves.get(year) || 0) + daysInYear);
        }
      });
  
    const subAccountDeposits = new Map<number, number>();
    events
      .filter((e) => e.type === 'subAccountDeposit' && e.date && e.amount)
      .forEach((e) => {
        const year = new Date(e.date!).getFullYear();
        subAccountDeposits.set(year, (subAccountDeposits.get(year) || 0) + e.amount!);
      });
  
    for (let year = yearWorkStart; year < yearRetirement; year++) {
      if (salaryChanges.has(year)) {
        currentSalary = salaryChanges.get(year)!;
      }
  
      const yearStr = year.toString();
      const growthRateStr = salaryGrowthData[yearStr];
      const wageGrowthRate = growthRateStr ? parsePercentage(growthRateStr) : 0.0;
      const realGrowthRate = wageGrowthRate + inflationRate;
  
      let effectiveSickDays = 0;
      if (includeSickDays) {
        effectiveSickDays = sickLeaves.get(year) || sickDaysPerYear;
      }
  
      const dailySalary = currentSalary / workingDaysPerMonth;
      const sickDaysReduction = effectiveSickDays * dailySalary * contributionRate;
  
      let yearlyContribution = currentSalary * monthsInYear * contributionRate - sickDaysReduction;
  
      if (averageSalaryData[yearStr]) {
        const maxContribution = averageSalaryData[yearStr] * 30;
        if (yearlyContribution > maxContribution) {
          yearlyContribution = maxContribution;
        }
      }
  
      const subDeposit = subAccountDeposits.get(year) || 0;
  
      totalMainBalance += yearlyContribution;
      totalSubBalance += subDeposit;
  
      yearlyBalances.push({
        year,
        mainBalance: totalMainBalance,
        subBalance: totalSubBalance,
        salary: currentSalary,
        contribution: yearlyContribution,
        sickDays: effectiveSickDays,
      });
  
      currentSalary *= 1 + realGrowthRate;
    }
  
    return {
      yearlyBalances,
      totalMainBalance: Math.round(totalMainBalance * 100) / 100,
      totalSubBalance: Math.round(totalSubBalance * 100) / 100,
    };
  }
  
  export function calculateMonthlyPension(
    totalPension: number,
    retirementAge: number,
    lifeExpectancyData: LifeExpectancyData
  ): number {
    if (totalPension <= 0) {
      throw new Error('Total pension must be positive');
    }
  
    if (retirementAge < 60 || retirementAge > 90) {
      throw new Error('Retirement age must be between 60 and 90');
    }
  
    const lifeExpectancyMonths = lifeExpectancyData[retirementAge.toString()];
  
    if (!lifeExpectancyMonths) {
      throw new Error(`No life expectancy data found for age ${retirementAge}`);
    }
  
    const monthlyPension = totalPension / Math.round(lifeExpectancyMonths);
  
    return Math.round(monthlyPension * 100) / 100;
  }
  
  export function calculateDelayedRetirementImpact(
    baseMonthlyPension: number,
    delayYears: number
  ): {
    newMonthlyPension: number;
    percentageIncrease: number;
  } {
    const increasePerYear = 0.08;
    const percentageIncrease = delayYears * increasePerYear;
    const newMonthlyPension = baseMonthlyPension * (1 + percentageIncrease);
  
    return {
      newMonthlyPension: Math.round(newMonthlyPension * 100) / 100,
      percentageIncrease: Math.round(percentageIncrease * 100),
    };
  }
  
  export function convertBalanceDataToChart(yearlyBalances: YearlyBalance[]): {
    [year: string]: { mainBalance: number; subBalance: number };
  } {
    const chartData: { [year: string]: { mainBalance: number; subBalance: number } } = {};
  
    yearlyBalances.forEach((balance) => {
      chartData[balance.year.toString()] = {
        mainBalance: balance.mainBalance,
        subBalance: balance.subBalance,
      };
    });
  
    return chartData;
  }
  
