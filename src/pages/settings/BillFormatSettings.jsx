import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  FileText, 
  CheckCircle2, 
  Save, 
  Sparkles, 
  Printer, 
  HelpCircle,
  Eye,
  Sliders,
  QrCode
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { toast } from '../../components/ui/toast/toastService';
import { ThermalReceipt } from '../../components/sales/ThermalReceipt';
import { useAuth } from '../../hooks/useAuth';

export const BillFormatSettings = () => {
  const { user } = useAuth();
  
  // Load saved preferences from localStorage
  const [selectedBillType, setSelectedBillType] = useState(() => {
    return localStorage.getItem('erp_default_bill_type') || 'THERMAL'; // Default to THERMAL as requested
  });

  const [cashierName, setCashierName] = useState(() => {
    return localStorage.getItem('erp_thermal_cashier') || user?.name || 'PRAYOSHA';
  });

  const [showQR, setShowQR] = useState(() => {
    return localStorage.getItem('erp_thermal_show_qr') !== 'false';
  });

  const [termsList, setTermsList] = useState(() => {
    const saved = localStorage.getItem('erp_thermal_terms');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      'Goods once sold will not be taken back.',
      'No Exchange without Origional Invoice & Barcode',
      'Exchange only within 7 Days Before 5.00 PM.',
      'No Guarantee. No Refund.',
      'Subject To Store Jurisdiction.'
    ];
  });

  const [activePreviewTab, setActivePreviewTab] = useState(selectedBillType);

  // Sample Sale Object for Live Preview
  const previewSale = {
    invoiceNumber: 'SR/2498/25-26',
    createdAt: new Date().toISOString(),
    paymentMethod: 'CASH',
    status: 'COMPLETED',
    businessId: user?.business || {
      name: 'Prayosha Fashion',
      address: 'Near Saurashtra Gramin Bank, Bhavnagar Road, Sidsar, Bhavnagar-364060',
      mobile: '8140912761',
      gstNumber: '24AAAAB1111A1Z1'
    },
    customerId: {
      name: 'ASHVINBHAI',
      mobile: '9824687957',
      address: 'Ahmedabad, Gujarat'
    },
    items: [
      {
        productName: 'jeans AMERICAN EAGLE',
        barcode: '00008893',
        size: '32',
        colour: 'MIX',
        quantity: 1,
        rate: 1030,
        discount: 50,
        total: 980
      },
      {
        productName: 'G-TEN SHIRT',
        barcode: 'bhakti',
        size: '38',
        colour: 'MIX',
        quantity: 1,
        rate: 599,
        discount: 49,
        total: 550
      },
      {
        productName: 'jeans URBAN JACK',
        barcode: '00009206',
        size: '32',
        colour: 'DARCK SHADE',
        quantity: 1,
        rate: 1200,
        discount: 50,
        total: 1150
      },
      {
        productName: 'SHIRT LV',
        barcode: '0009150',
        size: 'M',
        colour: 'NEW',
        quantity: 1,
        rate: 780,
        discount: 50,
        total: 730
      }
    ],
    subtotal: 3609,
    discountTotal: 309,
    grandTotal: 3300,
    paidAmount: 3300,
    dueAmount: 0
  };

  const handleSaveSettings = () => {
    localStorage.setItem('erp_default_bill_type', selectedBillType);
    localStorage.setItem('erp_thermal_cashier', cashierName);
    localStorage.setItem('erp_thermal_show_qr', showQR.toString());
    localStorage.setItem('erp_thermal_terms', JSON.stringify(termsList));

    toast.success({
      title: 'Bill Format Settings Saved',
      message: `Default Invoice Bill Type set to ${selectedBillType === 'THERMAL' ? 'Bill Type 2: Thermal POS Receipt (80mm)' : 'Bill Type 1: Standard A4 Tax Invoice'}`
    });
  };

  const handleTermChange = (index, value) => {
    const updated = [...termsList];
    updated[index] = value;
    setTermsList(updated);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 select-none">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary-600" />
            <h1 className="text-2xl font-bold text-slate-900">Invoice Bill Format &amp; Template Settings</h1>
          </div>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Choose your preferred billing layout for printing and downloading sales invoices (Standard A4 vs Thermal POS Receipt).
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleSaveSettings}
          startIcon={<Save className="h-4 w-4" />}
          className="shadow-lg shadow-primary-500/20"
        >
          Save Format Preference
        </Button>
      </div>

      {/* Bill Type Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bill Type 1 Card: Standard A4 Tax Invoice */}
        <div 
          onClick={() => {
            setSelectedBillType('A4');
            setActivePreviewTab('A4');
          }}
          className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 bg-white ${
            selectedBillType === 'A4'
              ? 'border-primary-500 shadow-xl shadow-primary-500/10 ring-2 ring-primary-500/20'
              : 'border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          {selectedBillType === 'A4' && (
            <div className="absolute top-4 right-4 bg-primary-500 text-white p-1 rounded-full shadow-md">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest block">Bill Type 1</span>
              <h3 className="text-lg font-bold text-slate-900">Standard A4 Tax Invoice</h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-4">
            Comprehensive full-page A4 layout formatted with business header, itemized tax tables, breakdown of GST (CGST/SGST/IGST), payment details, and signature section.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <Printer className="h-4 w-4 text-slate-400" />
            <span>Best for Desktop &amp; InkJet / Laser Printers</span>
          </div>
        </div>

        {/* Bill Type 2 Card: Thermal POS Receipt 80mm */}
        <div 
          onClick={() => {
            setSelectedBillType('THERMAL');
            setActivePreviewTab('THERMAL');
          }}
          className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 bg-white ${
            selectedBillType === 'THERMAL'
              ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20'
              : 'border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          {selectedBillType === 'THERMAL' && (
            <div className="absolute top-4 right-4 bg-emerald-500 text-white p-1 rounded-full shadow-md">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block">Bill Type 2 (New)</span>
              <h3 className="text-lg font-bold text-slate-900">Thermal POS Receipt (80mm)</h3>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-4">
            Compact 80mm receipt format as per retail store standards with barcode, item size/color, cashier info, payment summary, Total Savings badge, QR code, and store Terms.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <Printer className="h-4 w-4 text-emerald-500" />
            <span>Best for 80mm Thermal Receipt Printers &amp; Quick Billing</span>
          </div>
        </div>
      </div>

      {/* Settings Customization & Live Interactive Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="h-5 w-5 text-primary-600" />
            <h2 className="text-base font-bold text-slate-900">Thermal Receipt Customization</h2>
          </div>

          <div className="space-y-4">
            <TextField
              label="Default Cashier Name"
              value={cashierName}
              onChange={(e) => setCashierName(e.target.value)}
              placeholder="e.g. PRAYOSHA"
            />

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">Show QR Code on Receipt</span>
                <span className="text-[11px] text-slate-500 font-semibold block">Includes UPI payment / invoice verification QR</span>
              </div>
              <input
                type="checkbox"
                checked={showQR}
                onChange={(e) => setShowQR(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Store Terms &amp; Conditions (Receipt Footer)</label>
              {termsList.map((term, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 font-mono">*</span>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => handleTermChange(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary-600" />
              <h2 className="text-base font-bold text-slate-900">Live Bill Preview</h2>
            </div>

            {/* Toggle Tabs for Preview */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActivePreviewTab('A4')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activePreviewTab === 'A4'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Standard A4
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('THERMAL')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activePreviewTab === 'THERMAL'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Thermal POS (80mm)
              </button>
            </div>
          </div>

          {/* Render Active Preview */}
          <div className="min-h-[450px] flex items-center justify-center p-4 bg-slate-50/60 rounded-xl border border-slate-100 overflow-x-auto">
            {activePreviewTab === 'THERMAL' ? (
              <div className="shadow-lg rounded-md overflow-hidden bg-white">
                <ThermalReceipt
                  sale={previewSale}
                  business={previewSale.businessId}
                  cashierName={cashierName}
                  showQR={showQR}
                  terms={termsList}
                />
              </div>
            ) : (
              <div className="w-full max-w-lg bg-white border border-slate-200 shadow-md rounded-xl p-6 space-y-4 text-xs font-semibold text-slate-700">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{previewSale.businessId.name}</h3>
                    <p className="text-[10px] text-slate-500">{previewSale.businessId.address}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold bg-primary-50 text-primary-600 px-2 py-0.5 rounded uppercase">TAX INVOICE</span>
                    <p className="text-[10px] font-bold text-slate-800 mt-1">{previewSale.invoiceNumber}</p>
                  </div>
                </div>
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <tr>
                        <th className="p-2">Item</th>
                        <th className="p-2 text-right">Qty</th>
                        <th className="p-2 text-right">Price</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewSale.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-bold text-slate-900">{item.productName}</td>
                          <td className="p-2 text-right">{item.quantity}</td>
                          <td className="p-2 text-right">₹{item.rate}</td>
                          <td className="p-2 text-right font-bold text-slate-900">₹{item.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-900 border-t border-slate-100 pt-2">
                  <span>Grand Total</span>
                  <span>₹{previewSale.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillFormatSettings;
