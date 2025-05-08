import React, { useState } from 'react';

import '../css/Input.css';

const Input = ({ onAddCard, types, banks }) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');
  const [operationType, setOperationType] = useState('');
  const [selectedInco, setSelectedInco] = useState('');

  const inco = [
    { id: 1, name: 'Стипендия', color: '#A8E4A0', icon: '💵' },
    { id: 2, name: 'Перевод', color: '#A8E4A0', icon: '💵' },
    { id: 3, name: 'Зарплата', color: '#A8E4A0', icon: '💵' }
  ];

  // const banks = [
  //   { id: 1, name: 'Кредитная карта', amount:0 },
  //   { id: 2, name: 'Наличные', amount:0},
  //   { id: 3, name: 'Банковский перевод', amount:0},
  //   { id: 4, name: 'Электронный кошелек', amount:0}
  // ];

  const handleSubmit = () => {
    let category = '';

    if (operationType === 'income') {
      if (!selectedBank || !amount || !date) {
        alert('Заполни все поля для дохода!');
        return;
      }
      category = inco.find(i => i.id == selectedInco)?.name || 'Без категории';
    }

    if (operationType === 'expense') {
      if (!selectedBank || !selectedType || !amount || !date) {
        alert('Заполни все поля для расхода!');
        return;
      }
      category = types.find(t => t.id == selectedType)?.name || 'Без категории';
    }

    const newCard = {
      id: Date.now(),
      category,
      amount: Number(amount),
      date,
      comment,
      operationType,
      bank: banks.find(b => b.id === Number(selectedBank))?.name || '',
      type: types.find(t => t.id === Number(selectedType))?.name || '',
      icon: operationType === 'income'
        ? inco.find(i => i.id == selectedInco)?.icon || ''
        : types.find(t => t.id == selectedType)?.icon || '',
      color: operationType === 'income'
        ? inco.find(i => i.id == selectedInco)?.color || ''
        : types.find(t => t.id == selectedType)?.color || ''
    };

    onAddCard(newCard);

    setSelectedBank('');
    setSelectedType('');
    setAmount('');
    setDate('');
    setComment('');
    setOperationType('');
    setSelectedInco('');
  };

  return (
    <div className="main">
      <div className="operation-buttons">
        <button
          className={`operation-button ${operationType === 'income' ? 'active' : ''}`}
          onClick={() => setOperationType('income')}
        >
          Доход
        </button>
        <button
          className={`operation-button ${operationType === 'expense' ? 'active' : ''}`}
          onClick={() => setOperationType('expense')}
        >
          Расход
        </button>
      </div>

      {operationType === 'income' && (
        <>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="from-input"
          >
            <option value="">Выбери банк</option>
            {banks.map(bank => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Сумма:"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bill-input"
          />

          <input
            placeholder="Дата:"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-input"
          />

          <input
            placeholder="Комментарий:"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="comment-input"
          />

          <button className="input-button" onClick={handleSubmit}>+</button>
        </>
      )}

      {operationType === 'expense' && (
        <>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="from-input"
          >
            <option value="">Выбери банк</option>
            {banks.map(bank => (
              <option key={bank.id} value={bank.id}>
                {bank.name}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="type-input"
          >
            <option value="">Выбери тип</option>
            {types.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Сумма:"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bill-input"
          />

          <input
            placeholder="Дата:"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-input"
          />

          <input
            placeholder="Комментарий:"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="comment-input"
          />

          <button className="input-button" onClick={handleSubmit}>+</button>
        </>
      )}
    </div>
  );
};

export default Input;