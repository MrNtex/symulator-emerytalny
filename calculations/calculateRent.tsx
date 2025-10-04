interface SalaryGrowthData {
  [year: string]: string;
}

interface CalculationParams {
  monthlyIncome: number;
  yearWorkStart: number;
  yearRetirement: number;
}

import data from './wskaznik_wzrostu_wynagrodzenia.json';
const contributionRate = 0.1952;
const salaryGrowthData = data as SalaryGrowthData;
const monthsInYear = 12;

const parsePercentage = (percentageStr: string): number => {
  return parseFloat(percentageStr.replace('%', '')) / 100;
};

// Emerytura rzeczywista
export function calculateRent(params: CalculationParams): number {
  const { monthlyIncome, yearWorkStart, yearRetirement } = params;
  
  if (yearWorkStart >= yearRetirement) {
    throw new Error('Work start year must be before retirement year');
  }
  
  if (monthlyIncome <= 0) {
    throw new Error('Monthly income must be positive');
  }
  
  let totalRent = 0;
  const yearlyContribution = monthlyIncome * monthsInYear * contributionRate; 
  
  for (let year = yearWorkStart; year < yearRetirement; year++) {
    totalRent += yearlyContribution;
  }
  
  return Math.round(totalRent * 100) / 100; 
}

// emerytura urealniona
export function calculateRealRent(params: CalculationParams): number {
  const { monthlyIncome, yearWorkStart, yearRetirement } = params;
  
  if (yearWorkStart >= yearRetirement) {
    throw new Error('Work start year must be before retirement year');
  }
  
  if (monthlyIncome <= 0) {
    throw new Error('Monthly income must be positive');
  }
  
  let totalRent = 0;
  let currentIncome = monthlyIncome;
  const inflationRate = 0.025; 
  
  for (let year = yearWorkStart; year < yearRetirement; year++) {
    const yearStr = year.toString();
    const growthRateStr = salaryGrowthData[yearStr];
    
    if (!growthRateStr) {
      console.warn(`No growth data found for year ${year}, using 1.0 (no growth)`);
    }
    
    const wageGrowthRate = growthRateStr ? parsePercentage(growthRateStr) : 1.0;
    const realGrowthRate = wageGrowthRate + inflationRate; 
    
    const yearlyContribution = currentIncome * monthsInYear * contributionRate;
    totalRent += yearlyContribution;
    
    currentIncome *= (1 + realGrowthRate);
  }
  
  return Math.round(totalRent * 100) / 100;
}