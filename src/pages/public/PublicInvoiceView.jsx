import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  FileDown, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Receipt,
  FileText
} from 'lucide-react';
import { usePublicSale } from '../../hooks/useSales';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { downloadInvoicePDF } from '../../utils/pdfGenerator';
import { toast } from '../../components/ui/toast/toastService';
import { ThermalReceipt } from '../../components/sales/ThermalReceipt';

export const PublicInvoiceView = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const autoDownload = searchParams.get('download') === 'true';
  const autoPrint = searchParams.get('print') === 'true';

  const { sale, isLoading, isError, error } = usePublicSale(id);
  const [isDownloading, setIsDownloading] = useState(false);

  // Bill Format state
  const [billType, setBillType] = useState(() => {
    return localStorage.getItem('erp_default_bill_type') || 'THERMAL';
  });

  // Auto trigger download or print if query param is passed
  React.useEffect(() => {
    if (sale) {
      if (autoDownload) {
        handleDownloadPDF();
      } else if (autoPrint) {
        setTimeout(() => window.print(), 600);
      }
    }
  }, [sale, autoDownload, autoPrint]);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const el = document.getElementById('public-invoice-printable');
      await downloadInvoicePDF(sale, sale?.businessId, el);
    } catch (err) {
      console.error('PDF download error:', err);
      toast.error('Failed to download PDF invoice.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader />
          <p className="text-sm font-semibold text-slate-500">Loading your invoice details...</p>
        </div>
      </div>
    );
  }

  if (isError || !sale) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 mx-auto flex items-center justify-center">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Invoice Not Found</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {error?.message || 'This invoice link may be expired, invalid, or no longer available.'}
          </p>
        </div>
      </div>
    );
  }

  const business = sale.businessId || {};
  const customer = sale.customerId || {};
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const logoUrl = business.logo
    ? business.logo.startsWith('http') ? business.logo : `${backendUrl}${business.logo}`
    : null;

  const isPaid = (sale.dueAmount || 0) <= 0;

  return (
    <div className="min-h-screen bg-slate-100/80 py-6 px-4 sm:px-6 font-sans antialiased text-slate-900">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Top Floating Action Banner (Hidden on Print) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center justify-between gap-4 flex-wrap select-none no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Verified E-Invoice</span>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                Invoice #{sale.invoiceNumber}
              </h1>
            </div>
          </div>

          {/* Bill Format Switcher */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setBillType('A4')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                billType === 'A4'
                  ? 'bg-white text-primary-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Standard A4</span>
            </button>

            <button
              type="button"
              onClick={() => setBillType('THERMAL')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                billType === 'THERMAL'
                  ? 'bg-white text-emerald-600 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Receipt className="h-4 w-4 text-emerald-600" />
              <span>Thermal POS (80mm)</span>
            </button>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              startIcon={<Printer className="h-4 w-4" />}
              className="text-slate-700 hover:bg-slate-50 border-slate-300"
            >
              Print Bill
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleDownloadPDF}
              loading={isDownloading}
              startIcon={<FileDown className="h-4 w-4" />}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20"
            >
              Download PDF Bill
            </Button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div id="public-invoice-printable" className="select-none">
          {billType === 'THERMAL' ? (
            <div className="py-4">
              <ThermalReceipt
                sale={sale}
                business={sale?.businessId}
                cashierName={localStorage.getItem('erp_thermal_cashier') || 'PRAYOSHA'}
                printableId="public-thermal-bill"
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-8 print:shadow-none print:border-none print:p-0">
              {/* Header Section: Store Identity & Invoice Title */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-6">
                <div className="space-y-3">
                  {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt={business.name || 'Store Logo'} 
                      className="h-12 w-auto object-contain max-w-[200px]" 
                    />
                  ) : (
                    <div className="p-2.5 bg-slate-900 text-white rounded-xl inline-flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-400" />
                      <span className="font-extrabold text-sm tracking-wide">{business.name || 'Our Shop'}</span>
                    </div>
                  )}

                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">{business.name || 'Our Shop'}</h2>
                    {business.address && (
                      <p className="text-xs text-slate-500 font-medium leading-relaxed whitespace-pre-line max-w-sm mt-1">
                        {business.address}
                      </p>
                    )}
                    <div className="text-xs text-slate-600 font-medium space-y-0.5 mt-2">
                      {business.mobile && <p>📞 Phone: <b>{business.mobile}</b></p>}
                      {business.email && <p>✉️ Email: <b>{business.email}</b></p>}
                      {business.gstNumber && <p className="text-emerald-700 font-bold">🏷️ GSTIN: {business.gstNumber}</p>}
                    </div>
                  </div>
                </div>

                {/* Invoice Meta */}
                <div className="sm:text-right space-y-1.5 flex flex-col justify-between items-start sm:items-end">
                  <span className="text-xs font-extrabold tracking-widest uppercase bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-100">
                    TAX INVOICE
                  </span>
                  <div className="text-xs text-slate-600 font-semibold space-y-1 mt-2">
                    <div>Invoice No: <span className="font-bold text-slate-900 text-sm">{sale.invoiceNumber}</span></div>
                    <div>Date: <span className="font-bold text-slate-900">{new Date(sale.createdAt).toLocaleDateString()}</span></div>
                    <div>Payment Mode: <span className="font-bold text-slate-900">{sale.paymentMethod || 'CASH'}</span></div>
                    <div>
                      Payment Status:{' '}
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded text-[11px]">
                          BALANCE DUE
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Billed To Customer Card */}
              <div className="p-4 sm:p-5 bg-slate-50/80 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Billed To (Customer)
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{customer.name || 'Walk-in Customer'}</h3>
                  {customer.mobile && <p className="text-xs text-slate-600 font-medium mt-0.5">Mobile: {customer.mobile}</p>}
                  {customer.email && <p className="text-xs text-slate-600 font-medium">Email: {customer.email}</p>}
                  {customer.address && <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{customer.address}</p>}
                </div>

                <div className="sm:text-right flex flex-col justify-end items-start sm:items-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Invoice Total Amount
                  </span>
                  <div className="text-2xl font-black text-slate-900">
                    ₹ {Number(sale.grandTotal || 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    Paid: ₹ {Number(sale.paidAmount || 0).toFixed(2)}
                    {Number(sale.dueAmount || 0) > 0 && (
                      <span className="text-red-600 font-bold ml-1.5">(Due: ₹{Number(sale.dueAmount).toFixed(2)})</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Item Description</th>
                      <th className="py-3 px-4 text-right">Price</th>
                      <th className="py-3 px-4 text-center">Qty</th>
                      <th className="py-3 px-4 text-right">Discount</th>
                      <th className="py-3 px-4 text-right">GST</th>
                      <th className="py-3 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(sale.items || []).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 text-slate-400 font-medium">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {item.productName || item.productId?.name || `Item ${idx + 1}`}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-600 font-medium">
                          ₹ {Number(item.rate || 0).toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                          {item.quantity || 1}
                        </td>
                        <td className="py-3.5 px-4 text-right text-emerald-600 font-medium">
                          {Number(item.discount || 0) > 0 ? `- ₹ ${Number(item.discount).toFixed(2)}` : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-500 font-medium">
                          {item.gstRate !== undefined ? `${item.gstRate}%` : '0%'}
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-slate-900">
                          ₹ {Number(item.total || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Calculation Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
                <div className="max-w-sm space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Thank You For Your Business!</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We appreciate your trust in <b>{business.name || 'Our Shop'}</b>. For any questions or support regarding this invoice, please reach out with your Invoice Number.
                  </p>
                </div>

                <div className="w-full sm:w-72 space-y-2 text-xs border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>Subtotal (Before Tax):</span>
                    <span className="font-semibold text-slate-900">₹ {Number(sale.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>Discounts Applied:</span>
                    <span className="font-semibold text-emerald-600">- ₹ {Number(sale.discountTotal || 0).toFixed(2)}</span>
                  </div>
                  {Number(sale.cgst || 0) > 0 && (
                    <div className="flex justify-between font-medium text-slate-500 pl-2">
                      <span>CGST:</span>
                      <span>₹ {Number(sale.cgst).toFixed(2)}</span>
                    </div>
                  )}
                  {Number(sale.sgst || 0) > 0 && (
                    <div className="flex justify-between font-medium text-slate-500 pl-2">
                      <span>SGST:</span>
                      <span>₹ {Number(sale.sgst).toFixed(2)}</span>
                    </div>
                  )}
                  {Number(sale.igst || 0) > 0 && (
                    <div className="flex justify-between font-medium text-slate-500 pl-2">
                      <span>IGST:</span>
                      <span>₹ {Number(sale.igst).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-sm text-slate-900">
                    <span>Grand Total:</span>
                    <span className="text-base text-slate-900">₹ {Number(sale.grandTotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700 pt-1">
                    <span>Paid Amount:</span>
                    <span>₹ {Number(sale.paidAmount || 0).toFixed(2)}</span>
                  </div>
                  {Number(sale.dueAmount || 0) > 0 ? (
                    <div className="flex justify-between font-extrabold text-red-600 pt-1 border-t border-dashed border-slate-200">
                      <span>Balance Due:</span>
                      <span>₹ {Number(sale.dueAmount).toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="text-center py-1 font-bold text-emerald-700 bg-emerald-100/60 rounded-lg text-[11px] mt-1">
                      🎉 Invoice Fully Paid
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 py-4 select-none no-print">
          Generated via ERP Billing System • Powered by {business.name || 'Our Shop'}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          #public-invoice-printable {
            border: none !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PublicInvoiceView;
