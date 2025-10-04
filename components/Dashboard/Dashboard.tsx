'use client';

import { useState, useEffect, useRef } from 'react';
import './Dashboard.css';

interface TimelineEvent {
  id: string;
  year: number;
  type: 'salary' | 'sickLeave' | 'indexation' | 'other';
  title: string;
  amount?: number;
  duration?: number;
}

const Dashboard = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    type: 'salary',
    year: new Date().getFullYear(),
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

  const handleAddEvent = () => {
    if (newEvent.year && newEvent.title) {
      const event: TimelineEvent = {
        id: Date.now().toString(),
        year: newEvent.year,
        type: newEvent.type as TimelineEvent['type'],
        title: newEvent.title,
        amount: newEvent.amount,
        duration: newEvent.duration,
      };
      setEvents([...events, event]);
      setIsAddingEvent(false);
      setNewEvent({ type: 'salary', year: currentYear });
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'salary':
        return '#00993F';
      case 'sickLeave':
        return '#dc2626';
      case 'indexation':
        return '#2563eb';
      case 'other':
        return '#9333ea';
      default:
        return '#00993F';
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
            <button
              className="add-event-btn"
              onClick={() => setIsAddingEvent(true)}
            >
              + Dodaj Wydarzenie
            </button>
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
                  const yearIndex = years.indexOf(event.year);
                  const leftPosition = (yearIndex / (years.length - 1)) * 100;
                  
                  const isNearLeft = leftPosition < 10;
                  const isNearRight = leftPosition > 90;
                  const baseTransform = isNearLeft ? 'translateX(0)' : isNearRight ? 'translateX(-100%)' : 'translateX(-50%)';
                  const eventStyle = {
                    left: `${leftPosition}%`,
                    borderColor: getEventColor(event.type),
                    transform: baseTransform,
                  };

                  return (
                    <div
                      key={event.id}
                      className="timeline-event"
                      style={eventStyle}
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
                        {event.amount && <p>Kwota: {event.amount.toLocaleString('pl-PL')} zł</p>}
                        {event.duration && <p>Okres: {event.duration} dni</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {isAddingEvent && (
          <div className="modal-overlay" onClick={() => setIsAddingEvent(false)}>
            <div className="event-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Dodaj Nowe Wydarzenie</h3>

              <div className="form-group">
                <label>Typ wydarzenia</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as TimelineEvent['type'] })}
                >
                  <option value="salary">Zmiana wynagrodzenia</option>
                  <option value="sickLeave">Zwolnienie chorobowe</option>
                  <option value="indexation">Zmiana indeksacji</option>
                  <option value="other">Inne</option>
                </select>
              </div>

              <div className="form-group">
                <label>Rok</label>
                <input
                  type="number"
                  value={newEvent.year || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, year: parseInt(e.target.value) })}
                  min={startYear}
                  max={endYear}
                />
              </div>

              <div className="form-group">
                <label>Tytuł wydarzenia</label>
                <input
                  type="text"
                  value={newEvent.title || ''}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Opisz wydarzenie"
                />
              </div>

              {(newEvent.type === 'salary' || newEvent.type === 'indexation') && (
                <div className="form-group">
                  <label>Kwota (zł)</label>
                  <input
                    type="number"
                    value={newEvent.amount || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, amount: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
              )}

              {newEvent.type === 'sickLeave' && (
                <div className="form-group">
                  <label>Okres (dni)</label>
                  <input
                    type="number"
                    value={newEvent.duration || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) })}
                    placeholder="Liczba dni"
                  />
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setIsAddingEvent(false);
                    setNewEvent({ type: 'salary', year: currentYear });
                  }}
                >
                  Anuluj
                </button>
                <button
                  className="confirm-btn"
                  onClick={handleAddEvent}
                  disabled={!newEvent.year || !newEvent.title}
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
