'use client';

import { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

interface SalaryChangeEvent {
  id: string;
  type: 'salary';
  date: string;
  amount: number;
  title: string;
}

interface SickLeaveEvent {
  id: string;
  type: 'sickLeave';
  startDate: string;
  endDate: string;
  title: string;
}

interface SubAccountDepositEvent {
  id: string;
  type: 'subAccountDeposit';
  date: string;
  amount: number;
  title: string;
}

type TimelineEvent = SalaryChangeEvent | SickLeaveEvent | SubAccountDepositEvent;

const Dashboard = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isAddingSalaryChange, setIsAddingSalaryChange] = useState(false);
  const [isAddingSickLeave, setIsAddingSickLeave] = useState(false);
  const [isAddingSubAccountDeposit, setIsAddingSubAccountDeposit] = useState(false);

  const [salaryChange, setSalaryChange] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    title: '',
  });

  const [sickLeave, setSickLeave] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    title: '',
  });

  const [subAccountDeposit, setSubAccountDeposit] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    title: '',
  });
  const timelineRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 15;
  const endYear = currentYear + 15;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  useEffect(() => {
    if (timelineRef.current) {
      const currentYearIndex = years.indexOf(currentYear);
      const totalYears = years.length;
      const scrollPercentage = currentYearIndex / (totalYears - 1);
      
      const timelineWidth = timelineRef.current.scrollWidth;
      const containerWidth = timelineRef.current.clientWidth;
      const maxScroll = timelineWidth - containerWidth;
      
      const scrollPosition = scrollPercentage * maxScroll;
      timelineRef.current.scrollLeft = scrollPosition;
    }
  }, [currentYear, years]);

  const handleAddSalaryChange = () => {
    if (salaryChange.date && salaryChange.amount && salaryChange.title) {
      const event: SalaryChangeEvent = {
        id: Date.now().toString(),
        type: 'salary',
        date: salaryChange.date,
        amount: salaryChange.amount,
        title: salaryChange.title,
      };
      setEvents([...events, event]);
      setIsAddingSalaryChange(false);
      setSalaryChange({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        title: '',
      });
    }
  };

  const handleAddSickLeave = () => {
    if (sickLeave.startDate && sickLeave.endDate && sickLeave.title) {
      const event: SickLeaveEvent = {
        id: Date.now().toString(),
        type: 'sickLeave',
        startDate: sickLeave.startDate,
        endDate: sickLeave.endDate,
        title: sickLeave.title,
      };
      setEvents([...events, event]);
      setIsAddingSickLeave(false);
      setSickLeave({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        title: '',
      });
    }
  };

  const handleAddSubAccountDeposit = () => {
    if (subAccountDeposit.date && subAccountDeposit.amount && subAccountDeposit.title) {
      const event: SubAccountDepositEvent = {
        id: Date.now().toString(),
        type: 'subAccountDeposit',
        date: subAccountDeposit.date,
        amount: subAccountDeposit.amount,
        title: subAccountDeposit.title,
      };
      setEvents([...events, event]);
      setIsAddingSubAccountDeposit(false);
      setSubAccountDeposit({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        title: '',
      });
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'salary':
        return '#00993F';
      case 'sickLeave':
        return '#dc2626';
      case 'subAccountDeposit':
        return '#2563eb';
      default:
        return '#00993F';
    }
  };

  const getEventYear = (event: TimelineEvent): number => {
    if (event.type === 'salary' || event.type === 'subAccountDeposit') {
      return new Date(event.date).getFullYear();
    } else {
      return new Date(event.startDate).getFullYear();
    }
  };

  const getEventDateRange = (event: TimelineEvent): { start: Date; end: Date } => {
    if (event.type === 'salary' || event.type === 'subAccountDeposit') {
      const date = new Date(event.date);
      return { start: date, end: date };
    } else {
      return {
        start: new Date(event.startDate),
        end: new Date(event.endDate),
      };
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard Symulatora Emerytalnego</h1>
          <p>Zarządzaj prognozami i symuluj różne scenariusze</p>
        </div>

        <div className="dashboard-cards">
          <div className="info-card">
            <h3>Konto ZUS</h3>
            <div className="account-value">
              <span className="value-label">Zgromadzona kwota:</span>
              <span className="value-amount">0,00 zł</span>
            </div>
          </div>

          <div className="info-card">
            <h3>Subkonto ZUS</h3>
            <div className="account-value">
              <span className="value-label">Zgromadzona kwota:</span>
              <span className="value-amount">0,00 zł</span>
            </div>
          </div>
        </div>

        <div className="timeline-section">
          <div className="timeline-header">
            <h2>Oś Czasu Wydarzeń</h2>
            <div className="add-event-buttons">
              <button
                className="add-event-btn salary-btn"
                onClick={() => setIsAddingSalaryChange(true)}
              >
                + Zmiana wynagrodzenia
              </button>
              <button
                className="add-event-btn sickleave-btn"
                onClick={() => setIsAddingSickLeave(true)}
              >
                + Chorobowy
              </button>
              <button
                className="add-event-btn subaccount-btn"
                onClick={() => setIsAddingSubAccountDeposit(true)}
              >
                + Wpłata na subkonto
              </button>
            </div>
          </div>

          <div className="timeline-container" ref={timelineRef}>
            <div className="timeline-track">
              <div className="timeline-line"></div>
              <div className="timeline-markers">
                {years.map((year) => (
                  <div
                    key={year}
                    className={`timeline-marker ${year === currentYear ? 'current-year' : ''}`}
                  >
                    <div className="marker-dot"></div>
                    <span className="marker-year">{year}</span>
                  </div>
                ))}
              </div>

              <div className="timeline-events">
                {events.map((event) => {
                  const eventYear = getEventYear(event);
                  const yearIndex = years.indexOf(eventYear);
                  const leftPosition = (yearIndex / (years.length - 1)) * 100;

                  const isNearLeft = leftPosition < 10;
                  const isNearRight = leftPosition > 90;
                  const baseTransform = isNearLeft ? 'translateX(0)' : isNearRight ? 'translateX(-100%)' : 'translateX(-50%)';

                  if (event.type === 'sickLeave') {
                    const dateRange = getEventDateRange(event);
                    const startYear = dateRange.start.getFullYear();
                    const endYear = dateRange.end.getFullYear();
                    const startIndex = years.indexOf(startYear);
                    const endIndex = years.indexOf(endYear);
                    const startPos = (startIndex / (years.length - 1)) * 100;
                    const endPos = (endIndex / (years.length - 1)) * 100;
                    const width = endPos - startPos;

                    return (
                      <div key={event.id}>
                        <div
                          className="timeline-sick-leave-bar"
                          style={{
                            left: `${startPos}%`,
                            width: `${Math.max(width, 0.5)}%`,
                            backgroundColor: getEventColor(event.type),
                          }}
                        ></div>
                        <div
                          className="timeline-event"
                          style={{
                            left: `${leftPosition}%`,
                            borderColor: getEventColor(event.type),
                            transform: baseTransform,
                          }}
                        >
                          <button
                            className="event-delete"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            ×
                          </button>
                          <div
                            className="event-indicator"
                            style={{ backgroundColor: getEventColor(event.type) }}
                          ></div>
                          <div className="event-content">
                            <h4>{event.title}</h4>
                            <p>{new Date(event.startDate).toLocaleDateString('pl-PL')} - {new Date(event.endDate).toLocaleDateString('pl-PL')}</p>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={event.id}
                        className="timeline-event"
                        style={{
                          left: `${leftPosition}%`,
                          borderColor: getEventColor(event.type),
                          transform: baseTransform,
                        }}
                      >
                        <button
                          className="event-delete"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          ×
                        </button>
                        <div
                          className="event-indicator"
                          style={{ backgroundColor: getEventColor(event.type) }}
                        ></div>
                        <div className="event-content">
                          <h4>{event.title}</h4>
                          <p>Kwota: {event.amount.toLocaleString('pl-PL')} zł</p>
                          <p>Data: {new Date(event.date).toLocaleDateString('pl-PL')}</p>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>

        {isAddingSalaryChange && (
          <div className="modal-overlay" onClick={() => setIsAddingSalaryChange(false)}>
            <div className="event-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Zmiana wynagrodzenia</h3>

              <div className="form-group">
                <label>Tytuł</label>
                <input
                  type="text"
                  value={salaryChange.title}
                  onChange={(e) => setSalaryChange({ ...salaryChange, title: e.target.value })}
                  placeholder="Np. Awans, Podwyżka roczna"
                />
              </div>

              <div className="form-group">
                <label>Data</label>
                <input
                  type="date"
                  value={salaryChange.date}
                  onChange={(e) => setSalaryChange({ ...salaryChange, date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Wysokość wynagrodzenia (zł brutto)</label>
                <input
                  type="number"
                  value={salaryChange.amount || ''}
                  onChange={(e) => setSalaryChange({ ...salaryChange, amount: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsAddingSalaryChange(false);
                    setSalaryChange({
                      date: new Date().toISOString().split('T')[0],
                      amount: 0,
                      title: '',
                    });
                  }}
                >
                  Anuluj
                </button>
                <button
                  className="confirm-btn"
                  onClick={handleAddSalaryChange}
                  disabled={!salaryChange.date || !salaryChange.amount || !salaryChange.title}
                >
                  Dodaj
                </button>
              </div>
            </div>
          </div>
        )}

        {isAddingSickLeave && (
          <div className="modal-overlay" onClick={() => setIsAddingSickLeave(false)}>
            <div className="event-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Zwolnienie chorobowe</h3>

              <div className="form-group">
                <label>Tytuł</label>
                <input
                  type="text"
                  value={sickLeave.title}
                  onChange={(e) => setSickLeave({ ...sickLeave, title: e.target.value })}
                  placeholder="Np. Grypa, Rehabilitacja"
                />
              </div>

              <div className="form-group">
                <label>Data rozpoczęcia</label>
                <input
                  type="date"
                  value={sickLeave.startDate}
                  onChange={(e) => setSickLeave({ ...sickLeave, startDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Data zakończenia</label>
                <input
                  type="date"
                  value={sickLeave.endDate}
                  onChange={(e) => setSickLeave({ ...sickLeave, endDate: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsAddingSickLeave(false);
                    setSickLeave({
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: new Date().toISOString().split('T')[0],
                      title: '',
                    });
                  }}
                >
                  Anuluj
                </button>
                <button
                  className="confirm-btn"
                  onClick={handleAddSickLeave}
                  disabled={!sickLeave.startDate || !sickLeave.endDate || !sickLeave.title}
                >
                  Dodaj
                </button>
              </div>
            </div>
          </div>
        )}

        {isAddingSubAccountDeposit && (
          <div className="modal-overlay" onClick={() => setIsAddingSubAccountDeposit(false)}>
            <div className="event-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Wpłata na subkonto</h3>

              <div className="form-group">
                <label>Tytuł</label>
                <input
                  type="text"
                  value={subAccountDeposit.title}
                  onChange={(e) => setSubAccountDeposit({ ...subAccountDeposit, title: e.target.value })}
                  placeholder="Np. Dodatkowa wpłata, Premia"
                />
              </div>

              <div className="form-group">
                <label>Data</label>
                <input
                  type="date"
                  value={subAccountDeposit.date}
                  onChange={(e) => setSubAccountDeposit({ ...subAccountDeposit, date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Kwota (zł)</label>
                <input
                  type="number"
                  value={subAccountDeposit.amount || ''}
                  onChange={(e) => setSubAccountDeposit({ ...subAccountDeposit, amount: parseFloat(e.target.value) })}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsAddingSubAccountDeposit(false);
                    setSubAccountDeposit({
                      date: new Date().toISOString().split('T')[0],
                      amount: 0,
                      title: '',
                    });
                  }}
                >
                  Anuluj
                </button>
                <button
                  className="confirm-btn"
                  onClick={handleAddSubAccountDeposit}
                  disabled={!subAccountDeposit.date || !subAccountDeposit.amount || !subAccountDeposit.title}
                >
                  Dodaj
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="simulation-controls">
          <h2>Opcje Prognozy</h2>

          <div className="controls-grid">
            <div className="control-group">
              <label>Wskaźnik indeksacji przyszłości (%)</label>
              <input type="number" step="0.1" defaultValue="3.5" />
            </div>

            <div className="control-group">
              <label>Przewidywany wiek emerytalny</label>
              <input type="number" defaultValue="67" />
            </div>

            <div className="control-group">
              <label>Okresy składkowe (lata)</label>
              <input type="number" defaultValue="35" />
            </div>

            <div className="control-group">
              <label>Średnie wynagrodzenie (zł)</label>
              <input type="number" defaultValue="7000" />
            </div>
          </div>

          <button className="recalculate-btn">
            Przelicz Symulację
          </button>
        </div>

        <div className="account-growth-section">
          <h2>Wzrost Środków na Kontach ZUS</h2>
          <div className="growth-chart-placeholder">
            <p>Wykres pokazujący wzrost kwot zgromadzonych na koncie i subkoncie w czasie</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
