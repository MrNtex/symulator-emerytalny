"use client";
import { useUser, Gender } from "@/context/UserContext";

import {
  calculatePension,
  calculateRealPension,
  calculateSickDaysImpact,
  calculateDelayedRetirementRent,
  calculateMonthlyPension,
  calculateRetirementStep 
} from "@/calculations/calculateRent";

const mapGender = (sex: Gender): 'male' | 'female' => {
  return sex === 'Mężczyzna' ? 'male' : 'female';
};

const getRetirementAge = (gender: 'male' | 'female') => {
    return gender === 'male' ? 65 : 60;
};

const PensionDisplay = () => {
  const { user } = useUser();
  if (!user) {
    return <div className="p-4 text-center">Proszę wprowadzić dane do kalkulatora.</div>;
  }  
  const mappedGender = mapGender(user.sex);
  const retirementAge = getRetirementAge(mappedGender);
  
  const calculationParams = {
    monthlyIncome: user.GrossSalary,
    yearWorkStart: user.StartYear,
    yearRetirement: user.PlannedRetirementYear,
    gender: mappedGender,
  };
  const delayedRetirementYear = user.PlannedRetirementYear + 5;
  const delayedRetirementAge = retirementAge + 5; 
  let actualMonthly, realMonthly, sickDaysMonthly, delayedMonthly;
  let actualTotal, realTotal, sickDaysTotal, delayedTotal;
  let retirementStep: number | undefined;
  let calculationError: string | null = null;

  try {
    actualTotal = calculatePension(calculationParams);
    realTotal = calculateRealPension(calculationParams);
    sickDaysTotal = calculateSickDaysImpact(calculationParams);
    delayedTotal = calculateDelayedRetirementRent(calculationParams, delayedRetirementYear, false);
    actualMonthly = calculateMonthlyPension(actualTotal, retirementAge);
    realMonthly = calculateMonthlyPension(realTotal, retirementAge);
    sickDaysMonthly = calculateMonthlyPension(sickDaysTotal, retirementAge);
    delayedMonthly = calculateMonthlyPension(delayedTotal, delayedRetirementAge);
    retirementStep = calculateRetirementStep(calculationParams, false, false) * 100;

  } catch (error) {
    calculationError = error instanceof Error ? error.message : "Wystąpił nieznany błąd podczas obliczeń.";
    console.error("Błąd kalkulacji:", error);
  }

  if (calculationError) {
    return <div className="p-4 text-red-600 border border-red-300 bg-red-50">Błąd: {calculationError}</div>;
  }

  const results = {
    actual: actualMonthly ?? 0,
    real: realMonthly ?? 0,
    sickDays: sickDaysMonthly ?? 0,
    delayed: delayedMonthly ?? 0,
    step: retirementStep ?? 0,
  };


  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-blue-700">Wyniki Kalkulacji Emerytalnej 📊</h2>
      
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div><p><strong>Płeć:</strong> {user.sex}</p></div>
        <div><p><strong>Wiek Emerytalny:</strong> {retirementAge} lat</p></div>
        <div><p><strong>Pensja Miesięczna Brutto:</strong> {user.GrossSalary} PLN</p></div>
        <div className="p-2 border rounded bg-blue-50 text-center">
            <p className="font-semibold text-sm text-blue-700">Stopa Zastąpienia</p>
            <p className="text-2xl font-bold text-blue-900">{results.step.toFixed(2)}%</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-4 mb-2 border-t pt-2">Miesięczne Kwoty Emerytur</h3>

      <div className="space-y-3">
        
        <ResultItem
            title="Emerytura Urealniona (Podstawa)"
            amount={results.real}
            description={`Całkowity kapitał: ${realTotal?.toFixed(2) ?? 'N/A'} PLN`}
            color="border-blue-500 bg-blue-50"
        />
        
        <ResultItem
            title={`Emerytura Opóźniona (do ${delayedRetirementAge} lat)`}
            amount={results.delayed}
            description={`Otrzymujesz więcej, pracując do ${delayedRetirementYear} roku.`}
            color="border-green-500 bg-green-50"
        />

        <ResultItem
            title="Emerytura z Redukcją (Śr. L4)"
            amount={results.sickDays}
            description={`Emerytura urealniona, pomniejszona o wpływ L4 (~34 dni/rok).`}
            color="border-amber-500 bg-amber-50"
        />

        <ResultItem
            title="Emerytura Rzeczywista (Uproszczona)"
            amount={results.actual}
            description={`Bez waloryzacji składek - stałe składki roczne.`}
            color="border-gray-400 bg-gray-50"
        />
      </div>
    </div>
  );
};

const ResultItem = ({ title, amount, description, color }: { title: string, amount: number, description: string, color: string }) => (
    <div className={`p-3 border-l-4 ${color}`}>
        <p className="font-semibold">{title}</p>
        <p className="text-xl font-bold text-gray-800">{amount.toFixed(2)} PLN/mies.</p>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);

export default PensionDisplay;