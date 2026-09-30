import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Download, Play, Activity, CheckCircle, Loader2 } from 'lucide-react';

export default function LiveEvaluator() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All Risk Levels');
  const [confidenceFilter, setConfidenceFilter] = useState('All Confidence Ranges');
  const [batchRunning, setBatchRunning] = useState(false);
  const [batchResult, setBatchResult] = useState(null);

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Claim ID,Risk Level,Python Confidence,GTM Confidence,Status,Timestamp\n"
      + "#CLM-9120,High,72%,68%,Model Disagreement,2026-09-27T08:12:00\n"
      + "#CLM-9118,Medium,85%,88%,Rule Violation,2026-09-27T07:55:00\n"
      + "#CLM-9105,Low,52%,55%,Low Confidence,2026-09-26T22:30:00\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "AssureX_Evaluator_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBatchEvaluation = async () => {
    setBatchRunning(true);
    setBatchResult(null);
    // Simulate batch evaluation (replace with real API call when ready)
    await new Promise(r => setTimeout(r, 2500));
    setBatchResult({
      processed: 87,
      approved: 61,
      review: 18,
      rejected: 8,
      avgConfidence: '84.3%',
      duration: '2.1s'
    });
    setBatchRunning(false);
  };

  return (
    <div className="dashboard-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Live Evaluator Playground</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Interactive AI telemetry and claim adjudication testing area.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            className="btn-primary"
            onClick={handleExportData}
            style={{ background: '#fff', color: '#0f172a', border: '1px solid var(--border-color)' }}
          >
            <Download size={18} /> Export Data
          </button>
          <button
            className="btn-primary"
            style={{ background: '#4f46e5', opacity: batchRunning ? 0.7 : 1, cursor: batchRunning ? 'not-allowed' : 'pointer' }}
            onClick={handleBatchEvaluation}
            disabled={batchRunning}
          >
            {batchRunning
              ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Running...</>
              : <><Play size={18} /> Run Batch Evaluation</>
            }
          </button>
        </div>
      </div>

      {/* Batch Result Banner */}
      {batchResult && (
        <div style={{
          background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '10px',
          padding: '1rem 1.5rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'
        }}>
          <CheckCircle size={20} color="#16a34a" />
          <strong style={{ color: '#065f46' }}>Batch Complete — {batchResult.processed} claims processed in {batchResult.duration}</strong>
          <span style={{ color: '#065f46', fontSize: '0.9rem' }}>
            ✓ {batchResult.approved} Approved &nbsp;|&nbsp; ⚑ {batchResult.review} Manual Review &nbsp;|&nbsp; ✗ {batchResult.rejected} Rejected &nbsp;|&nbsp; Avg Confidence: {batchResult.avgConfidence}
          </span>
          <button onClick={() => setBatchResult(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', fontSize: '1.2rem' }}>×</button>
        </div>
      )}

      {/* Advanced Filtering & Search */}
      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search Claim ID, Product ID, Serial Number..."
              style={{ width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
          >
            <option>All Risk Levels</option>
            <option>High Risk</option>
            <option>Low Risk</option>
          </select>

          <select
            value={confidenceFilter}
            onChange={e => setConfidenceFilter(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
          >
            <option>All Confidence Ranges</option>
            <option>{'>'} 90%</option>
            <option>50% - 90%</option>
            <option>{'<'} 50%</option>
          </select>

          <button className="btn-primary" style={{ background: '#f8fafc', color: '#334155', border: '1px solid var(--border-color)', padding: '10px 15px' }}>
            <SlidersHorizontal size={18} /> More Filters
          </button>
        </div>
      </div>

      {/* Evaluator Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="table-container" style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <Activity size={20} color="#ea580c" /> Model Disagreements Log
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Claims where the two AI models disagree on outcome.</p>
          <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', fontSize: '0.9rem', color: '#334155' }}>
            {search
              ? <p style={{ color: 'var(--text-muted)' }}>Searching for: "<strong>{search}</strong>" — no matching disagreements found.</p>
              : <p style={{ color: '#94a3b8', textAlign: 'center', padding: '3rem 0' }}>Connect to live backend to stream telemetry.</p>
            }
          </div>
        </div>

        <div className="table-container" style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <Filter size={20} color="#3b82f6" /> Recent Adjudicator Overrides
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>System audit trail for manual evaluations.</p>
          <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '3rem 0' }}>No overrides in the last 24 hours.</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

