import React from 'react';
import { ShieldCheck, Clock, AlertTriangle, PlusCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Customer Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Overview of your covered products and automated warranty claims.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => document.getElementById('ocr-upload').click()} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', cursor: 'pointer' }}>
            <span style={{ fontWeight: '500' }}>Scan Receipt (OCR)</span>
            <input type="file" id="ocr-upload" style={{ display: 'none' }} accept="image/*" onChange={async (e) => {
              if (e.target.files && e.target.files[0]) {
                const formData = new FormData();
                formData.append('receipt_image', e.target.files[0]);
                try {
                  const response = await fetch('http://localhost:8000/api/ocr/scan', {
                    method: 'POST',
                    body: formData
                  });
                  if (response.ok) {
                    const data = await response.json();
                    alert(`OCR Successful!\n\nExtracted Text: ${data.extracted_text}`);
                  } else {
                    alert('OCR Scan failed.');
                  }
                } catch (err) {
                  alert('Error connecting to backend for OCR scan.');
                }
              }
            }} />
          </button>
          <button className="btn-primary" onClick={() => navigate('/submit-claim')}>
            <PlusCircle size={18} /> File New Claim
          </button>
        </div>
      </div>

      {/* Analytical KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <h4>Active Warranties</h4>
            <div className="value">3 Covered</div>
          </div>
          <div className="icon-box" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <h4>Pending Processing</h4>
            <div className="value">1 Active</div>
          </div>
          <div className="icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <h4>Expiring Soon</h4>
            <div className="value">1 Product</div>
          </div>
          <div className="icon-box" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Claims Data Table */}
      <div className="table-container">
        <div className="table-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Recent Claim Submissions</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}>
            View All
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Claim ID</th>
              <th>Product</th>
              <th>Date Filed</th>
              <th>AI Decision</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>#CLM-9042</strong></td>
              <td>UltraBook Pro 15"</td>
              <td>Sep 20, 2026</td>
              <td>Valid (88% Match)</td>
              <td><span className="status-pill approved">Approved</span></td>
              <td>
                <button 
                  onClick={() => navigate('/claim/CLM-9042')}
                  style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Details <ArrowRight size={14} />
                </button>
              </td>
            </tr>
            <tr>
              <td><strong>#CLM-8812</strong></td>
              <td>Smart Monitor X27</td>
              <td>Sep 14, 2026</td>
              <td>Under Evaluation</td>
              <td><span className="status-pill review">Manual Review</span></td>
              <td>
                <button 
                  onClick={() => navigate('/claim/CLM-8812')}
                  style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Details <ArrowRight size={14} />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}