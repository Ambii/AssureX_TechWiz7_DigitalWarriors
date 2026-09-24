import React from 'react';

export default function ClaimDetails() {
  const pythonConfidence = 88;
  const gtmConfidence = 82;
  const difference = Math.abs(pythonConfidence - gtmConfidence);

  return (
    <div>
      <h1>Claim Assessment Summary: #CLM-9042</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        {/* Python Model View */}
        <div style={{ padding: '1rem', border: '1px solid #10b981', borderRadius: '8px' }}>
          <h3>Python Classification Model</h3>
          <p>Prediction: <strong>Valid Claim</strong></p>
          <p>Confidence: <strong>{pythonConfidence}%</strong></p>
        </div>

        {/* Google Teachable Machine View */}
        <div style={{ padding: '1rem', border: '1px solid #3b82f6', borderRadius: '8px' }}>
          <h3>Teachable Machine Model</h3>
          <p>Prediction: <strong>Valid Claim</strong></p>
          <p>Confidence: <strong>{gtmConfidence}%</strong></p>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '1rem', background: '#f8fafc', border: '1px solid #cbd5e1' }}>
        <h4>Evaluation Metrics</h4>
        <p>Confidence Difference: <strong>{difference}%</strong></p>
        <p>Status: <span style={{ color: 'green', fontWeight: 'bold' }}>Strong Model Match</span></p>
      </div>
    </div>
  );
}