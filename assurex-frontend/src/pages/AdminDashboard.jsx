import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, AlertTriangle, BarChart3, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_claims: 0,
    valid_claims: 0,
    manual_review: 0,
    model_disagreements: 0,
    python_uptime: 100,
    gtm_uptime: 100
  });

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Executive Admin Telemetry</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>System-wide operations and dual-AI performance metrics.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" style={{ background: '#fff', color: '#0f172a', border: '1px solid var(--border-color)' }}>
            Export CSV Report
          </button>
          <button className="btn-primary" onClick={() => navigate('/reviewer')}>
            Review Queue
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: 'white' }}>
          <div>
            <h4 style={{ color: 'rgba(255,255,255,0.8)' }}>Total Claims Processed</h4>
            <div className="value">{stats.total_claims.toLocaleString()}</div>
          </div>
          <div className="icon-box" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <FileText size={24} color="white" />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <h4>Likely Valid Claims</h4>
            <div className="value" style={{ color: '#16a34a' }}>{stats.valid_claims.toLocaleString()}</div>
          </div>
          <div className="icon-box" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <h4>Manual Reviews Required</h4>
            <div className="value" style={{ color: '#ea580c' }}>{stats.manual_review.toLocaleString()}</div>
          </div>
          <div className="icon-box" style={{ background: '#ffedd5', color: '#ea580c' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <h4>Model Disagreements</h4>
            <div className="value" style={{ color: '#dc2626' }}>{stats.model_disagreements.toLocaleString()}</div>
          </div>
          <div className="icon-box" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <Activity size={24} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="table-container" style={{ marginTop: 0 }}>
          <div className="table-header">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Recent High-Confidence Approvals</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Python Model</th>
                <th>Teachable Machine</th>
                <th>Match Status</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>#CLM-9102</strong></td>
                <td>98.5% Valid</td>
                <td>97.2% Valid</td>
                <td><span className="status-pill approved">Strong Match</span></td>
                <td>Auto-Approved</td>
              </tr>
              <tr>
                <td><strong>#CLM-9101</strong></td>
                <td>95.1% Valid</td>
                <td>93.8% Valid</td>
                <td><span className="status-pill approved">Strong Match</span></td>
                <td>Auto-Approved</td>
              </tr>
              <tr>
                <td><strong>#CLM-9099</strong></td>
                <td>89.4% Valid</td>
                <td>91.0% Valid</td>
                <td><span className="status-pill approved">Acceptable Match</span></td>
                <td>Auto-Approved</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="table-container" style={{ marginTop: 0, padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>System Health</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Python Model Uptime</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#16a34a' }}>{stats.python_uptime}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${stats.python_uptime}%`, height: '100%', background: '#16a34a' }}></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>GTM Model API</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#16a34a' }}>{stats.gtm_uptime}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${stats.gtm_uptime}%`, height: '100%', background: '#16a34a' }}></div>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: '600', marginBottom: '0.5rem' }}>
                <BarChart3 size={18} color="#4f46e5" /> Average Processing Time
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>1.2s <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '400' }}>per claim</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
