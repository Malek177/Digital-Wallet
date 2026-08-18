import React from 'react';
import '../App.css';

function Summary({ monthlySummary }){

    return(
      <section className="card">
        <div className="card-title">
          <i className="fas fa-chart-pie" /> Monthly Summary
          <span className="badge">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="sum-label"><i className="fas fa-arrow-up" style={{ color: '#1a7a3a' }} /> Income</div>
            <div className="sum-value income">${monthlySummary.income.toFixed(2)}</div>
          </div>
          <div className="summary-item">
            <div className="sum-label"><i className="fas fa-arrow-down" style={{ color: '#b13e3a' }} /> Expenses</div>
            <div className="sum-value expense">${monthlySummary.expense.toFixed(2)}</div>
          </div>
          <div className="summary-item">
            <div className="sum-label"><i className="fas fa-circle" style={{ color: '#4a6fa5' }} /> Net</div>
            <div className={`sum-value net ${monthlySummary.net >= 0 ? 'income' : 'expense'}`}>
              ${monthlySummary.net.toFixed(2)}
            </div>
          </div>
        </div>
      </section>
    )
}
export default Summary;