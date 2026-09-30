import React, { useState } from 'react';
import { Filter, Search, AlertOctagon, CheckSquare, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ALL_CLAIMS = [
  { id: 'CLM-9120', product: 'Smart Monitor X27', reason: 'Model Disagreement', reasonIcon: 'disagreement', pythonConf: '72% Valid', gtmConf: '68% Invalid' },
  { id: 'CLM-9118', product: 'UltraBook Pro 15"', reason: 'Missing Invoice', reasonIcon: 'rule', pythonConf: '85% Valid', gtmConf: '88% Valid' },
  { id: 'CLM-9105', product: 'Wireless Earbuds Pro', reason: 'Low Confidence (Valid)', reasonIcon: 'low', pythonConf: '52% Valid', gtmConf: '55% Valid' },
];

export default function ReviewQueue() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterReason, setFilterReason] = useState('All');

  const filtered = ALL_CLAIMS.filter(c => {
    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.product.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterReason === 'All' || c.reasonIcon === filterReason;
    return matchesSearch && matchesFilter;
  });

  const reasonStyle = (icon) => {
    if (icon === 'disagreement') return { color: '#dc2626', icon: <AlertOctagon size={14} /> };
    if (icon === 'rule') return { color: '#ea580c', icon: <CheckSquare size={14} /> };
    return { color: '#d97706', icon: <Clock size={14} /> };
  };

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Review Queue</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Evaluate claims flagged for manual review by the AI engine.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="nav-search" style={{ width: '250px', background: '#fff', border: '1px solid var(--border-color)' }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by ID or product..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            className="btn-primary"
            style={{
              background: showFilters ? '#4f46e5' : '#fff',
              color: showFilters ? '#fff' : '#0f172a',
              border: '1px solid var(--border-color)'
            }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div style={{
          background: '#fff', border: '1px solid var(--border-color)', borderRadius: '10px',
          padding: '1rem 1.5rem', marginBottom: '1.5rem',
          display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap'
        }}>
          <span style={{ fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Filter by Reason:</span>
          {[
            ['All', 'All Types'],
            ['disagreement', 'Model Disagreement'],
            ['rule', 'Rule Violation'],
            ['low', 'Low Confidence']
          ].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilterReason(val)}
              style={{
                padding: '6px 14px', borderRadius: '20px', border: '1px solid',
                borderColor: filterReason === val ? '#4f46e5' : '#e2e8f0',
                background: filterReason === val ? '#e0e7ff' : '#fff',
                color: filterReason === val ? '#4f46e5' : '#334155',
                fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card" style={{ padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icon-box" style={{ background: '#fee2e2', color: '#dc2626', width: '40px', height: '40px' }}>
              <AlertOctagon size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.8rem' }}>Model Disagreement</h4>
              <div className="value" style={{ fontSize: '1.25rem' }}>14</div>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icon-box" style={{ background: '#ffedd5', color: '#ea580c', width: '40px', height: '40px' }}>
              <CheckSquare size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.8rem' }}>Rule Violation</h4>
              <div className="value" style={{ fontSize: '1.25rem' }}>28</div>
            </div>
          </div>
        </div>

        <div className="stat-card" style={{ padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="icon-box" style={{ background: '#fef3c7', color: '#d97706', width: '40px', height: '40px' }}>
              <Clock size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.8rem' }}>Low Confidence</h4>
              <div className="value" style={{ fontSize: '1.25rem' }}>45</div>
            </div>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="table-container">
        <div className="table-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>
            Pending Reviews{' '}
            {filtered.length !== ALL_CLAIMS.length && (
              <span style={{ fontWeight: '400', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                ({filtered.length} of {ALL_CLAIMS.length} shown)
              </span>
            )}
          </h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Product</th>
              <th>Reason for Review</th>
              <th>Python Confidence</th>
              <th>GTM Confidence</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(claim => {
                const rs = reasonStyle(claim.reasonIcon);
                return (
                  <tr key={claim.id}>
                    <td><strong>#{claim.id}</strong></td>
                    <td>{claim.product}</td>
                    <td>
                      <span style={{ color: rs.color, fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {rs.icon} {claim.reason}
                      </span>
                    </td>
                    <td>{claim.pythonConf}</td>
                    <td>{claim.gtmConf}</td>
                    <td>
                      <button
                        className="btn-primary"
                        onClick={() => navigate(`/claim/${claim.id}`)}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No claims match your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
