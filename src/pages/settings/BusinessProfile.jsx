import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Settings, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBusiness } from '../../hooks/useBusiness';
import { businessSetupSchema as businessSchema } from '../../validations/businessValidation';
import { Card } from '../../components/ui/Card';
import { TextField } from '../../components/ui/TextField';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';

export const BusinessProfile = () => {
  const { user } = useAuth();
  const { business, updateBusiness, isUpdating } = useBusiness();
  
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  // Sync logo preview state whenever the business query loads
  useEffect(() => {
    if (business?.logo) {
      setLogoPreview(
        business.logo.startsWith('/') 
          ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${business.logo}` 
          : business.logo
      );
    }
  }, [business]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // Generate a temporary local URL for visual preview
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (values) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('address', values.address);
    formData.append('gstNumber', values.gstNumber || '');
    formData.append('invoicePrefix', values.invoicePrefix || 'INV');
    
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    updateBusiness(formData, {
      onSuccess: () => {
        // Clear local file state after success
        setLogoFile(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 select-none">
        <Settings className="h-6 w-6 text-slate-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-none">Shop Configuration</h1>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">Configure invoicing prefix and details</span>
        </div>
      </div>

      <Formik
        initialValues={{
          name: business?.name || '',
          address: business?.address || '',
          gstNumber: business?.gstNumber || '',
          invoicePrefix: business?.invoicePrefix || 'INV',
        }}
        enableReinitialize
        validationSchema={businessSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card title="Business Info" subtitle="Official contact card information">
                <div className="space-y-4">
                  <TextField
                    label="Business Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && errors.name}
                    required
                  />

                  <TextArea
                    label="Business Address (Displayed on printed invoices)"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address && errors.address}
                    rows={4}
                    required
                  />
                </div>
              </Card>

              <Card title="Billing Settings" subtitle="Configure defaults for tax billing receipts">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    label="Shop GSTIN Code"
                    name="gstNumber"
                    value={values.gstNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="15-digit code"
                    error={touched.gstNumber && errors.gstNumber}
                  />

                  <TextField
                    label="Invoice Prefix"
                    name="invoicePrefix"
                    value={values.invoicePrefix}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="INV"
                    error={touched.invoicePrefix && errors.invoicePrefix}
                    required
                  />
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card title="Logo Branding" subtitle="Logo appears on invoices header">
                <div className="space-y-4 text-center select-none">
                  <div className="h-32 w-full border border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 relative overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="business preview logo" className="h-full w-full object-contain p-2" />
                    ) : (
                      <Sparkles className="h-10 w-10 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <label className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-colors border border-slate-200">
                      Upload New Logo Image
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                    </label>
                  </div>
                </div>
              </Card>

              {user?.role === 'OWNER' ? (
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-3 text-sm"
                  loading={isUpdating}
                >
                  Save Settings
                </Button>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2 select-none">
                  <ShieldCheck className="h-4 w-4 text-red-500 shrink-0" />
                  <span>Only the business OWNER is permitted to modify configurations.</span>
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BusinessProfile;
