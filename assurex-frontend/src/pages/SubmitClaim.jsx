import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, FileText, ArrowRight } from 'lucide-react';

export default function SubmitClaim() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    fault_description: '',
    purchase_date: '2025-05-12',
    store_name: 'Tech Store'
  });
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleNext = () => setStep(step + 1);

  const handleFileChange = (e) => {
    setEvidenceFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Create FormData for multipart/form-data upload
    const submitData = new FormData();
    submitData.append('product_id', formData.product_id);
    submitData.append('fault_description', formData.fault_description);
    submitData.append('purchase_date', formData.purchase_date);
    if (evidenceFile) {
      submitData.append('evidence_file', evidenceFile);
    }

    try {
      const response = await fetch('/api/claims/submit', {
        method: 'POST',
        body: submitData,
      });
      
      const data = await response.json();
      setResult(data);
      setStep(4); // Move to results step
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert("Failed to connect to the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Submit Warranty Claim</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Follow the steps to submit your product issue for AI evaluation.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {[1, 2, 3].map(num => (
          <div key={num} style={{
            flex: 1, 
            padding: '10px', 
            borderBottom: step >= num ? '3px solid var(--primary)' : '3px solid var(--border-color)',
            color: step >= num ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: '600'
          }}>
            Step {num}: {num === 1 ? 'Details' : num === 2 ? 'Evidence' : 'Verify'}
          </div>
        ))}
      </div>

      <div className="table-container" style={{ padding: '2rem', maxWidth: '800px' }}>
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="var(--primary)" /> Product Details
            </h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Product Serial Number</label>
              <input 
                type="text" 
                value={formData.product_id}
                onChange={e => setFormData({...formData, product_id: e.target.value})}
                placeholder="e.g. SN-99482X" 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Fault Description</label>
              <textarea 
                rows="4"
                value={formData.fault_description}
                onChange={e => setFormData({...formData, fault_description: e.target.value})}
                placeholder="Describe the issue in detail..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'vertical' }}
              ></textarea>
            </div>

            <button className="btn-primary" onClick={handleNext}>
              Next Step <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UploadCloud size={20} color="var(--primary)" /> Upload Proof of Purchase
            </h3>
            
            <div style={{ 
              border: '2px dashed var(--border-color)', 
              borderRadius: '12px', 
              padding: '3rem 2rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              background: '#f8fafc'
            }}>
              <UploadCloud size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
              <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Drag & drop your receipt/invoice here or browse</p>
              <input 
                type="file" 
                accept="image/*,.pdf" 
                onChange={handleFileChange}
                style={{ display: 'block', margin: '0 auto' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" style={{ background: '#fff', color: '#0f172a', border: '1px solid var(--border-color)' }} onClick={() => setStep(1)}>
                Back
              </button>
              <button className="btn-primary" onClick={handleNext} disabled={!evidenceFile}>
                Simulate OCR Scan <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={20} color="var(--primary)" /> OCR Extracted Data
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Verify the details automatically extracted by the engine:</p>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Store Name</label>
              <input 
                type="text" 
                value={formData.store_name} 
                onChange={e => setFormData({...formData, store_name: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Purchase Date</label>
              <input 
                type="date" 
                value={formData.purchase_date} 
                onChange={e => setFormData({...formData, purchase_date: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-primary" style={{ background: '#fff', color: '#0f172a', border: '1px solid var(--border-color)' }} onClick={() => setStep(2)}>
                Back
              </button>
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Processing via AI Engine...' : 'Submit Claim'} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && result && (
          <div style={{ animation: 'fadeIn 0.3s ease-out', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', background: '#dcfce7', borderRadius: '50%', marginBottom: '1.5rem' }}>
              <CheckCircle size={48} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Claim Submitted Successfully</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Claim ID: <strong>{result.claim_id}</strong></p>
            
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'left', marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>AI Initial Evaluation</h4>
              <p><strong>Python Model Prediction:</strong> {result.python_prediction.predicted_class} ({(result.python_prediction.confidence_valid * 100).toFixed(1)}% Confidence)</p>
              <p><strong>GTM Model Prediction:</strong> {result.gtm_prediction.predicted_class} ({(result.gtm_prediction.confidence_valid * 100).toFixed(1)}% Confidence)</p>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <strong>Status:</strong> <span className={`status-pill ${result.final_decision.includes('Valid') ? 'approved' : 'review'}`}>{result.final_decision}</span>
              </div>
            </div>

            <button className="btn-primary" onClick={() => navigate('/customer')}>
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}