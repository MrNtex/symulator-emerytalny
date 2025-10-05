// Simple test file for pension calculations
// Run with: npx ts-node test-functions.ts

// Import functions from the TypeScript file
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
} from './calculations/calculateRent';

// Test parameters
const testParams = {
  monthlyIncome: 500000,
  yearWorkStart: 2020,
  yearRetirement: 2065, // Age 65 retirement
  gender: 'male' as const
};

console.log('=== PENSION CALCULATION TESTS ===\n');

console.log('Test Parameters:');
console.log(`- Monthly Income: ${testParams.monthlyIncome} PLN`); 
console.log(`- Work Start Year: ${testParams.yearWorkStart}`);
console.log(`- Retirement Year: ${testParams.yearRetirement}`);
console.log(`- Gender: ${testParams.gender}\n`);

try {
  // Test 1: Basic pension calculation
  console.log('1. Basic Pension Calculation:');
  const basicPension = calculatePension(testParams);
  console.log(`   Result: ${basicPension.toLocaleString()} PLN\n`);

  // Test 2: Real pension with inflation and growth
  console.log('2. Real Pension (with inflation and growth):');
  const realPension = calculateRealPension(testParams);
  console.log(`   Result: ${realPension.toLocaleString()} PLN\n`);

  // Test 3: Sick days impact
  console.log('3. Pension with Sick Days Impact:');
  const sickDaysPension = calculateSickDaysImpact(testParams);
  console.log(`   Result: ${sickDaysPension.toLocaleString()} PLN`);
  console.log(`   Difference from real pension: ${(realPension - sickDaysPension).toLocaleString()} PLN\n`);

  // Test 4: Delayed retirement (5 years delay)
  console.log('4. Delayed Retirement (5 years delay):');
  const delayedRetirementAge = testParams.gender === 'male' ? 65 + 5 : 60 + 5;
  const delayedPension = calculateDelayedRetirementRent(testParams, delayedRetirementAge);
  console.log(`   Delayed retirement age: ${delayedRetirementAge}`);
  console.log(`   Result: ${delayedPension.toLocaleString()} PLN\n`);

  // Test 5: Delayed retirement with sick days
  console.log('5. Delayed Retirement with Sick Days:');
  const delayedSickPension = calculateDelayedRetirementRent(testParams, delayedRetirementAge, true);
  console.log(`   Result: ${delayedSickPension.toLocaleString()} PLN\n`);

  // Test 6: Final salary calculation
  console.log('6. Final Salary Calculation:');
  const finalSalary = calculateFinalSalary(testParams.monthlyIncome, testParams.yearWorkStart, testParams.yearRetirement - testParams.yearWorkStart);
  console.log(`   Result: ${finalSalary.toLocaleString()} PLN\n`);

  // Test 7: Monthly pension
  console.log('7. Monthly Pension:');
  const monthlyPension = calculateMonthlyPension(realPension, testParams.gender === 'male' ? 65 : 60);
  console.log(`   Result: ${monthlyPension.toLocaleString()} PLN\n`);

  // Test 8: Retirement step (replacement rate)
  console.log('8. Retirement Step (Replacement Rate):');
  const retirementStep = calculateRetirementStep(testParams);
  console.log(`   Result: ${retirementStep}%`);
  console.log(`   (This means pension is ${retirementStep}% of final salary)\n`);

  // Test 9: Retirement step with sick days
  console.log('9. Retirement Step with Sick Days:');
  const sickRetirementStep = calculateRetirementStep(testParams, true);
  console.log(`   Result: ${sickRetirementStep}%\n`);

  // Test 10: Years needed to achieve required pension
  console.log('10. Years to Achieve Required Pension:');
  const requiredPension = 5000; // 800k PLN
  const yearsNeeded = calculateDifference(testParams, false, requiredPension);
  console.log(`   Required pension: ${requiredPension.toLocaleString()} PLN`);
  console.log(`   Years needed: ${yearsNeeded}\n`);

  // Test 11: Years needed with sick days
  console.log('11. Years to Achieve Required Pension (with sick days):');
  const yearsNeededSick = calculateDifference(testParams, true, requiredPension);
  console.log(`   Required pension: ${requiredPension.toLocaleString()} PLN`);
  console.log(`   Years needed: ${yearsNeededSick}\n`);

  // Summary comparison
  console.log('=== SUMMARY COMPARISON ===');
  console.log(`Basic Pension: ${basicPension.toLocaleString()} PLN`);
  console.log(`Real Pension: ${realPension.toLocaleString()} PLN`);
  console.log(`Sick Days Impact: ${sickDaysPension.toLocaleString()} PLN (${((sickDaysPension/realPension)*100).toFixed(2)}% of real pension)`);
  console.log(`Delayed Retirement: ${delayedPension.toLocaleString()} PLN`);
  console.log(`Delayed + Sick Days: ${delayedSickPension.toLocaleString()} PLN`);
  console.log(`Final Salary: ${finalSalary.toLocaleString()} PLN`);
  console.log(`Monthly Pension: ${monthlyPension.toLocaleString()} PLN`);
  console.log(`Replacement Rate: ${retirementStep}%`);

  console.log('\n✅ All tests completed successfully!');

} catch (error) {
  console.error('❌ Error running tests:', (error as Error).message);
}
