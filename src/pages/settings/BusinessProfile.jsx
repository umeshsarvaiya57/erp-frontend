import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import { 
  Building2, 
  MapPin, 
  Receipt, 
  Upload, 
  Sparkles, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useBusiness } from '../../hooks/useBusiness';
import { businessProfileSchema } from '../../validations/businessValidation';
import { Card } from '../../components/ui/Card';
import { TextField } from '../../components/ui/TextField';
import { Select } from '../../components/ui/Select';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/toast/toastService';

export const BusinessProfile = () => {
  const { user } = useAuth();
  const { business, updateBusiness, isUpdating, isLoading } = useBusiness();
  const fileInputRef = useRef(null);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  // Synchronize logo preview state from active business query
  useEffect(() => {
    if (business?.logo) {
      setLogoPreview(
        business.logo.startsWith('/')
          ? `${import.meta.env.VITE_BACKEND_URL}${business.logo}`
          : business.logo
      );
    } else {
      setLogoPreview('');
    }
  }, [business?.logo]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file size must be less than 5MB');
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      toast.info('New logo selected. Click "Save Settings" to apply.');
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const initialValues = {
    name: business?.name || '',
    businessType: business?.businessType || 'retail',
    description: business?.description || '',
    mobile: business?.mobile || user?.mobile || '',
    email: business?.email || user?.email || '',
    website: business?.website || '',
    address: business?.address || '',
    city: business?.city || '',
    state: business?.state || '',
    country: business?.country || 'India',
    pincode: business?.pincode || '',
    gstNumber: business?.gstNumber || '',
    panNumber: business?.panNumber || '',
    invoicePrefix: business?.invoicePrefix || 'INV',
    currency: business?.currency || 'INR',
    timezone: business?.timezone || 'Asia/Kolkata',
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      
      // Append all form values
      Object.keys(values).forEach((key) => {
        const val = values[key];
        if (val !== undefined && val !== null) {
          const stringVal = typeof val === 'string' ? val.trim() : val;
          // Capitalize GST and PAN for consistency
          if (key === 'gstNumber' || key === 'panNumber') {
            formData.append(key, typeof stringVal === 'string' ? stringVal.toUpperCase() : stringVal);
          } else {
            formData.append(key, stringVal);
          }
        }
      });

      // Append logo if newly selected
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      updateBusiness(formData, {
        onSuccess: () => {
          setLogoFile(null);
          setSubmitting(false);
        },
        onError: () => {
          setSubmitting(false);
        }
      });
    } catch (err) {
      setSubmitting(false);
      toast.error(err.message || 'An unexpected error occurred while saving.');
    }
  };

  const isOwner = user?.role === 'OWNER' || user?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-2xl">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              Business Setup & Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Manage your company identity, contact information, GSTIN tax details, and billing preferences
            </p>
          </div>
        </div>

        {business?.profileCompleted && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Profile Active & Verified</span>
          </div>
        )}
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={businessProfileSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
          <Form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left & Middle Column (2 cols): General & Contact & Tax */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* General Business Information */}
              <Card 
                title="Business Profile" 
                subtitle="Company name, category, and public description"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <TextField
                      label="Business Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. Apex Electronics & Retail"
                      error={touched.name && errors.name}
                      required
                    />
                  </div>

                  <Select
                    label="Business Type"
                    name="businessType"
                    value={values.businessType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={[
                      { value: 'retail', label: 'Retail Store / Shop' },
                      { value: 'wholesale', label: 'Wholesale & Distribution' },
                      { value: 'manufacturing', label: 'Manufacturing & Production' },
                      { value: 'services', label: 'Services Provider' },
                      { value: 'electronics', label: 'Electronics & Mobiles' },
                      { value: 'furniture', label: 'Furniture & Hardware' },
                      { value: 'other', label: 'Other Business' },
                    ]}
                    error={touched.businessType && errors.businessType}
                    required
                  />

                  <TextField
                    label="Website URL (Optional)"
                    name="website"
                    value={values.website || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="https://mybusiness.com"
                    error={touched.website && errors.website}
                  />

                  <div className="md:col-span-2">
                    <TextArea
                      label="Business Description"
                      name="description"
                      value={values.description || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Short summary about your business, products or services..."
                      error={touched.description && errors.description}
                      rows={3}
                    />
                  </div>
                </div>
              </Card>

              {/* Contact & Address */}
              <Card 
                title="Contact & Location" 
                subtitle="Registered business address and communication details"
                extra={<MapPin className="h-4 w-4 text-slate-400" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <TextField
                    label="Mobile Number"
                    name="mobile"
                    value={values.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="10-digit mobile number"
                    error={touched.mobile && errors.mobile}
                    required
                  />

                  <TextField
                    label="Business Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="contact@business.com"
                    error={touched.email && errors.email}
                    required
                  />

                  <div className="md:col-span-2">
                    <TextField
                      label="Street Address (Printed on invoices)"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Shop/Office No, Building, Road, Area"
                      error={touched.address && errors.address}
                      required
                    />
                  </div>

                  <TextField
                    label="City"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="City"
                    error={touched.city && errors.city}
                    required
                  />

                  <TextField
                    label="State"
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="State / Province"
                    error={touched.state && errors.state}
                    required
                  />

                  <TextField
                    label="Country"
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Country"
                    error={touched.country && errors.country}
                    required
                  />

                  <TextField
                    label="Pincode / Postal Code"
                    name="pincode"
                    value={values.pincode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="6-digit pincode"
                    error={touched.pincode && errors.pincode}
                    required
                  />
                </div>
              </Card>

              {/* Tax & Invoicing Configuration */}
              <Card 
                title="Tax & Invoice Settings" 
                subtitle="GSTIN registration, invoice numbering prefix, and defaults"
                extra={<Receipt className="h-4 w-4 text-slate-400" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <TextField
                    label="Shop GST Number (GSTIN)"
                    name="gstNumber"
                    value={values.gstNumber || ''}
                    onChange={(e) => {
                      const upper = e.target.value.toUpperCase().replace(/\s/g, '');
                      setFieldValue('gstNumber', upper);
                    }}
                    onBlur={handleBlur}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    error={touched.gstNumber && errors.gstNumber}
                  />

                  <TextField
                    label="PAN Number"
                    name="panNumber"
                    value={values.panNumber || ''}
                    onChange={(e) => {
                      const upper = e.target.value.toUpperCase().replace(/\s/g, '');
                      setFieldValue('panNumber', upper);
                    }}
                    onBlur={handleBlur}
                    placeholder="e.g. ABCDE1234F"
                    error={touched.panNumber && errors.panNumber}
                  />

                  <TextField
                    label="Invoice Number Prefix"
                    name="invoicePrefix"
                    value={values.invoicePrefix}
                    onChange={(e) => setFieldValue('invoicePrefix', e.target.value.toUpperCase())}
                    onBlur={handleBlur}
                    placeholder="INV"
                    error={touched.invoicePrefix && errors.invoicePrefix}
                    required
                  />

                  <Select
                    label="Default Currency"
                    name="currency"
                    value={values.currency}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={[
                      { value: 'INR', label: 'INR (₹ - Indian Rupee)' },
                      { value: 'USD', label: 'USD ($ - US Dollar)' },
                      { value: 'EUR', label: 'EUR (€ - Euro)' },
                      { value: 'GBP', label: 'GBP (£ - British Pound)' },
                      { value: 'AED', label: 'AED (د.إ - UAE Dirham)' },
                    ]}
                    error={touched.currency && errors.currency}
                    required
                  />

                  <Select
                    label="Business Timezone"
                    name="timezone"
                    value={values.timezone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={[
                      { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST +5:30)' },
                      { value: 'UTC', label: 'UTC (+0:00)' },
                      { value: 'Asia/Dubai', label: 'Asia/Dubai (GST +4:00)' },
                      { value: 'America/New_York', label: 'America/New_York (EST -5:00)' },
                      { value: 'Europe/London', label: 'Europe/London (GMT +0:00)' },
                    ]}
                    error={touched.timezone && errors.timezone}
                    required
                  />
                </div>
              </Card>

            </div>

            {/* Right Column (1 col): Logo Branding & Action Box */}
            <div className="space-y-6">
              
              {/* Logo Card */}
              <Card title="Business Logo" subtitle="Appears on bills, receipts and navbar">
                <div className="space-y-4 text-center select-none">
                  <div className="h-36 w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 relative overflow-hidden group">
                    {logoPreview ? (
                      <>
                        <img 
                          src={logoPreview} 
                          alt="Business Logo Preview" 
                          className="h-full w-full object-contain p-3 transition-transform group-hover:scale-105 duration-200" 
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-xl shadow-md hover:bg-rose-600 transition-colors opacity-90 hover:opacity-100"
                          title="Remove logo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Sparkles className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                        <span className="text-xs font-medium text-slate-400">No logo uploaded yet</span>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleLogoChange}
                  />

                  <div className="flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      startIcon={<Upload className="h-4 w-4" />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Recommended PNG or JPG, max 5MB
                  </p>
                </div>
              </Card>

              {/* Action Box */}
              <div className="sticky top-6 space-y-4">
                {isOwner ? (
                  <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-xs">
                      <ShieldCheck className="h-4 w-4 text-primary-500" />
                      <span>Owner Access Privileges</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Changes will be reflected immediately on your invoices, GST reports, and workspace header.
                    </p>

                    {/* Show form errors if submit was blocked */}
                    {Object.keys(errors).length > 0 && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block mb-1">Please fix the following:</span>
                          <ul className="list-disc pl-4 space-y-0.5">
                            {Object.entries(errors).map(([field, err]) => (
                              <li key={field}>{err}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full py-3 text-sm font-bold shadow-md shadow-primary-500/20"
                      loading={isUpdating || isSubmitting}
                      disabled={isUpdating || isSubmitting}
                    >
                      Save Settings
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-semibold flex items-center gap-3 select-none">
                    <ShieldCheck className="h-5 w-5 text-rose-500 shrink-0" />
                    <span>Only the Business OWNER is permitted to modify organization settings.</span>
                  </div>
                )}
              </div>

            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BusinessProfile;

