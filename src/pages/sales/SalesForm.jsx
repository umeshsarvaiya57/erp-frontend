import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Formik, Form, FieldArray } from 'formik';
import { ShoppingBag, Plus, Trash2, ArrowLeft, AlertTriangle, QrCode } from 'lucide-react';
import { saleSchema } from '../../validations/saleValidation';
import { useSales } from '../../hooks/useSales';
import { useProducts } from '../../hooks/useProducts';
import { useCustomers } from '../../hooks/useCustomers';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { toast } from '../../components/ui/toast/toastService';

export const SalesForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scanInput, setScanInput] = useState('');

  // Synthesize a retail barcode beep sound out-of-the-box
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime); // 1000Hz frequency
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.08); // beep for 80ms
    } catch (err) {
      console.warn('AudioContext beep failed:', err);
    }
  };

  const handleBarcodeScan = (e, values, setFieldValue) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Stop normal form submit
      const code = scanInput.trim();
      if (!code) return;

      const product = products.find(p => p.barcode === code || p.sku.toLowerCase() === code.toLowerCase());
      if (product) {
        const existingIndex = values.items.findIndex(item => item.productId === product._id);
        
        if (existingIndex !== -1) {
          const currentQty = Number(values.items[existingIndex].quantity) || 0;
          setFieldValue(`items.${existingIndex}.quantity`, currentQty + 1);
          toast.success(`Incremented quantity for ${product.name}`);
        } else {
          // If first item row is completely empty, replace it
          const firstItem = values.items[0];
          if (values.items.length === 1 && !firstItem.productId) {
            setFieldValue('items.0.productId', product._id);
            setFieldValue('items.0.quantity', 1);
            setFieldValue('items.0.discount', 0);
          } else {
            setFieldValue('items', [
              ...values.items,
              { productId: product._id, quantity: 1, discount: 0 }
            ]);
          }
          toast.success(`Added ${product.name} to invoice`);
        }
        playBeep();
      } else {
        toast.error(`Product with Barcode/SKU "${code}" not found.`);
      }
      setScanInput(''); // Clear input
    }
  };

  // Queries for selectors
  const { products, isLoading: isProductsLoading } = useProducts({ limit: 100 });
  const { customers, isLoading: isCustomersLoading } = useCustomers({ limit: 100 });
  const { createSale, isCreating } = useSales();

  const handleFormSubmit = (values) => {
    createSale(values, {
      onSuccess: (res) => {
        navigate(`/invoices/${res.data.data._id}`);
      },
    });
  };

  const getProductLookup = (productId) => {
    return products.find(p => p._id === productId);
  };

  const getCustomerLookup = (customerId) => {
    return customers.find(c => c._id === customerId);
  };

  // Recalculates all subtotal, discount, GST taxes dynamically in the frontend layout
  const calculateInvoiceSummary = (values) => {
    let subtotal = 0;
    let discountTotal = 0;
    let gstTotal = 0;

    values.items.forEach(item => {
      const prod = getProductLookup(item.productId);
      if (prod) {
        const rate = prod.sellingPrice;
        const discount = Number(item.discount) || 0;
        const qty = Number(item.quantity) || 0;
        
        const lineSub = (rate - discount) * qty;
        const lineGst = (lineSub * (prod.gstRate || 0)) / 100;

        subtotal += rate * qty;
        discountTotal += discount * qty;
        gstTotal += lineGst;
      }
    });

    const grandTotal = subtotal - discountTotal + gstTotal;
    const dueAmount = grandTotal - (Number(values.paidAmount) || 0);

    // GST splits representation
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    const cust = getCustomerLookup(values.customerId);
    const isInterState = cust?.state && user?.business?.state && 
      cust.state.trim().toLowerCase() !== user.business.state.trim().toLowerCase();

    if (isInterState) {
      igst = gstTotal;
    } else {
      cgst = gstTotal / 2;
      sgst = gstTotal / 2;
    }

    return {
      subtotal,
      discountTotal,
      gstTotal,
      cgst,
      sgst,
      igst,
      grandTotal,
      dueAmount,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 select-none">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/sales')}
          startIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-slate-500" />
          <h1 className="text-2xl font-bold text-slate-900 leading-none">New Sales Invoice</h1>
        </div>
      </div>

      <Formik
        initialValues={{
          customerId: '',
          items: [{ productId: '', quantity: 1, discount: 0 }],
          paidAmount: 0,
          paymentMethod: 'CASH',
          notes: '',
        }}
        validationSchema={saleSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
          const summary = calculateInvoiceSummary(values);

          return (
            <Form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Form Panel: Client and Item lists */}
              <div className="lg:col-span-2 space-y-6">
                <Card title="Billing Details" subtitle="Identify the customer client">
                  <Select
                    label="Select Customer Account"
                    name="customerId"
                    value={values.customerId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={customers.map(c => ({ value: c._id, label: `${c.name} (${c.mobile})` }))}
                    error={touched.customerId && errors.customerId}
                    required
                  />
                </Card>

                {/* Items selection FieldArray */}
                <Card title="Invoice Items List" subtitle="Add items and configure discounts">
                  {/* Barcode/QR scan emulator input */}
                  <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 select-none">
                    <label className="text-xs font-bold text-slate-700 block">
                      Barcode / QR Code / SKU Scanner
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        onKeyDown={(e) => handleBarcodeScan(e, values, setFieldValue)}
                        placeholder="Scan item barcode/QR code or SKU, then press Enter..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 hover:border-slate-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 rounded-xl outline-none font-medium text-slate-800 placeholder-slate-400 transition-colors"
                      />
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 shrink-0">
                        <QrCode className="h-5 w-5" />
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold block">
                      Tip: Keep cursor inside this field and scan with scanner. It plays a retail beep sound automatically.
                    </span>
                  </div>

                  <FieldArray name="items">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.items.map((item, index) => {
                          const selectedProd = getProductLookup(item.productId);
                          const lineTotal = selectedProd 
                            ? ((selectedProd.sellingPrice - (Number(item.discount) || 0)) * (Number(item.quantity) || 0)) * (1 + selectedProd.gstRate / 100)
                            : 0;

                          return (
                            <div 
                              key={index} 
                              className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center gap-4"
                            >
                              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                  <Select
                                    label="Item Name"
                                    name={`items.${index}.productId`}
                                    value={item.productId}
                                    onChange={(e) => {
                                      handleChange(e);
                                      // Reset default values
                                      setFieldValue(`items.${index}.quantity`, 1);
                                      setFieldValue(`items.${index}.discount`, 0);
                                    }}
                                    onBlur={handleBlur}
                                    options={products.map(p => ({ value: p._id, label: `${p.name} (SKU: ${p.sku})` }))}
                                    error={touched.items?.[index]?.productId && errors.items?.[index]?.productId}
                                    required
                                  />
                                </div>

                                <TextField
                                  label="Qty"
                                  name={`items.${index}.quantity`}
                                  type="number"
                                  value={item.quantity}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.items?.[index]?.quantity && errors.items?.[index]?.quantity}
                                  required
                                />

                                <TextField
                                  label="Discount/Unit"
                                  name={`items.${index}.discount`}
                                  type="number"
                                  value={item.discount}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched.items?.[index]?.discount && errors.items?.[index]?.discount}
                                />
                              </div>

                              <div className="flex items-center gap-4 w-full md:w-auto self-end md:self-center justify-between md:justify-start pt-2 md:pt-0">
                                <div className="text-right select-none min-w-[80px]">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Line Total</span>
                                  <span className="text-sm font-bold text-slate-900">₹ {lineTotal.toFixed(2)}</span>
                                </div>
                                {values.items.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="text"
                                    onClick={() => remove(index)}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                                    startIcon={<Trash2 className="h-4 w-4" />}
                                  />
                                )}
                              </div>

                              {/* Alert warnings for quantity breaches */}
                              {selectedProd && selectedProd.quantity < item.quantity && (
                                <div className="w-full text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 font-semibold flex items-center gap-2 select-none md:col-span-full">
                                  <AlertTriangle className="h-4 w-4 animate-pulse text-red-500 shrink-0" />
                                  <span>Warning: Stock deficit! Current stock: {selectedProd.quantity} {selectedProd.unit}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <Button
                          type="button"
                          variant="outline"
                          startIcon={<Plus className="h-4 w-4" />}
                          onClick={() => push({ productId: '', quantity: 1, discount: 0 })}
                        >
                          Add Item Row
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </Card>
              </div>

              {/* Right Panel: Invoice calculations summary */}
              <div className="space-y-6">
                <Card title="Summary Panel" subtitle="Recalculated pricing structures">
                  <div className="space-y-3 select-none text-xs border-b border-slate-100 pb-4">
                    <div className="flex justify-between font-semibold text-slate-500">
                      <span>Subtotal (Before Tax)</span>
                      <span>₹ {summary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-500">
                      <span>Discounts Applied</span>
                      <span className="text-emerald-600">- ₹ {summary.discountTotal.toFixed(2)}</span>
                    </div>
                    {summary.cgst > 0 && (
                      <div className="flex justify-between font-medium text-slate-400 pl-2">
                        <span>CGST Split</span>
                        <span>₹ {summary.cgst.toFixed(2)}</span>
                      </div>
                    )}
                    {summary.sgst > 0 && (
                      <div className="flex justify-between font-medium text-slate-400 pl-2">
                        <span>SGST Split</span>
                        <span>₹ {summary.sgst.toFixed(2)}</span>
                      </div>
                    )}
                    {summary.igst > 0 && (
                      <div className="flex justify-between font-medium text-slate-400 pl-2">
                        <span>IGST Split</span>
                        <span>₹ {summary.igst.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-slate-800 text-sm pt-2 border-t border-dashed border-slate-200">
                      <span>Grand Total</span>
                      <span>₹ {summary.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <TextField
                      label="Paid Amount (Cash Collected)"
                      name="paidAmount"
                      type="number"
                      value={values.paidAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.paidAmount && errors.paidAmount}
                      required
                    />

                    <Select
                      label="Payment Channel"
                      name="paymentMethod"
                      value={values.paymentMethod}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      options={[
                        { value: 'CASH', label: 'Cash Payment' },
                        { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                        { value: 'UPI', label: 'UPI QR Payment' },
                        { value: 'CARD', label: 'Credit/Debit Card' },
                        { value: 'CREDIT', label: 'Credit Account (Owed Balance)' },
                      ]}
                      error={touched.paymentMethod && errors.paymentMethod}
                      required
                    />

                    <div className="flex justify-between items-center text-xs bg-slate-50 border border-slate-200 p-3 rounded-xl select-none font-semibold">
                      <span className="text-slate-500">Balance Due:</span>
                      <span className={summary.dueAmount > 0 ? 'text-red-500 font-bold' : 'text-slate-400'}>
                        ₹ {summary.dueAmount.toFixed(2)}
                      </span>
                    </div>

                    <TextField
                      label="Invoicing Remarks"
                      name="notes"
                      value={values.notes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Delivered to site"
                      error={touched.notes && errors.notes}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full py-3 text-sm"
                      loading={isCreating}
                      disabled={values.items.some(item => {
                        const prod = getProductLookup(item.productId);
                        return prod && prod.quantity < item.quantity;
                      })}
                    >
                      Record Sale & Generate Invoice
                    </Button>
                  </div>
                </Card>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SalesForm;
