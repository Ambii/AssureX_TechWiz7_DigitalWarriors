import React, { useState } from 'react';
import { ShieldCheck, Clock, AlertTriangle, PlusCircle, ArrowRight, ScanLine, Loader2, Image, X, UploadCloud, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);

  // Claim modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimResult, setClaimResult] = useState(null);
  const [claimFormData, setClaimFormData] = useState({
    product_id: '',
    fault_description: ''
  });
  const [faultImageFile, setFaultImageFile] = useState(null);
  const [faultImagePreview, setFaultImagePreview] = useState(null);
  const [warrantyCardFile, setWarrantyCardFile] = useState(null);
  const [warrantyCardPreview, setWarrantyCardPreview] = useState(null);

  const [claims, setClaims] = useState([
    { id: 'CLM-9042', product: 'UltraBook Pro 15"', date: 'Sep 20, 2026', aiDecision: 'Valid (88% Match)', status: 'approved', statusLabel: 'Approved' },
    { id: 'CLM-8812', product: 'Smart Monitor X27', date: 'Sep 14, 2026', aiDecision: 'Under Evaluation', status: 'review', statusLabel: 'Manual Review' },
  ]);

  const handleOcrUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setOcrLoading(true);
      setOcrResult(null);
      const formData = new FormData();
      formData.append('receipt_image', e.target.files[0]);
      try {
        const response = await fetch('/api/ocr/scan', {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          const data = await response.json();
          setOcrResult({ success: true, text: data.extracted_text });
        } else {
          const errorData = await response.json();
          setOcrResult({ success: false, error: errorData.detail || 'OCR scan failed.' });
        }
      } catch (err) {
        setOcrResult({ success: false, error: 'Error connecting to backend for OCR scan.' });
      } finally {
        setOcrLoading(false);
        e.target.value = '';
      }
    }
  };

  // Fault image handler
  const handleFaultImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaultImageFile(file);
      setFaultImagePreview(URL.createObjectURL(file));
    }
  };

  const removeFaultImage = () => {
    setFaultImageFile(null);
    setFaultImagePreview(null);
  };

  // Warranty card image handler
  const handleWarrantyCardChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWarrantyCardFile(file);
      setWarrantyCardPreview(URL.createObjectURL(file));
    }
  };

  const removeWarrantyCard = () => {
    setWarrantyCardFile(null);
    setWarrantyCardPreview(null);
  };

  // Submit claim handler
  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimFormData.product_id.trim() || !claimFormData.fault_description.trim()) {
      alert("Please provide both Product ID and Fault Description.");
      return;
    }

    setClaimLoading(true);
    const submitData = new FormData();
    submitData.append('product_id', claimFormData.product_id);
    submitData.append('fault_description', claimFormData.fault_description);
    submitData.append('purchase_date', new Date().toISOString().split('T')[0]);

    if (faultImageFile) {
      submitData.append('fault_image', faultImageFile);
      submitData.append('evidence_file', faultImageFile);
    }
    if (warrantyCardFile) {
      submitData.append('warranty_card', warrantyCardFile);
      if (!faultImageFile) {
        submitData.append('evidence_file', warrantyCardFile);
      }
    }
    if (!faultImageFile && !warrantyCardFile) {
      const placeholder = new Blob(['placeholder'], { type: 'text/plain' });
      submitData.append('evidence_file', placeholder, 'placeholder.txt');
    }

    try {
      const response = await fetch('/api/claims/submit', {
        method: 'POST',
        body: submitData
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to submit claim.');
      }

      const data = await response.json();

      // Add to recent claims table immediately
      const newClaim = {
        id: data.claim_id,
        product: claimFormData.product_id,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        aiDecision: data.final_decision,
        status: data.final_decision?.includes('Valid') ? 'approved' : data.final_decision?.includes('Invalid') ? 'rejected' : 'review',
        statusLabel: data.status,
        claimData: data
      };
      setClaims(prev => [newClaim, ...prev]);

      // Show result view in modal
      setClaimResult(data);
    } catch (err) {
      console.error(err);
      alert(`Error submitting claim: ${err.message}`);
    } finally {
      setClaimLoading(false);
    }
  };

  const resetClaimModal = () => {
    setIsModalOpen(false);
    setClaimResult(null);
    setClaimFormData({ product_id: '', fault_description: '' });
    setFaultImageFile(null);
    setFaultImagePreview(null);
    setWarrantyCardFile(null);
    setWarrantyCardPreview(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Customer Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Overview of your covered products and automated warranty claims.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>


          {/* Direct File Claim / Upload Warranty Card Modal Button */}
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={18} /> File Warranty Claim
          </button>
        </div>
      </div>

      {/* OCR Result Banner */}
      {ocrResult && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          background: ocrResult.success ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${ocrResult.success ? '#6ee7b7' : '#fca5a5'}`,
          color: ocrResult.success ? '#065f46' : '#991b1b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem'
        }}>
          <div>
            <strong>{ocrResult.success ? '✓ OCR Scan Successful' : '✗ OCR Scan Failed'}</strong>
            {ocrResult.success
              ? <pre style={{ marginTop: '6px', fontFamily: 'inherit', fontSize: '0.85rem', whiteSpace: 'pre-wrap', maxHeight: '120px', overflowY: 'auto' }}>{ocrResult.text || '(No text extracted)'}</pre>
              : <p style={{ marginTop: '4px', fontSize: '0.9rem' }}>{ocrResult.error}</p>
            }
          </div>
          <button onClick={() => setOcrResult(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'inherit', flexShrink: 0 }}>×</button>
        </div>
      )}

      {/* KPI Cards */}
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
            <div className="value">{claims.filter(c => c.status === 'review').length} Active</div>
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

      {/* Claims Table */}
      <div className="table-container">
        <div className="table-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Recent Claim Submissions</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}
          >
            + File New Claim
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
            {claims.map(claim => (
              <tr key={claim.id}>
                <td><strong>#{claim.id}</strong></td>
                <td>{claim.product}</td>
                <td>{claim.date}</td>
                <td>{claim.aiDecision}</td>
                <td><span className={`status-pill ${claim.status}`}>{claim.statusLabel}</span></td>
                <td>
                  <button
                    onClick={() => navigate(`/claim/${claim.id}`)}
                    style={{ background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    Details <ArrowRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── FILE WARRANTY CLAIM MODAL (With only Product ID, Fault Description, Fault Evidence Image, Warranty Card Image) ─── */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            padding: '2rem',
            position: 'relative'
          }}>
            <button
              onClick={resetClaimModal}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={18} />
            </button>

            {!claimResult ? (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a' }}>File Warranty Claim</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                    Provide product details, fault evidence, and your warranty card for automated AI evaluation.
                  </p>
                </div>

                <form onSubmit={handleClaimSubmit}>
                  {/* 1. Product ID */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
                      Product ID / Serial Number <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SN-884920 or PRD-1029"
                      value={claimFormData.product_id}
                      onChange={e => setClaimFormData({ ...claimFormData, product_id: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  {/* 2. Fault Description */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.9rem', color: '#334155' }}>
                      Fault Description <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <textarea
                      rows="3"
                      required
                      placeholder="Describe the issue with the product..."
                      value={claimFormData.fault_description}
                      onChange={e => setClaimFormData({ ...claimFormData, fault_description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.95rem',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  {/* 3 & 4. Two Upload Areas: Fault Evidence Image & Warranty Card Image */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    {/* Fault Evidence Image */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: '#334155' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Image size={16} color="var(--primary)" />
                          Fault Evidence Image
                        </span>
                      </label>
                      {!faultImagePreview ? (
                        <label
                          htmlFor="modal-fault-upload"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed #c7d2fe',
                            borderRadius: '10px',
                            padding: '1.25rem 0.5rem',
                            background: '#f8fafc',
                            cursor: 'pointer',
                            textAlign: 'center',
                            minHeight: '120px'
                          }}
                        >
                          <UploadCloud size={24} color="#6366f1" style={{ marginBottom: '4px' }} />
                          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#4f46e5' }}>Upload Fault Photo</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PNG, JPG</span>
                          <input
                            id="modal-fault-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFaultImageChange}
                            style={{ display: 'none' }}
                          />
                        </label>
                      ) : (
                        <div style={{ position: 'relative', border: '1px solid #c7d2fe', borderRadius: '10px', overflow: 'hidden' }}>
                          <img src={faultImagePreview} alt="Fault" style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }} />
                          <div style={{ padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ede9fe' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4f46e5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                              {faultImageFile?.name}
                            </span>
                            <button type="button" onClick={removeFaultImage} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Warranty Card Image */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '0.88rem', color: '#334155' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={16} color="#16a34a" />
                          Warranty Card Image
                        </span>
                      </label>
                      {!warrantyCardPreview ? (
                        <label
                          htmlFor="modal-warranty-upload"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed #86efac',
                            borderRadius: '10px',
                            padding: '1.25rem 0.5rem',
                            background: '#f8fafc',
                            cursor: 'pointer',
                            textAlign: 'center',
                            minHeight: '120px'
                          }}
                        >
                          <ShieldCheck size={24} color="#16a34a" style={{ marginBottom: '4px' }} />
                          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#15803d' }}>Upload Warranty Card</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Photo or scan</span>
                          <input
                            id="modal-warranty-upload"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleWarrantyCardChange}
                            style={{ display: 'none' }}
                          />
                        </label>
                      ) : (
                        <div style={{ position: 'relative', border: '1px solid #86efac', borderRadius: '10px', overflow: 'hidden' }}>
                          <img src={warrantyCardPreview} alt="Warranty Card" style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }} />
                          <div style={{ padding: '4px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#dcfce7' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#15803d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                              {warrantyCardFile?.name}
                            </span>
                            <button type="button" onClick={removeWarrantyCard} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ background: '#fff', color: '#0f172a', border: '1px solid var(--border-color)' }}
                      onClick={resetClaimModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={claimLoading}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      {claimLoading ? (
                        <>
                          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Evaluating with AI...
                        </>
                      ) : (
                        <>Submit for AI Evaluation <ArrowRight size={16} /></>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Modal Result View — Full AI Evaluation */
              <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'inline-flex', padding: '0.8rem', background: '#dcfce7', borderRadius: '50%', marginBottom: '0.75rem' }}>
                    <CheckCircle size={36} color="#16a34a" />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '4px' }}>Claim Evaluated Successfully</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Claim ID: <strong>{claimResult.claim_id}</strong>
                  </p>
                </div>

                {/* Final Decision Banner */}
                <div style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  background: claimResult.final_decision.includes('Valid') ? '#ecfdf5' : claimResult.final_decision.includes('Invalid') ? '#fef2f2' : '#fff7ed',
                  border: `1px solid ${claimResult.final_decision.includes('Valid') ? '#6ee7b7' : claimResult.final_decision.includes('Invalid') ? '#fca5a5' : '#fed7aa'}`,
                  marginBottom: '1rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px'
                }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1rem', color: claimResult.final_decision.includes('Valid') ? '#065f46' : claimResult.final_decision.includes('Invalid') ? '#991b1b' : '#9a3412' }}>
                      🤖 Final AI Decision: {claimResult.final_decision}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                      {claimResult.models_agreeing} models agree · Consensus: <strong>{claimResult.majority_vote}</strong>
                    </div>
                  </div>
                  <span className={`status-pill ${claimResult.final_decision.includes('Valid') ? 'approved' : claimResult.final_decision.includes('Invalid') ? 'rejected' : 'review'}`}>
                    {claimResult.status}
                  </span>
                </div>

                {/* Dual-AI Telemetry */}
                <div style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '0.9rem 1rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.6rem', color: '#1e293b' }}>⚡ Dual-AI Telemetry</div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Python Models', conf: claimResult.python_confidence, pred: claimResult.python_prediction },
                      { label: 'GTM Image AI', conf: claimResult.gtm_confidence, pred: claimResult.gtm_prediction },
                    ].map(({ label, conf, pred }) => (
                      <div key={label} style={{ flex: 1, minWidth: '130px', background: 'white', borderRadius: '8px', padding: '8px 10px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>{label}</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#4f46e5', margin: '2px 0' }}>{conf?.toFixed(1)}%</div>
                        <div style={{ fontSize: '0.72rem', color: pred?.predicted_class === 'Valid Claim' ? '#16a34a' : pred?.predicted_class === 'Invalid Claim' ? '#dc2626' : '#ea580c', fontWeight: '500' }}>
                          {pred?.predicted_class}
                        </div>
                        <div style={{ marginTop: '4px', height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
                          <div style={{ width: `${conf?.toFixed(0)}%`, height: '100%', background: '#6366f1', borderRadius: '2px' }} />
                        </div>
                      </div>
                    ))}
                    <div style={{ flex: 1, minWidth: '130px', background: 'white', borderRadius: '8px', padding: '8px 10px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b' }}>Confidence Gap</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: '700', color: claimResult.confidence_difference <= 15 ? '#16a34a' : '#ea580c', margin: '2px 0' }}>
                        {claimResult.confidence_difference?.toFixed(1)}%
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '500' }}>{claimResult.system_recommendation}</div>
                    </div>
                  </div>
                </div>

                {/* 4-Model Breakdown with % bars */}
                <div style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '0.9rem 1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.75rem', color: '#1e293b' }}>📊 ML Model Predictions Breakdown</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { label: '🔵 XGBoost', pred: claimResult.xgboost_prediction },
                      { label: '🌳 Decision Tree', pred: claimResult.decision_tree_prediction },
                      { label: '📈 Logistic Reg', pred: claimResult.logistic_prediction },
                      { label: '🖼️ GTM Image Model', pred: claimResult.gtm_prediction },
                    ].map(({ label, pred }) => pred && (
                      <div key={label} style={{ background: 'white', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                        <div style={{ fontWeight: '600', color: '#475569', marginBottom: '3px' }}>{label}</div>
                        <div style={{ fontWeight: '600', color: pred.predicted_class === 'Valid Claim' ? '#16a34a' : pred.predicted_class === 'Invalid Claim' ? '#dc2626' : '#ea580c', marginBottom: '5px', fontSize: '0.8rem' }}>
                          {pred.predicted_class}
                        </div>
                        {[
                          { label: 'Valid', val: pred.confidence_valid, color: '#16a34a' },
                          { label: 'Invalid', val: pred.confidence_invalid, color: '#dc2626' },
                          { label: 'Review', val: pred.confidence_manual, color: '#ea580c' },
                        ].map(bar => (
                          <div key={bar.label} style={{ marginTop: '3px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              <span>{bar.label}</span><span>{(bar.val * 100).toFixed(0)}%</span>
                            </div>
                            <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `${(bar.val * 100).toFixed(0)}%`, height: '100%', background: bar.color, borderRadius: '2px' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={`/api/claims/pdf/${claimResult.claim_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px 16px',
                      background: '#4f46e5',
                      color: 'white',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.88rem',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    📄 Download PDF Report
                  </a>
                  <button
                    className="btn-primary"
                    onClick={resetClaimModal}
                    style={{ flex: 1, background: '#fff', color: '#0f172a', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}
                  >
                    Done & View Table
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Spin animation */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}