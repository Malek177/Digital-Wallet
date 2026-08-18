import React from 'react';
import '../App.css';

function History({ transactions, handleDelete }){

    return(
      <section className="card">
        <div className="card-title">
          <i className="fas fa-list-ul" /> Transaction History
          <span className="badge">{transactions.length}</span>
        </div>
        <div className="tx-list">
          {transactions.length === 0 ? (
            <div className="empty-tx">
              <i className="fas fa-inbox" style={{ fontSize: 24, display: 'block', marginBottom: 8 }} />
              No transactions yet.
            </div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="tx-item" style={{ borderLeftColor: tx.type === 'income' ? '#6fcf97' : '#f28b82' }}>
                <div className="tx-left">
                  <span className="tx-category">{tx.category}</span>
                  {tx.description && <span className="tx-desc">· {tx.description}</span>}
                  <span className="tx-date">{tx.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={`tx-amount ${tx.type}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </span>
                  <button className="delete-btn" onClick={() => handleDelete(tx.id)} title="Delete">
                    Delete<i className="fas fa-trash-alt"/>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    )
}
export default History;