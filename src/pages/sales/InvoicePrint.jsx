import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Printer, Sparkles, MessageSquare, Send } from 'lucide-react';
import { useSale } from '../../hooks/useSales';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { WhatsAppShareModal } from '../../components/sales/WhatsAppShareModal';
import { downloadInvoicePDF } from '../../utils/pdfGenerator';

export const InvoicePrint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shouldPrint = searchParams.get('print') === 'true';
  const shouldWhatsApp = searchParams.get('whatsapp') === 'true';
  const { user } = useAuth();

  const { sale, isLoading } = useSale(id);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  useEffect(() => {
    if (sale && shouldPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [sale, shouldPrint]);

  useEffect(() => {
    if (sale && shouldWhatsApp) {
      setIsWhatsAppModalOpen(true);
    }
  }, [sale, shouldWhatsApp]);

  if (isLoading) {
    return <Loader fullscreen />;
  }

  if (!sale) {
    return (
      <div className="p-12 text-center select-none space-y-4">
        <h2 className="text-xl font-bold text-red-500">Invoice Not Found</h2>
        <Button variant="outline" onClick={() => navigate('/sales')}>Back to Sales</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 my-4 p-4 md:p-0">
      {/* Control Actions Panel (Hidden on Print) */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 select-none no-print flex-wrap">
        <Button
          variant="outline"
          onClick={() => navigate('/sales')}
          startIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to list
        </Button>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            type="button"
            variant="outline"
            className="text-slate-700 hover:bg-slate-50 border-slate-300"
            onClick={() => downloadInvoicePDF(sale, sale?.businessId || user?.business, document.getElementById('printable-area'))}
            startIcon={<Printer className="h-4 w-4 text-primary-600" />}
          >
            Download PDF
          </Button>

          <Button
            type="button"
            variant="primary"
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 font-bold"
            onClick={() => setIsWhatsAppModalOpen(true)}
            startIcon={
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            }
          >
            Send WhatsApp & PDF
          </Button>

          <Button
            variant="primary"
            onClick={() => window.print()}
            startIcon={<Printer className="h-4 w-4" />}
          >
            Print
          </Button>
        </div>
      </div>

      {/* Invoice Sheet */}
      <div 
        id="printable-area" 
        className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8 space-y-8 select-none print:shadow-none print:border-none print:p-0"
      >
        {/* Invoice Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-3">
            {sale?.businessId?.logo ? (
              <img 
                src={sale.businessId.logo.startsWith('/') ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${sale.businessId.logo}` : sale.businessId.logo} 
                alt="business logo" 
                className="h-12 w-auto object-contain print:h-10" 
              />
            ) : (
              <div className="p-1 bg-slate-900 rounded-lg text-white inline-block">
                <Sparkles className="h-6 w-6" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-900">{sale?.businessId?.name}</h1>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed whitespace-pre-line max-w-sm">
                {sale?.businessId?.address}
              </p>
            </div>
          </div>

          <div className="text-left md:text-right space-y-1 md:self-stretch flex flex-col justify-between items-start md:items-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">TAX INVOICE</span>
            <div className="text-xs text-slate-600 font-semibold space-y-1">
              <div>Invoice No: <span className="font-bold text-slate-900">{sale.invoiceNumber}</span></div>
              <div>Date: <span className="font-bold text-slate-900">{new Date(sale.createdAt).toLocaleDateString()}</span></div>
              {sale?.businessId?.gstNumber && <div>GSTIN: <span className="font-bold text-slate-900">{sale.businessId.gstNumber}</span></div>}
            </div>
          </div>
        </div>

        {/* Billing Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billed To</span>
            <div className="text-xs text-slate-600 font-semibold space-y-0.5">
              <div className="text-sm font-bold text-slate-900">{sale.customerId?.name}</div>
              <div>Mobile: {sale.customerId?.mobile}</div>
              {sale.customerId?.email && <div>Email: {sale.customerId.email}</div>}
              {sale.customerId?.address && <div className="max-w-xs">{sale.customerId.address}</div>}
              {sale.customerId?.gstNumber && <div className="font-bold">GSTIN: {sale.customerId.gstNumber}</div>}
            </div>
          </div>

          <div className="space-y-1 md:text-right flex flex-col justify-end items-start md:items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Details</span>
            <div className="text-xs text-slate-600 font-semibold space-y-0.5">
              <div>Payment Mode: <span className="font-bold text-slate-900">{sale.paymentMethod}</span></div>
              <div>Status: <span className="font-bold text-slate-900">{sale.status}</span></div>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="border border-slate-100 rounded-xl overflow-hidden print:border-slate-200">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider print:bg-slate-100">
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Price/Unit</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Disc</th>
                <th className="px-4 py-3 text-right">GST %</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, index) => (
                <tr key={index} className="border-b border-slate-100 last:border-none font-semibold text-slate-700">
                  <td className="px-4 py-3 font-bold text-slate-900">{item.productName}</td>
                  <td className="px-4 py-3 text-right">₹ {item.rate.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-emerald-600">- ₹ {item.discount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">{item.gstRate}%</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900">₹ {item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-t border-slate-100 pt-6">
          <div className="text-xs text-slate-500 leading-relaxed font-semibold max-w-sm italic">
            Thank you for your business. For any invoice queries, contact shop support.
          </div>

          <div className="w-full md:w-80 text-xs space-y-2.5 font-semibold text-slate-600 select-none">
            <div className="flex justify-between">
              <span>Subtotal (Before Tax)</span>
              <span>₹ {sale.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discounts Applied</span>
              <span className="text-emerald-600">- ₹ {sale.discountTotal.toFixed(2)}</span>
            </div>
            {sale.cgst > 0 && (
              <div className="flex justify-between pl-3 text-slate-400">
                <span>CGST</span>
                <span>₹ {sale.cgst.toFixed(2)}</span>
              </div>
            )}
            {sale.sgst > 0 && (
              <div className="flex justify-between pl-3 text-slate-400">
                <span>SGST</span>
                <span>₹ {sale.sgst.toFixed(2)}</span>
              </div>
            )}
            {sale.igst > 0 && (
              <div className="flex justify-between pl-3 text-slate-400">
                <span>IGST</span>
                <span>₹ {sale.igst.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-dashed border-slate-200 pt-2 text-sm font-bold text-slate-900">
              <span>Grand Total</span>
              <span>₹ {sale.grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-800">
              <span>Amount Paid</span>
              <span>₹ {sale.paidAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-red-500">
              <span>Balance Due</span>
              <span>₹ {sale.dueAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        sale={sale}
        business={sale?.businessId || user?.business}
        printableElementId="printable-area"
      />

      {/* CSS Stylesheet Injector for Printer Layouts */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          #printable-area {
            border: none !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoicePrint;

