import React, { useState, useMemo, useRef } from 'react';
import Form from 'next/form';
interface RetirementData {
    age: number | ''; 
    gender: 'Kobieta' | 'Mężczyzna' | ''; 
    grossSalary: number | ''; 
    startYear: number | ''; 
    plannedRetirementYear: number | ''; 
}

const RETIREMENT_AGE_WOMAN = 60;
const RETIREMENT_AGE_MAN = 65;

const UserForm: React.FC = () => {
    const [formData, setFormData] = useState<RetirementData>({
        age: '',
        gender: '',
        grossSalary: '',
        startYear: new Date().getFullYear(),
        plannedRetirementYear: '',
    });

    const currentYear = new Date().getFullYear();
    const lastDefaultYear = useRef<number | ''>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' && value !== '' ? parseFloat(value) : value;

        if (name === 'plannedRetirementYear' && newValue !== defaultRetirementYear) {
            lastDefaultYear.current = '';
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };

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
    }, [formData.age, formData.gender, currentYear]);

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

    },
    [defaultRetirementYear, formData.plannedRetirementYear]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const isFormValid = Object.values(formData).every(value => value !== '' && value !== null && value !== undefined);
        if (isFormValid) {
            console.log("Dane gotowe do symulacji:", formData);
            alert("Formularz wysłany. Sprawdź konsolę, aby zobaczyć dane.");
        } else {
            alert("Proszę wypełnić wszystkie obowiązkowe pola.");
        }
    };

    return (
        <Form action={(() => {}) as any}
            onSubmit={handleSubmit} 
            style={{ 
                maxWidth: '400px', 
                margin: '20px auto', 
                padding: '20px', 
                border: '1px solid #ccc', 
                borderRadius: '5px' 
            }}
        >
            <h2>Symulacja Emerytury</h2>

            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="age">Wiek (lata): *</label>
                <input
                    type="number"
                    id="age"
                    name="age"
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="gender">Płeć: *</label>
                <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                >
                    <option value="">-- Wybierz płeć --</option>
                    <option value="Kobieta">Kobieta</option>
                    <option value="Mężczyzna">Mężczyzna</option>
                </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="grossSalary">Wysokość wynagrodzenia brutto (PLN): *</label>
                <input
                    type="number"
                    id="grossSalary"
                    name="grossSalary"
                    min="1000"
                    step="0.01"
                    value={formData.grossSalary}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="startYear">Rok rozpoczęcia pracy: *</label>
                <input
                    type="number"
                    id="startYear"
                    name="startYear"
                    min="1950"
                    max={currentYear}
                    step="1"
                    value={formData.startYear}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="plannedRetirementYear">Planowany rok zakończenia aktywności: *</label>
                <input
                    type="number"
                    id="plannedRetirementYear"
                    name="plannedRetirementYear"
                    min={defaultRetirementYear || currentYear} 
                    max={currentYear + 50}
                    step="1"
                    value={formData.plannedRetirementYear}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
                {defaultRetirementYear && (
                    <p style={{ fontSize: '0.8em', color: '#555' }}>
                        * Obowiązkowy wiek emerytalny: {defaultRetirementYear}.
                    </p>
                )}
            </div>

            <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Symuluj Emeryturę
            </button>
        </Form>
    );
};

export default UserForm;