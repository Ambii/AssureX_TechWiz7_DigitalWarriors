import React, { useState } from 'react';

export default function SubmitClaim() {
  const [step, setStep] = useState(1);
  const [ocrData, setOcrData] = useState({ purchaseDate: '2025-05-12', storeName: 'Tech Store' });

  return (
    <div>
      <h1>Submit Warranty Claim</h1>
      <h3>Step {step} of 3</h3>

      {step === 1 && (
        <div>
          <h4>Select Product & Issue</h4>
          <input type="text" placeholder="Product Serial Number" /><br /><br />
          <textarea placeholder="Describe the fault..."></textarea><br /><br />
          <button onClick={() => setStep(2)}>Next: Upload Receipt</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h4>Upload Receipt & Proof</h4>
          <input type="file" accept="image/*,.pdf" /><br /><br />
          <button onClick={() => setStep(3)}>Simulate OCR Scan</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h4>OCR Extracted Data Verification</h4>
          <p>Verify extracted details before submission:</p>
          <label>Store Name: </label>
          <input value={ocrData.storeName} onChange={(e) => setOcrData({...ocrData, storeName: e.target.value})} /><br /><br />
          <label>Purchase Date: </label>
          <input value={ocrData.purchaseDate} onChange={(e) => setOcrData({...ocrData, purchaseDate: e.target.value})} /><br /><br />
          <button onClick={() => alert('Claim Submitted Successfully!')}>Confirm & Submit Claim</button>
        </div>
      )}
    </div>
  );
}