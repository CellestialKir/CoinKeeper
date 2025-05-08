import React, { useState, useEffect } from "react";
import "../css/Main.css";
import OperationsPage from './OperationsPage';
import Tabs from './Tabs';
import Input from './Input';
import { createHistory, fetchHistory } from '../store/actions/historyActions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTypes, updateType } from '../store/actions/typeActions';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';

const Main = ({ activeBoard }) => {
  const dispatch = useDispatch();
  const { data: historyData = [], loading, error } = useSelector((state) => state.history);
  const { data: types = [] } = useSelector((state) => state.types);
  const [activeTab, setActiveTab] = useState('operations');
  const [cards, setCards] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // const [types, setTypes] = useState([
  //   { id: 1, name: 'Развлечения', color: '#ff6b6b', icon: '🎮', amount: 0 },
  //   { id: 2, name: 'Транспорт', color: '#4ecdc4', icon: '🚗', amount: 0 },
  //   { id: 3, name: 'Продукты', color: '#ffe66d', icon: '🛒', amount: 0 }
  // ]);

  const [banks, setBanks] = useState([
    { id: 1, name: 'Кредитная карта', amount: 0, color: '#ff6b6b' },
    { id: 2, name: 'Наличные', amount: 0, color: '#4ecdc4' },
    { id: 3, name: 'Банковский перевод', amount: 0, color: '#ff6b6b' },
    { id: 4, name: 'Электронный кошелек', amount: 0, color: '#4ecdc4' }
  ]);

  // Загрузка данных при монтировании
  useEffect(() => {
    dispatch(fetchHistory());
    dispatch(fetchTypes());
  }, [dispatch]);

  useEffect(() => {
      console.log('Types Data:', types); // Логирование данных типов
  }, [types]);

  // Синхронизация локального состояния с Redux store
  useEffect(() => {
    if (historyData && Array.isArray(historyData)) {
      setCards(historyData);
    }
  }, [historyData]);

  const handleAddCard = (newCard) => {
    if (!newCard || typeof newCard !== 'object') return;

    try {
        // Обновляем локальное состояние
        setCards(prev => [...prev, newCard]);

        // Обновляем types если это расход
        if (newCard.operationType === 'expense') {
          console.log(newCard)
          const selectedType = types.find(t => t.name === newCard.type);
          if (selectedType) {
              console.log('Selected Type for Update:', selectedType); // Логирование выбранного типа
              dispatch(updateType(selectedType.id, {
                  name: selectedType.name,
                  color: selectedType.color,
                  icon: selectedType.icon,
                  amount: selectedType.amount + newCard.amount
              }));
          }
      }

        // Обновляем banks
        setBanks(prevBanks => 
            prevBanks.map(bank => 
                bank.name === newCard.bank 
                    ? { 
                        ...bank, 
                        amount: bank.amount + (newCard.operationType === 'income' 
                            ? newCard.amount 
                            : -newCard.amount) 
                    } 
                    : bank
            )
        );
        
        // Отправляем действие в Redux
        dispatch(createHistory(newCard));

    } catch (error) {
        console.error('Error adding card:', error);
    }
};


  const tabs = [
    { id: 'operations', label: 'Операции' },
    { id: 'stats', label: 'Статистика' },
  ];

  const filterCardsByDate = (cards = []) => {
    return cards.filter(card => {
      try {
        if (!card?.date) return false;
        
        const cardDate = new Date(card.date);
        if (isNaN(cardDate.getTime())) return false;
        
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        let valid = true;
        if (start && !isNaN(start.getTime())) valid = valid && cardDate >= start;
        if (end && !isNaN(end.getTime())) valid = valid && cardDate <= end;
        return valid;
      } catch (e) {
        console.error('Ошибка обработки даты:', card?.date, e);
        return false;
      }
    });
  };

  const getStatsData = () => {
    const filteredCards = filterCardsByDate(cards);
    if (!filteredCards.length) return [];

    const processCategory = (card) =>
      (card.category?.trim() || 'Без категории').replace(/\s+/g, ' ').trim();

    const incomeCards = filteredCards.filter(card => card.operationType === 'income');
    const expenseCards = filteredCards.filter(card => card.operationType === 'expense');

    const incomeByCategory = incomeCards.reduce((acc, card) => {
      const category = processCategory(card);
      acc[category] = (acc[category] || 0) + card.amount;
      return acc;
    }, {});

    const expenseByCategory = expenseCards.reduce((acc, card) => {
      const category = processCategory(card);
      acc[category] = (acc[category] || 0) + card.amount;
      return acc;
    }, {});

    return [
      ...Object.entries(incomeByCategory).map(([name, value]) => ({
        name,
        value,
        type: 'income'
      })),
      ...Object.entries(expenseByCategory).map(([name, value]) => ({
        name,
        value,
        type: 'expense'
      }))
    ].filter(item => item.name && item.value > 0);
  };

  const getMonthlyData = (cards = []) => {
    const filtered = filterCardsByDate(cards);
    if (!filtered.length) return [];

    const grouped = filtered.reduce((acc, card) => {
      const month = new Date(card.date).toLocaleString('ru-RU', { month: 'short' });
      if (!month) return acc;
      
      if (!acc[month]) acc[month] = { income: 0, expense: 0 };
      card.operationType === 'income'
        ? acc[month].income += card.amount
        : acc[month].expense += card.amount;
      return acc;
    }, {});

    return Object.entries(grouped).map(([month, values]) => ({
      month,
      ...values
    }));
  };

  const statsData = getStatsData();
  const monthlyData = getMonthlyData(cards);

  if (loading) return <div className="loading">Загрузка данных...</div>;
  if (error) return <div className="error">Ошибка загрузки: {error}</div>;

  return (
    <main className="main-content">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === 'operations' && (
        <>
          <Input onAddCard={handleAddCard} types={types} banks={banks} />
          <OperationsPage cards={cards} types={types} banks={banks} />
        </>
      )}

      {activeTab === 'stats' && (
        <div className="stats">
          <h2>Статистика</h2>

          <div className="date-filter">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="date-input"
            />
            <span> — </span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="date-input"
            />
          </div>

          {statsData.length > 0 ? (
            <>
              <div className="chart-container">
                <h3>Распределение по категориям</h3>
                <PieChart width={500} height={400}>
                  <Pie
                    data={statsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label
                  >
                    {statsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.type === 'income' ? '#82ca9d' : '#ff7f0e'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>

              <div className="chart-container">
                <h3>Динамика по месяцам</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="income" fill="#82ca9d" name="Доходы" />
                    <Bar dataKey="expense" fill="#ff7f0e" name="Расходы" />
                    <Tooltip />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <p>Нет данных для отображения</p>
          )}
        </div>
      )}
    </main>
  );
};

export default Main;