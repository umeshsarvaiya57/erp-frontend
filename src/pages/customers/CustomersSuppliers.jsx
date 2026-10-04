import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import { Users2, Plus, Phone, Mail, MapPin, Search } from 'lucide-react';
import { useCustomers } from '../../hooks/useCustomers';
import { useSuppliers } from '../../hooks/useSuppliers';
import { customerSchema } from '../../validations/customerValidation';
import { supplierSchema } from '../../validations/supplierValidation';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { TextField } from '../../components/ui/TextField';
import { TextArea } from '../../components/ui/TextArea';
import { Pagination } from '../../components/ui/Pagination';
import { Badge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/SearchInput';

export const CustomersSuppliers = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [custPage, setCustPage] = useState(1);
  const [suppPage, setSuppPage] = useState(1);
  const [custSearch, setCustSearch] = useState('');
  const [suppSearch, setSuppSearch] = useState('');

  // Modals state
  const [isCustModalOpen, setIsCustModalOpen] = useState(false);
  const [isSuppModalOpen, setIsSuppModalOpen] = useState(false);

  // Fetch Customers and Suppliers
  const { 
    customers, 
    pagination: custPagination, 
    isLoading: isCustLoading, 
    createCustomer 
  } = useCustomers({ page: custPage, limit: 10, search: custSearch });

  const { 
    suppliers, 
    pagination: suppPagination, 
    isLoading: isSuppLoading, 
    createSupplier 
  } = useSuppliers({ page: suppPage, limit: 10, search: suppSearch });

  const handleCreateCustomerSubmit = (values, { resetForm }) => {
    createCustomer(values, {
      onSuccess: () => {
        setIsCustModalOpen(false);
        resetForm();
      }
    });
  };

  const handleCreateSupplierSubmit = (values, { resetForm }) => {
    createSupplier(values, {
      onSuccess: () => {
        setIsSuppModalOpen(false);
        resetForm();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap select-none">
        <div className="flex items-center gap-2">
          <Users2 className="h-6 w-6 text-slate-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-none">CRM Contacts</h1>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">Manage accounts and balances</span>
          </div>
        </div>
        <Button
          variant="primary"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={() => activeTab === 'customers' ? setIsCustModalOpen(true) : setIsSuppModalOpen(true)}
        >
          {activeTab === 'customers' ? 'Register Customer' : 'Register Supplier'}
        </Button>
      </div>

      {/* Tabs Switcher */}
      <div className="border-b border-slate-200 select-none">
        <nav className="flex gap-6 -mb-px">
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-4 px-1 text-sm font-semibold border-b-2 transition-all duration-150 ${activeTab === 'customers' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            Customers ({custPagination?.total || 0})
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`pb-4 px-1 text-sm font-semibold border-b-2 transition-all duration-150 ${activeTab === 'suppliers' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            Suppliers ({suppPagination?.total || 0})
          </button>
        </nav>
      </div>

      {activeTab === 'customers' ? (
        <div className="space-y-4">
          <Card className="p-4" bodyClassName="flex items-center">
            <SearchInput
              value={custSearch}
              onChange={(e) => { setCustSearch(e.target.value); setCustPage(1); }}
              placeholder="Search customers..."
            />
          </Card>

          <Table
            headers={['Customer Info', 'Location/State', 'Credit Limit', 'Balance Owed', 'Joined Date']}
            loading={isCustLoading}
          >
            {customers.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-sm leading-snug">{c.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-0.5"><Phone className="h-3 w-3" /> {c.mobile}</span>
                      {c.email && <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5"><Mail className="h-3 w-3" /> {c.email}</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600 text-sm">
                  {c.city ? `${c.city}, ${c.state || ''}` : c.state || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-700">
                  ₹ {c.creditLimit ? c.creditLimit.toFixed(2) : '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={c.balance > 0 ? 'danger' : 'neutral'}>
                    ₹ {c.balance.toFixed(2)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {customers.length === 0 && !isCustLoading && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                  No customers found. Click "Register Customer" to add one.
                </td>
              </tr>
            )}
          </Table>

          <Pagination
            page={custPage}
            totalPages={custPagination?.totalPages || 1}
            onPageChange={(p) => setCustPage(p)}
            limit={10}
            total={custPagination?.total || 0}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="p-4" bodyClassName="flex items-center">
            <SearchInput
              value={suppSearch}
              onChange={(e) => { setSuppSearch(e.target.value); setSuppPage(1); }}
              placeholder="Search suppliers..."
            />
          </Card>

          <Table
            headers={['Supplier Details', 'GST / PAN Code', 'Balance Owed to Them', 'Joined Date']}
            loading={isSuppLoading}
          >
            {suppliers.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-sm leading-snug">{s.name}</span>
                    {s.companyName && <span className="text-xs text-slate-500 font-medium">{s.companyName}</span>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-0.5"><Phone className="h-3 w-3" /> {s.mobile}</span>
                      {s.email && <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5"><Mail className="h-3 w-3" /> {s.email}</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-500 text-xs">
                  <div className="flex flex-col">
                    {s.gstNumber && <span>GSTIN: {s.gstNumber}</span>}
                    {s.panNumber && <span>PAN: {s.panNumber}</span>}
                    {!s.gstNumber && !s.panNumber && '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={s.balance > 0 ? 'warning' : 'neutral'}>
                    ₹ {s.balance.toFixed(2)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && !isSuppLoading && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">
                  No suppliers found. Click "Register Supplier" to add one.
                </td>
              </tr>
            )}
          </Table>

          <Pagination
            page={suppPage}
            totalPages={suppPagination?.totalPages || 1}
            onPageChange={(p) => setSuppPage(p)}
            limit={10}
            total={suppPagination?.total || 0}
          />
        </div>
      )}

      {/* Customer Registration Modal */}
      <Modal
        isOpen={isCustModalOpen}
        onClose={() => setIsCustModalOpen(false)}
        title="Register Customer"
        size="lg"
      >
        <Formik
          initialValues={{
            name: '', mobile: '', email: '', address: '', 
            city: '', state: '', pincode: '', gstNumber: '', 
            panNumber: '', creditLimit: 0, openingBalance: 0, notes: ''
          }}
          validationSchema={customerSchema}
          onSubmit={handleCreateCustomerSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Customer Full Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Ramesh Kumar"
                  error={touched.name && errors.name}
                  required
                />
                <TextField
                  label="Mobile Number"
                  name="mobile"
                  value={values.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="10-digit number"
                  error={touched.mobile && errors.mobile}
                  required
                />
                {/* <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="name@mail.com"
                  error={touched.email && errors.email}
                />
                <TextField
                  label="Pincode"
                  name="pincode"
                  value={values.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="6-digit pincode"
                  error={touched.pincode && errors.pincode}
                /> */}
                <TextField
                  label="City"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="City"
                  error={touched.city && errors.city}
                />
                {/* <TextField
                  label="State"
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="State (e.g. Maharashtra)"
                  error={touched.state && errors.state}
                />
                <TextField
                  label="GSTIN Number"
                  name="gstNumber"
                  value={values.gstNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="15-digit GSTIN"
                  error={touched.gstNumber && errors.gstNumber}
                />
                <TextField
                  label="PAN Number"
                  name="panNumber"
                  value={values.panNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="10-digit PAN"
                  error={touched.panNumber && errors.panNumber}
                />
                <TextField
                  label="Credit Limit (₹)"
                  name="creditLimit"
                  type="number"
                  value={values.creditLimit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0.00"
                  error={touched.creditLimit && errors.creditLimit}
                />
                <TextField
                  label="Opening Owed Balance (₹)"
                  name="openingBalance"
                  type="number"
                  value={values.openingBalance}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0.00"
                  error={touched.openingBalance && errors.openingBalance}
                />
                <div className="md:col-span-2">
                  <TextArea
                    label="Notes"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Customer specs, credit history notes..."
                    error={touched.notes && errors.notes}
                  />
                </div> */}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <Button variant="outline" onClick={() => setIsCustModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Register Customer</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Supplier Registration Modal */}
      <Modal
        isOpen={isSuppModalOpen}
        onClose={() => setIsSuppModalOpen(false)}
        title="Register Supplier"
        size="lg"
      >
        <Formik
          initialValues={{
            name: '', companyName: '', mobile: '', email: '', 
            address: '', gstNumber: '', panNumber: '', openingBalance: 0, notes: ''
          }}
          validationSchema={supplierSchema}
          onSubmit={handleCreateSupplierSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField
                  label="Supplier Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Amit Traders"
                  error={touched.name && errors.name}
                  required
                />
                <TextField
                  label="Company Name"
                  name="companyName"
                  value={values.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Company official name"
                  error={touched.companyName && errors.companyName}
                />
                <TextField
                  label="Mobile Number"
                  name="mobile"
                  value={values.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="10-digit number"
                  error={touched.mobile && errors.mobile}
                  required
                />
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="supplier@mail.com"
                  error={touched.email && errors.email}
                />
                <TextField
                  label="GSTIN Number"
                  name="gstNumber"
                  value={values.gstNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="15-digit GSTIN"
                  error={touched.gstNumber && errors.gstNumber}
                />
                <TextField
                  label="PAN Number"
                  name="panNumber"
                  value={values.panNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="10-digit PAN"
                  error={touched.panNumber && errors.panNumber}
                />
                <TextField
                  label="Opening Due Balance (₹)"
                  name="openingBalance"
                  type="number"
                  value={values.openingBalance}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0.00"
                  error={touched.openingBalance && errors.openingBalance}
                />
                <div className="md:col-span-2">
                  <TextField
                    label="Address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Supplier headquarters street"
                    error={touched.address && errors.address}
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Notes"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Supplier specifications, pricing contracts..."
                    error={touched.notes && errors.notes}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <Button variant="outline" onClick={() => setIsSuppModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Register Supplier</Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default CustomersSuppliers;
