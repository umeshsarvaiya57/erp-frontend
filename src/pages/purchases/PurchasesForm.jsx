import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Formik, Form, FieldArray } from 'formik';
import { ShoppingCart, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { purchaseSchema } from '../../validations/purchaseValidation';
import { usePurchases } from '../../hooks/usePurchases';
import { useProducts } from '../../hooks/useProducts';
import { useSuppliers } from '../../hooks/useSuppliers';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';

export const PurchasesForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Selectors listings queries
  const { products } = useProducts({ limit: 100 });
  const { suppliers } = useSuppliers({ limit: 100 });
  const { createPurchase, isCreating } = usePurchases();

  const handleFormSubmit = (values) => {
    createPurchase(values, {
      onSuccess: () => {
        navigate('/purchases');
      },
    });
  };

  const getProductLookup = (productId) => {
    return products.find(p => p._id === productId);
  };

  const getSupplierLookup = (supplierId) => {
    return suppliers.find(s => s._id === supplierId);
  };

  // Recalculates all subtotal, discount, GST taxes dynamically in the frontend layout
  const calculatePurchaseSummary = (values) => {
    let subtotal = 0;
    let discountTotal = 0;
    let gstTotal = 0;

    values.items.forEach(item => {
      const prod = getProductLookup(item.productId);
      if (prod) {
        const rate = prod.purchasePrice; // authoritative PO cost
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

    const supp = getSupplierLookup(values.supplierId);
    const isInterState = supp?.state && user?.business?.state && 
      supp.state.trim().toLowerCase() !== user.business.state.trim().toLowerCase();

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
          onClick={() => navigate('/purchases')}
          startIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-slate-500" />
          <h1 className="text-2xl font-bold text-slate-900 leading-none">New Purchase Order</h1>
        </div>
      </div>

      <Formik
        initialValues={{
          supplierId: '',
          items: [{ productId: '', quantity: 1, discount: 0 }],
          paidAmount: 0,
          paymentMethod: 'CASH',
          notes: '',
        }}
        validationSchema={purchaseSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
          const summary = calculatePurchaseSummary(values);

          return (
            <Form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Vendor info and items list */}
              <div className="lg:col-span-2 space-y-6">
                <Card title="Supplier Details" subtitle="Identify the vendor supplier">
                  <Select
                    label="Select Supplier Account"
                    name="supplierId"
                    value={values.supplierId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={suppliers.map(s => ({ value: s._id, label: s.name }))}
                    error={touched.supplierId && errors.supplierId}
                    required
                  />
                </Card>

                {/* Items selection FieldArray */}
                <Card title="Purchase Items List" subtitle="Add items and supply cost values">
                  <FieldArray name="items">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.items.map((item, index) => {
                          const selectedProd = getProductLookup(item.productId);
                          const lineTotal = selectedProd 
                            ? ((selectedProd.purchasePrice - (Number(item.discount) || 0)) * (Number(item.quantity) || 0)) * (1 + selectedProd.gstRate / 100)
                            : 0;

                          return (
                            <div 
                              key={index} 
                              className="p-4 border border-slate-200 rounded-xl bg-slate-50/55 flex flex-col md:flex-row items-start md:items-center gap-4"
                            >
                              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                  <Select
                                    label="Item Name"
                                    name={`items.${index}.productId`}
                                    value={item.productId}
                                    onChange={(e) => {
                                      handleChange(e);
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

              {/* Right Column: Invoicing totals summaries */}
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
                      label="Paid Amount (Cash Sent)"
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
                      label="PO Remarks"
                      name="notes"
                      value={values.notes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Received shipment"
                      error={touched.notes && errors.notes}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full py-3 text-sm"
                      loading={isCreating}
                    >
                      Record Purchase Order
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

export default PurchasesForm;
