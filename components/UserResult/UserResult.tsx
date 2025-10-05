"use client";
import { useUser, Gender } from "@/context/UserContext";
import { useUsageReport } from "@/hooks/useUsageReport";
import { useEffect } from "react";
import "./UserResult.css";

import {
  calculatePension,
  calculateRealPension,
  calculateSickDaysImpact,
  calculateDelayedRetirementRent,
  calculateMonthlyPension,
  calculateRetirementStep,
  calculateFutureAveragePension
} from "@/calculations/calculateRent";

const mapGender = (sex: Gender): 'male' | 'female' => {
  return sex === 'Mężczyzna' ? 'male' : 'female';
};

const getRetirementAge = (gender: 'male' | 'female') => {
    return gender === 'male' ? 65 : 60;
};

const PensionDisplay = () => {
  const { user } = useUser();
  const { sendUsageReport } = useUsageReport();
  
  if (!user) {
    return <div className="no-data-message">Proszę wprowadzić dane do kalkulatora.</div>;
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
  let futureAveragePension = 0;
  let pensionComparison = 0;
  let targetComparison = 0;
  let yearsToTarget = 0;
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

    // Prognozowana średnia emerytura w kraju
    const currentAveragePension = 3500; // Aktualna średnia emerytura w Polsce (2024)
    const yearsUntilRetirement = user.PlannedRetirementYear - new Date().getFullYear();
    futureAveragePension = calculateFutureAveragePension(currentAveragePension, yearsUntilRetirement, new Date().getFullYear());
    
    // Porównanie z prognozowaną średnią emeryturą w kraju
    pensionComparison = ((realMonthly / futureAveragePension) * 100);
    
    // Porównanie z oczekiwanym świadczeniem użytkownika
    if (user.targetPension && user.targetPension > 0) {
      targetComparison = ((realMonthly / user.targetPension) * 100);
      
      // Oblicz ile lat dłużej musi pracować, żeby osiągnąć cel
      if (realMonthly < user.targetPension) {
        const monthlyDifference = user.targetPension - realMonthly;
        const yearlyContribution = user.GrossSalary * 12 * 0.195; // 19.5% składki emerytalnej
        yearsToTarget = Math.ceil(monthlyDifference * 12 / yearlyContribution);
      }
    }

  } catch (error) {
    calculationError = error instanceof Error ? error.message : "Wystąpił nieznany błąd podczas obliczeń.";
    console.error("Błąd kalkulacji:", error);
  }

  // Wysyłanie danych do bazy po obliczeniach
  useEffect(() => {
    if (!calculationError && realMonthly && realTotal) {
      const now = new Date();
      const usageData = {
        date: now.toISOString().split('T')[0], // YYYY-MM-DD
        time: now.toTimeString().split(' ')[0], // HH:MM:SS
        expectedPension: user.targetPension || 0,
        age: user.age || 0,
        gender: user.sex,
        salary: user.GrossSalary,
        includedSickPeriods: user.includeSickDays || false,
        accountFunds: 0, // Można dodać logikę do obliczania środków na kontach
        realPension: realTotal,
        adjustedPension: realMonthly,
        postalCode: user.postalCode || '', // Opcjonalny
      };

      sendUsageReport(usageData);
    }
  }, [calculationError, realMonthly, realTotal, user, sendUsageReport]);

  if (calculationError) {
    return <div className="error-message">Błąd: {calculationError}</div>;
  }

  const results = {
    actual: actualMonthly ?? 0,
    real: realMonthly ?? 0,
    sickDays: sickDaysMonthly ?? 0,
    delayed: delayedMonthly ?? 0,
    step: retirementStep ?? 0,
  };


  return (
    <div className="pension-display">
      <h2 className="pension-title">Wyniki Kalkulacji Emerytalnej 📊</h2>
      
      <div className="user-info-grid">
        <div className="user-info-item"><p><strong>Płeć:</strong> {user.sex}</p></div>
        <div className="user-info-item"><p><strong>Wiek Emerytalny:</strong> {retirementAge} lat</p></div>
        <div className="user-info-item"><p><strong>Pensja Miesięczna Brutto:</strong> {user.GrossSalary} PLN</p></div>
        <div className="replacement-rate-card">
            <p className="replacement-rate-label">Stopa Zastąpienia</p>
            <p className="replacement-rate-value">{results.step.toFixed(2)}%</p>
        </div>
      </div>

      <h3 className="monthly-pensions-title">Miesięczne Kwoty Emerytur</h3>

      <div className="pension-items">
        
        <ResultItem
            title="Emerytura Urealniona (Podstawa)"
            amount={results.real}
            description={`Całkowity kapitał: ${realTotal?.toFixed(2) ?? 'N/A'} PLN`}
            color="pension-item-blue"
        />
        
        <ResultItem
            title={`Emerytura Opóźniona (do ${delayedRetirementAge} lat)`}
            amount={results.delayed}
            description={`Otrzymujesz więcej, pracując do ${delayedRetirementYear} roku.`}
            color="pension-item-green"
        />

        <ResultItem
            title="Emerytura z Redukcją (Śr. L4)"
            amount={results.sickDays}
            description={`Emerytura urealniona, pomniejszona o wpływ L4 (~34 dni/rok).`}
            color="pension-item-amber"
        />

        <ResultItem
            title="Emerytura Rzeczywista (Uproszczona)"
            amount={results.actual}
            description={`Bez waloryzacji składek - stałe składki roczne.`}
            color="pension-item-gray"
        />
      </div>

      <div className="comparison-section">
        <h3 className="comparison-title">Porównanie ze średnią emeryturą w kraju</h3>
        <div className="comparison-grid">
          <div className="comparison-card">
            <h4 className="comparison-card-title">Twoja prognozowana emerytura</h4>
            <p className="comparison-card-amount">{Math.round(realMonthly ?? 0).toLocaleString()} zł</p>
            <span className="comparison-card-subtitle">miesięcznie (urealniona)</span>
          </div>
          <div className="comparison-card">
            <h4 className="comparison-card-title">Prognozowana średnia w kraju</h4>
            <p className="comparison-card-amount">{Math.round(futureAveragePension).toLocaleString()} zł</p>
            <span className="comparison-card-subtitle">w roku {user.PlannedRetirementYear}</span>
          </div>
        </div>
        <div className="comparison-summary">
          <p className="comparison-summary-text">
            Twoja emerytura będzie <strong>{pensionComparison > 100 ? 'wyższa' : 'niższa'}</strong> od prognozowanej średniej emerytury w kraju o <strong>{Math.abs(pensionComparison - 100).toFixed(1)}%</strong>
            {pensionComparison > 100 ? ' (lepiej)' : ' (gorzej)'}.
          </p>
        </div>
      </div>

      {user.targetPension && user.targetPension > 0 && (
        <div className="comparison-section">
          <h3 className="comparison-title">Porównanie z Twoim celem emerytalnym</h3>
          <div className="comparison-grid">
            <div className="comparison-card">
              <h4 className="comparison-card-title">Twoja prognozowana emerytura</h4>
              <p className="comparison-card-amount">{Math.round(realMonthly ?? 0).toLocaleString()} zł</p>
              <span className="comparison-card-subtitle">miesięcznie (urealniona)</span>
            </div>
            <div className="comparison-card">
              <h4 className="comparison-card-title">Twoje oczekiwane świadczenie</h4>
              <p className="comparison-card-amount">{user.targetPension.toLocaleString()} zł</p>
              <span className="comparison-card-subtitle">cel do osiągnięcia</span>
            </div>
          </div>
          <div className="comparison-summary">
            {targetComparison >= 100 ? (
              <p className="comparison-summary-text">
                <strong>Gratulacje! 🎉</strong> Twoja prognozowana emerytura <strong>przekracza</strong> Twój cel o <strong>{(targetComparison - 100).toFixed(1)}%</strong>.
              </p>
            ) : (
              <p className="comparison-summary-text">
                Twoja prognozowana emerytura jest <strong>niższa</strong> od Twojego celu o <strong>{(100 - targetComparison).toFixed(1)}%</strong>.
                <br />
                <strong>Aby osiągnąć cel, musisz pracować o {yearsToTarget} lat dłużej</strong> (do roku {user.PlannedRetirementYear + yearsToTarget}).
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ResultItem = ({ title, amount, description, color }: { title: string, amount: number, description: string, color: string }) => (
    <div className={`pension-item ${color}`}>
        <p className="pension-item-title">{title}</p>
        <p className="pension-item-amount">{amount.toFixed(2)} PLN/mies.</p>
        <p className="pension-item-description">{description}</p>
    </div>
);

export default PensionDisplay;