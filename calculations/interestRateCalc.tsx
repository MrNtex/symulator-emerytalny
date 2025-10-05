//obliczenia odnosnie subKonta
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
        }
    } else {
        for (let quarter = 0; quarter < (yearEnd - yearStart) * 4; quarter++) {
            amount *= (1 + interestRate/4);
        }
    }
    return amount;
}
