'use client'

import React, { useState, useMemo, useRef } from 'react';
import Form from 'next/form';
import { useRouter } from 'next/navigation';
import './UserForm.css';
import { useUser, Gender } from '@/context/UserContext';

interface RetirementData {
  age: number | '';
  gender: 'Kobieta' | 'Mężczyzna' | '';
  grossSalary: number | '';
  startYear: number;
  plannedRetirementYear: number | '';
  sickDaysPerYear: number | '';
  includeSickDays: boolean;
  includeDelayedRetirement: boolean;
  targetPension: number | '';
}

const RETIREMENT_AGE_WOMAN = 60;
const RETIREMENT_AGE_MAN = 65;

const UserForm: React.FC = () => {
  const router = useRouter();
  const { setUser, user } = useUser();
  const currentYear = new Date().getFullYear();
  const initialStartYear = user?.StartYear ?? currentYear;

  const [formData, setFormData] = useState<RetirementData>({
    age: user?.age ?? '' as number | '',
    gender: user?.sex ?? '' as Gender | '',
    grossSalary: user?.GrossSalary ?? '' as number | '',
    startYear: initialStartYear,
    plannedRetirementYear: user?.PlannedRetirementYear ?? '' as number | '',
    sickDaysPerYear: user?.sickDaysPerYear ?? 34 as number | '',
    includeSickDays: user?.includeSickDays ?? false,
    includeDelayedRetirement: user?.includeDelayedRetirement ?? false,
    targetPension: user?.targetPension ?? '' as number | '',
  });

  const lastDefaultYear = useRef<number | ''>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean;

    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number' && value !== '') {
      newValue = parseFloat(value);
    } else {
      newValue = value;
    }

    if (name === 'plannedRetirementYear' && newValue !== defaultRetirementYear) {
      lastDefaultYear.current = '';
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Wiek emerytalny zależny od płci
  const defaultRetirementYear = useMemo(() => {
    const { age, gender } = formData;

    if (age === '' || gender === '') return '';

    const ageNumber = age as number;

    if (gender === 'Kobieta') {
      const yearsToRetirement = RETIREMENT_AGE_WOMAN - ageNumber;
      return currentYear + yearsToRetirement;
    }
    if (gender === 'Mężczyzna') {
      const yearsToRetirement = RETIREMENT_AGE_MAN - ageNumber;
      return currentYear + yearsToRetirement;
    }

    return '';
  }, [formData, currentYear]);

  React.useEffect(() => {
    if (!defaultRetirementYear) return;
    const currentPlanned = formData.plannedRetirementYear;

    if (currentPlanned === '' || currentPlanned === lastDefaultYear.current) {
      setFormData(prev => ({
        ...prev,
        plannedRetirementYear: defaultRetirementYear,
      }));
      lastDefaultYear.current = defaultRetirementYear;
    }
  }, [defaultRetirementYear, formData.plannedRetirementYear]);

  // Automatyczne zapisywanie do kontekstu
  React.useEffect(() => {
    const validData = {
      age: formData.age,
      sex: formData.gender,
      GrossSalary: formData.grossSalary,
      StartYear: formData.startYear,
      PlannedRetirementYear: formData.plannedRetirementYear
    };

    const allFieldsValid = Object.values(validData).every(value =>
      value !== '' && value !== null && value !== undefined
    );

    if (allFieldsValid) {
      setUser({
        age: validData.age as number,
        sex: validData.sex as Gender,
        GrossSalary: validData.GrossSalary as number,
        StartYear: validData.StartYear as number,
        PlannedRetirementYear: validData.PlannedRetirementYear as number,
        sickDaysPerYear: formData.sickDaysPerYear as number || 34,
        includeSickDays: formData.includeSickDays,
        includeDelayedRetirement: formData.includeDelayedRetirement,
        targetPension: formData.targetPension as number || undefined
      });
    }
  }, [formData, setUser]);

  // Obsługa kliknięcia w strzałki (góra / dół)
  const handleArrowClick = (field: keyof RetirementData, direction: 'up' | 'down') => {
    setFormData(prev => {
      const currentValue = Number(prev[field]) || 0;
      const step = 1;
      const newValue = direction === 'up' ? currentValue + step : currentValue - step;
      return { ...prev, [field]: newValue };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = {
      age: formData.age,
      gender: formData.gender,
      grossSalary: formData.grossSalary,
      startYear: formData.startYear,
      plannedRetirementYear: formData.plannedRetirementYear
    };

    const isFormValid = Object.values(requiredFields).every(value => value !== '' && value !== null && value !== undefined);

    if (isFormValid) {
      setUser({
        age: formData.age as number,
        sex: formData.gender as Gender,
        GrossSalary: formData.grossSalary as number,
        StartYear: formData.startYear as number,
        PlannedRetirementYear: formData.plannedRetirementYear as number,
        sickDaysPerYear: formData.sickDaysPerYear as number || 34,
        includeSickDays: formData.includeSickDays,
        includeDelayedRetirement: formData.includeDelayedRetirement,
        targetPension: formData.targetPension as number || undefined
      });
      router.push('/wyniki');
    } else {
      alert("Proszę wypełnić wszystkie obowiązkowe pola.");
    }
  };

  return (
    <div className="user-form-container">
        <Form action={() => {}} onSubmit={handleSubmit} className="retirement-form">
            <h2>Symulacja Emerytury</h2>

            {/* Wiek */}
            <div className="form-group">
                <label htmlFor="age">
                Wiek (lata): *
                <span className="tooltip-wrapper">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">Podaj swój aktualny wiek w pełnych latach (np. 35)</span>
                </span>
                </label>
                <div className="number-input-wrapper">
                <input
                    type="number"
                    id="age"
                    name="age"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={handleChange}
                    required
                />
                <span className="number-input-arrows">
                    <span className="arrow-up" onClick={() => handleArrowClick('age', 'up')}></span>
                    <span className="arrow-down" onClick={() => handleArrowClick('age', 'down')}></span>
                </span>
                </div>
            </div>

            {/* Płeć */}
            <div className="form-group">
                <label htmlFor="gender">
                Płeć: *
                <span className="tooltip-wrapper">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">Wybierz swoją płeć - wpływa na wiek emerytalny</span>
                </span>
                </label>
                <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                >
                <option value="">-- Wybierz płeć --</option>
                <option value="Kobieta">Kobieta</option>
                <option value="Mężczyzna">Mężczyzna</option>
                </select>
            </div>

            {/* Wynagrodzenie */}
            <div className="form-group">
                <label htmlFor="grossSalary">
                Wynagrodzenie brutto (PLN): *
                <span className="tooltip-wrapper">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">Podaj miesięczne wynagrodzenie brutto (np. 5000)</span>
                </span>
                </label>
                <div className="number-input-wrapper">
                <input
                    type="number"
                    id="grossSalary"
                    name="grossSalary"
                    min="1000"
                    step="500"
                    value={formData.grossSalary}
                    onChange={handleChange}
                    required
                />
                <span className="number-input-arrows">
                    <span className="arrow-up" onClick={() => handleArrowClick('grossSalary', 'up')}></span>
                    <span className="arrow-down" onClick={() => handleArrowClick('grossSalary', 'down')}></span>
                </span>
                </div>
            </div>

            {/* Rok rozpoczęcia */}
            <div className="form-group">
                <label htmlFor="startYear">Rok rozpoczęcia pracy: *</label>
                <div className="number-input-wrapper">
                <input
                    type="number"
                    id="startYear"
                    name="startYear"
                    min="1945"
                    step="1"
                    value={formData.startYear}
                    onChange={handleChange}
                    required
                />
                <span className="number-input-arrows">
                    <span className="arrow-up" onClick={() => handleArrowClick('startYear', 'up')}></span>
                    <span className="arrow-down" onClick={() => handleArrowClick('startYear', 'down')}></span>
                </span>
                </div>
            </div>

            {/* Rok zakończenia */}
            <div className="form-group">
                <label htmlFor="plannedRetirementYear">Planowany rok zakończenia aktywności: *</label>
                <div className="number-input-wrapper">
                <input
                    type="number"
                    id="plannedRetirementYear"
                    name="plannedRetirementYear"
                    min={defaultRetirementYear || currentYear}
                    step="1"
                    value={formData.plannedRetirementYear}
                    onChange={handleChange}
                    required
                />
                <span className="number-input-arrows">
                    <span className="arrow-up" onClick={() => handleArrowClick('plannedRetirementYear', 'up')}></span>
                    <span className="arrow-down" onClick={() => handleArrowClick('plannedRetirementYear', 'down')}></span>
                </span>
                </div>
                {defaultRetirementYear && (
                <p className="form-hint">* Obowiązkowy wiek emerytalny: {defaultRetirementYear}.</p>
                )}
            </div>

            {/* Dni chorobowe */}
            <div className="form-group">
                <label>
                <input
                    type="checkbox"
                    name="includeSickDays"
                    checked={formData.includeSickDays}
                    onChange={handleChange}
                    style={{ width: 'auto', marginRight: '10px' }}
                />
                Uwzględnij wpływ chorób na emeryturę
                <span className="tooltip-wrapper">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">Zaznacz, jeśli chcesz uwzględnić wpływ zwolnień chorobowych na wysokość emerytury</span>
                </span>
                </label>
            </div>

            {formData.includeSickDays && (
                <div className="form-group">
                <label htmlFor="sickDaysPerYear">
                    Średnia liczba dni chorobowych rocznie:
                    <span className="tooltip-wrapper">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">Podaj średnią liczbę dni chorobowych w ciągu roku (domyślnie: 34)</span>
                    </span>
                </label>
                <div className="number-input-wrapper">
                    <input
                    type="number"
                    id="sickDaysPerYear"
                    name="sickDaysPerYear"
                    min="0"
                    max="365"
                    value={formData.sickDaysPerYear}
                    onChange={handleChange}
                    />
                    <span className="number-input-arrows">
                    <span className="arrow-up" onClick={() => handleArrowClick('sickDaysPerYear', 'up')}></span>
                    <span className="arrow-down" onClick={() => handleArrowClick('sickDaysPerYear', 'down')}></span>
                    </span>
                </div>
                </div>
            )}

            {/* Opóźnienie emerytury */}
            <div className="form-group">
                <label>
                <input
                    type="checkbox"
                    name="includeDelayedRetirement"
                    checked={formData.includeDelayedRetirement}
                    onChange={handleChange}
                    style={{ width: 'auto', marginRight: '10px' }}
                />
                Rozważ opóźnienie przejścia na emeryturę
                <span className="tooltip-wrapper">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">Zaznacz, aby zobaczyć jak opóźnienie emerytury wpłynie na jej wysokość</span>
                </span>
                </label>
            </div>

            {/* Docelowa emerytura */}
            <div className="form-group">
                <label htmlFor="targetPension">
                Docelowa miesięczna emerytura (PLN - opcjonalnie):
                <span className="tooltip-wrapper">
                    <span className="tooltip-icon">?</span>
                    <span className="tooltip-text">Podaj kwotę emerytury, którą chciałbyś osiągnąć (opcjonalnie)</span>
                </span>
                </label>
                <div className="number-input-wrapper">
                <input
                    type="number"
                    id="targetPension"
                    name="targetPension"
                    min="0"
                    step="100"
                    value={formData.targetPension}
                    onChange={handleChange}
                />
                <span className="number-input-arrows">
                    <span className="arrow-up" onClick={() => handleArrowClick('targetPension', 'up')}></span>
                    <span className="arrow-down" onClick={() => handleArrowClick('targetPension', 'down')}></span>
                </span>
                </div>
            </div>

            <button type="submit">Symuluj Emeryturę</button>
        </Form>
    </div>
    
  );
};

export default UserForm;
