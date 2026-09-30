import React, { useState } from 'react';
import { UserPlus, ShieldCheck, Mail, Lock, ArrowLeft, Eye, EyeOff, Copy, Check, ScanLine, Loader2, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserManagement() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastCreated, setLastCreated] = useState(null);

  // OCR Receipt Scanner state
  const [receiptFile, setReceiptFile] = useState(null);
  const [ocrStatus, setOcrStatus] = useState('idle'); // idle | scanning | success | manual_review | error
  const [ocrResult, setOcrResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim username to avoid accidental whitespace
    const payload = { ...formData, username: formData.username.trim() };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setLastCreated({ username: payload.username, password: payload.password, role: payload.role });
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setFormData({ username: '', email: '', password: '', role: 'Customer' });
          setLastCreated(null);
        }, 8000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || 'Registration failed'}`);
      }
    } catch (err) {
      alert('Error connecting to backend');
    }
  };

  const copyCredentials = () => {
    if (!lastCreated) return;
    navigator.clipboard.writeText(`Username: ${lastCreated.username}\nPassword: ${lastCreated.password}\nRole: ${lastCreated.role}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/admin')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Manage Users and Product</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Register new Customers, Technicians, or Claim Reviewers.</p>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: '#4f46e5' }}>
          <UserPlus size={24} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Create New User Account</h2>
        </div>

        {/* Success Banner with credentials summary */}
        {success && lastCreated && (
          <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #86efac' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', fontWeight: '600' }}>
              <ShieldCheck size={20} /> User successfully registered!
            </div>
            <div style={{ fontSize: '0.875rem', background: '#f0fdf4', padding: '0.75rem', borderRadius: '6px', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <strong>Username:</strong> {lastCreated.username} &nbsp;|&nbsp;
                <strong>Password:</strong> {lastCreated.password} &nbsp;|&nbsp;
                <strong>Role:</strong> {lastCreated.role}
              </span>
              <button
                onClick={copyCredentials}
                style={{ background: 'none', border: '1px solid #16a34a', color: '#16a34a', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', flexShrink: 0 }}
              >
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          autoComplete="off"
        >
          {/* Hidden dummy fields to trick browser autofill away from real fields */}
          <input type="text" name="fakeusernameremembered" style={{ display: 'none' }} readOnly />
          <input type="password" name="fakepasswordremembered" style={{ display: 'none' }} readOnly />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Username</label>
              <input
                type="text"
                required
                autoComplete="off"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="e.g. john_doe"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                  style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>
                Temporary Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Set a password"
                  style={{ width: '100%', padding: '10px 42px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                {/* Show/hide password toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '12px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#94a3b8', padding: 0
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Password visible hint when showing */}
              {showPassword && formData.password && (
                <p style={{ fontSize: '0.78rem', color: '#059669', marginTop: '4px' }}>
                  Password visible: <strong>{formData.password}</strong>
                </p>
              )}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Assign Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}
              >
                <option value="Customer">Customer (Intake)</option>
                <option value="Reviewer">Reviewer (Adjudicator)</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ background: '#4f46e5', padding: '12px 24px' }}>
              Create Account
            </button>
          </div>
        </form>
      </div>

      <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#4f46e5' }}>Product Registration</h3>

        {/* ── OCR Receipt Scanner ────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, #f0f4ff 0%, #e8ecfb 100%)',
          border: '1px dashed #818cf8',
          borderRadius: '10px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <ScanLine size={20} color="#4f46e5" />
            <span style={{ fontWeight: '600', color: '#4f46e5', fontSize: '0.95rem' }}>OCR Receipt Scanner</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>– Upload a purchase receipt to auto-fill fields</span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#334155', fontSize: '0.85rem' }}>Receipt Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setReceiptFile(e.target.files[0] || null);
                  setOcrStatus('idle');
                  setOcrResult(null);
                }}
                style={{ width: '100%', padding: '7px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.875rem' }}
              />
            </div>
            <button
              type="button"
              disabled={!receiptFile || ocrStatus === 'scanning'}
              onClick={async () => {
                if (!receiptFile) return;
                setOcrStatus('scanning');
                setOcrResult(null);
                try {
                  const fd = new FormData();
                  fd.append('receipt_image', receiptFile);
                  const res = await fetch('/api/ocr/scan', { method: 'POST', body: fd });
                  const data = await res.json();
                  setOcrResult(data);

                  if (data.readable) {
                    setOcrStatus('success');
                    // Auto-fill form fields from parsed OCR data
                    const pf = data.parsed_fields || {};
                    const idField = document.querySelector('input[name="productId"]');
                    const nameField = document.querySelector('input[name="productName"]');
                    const dateField = document.querySelector('input[name="saleDate"]');
                    if (pf.product_id && idField) {
                      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(idField, pf.product_id);
                      idField.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    if (pf.product_name && nameField) {
                      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(nameField, pf.product_name);
                      nameField.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    if (pf.sale_date && dateField) {
                      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(dateField, pf.sale_date);
                      dateField.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                  } else {
                    setOcrStatus('manual_review');
                  }
                } catch {
                  setOcrStatus('error');
                }
              }}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                border: 'none',
                background: (!receiptFile || ocrStatus === 'scanning') ? '#c7d2fe' : '#4f46e5',
                color: '#fff',
                fontWeight: '600',
                cursor: (!receiptFile || ocrStatus === 'scanning') ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.875rem',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {ocrStatus === 'scanning' ? (
                <><Loader2 size={16} className="spin-icon" /> Scanning…</>
              ) : (
                <><ScanLine size={16} /> Scan Receipt with OCR</>
              )}
            </button>
          </div>

          {/* OCR Status Feedback */}
          {ocrStatus === 'success' && ocrResult && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              background: '#dcfce7',
              border: '1px solid #86efac',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.85rem',
              color: '#166534'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <strong>OCR scan successful!</strong> Extracted fields have been auto-filled below.
                {ocrResult.avg_confidence > 0 && (
                  <span style={{ marginLeft: '8px', color: '#15803d', fontSize: '0.78rem' }}>
                    (Confidence: {(ocrResult.avg_confidence * 100).toFixed(1)}%)
                  </span>
                )}
                {ocrResult.extracted_text && (
                  <div style={{ marginTop: '6px', padding: '6px 10px', background: '#f0fdf4', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#334155', maxHeight: '80px', overflow: 'auto', wordBreak: 'break-all' }}>
                    {ocrResult.extracted_text}
                  </div>
                )}
              </div>
            </div>
          )}

          {ocrStatus === 'manual_review' && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.85rem',
              color: '#92400e'
            }}>
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <strong>Receipt not readable by OCR — Sent to Manual Review.</strong>
                <div style={{ marginTop: '4px', color: '#78350f', fontSize: '0.8rem' }}>
                  The uploaded receipt could not be processed automatically. It has been queued for manual verification by a reviewer. You can still fill in the fields manually below.
                </div>
              </div>
            </div>
          )}

          {ocrStatus === 'error' && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.85rem',
              color: '#991b1b'
            }}>
              <XCircle size={18} style={{ flexShrink: 0 }} />
              <span><strong>OCR scan failed.</strong> Please try again or fill in the fields manually.</span>
            </div>
          )}
        </div>

        <form 
          onSubmit={async (e) => {
            e.preventDefault();
            const formPayload = new FormData(e.target);
            // Attach OCR receipt file as invoice if one was scanned
            if (receiptFile && !formPayload.get('invoice')?.name) {
              formPayload.set('invoice', receiptFile);
            }
            try {
              const res = await fetch('/api/products/register', {
                method: 'POST',
                body: formPayload
              });
              if (res.ok) {
                alert("Product successfully registered in Database!");
                e.target.reset();
                setReceiptFile(null);
                setOcrStatus('idle');
                setOcrResult(null);
              } else {
                const err = await res.json();
                alert("Error: " + (err.detail || "Failed to register product"));
              }
            } catch (err) {
              alert("Error connecting to the backend server.");
            }
          }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Product ID</label>
              <input type="text" name="productId" required style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="e.g. PRD-12345" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Product Name</label>
              <input type="text" name="productName" required style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} placeholder="e.g. Samsung Galaxy S23" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Sale Date</label>
              <input type="date" name="saleDate" required style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#334155' }}>Upload Invoice</label>
              <input type="file" name="invoice" required accept="image/*,.pdf" style={{ width: '100%', padding: '7px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
            </div>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ background: '#4f46e5', padding: '12px 24px' }}>
              Register Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
