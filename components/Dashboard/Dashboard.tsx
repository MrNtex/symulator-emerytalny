'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@/context/UserContext';
import './Dashboard.css';
import { Document, Page, Text, View, StyleSheet, pdf, Font } from '@react-pdf/renderer';
import PensionForecastChart from '@/components/PensionForecastChart';
import { calculateTotalBalance, getLatestBalance, formatCurrency } from '@/utils/pensionCalculations';
import balanceDataJson from '@/shared/data/balance.json';

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
  const { user } = useUser();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [balanceData] = useState(balanceDataJson);
  const latestBalance = getLatestBalance(balanceData);
  const totalBalance = calculateTotalBalance(balanceData);
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

  const [postalCode, setPostalCode] = useState('');
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 25;
  const endYear = currentYear + 25;
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

  const handleSendFeedback = () => {
    if (postalCode && !/^\d{2}-\d{3}$/.test(postalCode)) {
      alert('Proszę podać poprawny kod pocztowy w formacie XX-XXX');
      return;
    }
        
    console.log('Feedback wysłany:', { postalCode, timestamp: new Date() });
    setIsFeedbackSent(true);
    setPostalCode('');
    
    setTimeout(() => {
      setIsFeedbackSent(false);
    }, 3000);
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

  Font.register({
    family: 'OpenSans',
    fonts: [
      {
        src: '/fonts/OpenSans-Regular.ttf',
        fontWeight: 'normal',
      },
      {
        src: '/fonts/OpenSans-Bold.ttf',
        fontWeight: 'bold',
      },
    ],
  });

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 30,
      fontFamily: 'OpenSans',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#00993F',
      marginBottom: 20,
      textAlign: 'center',
      fontFamily: 'OpenSans',
    },
    date: {
      fontSize: 12,
      marginBottom: 30,
      textAlign: 'center',
      fontFamily: 'OpenSans',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#00416E',
      marginBottom: 15,
      marginTop: 20,
      fontFamily: 'OpenSans',
    },
    dataItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
      paddingVertical: 4,
    },
    dataLabel: {
      fontSize: 11,
      fontWeight: 'bold',
      color: '#00416E',
      fontFamily: 'OpenSans',
    },
    dataValue: {
      fontSize: 11,
      color: '#00993F',
      fontFamily: 'OpenSans',
    },
    eventItem: {
      marginBottom: 6,
      fontSize: 10,
      color: '#000000',
      fontFamily: 'OpenSans',
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: 'center',
      fontSize: 10,
      color: '#666666',
      fontFamily: 'OpenSans',
    },
    forecastTable: {
      marginBottom: 20,
      border: '1pt solid #e2e8f0',
      borderRadius: 4,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#00416E',
      padding: 8,
    },
    tableHeaderCell: {
      flex: 1,
      fontSize: 10,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'OpenSans',
      textAlign: 'center',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottom: '1pt solid #e2e8f0',
      padding: 6,
    },
    tableCell: {
      flex: 1,
      fontSize: 9,
      color: '#374151',
      fontFamily: 'OpenSans',
      paddingHorizontal: 4,
    },
    tableCellValue: {
      flex: 1,
      fontSize: 9,
      fontWeight: 'bold',
      color: '#00993F',
      fontFamily: 'OpenSans',
      textAlign: 'center',
      paddingHorizontal: 4,
    },
    tableCellPositive: {
      flex: 1,
      fontSize: 9,
      fontWeight: 'bold',
      color: '#059669',
      fontFamily: 'OpenSans',
      textAlign: 'center',
      paddingHorizontal: 4,
    },
    tableCellNegative: {
      flex: 1,
      fontSize: 9,
      fontWeight: 'bold',
      color: '#dc2626',
      fontFamily: 'OpenSans',
      textAlign: 'center',
      paddingHorizontal: 4,
    },
  });

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>RAPORT SYMULATORA EMERYTALNEGO ZUS</Text>
        <Text style={styles.date}>
          Data wygenerowania: {new Date().toLocaleDateString('pl-PL')}
        </Text>

        <Text style={styles.sectionTitle}>DANE UŻYTKOWNIKA</Text>
        {user && (
          <>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Rok rozpoczęcia pracy:</Text>
              <Text style={styles.dataValue}>{user.StartYear}</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Rok planowanego przejścia na emeryturę:</Text>
              <Text style={styles.dataValue}>{user.PlannedRetirementYear}</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Płeć:</Text>
              <Text style={styles.dataValue}>{user.sex}</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Obecne miesięczne wynagrodzenie brutto:</Text>
              <Text style={styles.dataValue}>{user.GrossSalary.toLocaleString('pl-PL')} zł</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Udział chorobowego (średnio dni/rok):</Text>
              <Text style={styles.dataValue}>{user.sickDaysPerYear || 34} dni</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Uwzględnienie chorób:</Text>
              <Text style={styles.dataValue}>{user.includeSickDays ? '✅ Tak' : '❌ Nie'}</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Uwzględnienie opóźnienia emerytury:</Text>
              <Text style={styles.dataValue}>{user.includeDelayedRetirement ? '✅ Tak' : '❌ Nie'}</Text>
            </View>
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Docelowa emerytura (oczekiwana):</Text>
              <Text style={styles.dataValue}>
                {user.targetPension ? `${user.targetPension.toLocaleString('pl-PL')} zł/mies.` : 'Nie określono'}
              </Text>
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>SZCZEGÓŁOWA PROGNOZA EMERYTALNA</Text>
        
        <View style={styles.forecastTable}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Wskaźnik</Text>
            <Text style={styles.tableHeaderCell}>Wartość</Text>
            <Text style={styles.tableHeaderCell}>Opis</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Prognozowana emerytura nominalna</Text>
            <Text style={styles.tableCellValue}>8 250 zł/mies.</Text>
            <Text style={styles.tableCell}>Kwota w roku przejścia (2055)</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Urealniona wartość (dzisiejsze zł)</Text>
            <Text style={styles.tableCellValue}>3 400 zł/mies.</Text>
            <Text style={styles.tableCell}>Po uwzględnieniu inflacji</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Łączny kapitał zgromadzony</Text>
            <Text style={styles.tableCellValue}>1 970 000 zł</Text>
            <Text style={styles.tableCell}>Suma składek + waloryzacja</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Stopa zastąpienia</Text>
            <Text style={styles.tableCellValue}>38%</Text>
            <Text style={styles.tableCell}>Emerytura / ostatnia pensja</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Średnia emerytura w kraju (2055)</Text>
            <Text style={styles.tableCell}>7 800 zł</Text>
            <Text style={styles.tableCell}>Porównanie do średniej</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Twoja emerytura względem średniej</Text>
            <Text style={styles.tableCellPositive}>🔼 +6%</Text>
            <Text style={styles.tableCell}>Nad/pod średnią</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Wpływ chorób</Text>
            <Text style={styles.tableCellNegative}>-42 000 zł</Text>
            <Text style={styles.tableCell}>Redukcja przez absencje</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Opóźnienie o 1 rok</Text>
            <Text style={styles.tableCellPositive}>+8%</Text>
            <Text style={styles.tableCell}>Wzrost świadczenia</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Opóźnienie o 5 lat</Text>
            <Text style={styles.tableCellPositive}>+32%</Text>
            <Text style={styles.tableCell}>Wzrost świadczenia</Text>
          </View>
        </View>

        {events.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>WYDARZENIA NA OSI CZASU</Text>
            {events.map((event) => {
              const eventText = event.type === 'salary' 
                ? `Zmiana wynagrodzenia: ${event.title} - ${event.amount.toLocaleString('pl-PL')} zł (${new Date(event.date).toLocaleDateString('pl-PL')})`
                : event.type === 'subAccountDeposit'
                ? `Wpłata na subkonto: ${event.title} - ${event.amount.toLocaleString('pl-PL')} zł (${new Date(event.date).toLocaleDateString('pl-PL')})`
                : `Zwolnienie chorobowe: ${event.title} (${new Date(event.startDate).toLocaleDateString('pl-PL')} - ${new Date(event.endDate).toLocaleDateString('pl-PL')})`;
              
              return (
                <Text key={event.id} style={styles.eventItem}>
                  {eventText}
                </Text>
              );
            })}
          </>
        )}

        <Text style={styles.footer}>
          Wygenerowano przez Symulator Emerytalny ZUS
        </Text>
      </Page>
    </Document>
  );

  const generatePDF = async () => {
    if (!user) return;

    const blob = await pdf(MyDocument()).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `raport-emerytalny-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
              <span className="value-label">Narastająco zgromadzona kwota:</span>
              <span className="value-amount">{formatCurrency(totalBalance.totalMain)} zł</span>
            </div>
            <div className="account-value" style={{ marginTop: '10px', fontSize: '0.9em', opacity: 0.8 }}>
              <span className="value-label">Ostatni rok ({latestBalance.year}):</span>
              <span className="value-amount">{formatCurrency(latestBalance.mainBalance)} zł</span>
            </div>
          </div>

          <div className="info-card">
            <h3>Subkonto ZUS</h3>
            <div className="account-value">
              <span className="value-label">Narastająco zgromadzona kwota:</span>
              <span className="value-amount">{formatCurrency(totalBalance.totalSub)} zł</span>
            </div>
            <div className="account-value" style={{ marginTop: '10px', fontSize: '0.9em', opacity: 0.8 }}>
              <span className="value-label">Ostatni rok ({latestBalance.year}):</span>
              <span className="value-amount">{formatCurrency(latestBalance.subBalance)} zł</span>
            </div>
          </div>

          <div className="info-card">
            <h3>Łączny Kapitał</h3>
            <div className="account-value">
              <span className="value-label">Suma narastająco:</span>
              <span className="value-amount">{formatCurrency(totalBalance.total)} zł</span>
            </div>
            <div className="account-value" style={{ marginTop: '10px', fontSize: '0.9em', opacity: 0.8 }}>
              <span className="value-label">Ostatni rok ({latestBalance.year}):</span>
              <span className="value-amount">{formatCurrency(latestBalance.total)} zł</span>
            </div>
          </div>
        </div>

        {user && (
          <div className="user-data-section">
            <h2>Twoje Dane</h2>
            <div className="user-data-grid">
              <div className="data-item">
                <span className="data-label">Rok rozpoczęcia pracy:</span>
                <span className="data-value">{user.StartYear}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Rok planowanego przejścia na emeryturę:</span>
                <span className="data-value">{user.PlannedRetirementYear}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Płeć:</span>
                <span className="data-value">{user.sex}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Obecne miesięczne wynagrodzenie brutto:</span>
                <span className="data-value">{user.GrossSalary.toLocaleString('pl-PL')} zł</span>
              </div>
              <div className="data-item">
                <span className="data-label">Udział chorobowego (średnio dni/rok):</span>
                <span className="data-value">{user.sickDaysPerYear || 34} dni</span>
              </div>
              <div className="data-item">
                <span className="data-label">Uwzględnienie chorób:</span>
                <span className="data-value">{user.includeSickDays ? '✅ Tak' : '❌ Nie'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Uwzględnienie opóźnienia emerytury:</span>
                <span className="data-value">{user.includeDelayedRetirement ? '✅ Tak' : '❌ Nie'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Docelowa emerytura (oczekiwana):</span>
                <span className="data-value">{user.targetPension ? `${user.targetPension.toLocaleString('pl-PL')} zł/mies.` : 'Nie określono'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="pension-forecast-section">
          <h2>Szczegółowa Prognoza Emerytalna</h2>
          
          <div className="forecast-table">
            <div className="table-header">
              <div className="table-cell">Wskaźnik</div>
              <div className="table-cell">Wartość</div>
              <div className="table-cell">Opis</div>
            </div>
            
            <div className="table-row">
              <div className="table-cell">Prognozowana emerytura nominalna</div>
              <div className="table-cell value-highlight">8 250 zł/mies.</div>
              <div className="table-cell">Kwota w roku przejścia (2055)</div>
            </div>
            
            <div className="table-row">
              <div className="table-cell">Urealniona wartość (dzisiejsze zł)</div>
              <div className="table-cell value-highlight">3 400 zł/mies.</div>
              <div className="table-cell">Po uwzględnieniu inflacji</div>
            </div>
            
            <div className="table-row">
              <div className="table-cell">Łączny kapitał zgromadzony</div>
              <div className="table-cell value-highlight">1 970 000 zł</div>
              <div className="table-cell">Suma składek + waloryzacja</div>
            </div>
            
            <div className="table-row">
              <div className="table-cell">Stopa zastąpienia</div>
              <div className="table-cell value-highlight">38%</div>
              <div className="table-cell">Emerytura / ostatnia pensja</div>
            </div>
            
            <div className="table-row">
              <div className="table-cell">Średnia emerytura w kraju (2055)</div>
              <div className="table-cell">7 800 zł</div>
              <div className="table-cell">Porównanie do średniej</div>
            </div>
            
            <div className="table-row">
              <div className="table-cell">Twoja emerytura względem średniej</div>
              <div className="table-cell value-positive">🔼 +6%</div>
              <div className="table-cell">Nad/pod średnią</div>
            </div>
            
            <div className="table-row">
              <div className="table-cell">Wpływ chorób</div>
              <div className="table-cell value-negative">-42 000 zł</div>
              <div className="table-cell">Redukcja przez absencje</div>
            </div>
            
            <div className="table-row">
              <div className="table-cell">Opóźnienie o 1 rok</div>
              <div className="table-cell value-positive">+8%</div>
              <div className="table-cell">Wzrost świadczenia</div>
            </div>
            
            <div className="table-row">
              <div className="table-cell">Opóźnienie o 5 lat</div>
              <div className="table-cell value-positive">+32%</div>
              <div className="table-cell">Wzrost świadczenia</div>
            </div>
          </div>

          <div className="charts-section-dashboard">
            <div className="chart-container">
              <h3>Porównanie Emerytur</h3>
              <div className="bar-chart">
                <div className="bar-item">
                  <div className="bar-label">Twoja emerytura</div>
                  <div className="bar-wrapper">
                    <div className="bar-fill" style={{ width: '100%', backgroundColor: '#00993F' }}>
                      <span className="bar-value">8 250 zł</span>
                    </div>
                  </div>
                </div>
                <div className="bar-item">
                  <div className="bar-label">Średnia krajowa</div>
                  <div className="bar-wrapper">
                    <div className="bar-fill" style={{ width: '95%', backgroundColor: '#2563eb' }}>
                      <span className="bar-value">7 800 zł</span>
                    </div>
                  </div>
                </div>
                <div className="bar-item">
                  <div className="bar-label">Wartość realna</div>
                  <div className="bar-wrapper">
                    <div className="bar-fill" style={{ width: '41%', backgroundColor: '#f59e0b' }}>
                      <span className="bar-value">3 400 zł</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Wpływ Opóźnienia Emerytury</h3>
              <div className="delay-impact-chart">
                <div className="delay-bars">
                  <div className="delay-bar-item">
                    <div className="delay-bar-label">Emerytura standardowa</div>
                    <div className="delay-bar-wrapper">
                      <div className="delay-bar-fill" style={{ width: '60%', backgroundColor: '#64748b' }}>
                        <span className="delay-bar-value">8 250</span>
                      </div>
                    </div>
                    <span className="delay-bar-subtitle">Wiek: 67 lat (0%)</span>
                  </div>
                  <div className="delay-bar-item">
                    <div className="delay-bar-label">Po opóźnieniu +1 rok</div>
                    <div className="delay-bar-wrapper">
                      <div className="delay-bar-fill" style={{ width: '65%', backgroundColor: '#0ea5e9' }}>
                        <span className="delay-bar-value">8 910</span>
                      </div>
                    </div>
                    <span className="delay-bar-subtitle">Wiek: 68 lat (+8%)</span>
                  </div>
                  <div className="delay-bar-item">
                    <div className="delay-bar-label">Po opóźnieniu +5 lat</div>
                    <div className="delay-bar-wrapper">
                      <div className="delay-bar-fill" style={{ width: '80%', backgroundColor: '#00993F' }}>
                        <span className="delay-bar-value">10 890</span>
                      </div>
                    </div>
                    <span className="delay-bar-subtitle">Wiek: 72 lata (+32%)</span>
                  </div>
                </div>
              </div>
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
          <h2>Narastający Kapitał Emerytalny</h2>
          <p style={{ marginBottom: '20px', color: '#64748b' }}>
            Poniższy wykres przedstawia narastający kapitał zgromadzony na koncie głównym (saldo) i subkoncie ZUS w poszczególnych latach.
          </p>
          <PensionForecastChart
            balanceData={balanceData}
            startYear={2020}
          />
        </div>

        <div className="report-section">
          <button className="download-report-btn" onClick={generatePDF}>
            📊 Pobierz raport
          </button>
        </div>

        <div className="feedback-section">
          <div className="feedback-container">
            <h3>Podziel się opinią</h3>
            <p>Pomóż nam ulepszyć symulator - podaj kod pocztowy (opcjonalnie)</p>
            <div className="feedback-form">
              <input
                type="text"
                placeholder="Kod pocztowy (opcjonalnie)"
                className="postal-code-input"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                maxLength={6}
                pattern="[0-9]{2}-[0-9]{3}"
                disabled={isFeedbackSent}
              />
              <button 
                className={`send-feedback-btn ${isFeedbackSent ? 'sent' : ''}`} 
                onClick={handleSendFeedback}
                disabled={isFeedbackSent}
              >
                {isFeedbackSent ? 'Wysłano' : 'Wyślij'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;