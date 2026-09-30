import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, FileText, ArrowRight, Image, X, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

export default function SubmitClaim() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    fault_description: '',
  });
  const [faultImageFile, setFaultImageFile] = useState(null);
  const [faultImagePreview, setFaultImagePreview] = useState(null);
  const [warrantyCardFile, setWarrantyCardFile] = useState(null);
  const [warrantyCardPreview, setWarrantyCardPreview] = useState(null);
  const [ocrText, setOcrText] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Handle fault image upload
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

  // Handle warranty card upload
  const handleWarrantyCardChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setWarrantyCardFile(file);
      setWarrantyCardPreview(URL.createObjectURL(file));
      
      setOcrLoading(true);
      setOcrText(null);
      const formData = new FormData();
      formData.append('receipt_image', file);
      try {
        const res = await fetch('/api/ocr/scan', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          setOcrText(data.extracted_text);
        } else {
          setOcrText("OCR Failed.");
        }
      } catch(err) {
        setOcrText("OCR Error.");
      } finally {
        setOcrLoading(false);
      }
    }
  };

  const removeWarrantyCard = () => {
    setWarrantyCardFile(null);
    setWarrantyCardPreview(null);
    setOcrText(null);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.product_id.trim() || !formData.fault_description.trim()) {
      alert("Please fill in both Product ID and Fault Description.");
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    submitData.append('product_id', formData.product_id);
    submitData.append('fault_description', formData.fault_description);
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
        body: submitData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Claim evaluation failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert(`Submission failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.product_id.trim() !== '' && formData.fault_description.trim() !== '';

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.4s ease-out', maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button
            onClick={() => navigate('/customer')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              marginBottom: '0.5rem',
              padding: 0
            }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Submit Warranty Claim</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Provide your product details, fault evidence, and warranty card for instant AI verification.
          </p>
        </div>
      </div>

      {!result ? (
        <div className="table-container" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {/* 1. Product ID */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                Product ID / Serial Number <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={formData.product_id}
                  onChange={e => setFormData({ ...formData, product_id: e.target.value })}
                  placeholder="e.g. PRD-9042X or SN-884920"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.95rem',
                    background: '#fff'
                  }}
                />
              </div>
              <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Found on your product label, receipt, or warranty documentation.
              </small>
            </div>

            {/* 2. Fault Description */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                Fault Description <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                rows="4"
                required
                value={formData.fault_description}
                onChange={e => setFormData({ ...formData, fault_description: e.target.value })}
                placeholder="Describe what went wrong with the product in detail..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.95rem',
                  resize: 'vertical',
                  background: '#fff',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* 3 & 4: Two-Column Image Uploads */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Fault Evidence Image Upload */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Image size={18} color="var(--primary)" />
                    Fault Evidence Image
                  </span>
                </label>

                {!faultImagePreview ? (
                  <label
                    htmlFor="fault-image-upload"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed #c7d2fe',
                      borderRadius: '12px',
                      padding: '2rem 1rem',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                      minHeight: '170px'
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = '#f5f3ff'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.background = '#f8fafc'; }}
                  >
                    <UploadCloud size={32} color="#6366f1" style={{ marginBottom: '8px' }} />
                    <p style={{ fontWeight: '600', color: '#4f46e5', margin: 0, fontSize: '0.9rem' }}>Upload Fault Photo</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>PNG, JPG up to 10MB</p>
                    <input
                      id="fault-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFaultImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                ) : (
                  <div style={{
                    position: 'relative',
                    border: '1.5px solid #c7d2fe',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#f5f3ff'
                  }}>
                    <img
                      src={faultImagePreview}
                      alt="Fault evidence"
                      style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      padding: '8px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#ede9fe'
                    }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#4f46e5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                        {faultImageFile?.name}
                      </span>
                      <button
                        type="button"
                        onClick={removeFaultImage}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}
                        title="Remove photo"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Warranty Card Image Upload */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#1e293b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={18} color="#16a34a" />
                    Warranty Card Image
                  </span>
                </label>

                {!warrantyCardPreview ? (
                  <label
                    htmlFor="warranty-card-upload"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px dashed #86efac',
                      borderRadius: '12px',
                      padding: '2rem 1rem',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                      minHeight: '170px'
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.background = '#f0fdf4'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = '#86efac'; e.currentTarget.style.background = '#f8fafc'; }}
                  >
                    <ShieldCheck size={32} color="#16a34a" style={{ marginBottom: '8px' }} />
                    <p style={{ fontWeight: '600', color: '#15803d', margin: 0, fontSize: '0.9rem' }}>Upload Warranty Card</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Photo or scan of warranty card</p>
                    <input
                      id="warranty-card-upload"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleWarrantyCardChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                ) : (
                  <div style={{
                    position: 'relative',
                    border: '1.5px solid #86efac',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: '#f0fdf4'
                  }}>
                    <img
                      src={warrantyCardPreview}
                      alt="Warranty card preview"
                      style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      padding: '8px 12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#dcfce7'
                    }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#15803d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                        {warrantyCardFile?.name}
                      </span>
                      <button
                        type="button"
                        onClick={removeWarrantyCard}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}
                        title="Remove warranty card"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
                {ocrLoading && (
                  <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Scanning OCR...
                  </div>
                )}
                {ocrText && !ocrLoading && (
                  <div style={{ marginTop: '8px', padding: '8px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#334155', maxHeight: '100px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                    <strong>Extracted OCR:</strong><br />{ocrText || '(No text found)'}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ background: '#fff', color: '#0f172a', border: '1px solid var(--border-color)' }}
                onClick={() => navigate('/customer')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!isValid || loading}
                style={{
                  opacity: (!isValid || loading) ? 0.6 : 1,
                  cursor: (!isValid || loading) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  fontSize: '1rem'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                    Running AI Evaluation...
                  </>
                ) : (
                  <>
                    Submit Claim for AI Evaluation <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ── Results View ── */
        <div className="table-container" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: '#dcfce7', borderRadius: '50%', marginBottom: '1.25rem' }}>
            <CheckCircle size={40} color="#16a34a" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>Claim Processed & Evaluated</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Claim ID: <strong>{result.claim_id}</strong> · Product: <strong>{formData.product_id}</strong></p>

          {/* Final Decision Banner */}
          <div style={{
            padding: '1.25rem 1.5rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            background: result.final_decision.includes('Valid') ? '#ecfdf5' : result.final_decision.includes('Invalid') ? '#fef2f2' : '#fff7ed',
            border: `1px solid ${result.final_decision.includes('Valid') ? '#6ee7b7' : result.final_decision.includes('Invalid') ? '#fca5a5' : '#fed7aa'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.2rem', color: result.final_decision.includes('Valid') ? '#065f46' : result.final_decision.includes('Invalid') ? '#991b1b' : '#9a3412' }}>
                🤖 Final AI Decision: {result.final_decision}
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {result.models_agreeing} models agree · Consensus: <strong>{result.majority_vote}</strong>
              </div>
            </div>
            <span className={`status-pill ${result.final_decision.includes('Valid') ? 'approved' : result.final_decision.includes('Invalid') ? 'rejected' : 'review'}`} style={{ fontSize: '0.9rem', padding: '6px 16px' }}>
              {result.status}
            </span>
          </div>

          {/* Model Breakdown */}
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>📊 Machine Learning Model Predictions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {(() => {
                const pythonModels = [
                  { label: '🔵 XGBoost', pred: result.xgboost_prediction },
                  { label: '🌳 Decision Tree', pred: result.decision_tree_prediction },
                  { label: '📈 Logistic Regression', pred: result.logistic_prediction },
                ].filter(m => m.pred);

                let bestPythonModel = null;
                let maxConf = -1;
                pythonModels.forEach(m => {
                  const conf = Math.max(m.pred.confidence_valid, m.pred.confidence_invalid, m.pred.confidence_manual);
                  if (conf > maxConf) {
                    maxConf = conf;
                    bestPythonModel = { ...m, label: m.label + ' (Best Fit)' };
                  }
                });

                return [
                  bestPythonModel,
                  { label: '🖼️ Keras GTM Image Model', pred: result.gtm_prediction },
                ].filter(Boolean);
              })().map(({ label, pred }) => pred && (
                <div key={label} style={{ background: 'white', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.88rem' }}>{label}</div>
                  <div style={{ fontSize: '0.85rem', marginBottom: '6px' }}>
                    Verdict: <strong style={{ color: pred.predicted_class === 'Valid Claim' ? '#16a34a' : pred.predicted_class === 'Invalid Claim' ? '#dc2626' : '#ea580c' }}>{pred.predicted_class}</strong>
                  </div>
                  {[{ label: 'Valid', val: pred.confidence_valid, color: '#16a34a' },
                    { label: 'Invalid', val: pred.confidence_invalid, color: '#dc2626' },
                    { label: 'Review', val: pred.confidence_manual, color: '#ea580c' }
                  ].map(bar => (
                    <div key={bar.label} style={{ marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        <span>{bar.label}</span><span>{(bar.val * 100).toFixed(0)}%</span>
                      </div>
                      <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${(bar.val * 100).toFixed(0)}%`, height: '100%', background: bar.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href={`/api/claims/pdf/${result.claim_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                background: '#4f46e5',
                color: 'white',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.95rem',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              📄 Download PDF Report
            </a>
            <button
              className="btn-primary"
              onClick={() => {
                setResult(null);
                setFormData({ product_id: '', fault_description: '' });
                setFaultImageFile(null);
                setFaultImagePreview(null);
                setWarrantyCardFile(null);
                setWarrantyCardPreview(null);
              }}
            >
              Submit Another Claim
            </button>
            <button
              className="btn-primary"
              style={{ background: '#fff', color: '#0f172a', border: '1px solid var(--border-color)' }}
              onClick={() => navigate('/customer')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}