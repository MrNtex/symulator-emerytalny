//funkcja która oblicza saldo konta na podstawie wzrostu kapitału i odsetek
import { calculateInterestRate } from './interestRateCalc';
import { 
    calculatePension, 
    calculateRealPension, 
    calculateSickDaysImpact, 
    calculateDelayedRetirementRent, 
    calculateFutureAveragePension, 
    calculateFinalSalary, 
    calculateMonthlyPension, 
    calculateRetirementStep,
    calculateDifference 
  } from './calculateRent';

interface AccountBalance{
    year: number;
    mainBalance: number;
    subBalance: number;
}


  