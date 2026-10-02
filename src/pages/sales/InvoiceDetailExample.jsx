import React, { useState } from 'react';
import { SendWhatsAppBillButton } from '../../components/sales/SendWhatsAppBillButton';
import { formatWhatsAppInvoiceMessage } from '../../utils/whatsappUtils';

/**
 * Example Integration Component: InvoiceDetailExample
 * Demonstrates rendering invoice details and triggering WhatsApp Deep Linking
 */
export const InvoiceDetailExample = () => {
  // Sample invoice state object matching your application schema
  const [invoice, setInvoice] = useState({
    id: 'INV-2026-0894',
    date: '23/09/2026',
    businessName: 'Apex Retail Enterprises',
    customerName: 'Rahul Sharma',
    customerPhone: '9876543210', // 10-digit number without country code
    items: [
      { name: 'Wireless Bluetooth Keyboard', qty: 1, price: 1499.00 },
      { name: 'Ergonomic Optical Mouse', qty: 2, price: 599.00 },
      { name: 'USB-C Fast Charging Cable', qty: 3, price: 249.00 },
    ],
    totalAmount: 3444.00,
    paymentStatus: 'PAID',
    pdfUrl: 'https://erp.apexretail.com/invoices/INV-2026-0894.pdf',
  });

  const [countryCode, setCountryCode] = useState('91');
  const [targetMode, setTargetMode] = useState('deep-link');
  const [feedback, setFeedback] = useState(null);

  const previewMessage = formatWhatsAppInvoiceMessage(invoice);

  const handleShareSuccess = (data) => {
    setFeedback({
      type: 'success',
      text: `WhatsApp link created and opened successfully for ${data.phone}!`,
    });
  };

  const handleShareError = (errorMsg) => {
    setFeedback({
      type: 'error',
      text: errorMsg,
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '32px auto', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0', color: '#0f172a' }}>
          Invoice #{invoice.id}
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
          Customer: <b>{invoice.customerName}</b> ({invoice.customerPhone})
        </p>
      </div>

      {/* Invoice Card */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Billing Summary
            </span>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
              Grand Total: ₹{invoice.totalAmount.toFixed(2)}
            </div>
          </div>

          {/* Action Toolbar with the WhatsApp Share Button */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <SendWhatsAppBillButton
              invoice={invoice}
              countryCode={countryCode}
              targetMode={targetMode}
              buttonText="Share Bill on WhatsApp"
              onSuccess={handleShareSuccess}
              onError={handleShareError}
            />
          </div>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '13px',
              fontWeight: '500',
              backgroundColor: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: feedback.type === 'success' ? '#065f46' : '#991b1b',
              border: `1px solid ${feedback.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            }}
          >
            {feedback.text}
          </div>
        )}

        {/* Itemized Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '24px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px' }}>Item</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 12px', fontWeight: '600' }}>{item.name}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.qty}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{item.price.toFixed(2)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700' }}>
                  ₹{(item.qty * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Configuration Options */}
        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
            Component Controls & Test Modifiers
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Customer Phone:
              </label>
              <input
                type="text"
                value={invoice.customerPhone}
                onChange={(e) => setInvoice({ ...invoice, customerPhone: e.target.value })}
                placeholder="e.g. 9876543210"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Default Country Code:
              </label>
              <input
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                placeholder="91"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                Target Mode:
              </label>
              <select
                value={targetMode}
                onChange={(e) => setTargetMode(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              >
                <option value="deep-link">Deep Link (wa.me - App & Mobile)</option>
                <option value="web">WhatsApp Web (web.whatsapp.com)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Message Preview */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>
            Live WhatsApp Message Preview (Markdown Formatted):
          </label>
          <pre
            style={{
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '12px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
              fontFamily: 'monospace',
            }}
          >
            {previewMessage}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailExample;
