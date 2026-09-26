import React from 'react';
import { Filter, Search, ArrowRight, AlertOctagon, CheckSquare, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ReviewQueue() {
  const navigate = useNavigate();

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
            <input type="text" placeholder="Search by ID..." />
          </div>
          <button className="btn-primary" style={{ background: '#fff', color: '#0f172a', border: '1px solid var(--border-color)' }}>
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

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

      <div className="table-container">
        <div className="table-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Pending Reviews</h3>
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
            <tr>
              <td><strong>#CLM-9120</strong></td>
              <td>Smart Monitor X27</td>
              <td><span style={{ color: '#dc2626', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertOctagon size={14}/> Model Disagreement</span></td>
              <td>72% Valid</td>
              <td>68% Invalid</td>
              <td>
                <button className="btn-primary" onClick={() => navigate('/claim/CLM-9120')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  Review
                </button>
              </td>
            </tr>
            <tr>
              <td><strong>#CLM-9118</strong></td>
              <td>UltraBook Pro 15"</td>
              <td><span style={{ color: '#ea580c', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckSquare size={14}/> Missing Invoice</span></td>
              <td>85% Valid</td>
              <td>88% Valid</td>
              <td>
                <button className="btn-primary" onClick={() => navigate('/claim/CLM-9118')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  Review
                </button>
              </td>
            </tr>
            <tr>
              <td><strong>#CLM-9105</strong></td>
              <td>Wireless Earbuds Pro</td>
              <td><span style={{ color: '#d97706', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> Low Confidence (Valid)</span></td>
              <td>52% Valid</td>
              <td>55% Valid</td>
              <td>
                <button className="btn-primary" onClick={() => navigate('/claim/CLM-9105')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  Review
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
