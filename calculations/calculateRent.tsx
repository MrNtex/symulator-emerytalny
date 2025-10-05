interface SalaryGrowthData {
  [year: string]: string;
}

interface LifeExpectancyData {
  [age: string]: number;
}
interface AverageSalaryData {
  [year: string]: number;
}

interface CalculationParams {
  monthlyIncome: number;
  yearWorkStart: number;
  yearRetirement: number;
  gender: 'male' | 'female';
}

import data from './wskaznik_wzrostu_wynagrodzenia.json';
import dataLifeExpectancy from './life_expectancy_gus.json';
import dataAverageSalary from './average_salary.json';
const contributionRate = 0.1952;
const salaryGrowthData = data as SalaryGrowthData;
const lifeExpectancyData = dataLifeExpectancy as LifeExpectancyData;
const averageSalaryData = dataAverageSalary as AverageSalaryData;
const monthsInYear = 12;
const workingDaysPerMonth = 22;
const inflationRate = 0.025;

const parsePercentage = (percentageStr: string): number => {
  return  parseFloat(percentageStr.replace('%', '')) / 100 - 1;
};


// Emerytura rzeczywista
export function calculatePension(params: CalculationParams): number {
  const { monthlyIncome, yearWorkStart, yearRetirement } = params;
  
  if (yearWorkStart >= yearRetirement) {
    throw new Error('Work start year must be before retirement year');
  }
  
  if (monthlyIncome <= 0) {
    throw new Error('Monthly income must be positive');
  }
  
  let totalPension = 0;
  let yearlyContribution = 0;
 
  for (let year = yearWorkStart; year < yearRetirement; year++) {
    yearlyContribution = monthlyIncome * monthsInYear * contributionRate;
    if(yearlyContribution/30 > averageSalaryData[year.toString()]) {
      yearlyContribution = averageSalaryData[year.toString()] * 30; 
    }
    totalPension += yearlyContribution;
    //console.log(yearlyContribution);
  }
  
  return Math.round(totalPension * 100) / 100; 
}

// emerytura urealniona
export function calculateRealPension(params: CalculationParams): number {
  const { monthlyIncome, yearWorkStart, yearRetirement } = params;
  
  if (yearWorkStart >= yearRetirement) {
    throw new Error('Work start year must be before retirement year');
  }
  
  if (monthlyIncome <= 0) {
    throw new Error('Monthly income must be positive');
  }
  
  let totalPension = 0;
  let currentIncome = monthlyIncome;
  
  for (let year = yearWorkStart; year < yearRetirement; year++) {
    const yearStr = year.toString();
    const growthRateStr = salaryGrowthData[yearStr];
    
    if (!growthRateStr) {
      console.warn(`No growth data found for year ${year}, using 0.0 (no growth)`);
    }
    
    const wageGrowthRate = growthRateStr ? parsePercentage(growthRateStr) : 0.0;
    const realGrowthRate = wageGrowthRate + inflationRate; 
    let yearlyContribution = 0;
      yearlyContribution = currentIncome * monthsInYear * contributionRate;
    if(yearlyContribution/30 > averageSalaryData[year.toString()]) {
      yearlyContribution = averageSalaryData[year.toString()] * 30; 
    }
    totalPension += yearlyContribution;
    currentIncome *= (1 + realGrowthRate);
    //console.log("yearlyContribution" + yearlyContribution + " currentIncome" + currentIncome);
  }
  
  return Math.round(totalPension * 100) / 100;
}

// Redukcja emerytury z powodu chorób
export function calculateSickDaysImpact(params: CalculationParams, averageSickDaysPerYear: number = 34): number {
  const { monthlyIncome, yearWorkStart, yearRetirement } = params;
  
  if (yearWorkStart >= yearRetirement) {
    throw new Error('Work start year must be before retirement year');
  }
  
  if (monthlyIncome <= 0) {
    throw new Error('Monthly income must be positive');
  }
  
  let totalPension = 0;
  let currentIncome = monthlyIncome;
  
  for (let year = yearWorkStart; year < yearRetirement; year++) {
    const yearStr = year.toString();
    const growthRateStr = salaryGrowthData[yearStr];
    
    if (!growthRateStr) {
      console.warn(`No growth data found for year ${year}, using 0.0 (no growth)`);
    }
    
    const wageGrowthRate = growthRateStr ? parsePercentage(growthRateStr) : 0.0;
    const realGrowthRate = wageGrowthRate + inflationRate; 
    let yearlyContribution = 0;
    const dailySalary = currentIncome / workingDaysPerMonth;
    yearlyContribution = currentIncome * monthsInYear * contributionRate - (averageSickDaysPerYear * dailySalary * contributionRate);
    if(yearlyContribution/30 > averageSalaryData[year.toString()]) {
      yearlyContribution = averageSalaryData[year.toString()] * 30; 
    }
    totalPension += yearlyContribution;
    currentIncome *= (1 + realGrowthRate);
  }
  return Math.round(totalPension * 100) / 100;
}

// Emerytura z późniejszym przejściem na emeryturę
export function calculateDelayedRetirementRent(params: CalculationParams, delayedRetirementAge: number, ifSickDays: boolean = false, averageSickDaysPerYear: number = 34): number {
  const { monthlyIncome, yearWorkStart, yearRetirement, gender } = params;
  
  if (yearWorkStart >= yearRetirement) {
    throw new Error('Work start year must be before retirement year');
  }
  
  if (monthlyIncome <= 0) {
    throw new Error('Monthly income must be positive');
  }
  const retirementAgeBasic = gender === 'male' ? 65 : 60;
  if (delayedRetirementAge <= retirementAgeBasic) {
    throw new Error('Delayed retirement age must be greater than current retirement age');
  }
  
  let totalPension = 0;
  let currentIncome = monthlyIncome;
  if (ifSickDays) {
    for (let year = 0; year < delayedRetirementAge - retirementAgeBasic; year++) {
        const yearStr = (year + yearWorkStart).toString();
        const growthRateStr = salaryGrowthData[yearStr];
    
        if (!growthRateStr) {
            console.warn(`No growth data found for year ${year + yearWorkStart}, using 0.0 (no growth)`);
        }
    
        const wageGrowthRate = growthRateStr ? parsePercentage(growthRateStr) : 0.0;
        const realGrowthRate = wageGrowthRate + inflationRate; 
    
        const dailyIncome = currentIncome / workingDaysPerMonth;
        const dailyContribution = dailyIncome * contributionRate;
        
        const sickDaysReduction = averageSickDaysPerYear * dailyContribution;
        let yearlyContribution = (currentIncome * monthsInYear * contributionRate) - sickDaysReduction;
        if(yearlyContribution/30 > averageSalaryData[year.toString()]) {
          yearlyContribution = averageSalaryData[year.toString()] * 30; 
        }
        totalPension += yearlyContribution;
        currentIncome *= (1 + realGrowthRate);
    }
  } else {
        for (let year = 0; year < delayedRetirementAge - retirementAgeBasic; year++) {
        const yearStr = (year + yearWorkStart).toString();
        const growthRateStr = salaryGrowthData[yearStr];
    
        if (!growthRateStr) {
            console.warn(`No growth data found for year ${year + yearWorkStart}, using 0.0 (no growth)`);
        }
    
        const wageGrowthRate = growthRateStr ? parsePercentage(growthRateStr) : 0.0;
        const realGrowthRate = wageGrowthRate + inflationRate; 
    
        let yearlyContribution = currentIncome * monthsInYear * contributionRate;
        if(yearlyContribution/30 > averageSalaryData[year.toString()]) {
          yearlyContribution = averageSalaryData[year.toString()] * 30; 
        }
        totalPension += yearlyContribution;
        currentIncome *= (1 + realGrowthRate);
    }
  }
  let originalPension = 0;
  if (ifSickDays) {
    originalPension = calculateSickDaysImpact(params);
  } else {
    originalPension = calculateRealPension(params);
  }
  const newTotalPension = originalPension + totalPension;
  
  return Math.round(newTotalPension * 100) / 100;
}

// Obliczanie przyszłej średniej emerytury z uwzględnieniem waloryzacji
export function calculateFutureAveragePension(
  currentAveragePension: number, 
  yearsUntilRetirement: number, 
  startYear: number
): number {
  if (currentAveragePension <= 0) {
    throw new Error('Current average pension must be positive');
  }
  
  if (yearsUntilRetirement <= 0) {
    throw new Error('Years until retirement must be positive');
  }
  
  let futurePension = currentAveragePension;
  
  for (let year = 0; year < yearsUntilRetirement; year++) {
    const currentYear = startYear + year;
    const yearStr = currentYear.toString();
    const growthRateStr = salaryGrowthData[yearStr];
    
    if (!growthRateStr) {
      console.warn(`No growth data found for year ${currentYear}, using 0.0 (no growth)`);
    }
    
    const wageGrowthRate = growthRateStr ? parsePercentage(growthRateStr) : 0.0;
    const realGrowthRate = wageGrowthRate + inflationRate;
    
    futurePension *= (1 + realGrowthRate);
  }
  
  return Math.round(futurePension * 100) / 100;
}

// Obliczanie końcowej pensji na podstawie wzrostu wynagrodzeń
export function calculateFinalSalary(
  initialSalary: number, 
  startYear: number, 
  yearsWorked: number
): number {
  if (initialSalary <= 0) {
    throw new Error('Initial salary must be positive');
  }
  
  if (yearsWorked <= 0) {
    throw new Error('Years worked must be positive');
  }
  
  let currentSalary = initialSalary;
  
  for (let year = 0; year < yearsWorked; year++) {
    const currentYear = startYear + year;
    const yearStr = currentYear.toString();
    const growthRateStr = salaryGrowthData[yearStr];
    
    if (!growthRateStr) {
      console.warn(`No growth data found for year ${currentYear}, using 0.0 (no growth)`);
    }
    
    const wageGrowthRate = growthRateStr ? parsePercentage(growthRateStr) : 0.0;
    const realGrowthRate = wageGrowthRate;
    
    currentSalary *= (1 + realGrowthRate);
  }
  
  return Math.round(currentSalary * 100) / 100;
}

// Obliczanie miesięcznej emerytury na podstawie całkowitej emerytury i oczekiwanej długości życia
export function calculateMonthlyPension(totalPension: number, retirementAge: number): number {
  if (totalPension <= 0) {
    throw new Error('Total pension must be positive');
  }
  
  if (retirementAge < 60 || retirementAge > 90) {
    alert(retirementAge);
    throw new Error('Retirement age must be between 60 and 90');
  }
  const lifeExpectancyMonths = lifeExpectancyData[retirementAge.toString()];
  
  if (!lifeExpectancyMonths) {
    throw new Error(`No life expectancy data found for age ${retirementAge}`);
  }
  
  const monthlyPension = totalPension / Math.round(lifeExpectancyMonths);
  
  return Math.round(monthlyPension * 100) / 100;
}

//stopa zastąpienia w % (ile ostatniej pensji to emerytura)
export function calculateRetirementStep(params: CalculationParams, ifSickDays: boolean = false, ifDelayedRetirement: boolean = false, delayedRetirementAge: number = 0): number {
  const { monthlyIncome, yearWorkStart, yearRetirement, gender } = params;
  let age = gender === 'male' ? 65 : 60;
  if (ifDelayedRetirement) {
    age = delayedRetirementAge;
  }
  if (yearWorkStart >= yearRetirement) {
    throw new Error('Work start year must be before retirement year');
  }
  
  if (monthlyIncome <= 0) {
    throw new Error('Monthly income must be positive');
  }
  const lastSalary = calculateFinalSalary(monthlyIncome, yearWorkStart, yearRetirement - yearWorkStart);
  let totalPension = 0;
  if (ifSickDays) {
    totalPension = calculateSickDaysImpact(params);
  } else if (ifDelayedRetirement) {
    totalPension = calculateDelayedRetirementRent(params, delayedRetirementAge);
  } else {
    totalPension = calculateRealPension(params);
  }
  
  const monthlyPension = calculateMonthlyPension(totalPension, age);
  const retirementStep = monthlyPension / lastSalary;

  return Math.round(retirementStep * 100);
}

export function calculateDifference(params: CalculationParams, ifSickDays: boolean = false, requiredPension: number): number {
    const { monthlyIncome, yearWorkStart, yearRetirement, gender } = params;
    if (requiredPension <= 0) {
      throw new Error('Required pension must be positive');
    }
    if (yearWorkStart >= yearRetirement) {
      throw new Error('Work start year must be before retirement year');
    }
    if (monthlyIncome <= 0) {
      throw new Error('Monthly income must be positive');
    }
    let currentTotalPension = 0;
    if (ifSickDays) {
      currentTotalPension = calculateSickDaysImpact(params);
    } else {
      currentTotalPension = calculateRealPension(params);
    }
    let age = gender === 'male' ? 65 : 60;
    let currentPension = calculateMonthlyPension(currentTotalPension, age);
    let difference = requiredPension - currentPension;
    let years = 0;
    age++;
    while (difference > 0) {
      currentTotalPension  = calculateDelayedRetirementRent(params, age);
      currentPension = calculateMonthlyPension(currentTotalPension, age);
      difference = requiredPension - currentPension;
      age++;
      years++;
    }
    return years;
  }