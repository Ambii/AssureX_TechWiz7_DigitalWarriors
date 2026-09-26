import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, Download, Play, Activity } from 'lucide-react';

export default function LiveEvaluator() {
  const [search, setSearch] = useState('');
  
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
          <button className="btn-primary" style={{ background: '#fff', color: '#0f172a', border: '1px solid var(--border-color)' }}>
            <Download size={18} /> Export Data
          </button>
          <button className="btn-primary" style={{ background: '#4f46e5' }}>
            <Play size={18} /> Run Batch Evaluation
          </button>
        </div>
      </div>

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
          
          <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <option>All Risk Levels</option>
            <option>High Risk</option>
            <option>Low Risk</option>
          </select>
          
          <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
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
        
        {/* Dual Model Disagreement Feed */}
        <div className="table-container" style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <Activity size={20} color="#ea580c" /> Model Disagreements Log
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No recent disagreements detected.</p>
          {/* Placeholder for table */}
          <div style={{ background: '#f8fafc', borderRadius: '8px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            Awaiting inference telemetry...
          </div>
        </div>

        {/* Override Audit Log */}
        <div className="table-container" style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <Filter size={20} color="#3b82f6" /> Recent Adjudicator Overrides
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>System audit trail for manual evaluations.</p>
          <div style={{ background: '#f8fafc', borderRadius: '8px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            No overrides in the last 24 hours.
          </div>
        </div>

      </div>
    </div>
  );
}
