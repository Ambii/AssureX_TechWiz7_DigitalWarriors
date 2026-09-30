import React from 'react';
import { Download, ArrowLeft, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ClaimDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const claimId = id || 'CLM-9042';
  const pythonConfidence = 88.5;
  const gtmConfidence = 86.2;
  const difference = Math.abs(pythonConfidence - gtmConfidence).toFixed(1);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: '900px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>Claim #{claimId}</h1>
        <span className="status-pill approved" style={{ marginLeft: 'auto' }}>Approved</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Downloadable Claim Report</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Contains all evidence, AI telemetry, contradictions, and reviewer audits.</p>
        </div>
        <button className="btn-primary" onClick={handleExportPDF} style={{ background: '#4f46e5' }}>
          <Download size={18} /> Export PDF Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', fontSize: '1.1rem' }}>
            <FileText size={18} color="#4f46e5"/> Claim Details
          </h3>
          <p><strong>Product ID:</strong> SN-99482X</p>
          <p><strong>Category:</strong> Electronics</p>
          <p><strong>Date Filed:</strong> Sep 20, 2026</p>
          <p><strong>Warranty Status:</strong> Active (Expires 2027)</p>
          <p><strong>Fault Description:</strong> Screen flickering during startup.</p>
        </div>

        <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', fontSize: '1.1rem' }}>
            <CheckCircle size={18} color="#10b981"/> Rule-Validation Result
          </h3>
          <p><strong>Coverage:</strong> Fault is covered under standard policy.</p>
          <p><strong>Reporting Period:</strong> Filed within allowed timeframe.</p>
          <p><strong>Contradictions:</strong> None detected.</p>
          <p><strong>Reviewer Comments:</strong> "Evidence clearly shows hardware failure. Approving."</p>
        </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Dual-AI Evaluation Telemetry</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Python Model View */}
        <div style={{ padding: '1.5rem', border: '2px solid #10b981', borderRadius: '12px', background: '#ecfdf5' }}>
          <h4 style={{ color: '#065f46', marginBottom: '0.5rem' }}>Python Classification Model</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Prediction:</span>
            <strong>Valid Claim</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Confidence:</span>
            <strong>{pythonConfidence}%</strong>
          </div>
        </div>

        {/* Google Teachable Machine View */}
        <div style={{ padding: '1.5rem', border: '2px solid #3b82f6', borderRadius: '12px', background: '#eff6ff' }}>
          <h4 style={{ color: '#1e3a8a', marginBottom: '0.5rem' }}>Google Teachable Machine (Image)</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Prediction:</span>
            <strong>Valid Claim</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Confidence:</span>
            <strong>{gtmConfidence}%</strong>
          </div>
        </div>
      </div>

      <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
        <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Final AI Recommendation</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Confidence Difference</p>
            <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{difference}%</p>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>System Recommendation</p>
            <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#10b981' }}>Strong Model Match - Auto-Approve</p>
          </div>
        </div>
      </div>
    </div>
  );
}