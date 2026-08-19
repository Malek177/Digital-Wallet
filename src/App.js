import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import History from './components/History';
import Summary from './components/Summary';

const STORAGE_KEY = 'expenseManagerData';
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Gift', 'Investment', 'Other'];
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

let nextId = 10;

const getDefaultTransactions = () => [
  //{ id: 1, type: 'income', category: 'Salary', amount: 3200, date: '2026-08-01', description: 'August salary' },
];

function App() {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length) {
          nextId = Math.max(...parsed.map(t => t.id)) + 1;
        }
        return parsed;
      } catch (_) {
      }
    }
    return getDefaultTransactions();
  });

  const [formType, setFormType] = useState('income');
  const [formCategory, setFormCategory] = useState(INCOME_CATEGORIES[0]);
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formDesc, setFormDesc] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
  }, [transactions]);

  const monthlySummary = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = `${year}-${month}`;

    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.date.startsWith(prefix)) {
        if (t.type === 'income') income += t.amount;
        else expense += t.amount;
      }
    });
    return { income, expense, net: income - expense };
  }, [transactions]);

  const handleTypeToggle = (type) => {
    setFormType(type);
    setFormCategory(type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const amount = parseFloat(formAmount);
    if (!formAmount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }
    if (!formDate) {
      alert('Please select a date.');
      return;
    }
    const newTx = {
      id: nextId++,
      type: formType,
      category: formCategory,
      amount,
      date: formDate,
      description: formDesc.trim() || '',
    };
    setTransactions(prev => [newTx, ...prev]);
    setFormAmount('');
    setFormDesc('');
    setFormDate(new Date().toISOString().slice(0, 10));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const categoryOptions = formType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <h1><i className="fas fa-wallet" />Eye Wallet</h1>
          <div className="sub"><i className="far fa-calendar-alt" />Digital Wallet Tracker</div>
          <div className = "name">By Malek Sakr</div>
        </div>
        <div className="Navbar">
          <h2 className="nav-text"><Link to="/" className="links">Home</Link> | <Link to="/components/Summary" className="links">Summary</Link> | <Link to="/components/History" className="links">History</Link></h2>
        </div>
      </header>

      <Routes>
        {/* Main page */}
        <Route path="/" element={
          <>
            <section className="moneySection">
              <div className="balance-wrap">
                <div className="balance-title">Total Balance</div>
                <div className={`amount ${totalBalance > 0 ? 'positive' : totalBalance < 0 ? 'negative' : 'zero'}`}>
                  ${totalBalance.toFixed(2)}
                </div>
              </div>
            </section>

      {/* Add Transaction */}
      <section className="card">
        <div className="card-title">
          <i className="fas fa-plus-circle" /> Add Transaction
        </div>
        <form onSubmit={handleAdd}>
          <div className="form-grid">
            <div className="form-group full">
              <label>Type</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={formType === 'income' ? 'active-income' : ''}
                  onClick={() => handleTypeToggle('income')}
                >
                  <i className="fas fa-arrow-up" /> Income
                </button>
                <button
                  type="button"
                  className={formType === 'expense' ? 'active-expense' : ''}
                  onClick={() => handleTypeToggle('expense')}
                >
                  <i className="fas fa-arrow-down" /> Expense
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}>
                {categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group full">
              <label>Description (optional)</label>
              <input
                type="text"
                placeholder="e.g. Grocery shopping"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
            </div>

            <div className="full">
              <button type="submit" className="btn-submit">
                <i className="fas fa-save" /> Add {formType === 'income' ? 'Income' : 'Expense'}
              </button>
            </div>
          </div>
        </form>
      </section>
          </>
        } />

      {/* History page */}
      <Route 
        path="/components/History" 
        element={<History transactions={transactions} handleDelete={handleDelete} />} 
        />
      
      {/*Summary Page*/}
      <Route 
       path="/components/Summary"
       element={<Summary  monthlySummary = {monthlySummary}/>}
      />
      </Routes>
    </div>
  );
}

export default App;