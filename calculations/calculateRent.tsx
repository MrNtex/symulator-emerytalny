interface SalaryGrowthData {
  [year: string]: string;
}

interface LifeExpectancyData {
  [age: string]: number;
}

interface CalculationParams {
  monthlyIncome: number;
  yearWorkStart: number;
  yearRetirement: number;
  gender: 'male' | 'female';
}

import data from './wskaznik_wzrostu_wynagrodzenia.json';
import dataLifeExpectancy from './life_expectancy_gus.json';
const contributionRate = 0.1952;
const salaryGrowthData = data as SalaryGrowthData;
const lifeExpectancyData = dataLifeExpectancy as LifeExpectancyData;
const monthsInYear = 12;

const parsePercentage = (percentageStr: string): number => {
  return parseFloat(percentageStr.replace('%', '')) / 100;
};

const getRetirementMonths = (gender: 'male' | 'female'): number => {
  const retirementAge = gender === 'male' ? 65 : 60;
  const lifeExpectancyMonths = lifeExpectancyData[retirementAge.toString()];
  
  if (!lifeExpectancyMonths) {
    throw new Error(`No life expectancy data found for age ${retirementAge}`);
  }
  
  return Math.round(lifeExpectancyMonths);
};

// Emerytura rzeczywista
export function calculateRent(params: CalculationParams): number {
  const { monthlyIncome, yearWorkStart, yearRetirement, gender } = params;
  
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
  
  const retirementMonths = getRetirementMonths(gender);
  const monthlyRent = totalRent / retirementMonths;
  
  return Math.round(monthlyRent * 100) / 100; 
}

// emerytura urealniona
export function calculateRealRent(params: CalculationParams): number {
  const { monthlyIncome, yearWorkStart, yearRetirement, gender } = params;
  
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
  
  const retirementMonths = getRetirementMonths(gender);
  const monthlyRent = totalRent / retirementMonths;
  
  return Math.round(monthlyRent * 100) / 100;
}

// Redukcja emerytury z powodu chorób
export function calculateSickDaysImpact(params: CalculationParams, averageSickDaysPerYear: number = 34): number {
  const { monthlyIncome, yearWorkStart, yearRetirement, gender } = params;
  
  if (yearWorkStart >= yearRetirement) {
    throw new Error('Work start year must be before retirement year');
  }
  
  if (monthlyIncome <= 0) {
    throw new Error('Monthly income must be positive');
  }
  
  const totalWorkYears = yearRetirement - yearWorkStart;
  const totalSickDays = totalWorkYears * averageSickDaysPerYear;
  
  const workingDaysPerMonth = 22;
  const dailyIncome = monthlyIncome / workingDaysPerMonth;
  
  const dailyContribution = dailyIncome * contributionRate;
  const totalPensionReduction = totalSickDays * dailyContribution;
  
  const retirementMonths = getRetirementMonths(gender);
  const monthlyPensionReduction = totalPensionReduction / retirementMonths;
  
  const fullMonthlyPension = calculateRealRent(params);
  const adjustedMonthlyPension = fullMonthlyPension - monthlyPensionReduction;
  
  return Math.round(adjustedMonthlyPension * 100) / 100;
}

// Emerytura z późniejszym przejściem na emeryturę
export function calculateDelayedRetirementRent(params: CalculationParams, delayedRetirementAge: number): number {
  const { monthlyIncome, yearWorkStart, yearRetirement, gender } = params;
  
  if (yearWorkStart >= yearRetirement) {
    throw new Error('Work start year must be before retirement year');
  }
  
  if (monthlyIncome <= 0) {
    throw new Error('Monthly income must be positive');
  }
  
  if (delayedRetirementAge <= yearRetirement) {
    throw new Error('Delayed retirement age must be greater than current retirement year');
  }
  
  let totalRent = 0;
  let currentIncome = monthlyIncome;
  const inflationRate = 0.025; 
  
  for (let year = yearRetirement; year < delayedRetirementAge; year++) {
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
  
  const originalPension = calculateRealRent(params);
  const originalTotalPension = originalPension * getRetirementMonths(gender);
  
  const newTotalPension = originalTotalPension + totalRent;
  
  const newLifeExpectancyMonths = lifeExpectancyData[delayedRetirementAge.toString()];
  
  if (!newLifeExpectancyMonths) {
    throw new Error(`No life expectancy data found for age ${delayedRetirementAge}`);
  }
  
  const newRetirementMonths = Math.round(newLifeExpectancyMonths);
  const newMonthlyRent = newTotalPension / newRetirementMonths;
  
  return Math.round(newMonthlyRent * 100) / 100;
}

