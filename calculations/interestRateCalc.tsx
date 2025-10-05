//obliczenia odnosnie subKonta
import { updateSubBalanceAndExportJson } from './updateJson';
const filePath = './shared/data/balance.json';

interface InterestRateParams {
    initialAmount: number;
    interestRate: number;
    yearStart: number;
    yearEnd: number;
    annualCapitalization: boolean; //true if annual false if quarterly
}

export function calculateInterestRate(params: InterestRateParams): number {
    const { initialAmount, interestRate, yearStart, yearEnd, annualCapitalization } = params;
    let amount = initialAmount;
    if (annualCapitalization) {
    for (let year = yearStart; year < yearEnd; year++) {
            amount *= (1 + interestRate);
            updateSubBalanceAndExportJson(filePath, year.toString(), amount);
        }
    } else {
        for (let quarter = 0; quarter < (yearEnd - yearStart) * 4; quarter++) {
            amount *= (1 + interestRate/4);
            if (quarter % 4 === 0) {
                updateSubBalanceAndExportJson(filePath, (yearStart+quarter/4).toString(), amount);
            }
        }
    }
    return amount;
}
