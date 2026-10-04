import React from 'react';

/**
 * Thermal POS Receipt (80mm) Component
 * Matches the exact receipt layout shown in Prayosha Fashion bill screenshot.
 */
export const ThermalReceipt = ({ 
  sale, 
  business = null, 
  cashierName = 'PRAYOSHA',
  terms = [
    'Goods once sold will not be taken back.',
    'No Exchange without Origional Invoice & Barcode',
    'Exchange only within 7 Days Before 5.00 PM.',
    'No Guarantee. No Refund.',
    'Subject To Jurisdiction.'
  ],
  showQR = true,
  printableId = 'thermal-printable-area'
}) => {
  if (!sale) return null;

  const bName = sale?.businessId?.name || business?.name || 'MyERP Store';
  const bAddress = sale?.businessId?.address || business?.address || 'Near Saurashtra Gramin Bank, Bhavnagar Road, Sidsar, Bhavnagar-364060';
  const bMobile = sale?.businessId?.mobile || business?.mobile || '8140912761';

  const invoiceNo = sale?.invoiceNumber || 'SR/2498/25-26';
  const dateStr = sale?.createdAt 
    ? new Date(sale.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
    : '16-07-2025';
  const timeStr = sale?.createdAt 
    ? new Date(sale.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    : '07:22:45 PM';

  const custName = sale?.customerId?.name || 'ASHVINBHAI';
  const custMobile = sale?.customerId?.mobile || '9824687957';

  const items = sale?.items || [];
  
  // Calculate Totals
  const totalQty = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const grossAmount = Number(sale?.subtotal || items.reduce((sum, i) => sum + (i.rate * i.quantity), 0));
  const totalDiscount = Number(sale?.discountTotal || items.reduce((sum, i) => sum + (Number(i.discount) || 0), 0));
  const netAmount = Number(sale?.grandTotal || (grossAmount - totalDiscount));
  const paidAmount = Number(sale?.paidAmount || netAmount);
  const totalSaving = totalDiscount;

  // Simple QR Code URL generator or inline SVG placeholder
  const qrData = encodeURIComponent(`BILL:${invoiceNo}|AMT:${netAmount}|STORE:${bName}`);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}`;

  return (
    <div 
      id={printableId} 
      className="thermal-receipt-container bg-white text-black font-mono p-3 select-none mx-auto border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-0"
      style={{
        width: '300px',
        fontSize: '11px',
        lineHeight: '1.25'
      }}
    >
      {/* Outer Border Header Box */}
      <div className="border border-black p-2 mb-1 text-center">
        <div className="border border-black py-0.5 px-2 inline-block font-extrabold text-xs uppercase tracking-wider mb-1">
          TAX INVOICE
        </div>
        <div className="text-lg font-black tracking-tight font-sans text-black leading-tight">
          {bName}
        </div>
        <div className="text-[10px] font-sans font-semibold text-black mt-0.5 leading-tight">
          {bAddress}
        </div>
        <div className="text-[10px] font-sans font-bold text-black mt-0.5">
          Phone : {bMobile}
        </div>

        {/* Dashed Separator */}
        <div className="border-t border-dashed border-black my-1.5" />

        {/* Invoice Info Metadata */}
        <div className="text-[10px] text-left font-sans space-y-0.5">
          <div className="flex justify-between font-bold">
            <span>Bill No : {invoiceNo}</span>
            <span>Date : {dateStr}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Cashier : {cashierName}</span>
            <span>Time : {timeStr}</span>
          </div>
        </div>

        {/* Dashed Separator */}
        <div className="border-t border-dashed border-black my-1.5" />

        {/* Customer Details */}
        <div className="text-[10px] text-left font-sans font-bold space-y-0.5">
          <div>Customer : {custName.toUpperCase()}</div>
          <div>Mobile No : {custMobile}</div>
        </div>

        {/* Items Table */}
        <div className="border-t border-b border-black my-1.5 py-1 text-left font-mono">
          <div className="grid grid-cols-12 font-bold border-b border-black pb-1 mb-1 text-[9px] uppercase">
            <span className="col-span-6">ITEM NAME</span>
            <span className="col-span-3 text-center">BarCode</span>
            <span className="col-span-3 text-right">Size</span>
          </div>
          <div className="grid grid-cols-12 font-bold border-b border-black pb-1 mb-1 text-[9px] uppercase">
            <span className="col-span-3">COLOUR</span>
            <span className="col-span-2 text-center">QTY</span>
            <span className="col-span-3 text-right">RATE</span>
            <span className="col-span-4 text-right">NET AMOUNT</span>
          </div>

          {/* Item Rows */}
          <div className="space-y-2 py-0.5 text-[10px]">
            {items.map((item, idx) => {
              const pName = item.productName || item.name || `Item ${idx + 1}`;
              const barcode = item.barcode || item.sku || `0000${8890 + idx}`;
              const size = item.size || item.unit || 'MIX';
              const colour = item.colour || item.color || 'MIX';
              const qty = Number(item.quantity || 1).toFixed(2);
              const rate = Number(item.rate || item.price || 0).toFixed(2);
              const netAmt = Number(item.total || (rate * qty - (item.discount || 0))).toFixed(2);

              return (
                <div key={idx} className="space-y-0.5 border-b border-dashed border-slate-300 pb-1.5 last:border-none">
                  <div className="grid grid-cols-12 font-bold uppercase">
                    <span className="col-span-6 truncate">{pName}</span>
                    <span className="col-span-3 text-center text-[9px] truncate">{barcode}</span>
                    <span className="col-span-3 text-right">{size}</span>
                  </div>
                  <div className="grid grid-cols-12 text-[9.5px]">
                    <span className="col-span-3 truncate text-slate-800">{colour}</span>
                    <span className="col-span-2 text-center font-semibold">{qty}</span>
                    <span className="col-span-3 text-right">{rate}</span>
                    <span className="col-span-4 text-right font-bold">{netAmt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* QTY TOTAL Line */}
        <div className="font-bold text-[11px] text-left uppercase my-1 font-mono">
          QTY. TOTAL: {totalQty.toFixed(2)}
        </div>

        {/* Solid Line Separator */}
        <div className="border-t-2 border-black my-1" />

        {/* PAYMENT SUMMARY */}
        <div className="text-[10.5px] font-mono text-center font-bold space-y-0.5 uppercase">
          <div className="text-center font-black tracking-wider text-xs my-0.5">
            PAYMENT SUMMARY
          </div>
          <div className="flex justify-between px-2">
            <span>Gross Amount :</span>
            <span>{grossAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between px-2">
            <span>Discount :</span>
            <span>{totalDiscount.toFixed(0)}</span>
          </div>
          <div className="flex justify-between px-2 font-black text-xs">
            <span>Net Amount :</span>
            <span>{netAmount.toFixed(2)}</span>
          </div>

          <div className="text-[9px] text-center my-1 tracking-tight">
            &lt;------- Amount Received From Customer ------&gt;
          </div>

          <div className="flex justify-between px-2 font-black">
            <span>CASH Received :</span>
            <span>{paidAmount.toFixed(2)}</span>
          </div>

          {/* Highlighted Total Saving Box */}
          {totalSaving > 0 && (
            <div className="border-2 border-black p-1 text-center font-black text-xs my-2 tracking-wide uppercase bg-slate-50">
              Total Saving : {totalSaving.toFixed(0)}/- Rs.
            </div>
          )}
        </div>

        {/* QR Code */}
        {showQR && (
          <div className="my-2 flex flex-col items-center justify-center">
            <img 
              src={qrCodeUrl} 
              alt="Receipt QR Code" 
              className="w-24 h-24 object-contain border border-black p-1 bg-white"
            />
          </div>
        )}

        {/* TERMS & CONDITIONS */}
        <div className="border-t border-black pt-1.5 mt-1 text-left">
          <div className="text-[9.5px] font-black text-center uppercase tracking-wider mb-0.5">
            TERMS &amp; CONDITIONS
          </div>
          <ul className="text-[8.5px] font-sans font-semibold space-y-0.5 text-slate-900 leading-tight">
            {terms.map((term, tIdx) => (
              <li key={tIdx}>* {term}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Print Specific Stylesheet Injection */}
      <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .thermal-receipt-container {
            width: 78mm !important;
            margin: 0 auto !important;
            padding: 2mm !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ThermalReceipt;
