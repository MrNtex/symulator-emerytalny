'use client'

import React from 'react'
import { useUser, Gender } from '@/context/UserContext'
import {
  calculatePension,
  calculateRealPension,
  calculateSickDaysImpact,
  calculateDelayedRetirementRent,
  calculateMonthlyPension,
  calculateRetirementStep,
  calculateFinalSalary
} from '@/calculations/calculateRent'
import './ResultModal.css'
import { useRouter } from 'next/navigation';
const mapGender = (sex: Gender): 'male' | 'female' => {
  return sex === 'Mężczyzna' ? 'male' : 'female';
};

const getRetirementAge = (gender: 'male' | 'female') => {
  return gender === 'male' ? 65 : 60;
};

const ResultModal = () => {
  const { user } = useUser();
  const router = useRouter();
  if (!user) {
    return (
      <div className="result-container">
        <div className="forecast-header">
          <h1>Brak danych</h1>
          <p className="forecast-year">Proszę wprowadzić dane w formularzu</p>
        </div>
      </div>
    );
  }

  const mappedGender = mapGender(user.sex);
  const retirementAge = getRetirementAge(mappedGender);
  
  const calculationParams = {
    monthlyIncome: user.GrossSalary,
    yearWorkStart: user.StartYear,
    yearRetirement: user.PlannedRetirementYear,
    gender: mappedGender,
  };

  let actualMonthly = 0;
  let realMonthly = 0;
  let sickDaysMonthly = 0;
  let delayedMonthly1 = 0;
  let delayedMonthly2 = 0;
  let delayedMonthly5 = 0;
  let retirementStep = 0;
  let sickDaysReduction = 0;
  let finalSalary = 0;
  let calculationError: string | null = null;

  try {
    // Obliczenia podstawowe
    const actualTotal = calculatePension(calculationParams);
    const realTotal = calculateRealPension(calculationParams);
    const sickDaysTotal = calculateSickDaysImpact(calculationParams);
    
    // Obliczenia miesięczne
    actualMonthly = calculateMonthlyPension(actualTotal, retirementAge);
    realMonthly = calculateMonthlyPension(realTotal, retirementAge);
    sickDaysMonthly = calculateMonthlyPension(sickDaysTotal, retirementAge);
    
    // Różnica z powodu zwolnień lekarskich
    sickDaysReduction = realMonthly - sickDaysMonthly;
    
    // Obliczenia dla opóźnionego przejścia na emeryturę
    const delayedTotal1 = calculateDelayedRetirementRent(calculationParams, retirementAge + 1, false);
    const delayedTotal2 = calculateDelayedRetirementRent(calculationParams, retirementAge + 2, false);
    const delayedTotal5 = calculateDelayedRetirementRent(calculationParams, retirementAge + 5, false);
    
    delayedMonthly1 = calculateMonthlyPension(delayedTotal1, retirementAge + 1);
    delayedMonthly2 = calculateMonthlyPension(delayedTotal2, retirementAge + 2);
    delayedMonthly5 = calculateMonthlyPension(delayedTotal5, retirementAge + 5);
    
    // Stopa zastąpienia
    retirementStep = calculateRetirementStep(calculationParams, false, false);
    
    // Ostatnia pensja
    finalSalary = calculateFinalSalary(user.GrossSalary, user.StartYear, user.PlannedRetirementYear - user.StartYear);
    
  } catch (error) {
    calculationError = error instanceof Error ? error.message : "Wystąpił nieznany błąd podczas obliczeń.";
    console.error("Błąd kalkulacji:", error);
  }

  if (calculationError) {
    return (
      <div className="result-container">
        <div className="forecast-header">
          <h1>Błąd obliczeń</h1>
          <p className="forecast-year text-red-600">{calculationError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      <div className="forecast-header">
        <h1>Twoja prognozowana emerytura</h1>
        <p className="forecast-year">Wyliczenie dla roku {user.PlannedRetirementYear}</p>
        
        <div className="amounts-grid">
          <div className="amount-card">
            <h3>KWOTA NOMINALNA</h3>
            <p className="amount">{Math.round(actualMonthly).toLocaleString()} zł</p>
            <span className="amount-desc">rzeczywista kwota w {user.PlannedRetirementYear}</span>
          </div>
          <div className="amount-card">
            <h3>KWOTA UREALNIONA</h3>
            <p className="amount">{Math.round(realMonthly).toLocaleString()} zł</p>
            <span className="amount-desc">w dzisiejszej sile nabywczej</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Stopa zastąpienia</h4>
          <p className="stat-value">{retirementStep}%</p>
        </div>
        <div className="stat-card">
          <h4>Ostatnia pensja</h4>
          <p className="stat-value">{Math.round(finalSalary).toLocaleString()} zł</p>
        </div>
      </div>

      <div className="info-section">
        <h3>Wpływ zwolnień lekarskich</h3>
        <div className="info-content">
          <p>Zwolnienia lekarskie obniżają Twoją przyszłą emeryturę o około {Math.round(sickDaysReduction)} zł miesięcznie. Bez L4 otrzymałbyś {Math.round(realMonthly).toLocaleString()} zł.</p>
        </div>
      </div>

      <div className="postpone-section">
        <h3>Odłóż przejście na emeryturę</h3>
        <p className="postpone-desc">Zobacz, jak wzrośnie Twoja emerytura, jeśli będziesz pracować dłużej:</p>
        
        <div className="postpone-grid">
          <div className="postpone-card">
            <p className="postpone-period">+1 rok</p>
            <p className="postpone-amount">+{Math.round(delayedMonthly1 - sickDaysMonthly)} zł</p>
          </div>
          <div className="postpone-card">
            <p className="postpone-period">+2 lata</p>
            <p className="postpone-amount">+{Math.round(delayedMonthly2 - sickDaysMonthly)} zł</p>
          </div>
          <div className="postpone-card">
            <p className="postpone-period">+5 lat</p>
            <p className="postpone-amount">+{Math.round(delayedMonthly5 - sickDaysMonthly)} zł</p>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn-secondary" onClick={() => window.history.back()}>Zmień parametry</button>
        <button className="btn-primary" onClick={() => router.push('/panel')}>Zaawansowana symulacja</button>
        <button className="btn-success">Pobierz raport</button>
      </div>
    </div>
  )
}

export default ResultModal