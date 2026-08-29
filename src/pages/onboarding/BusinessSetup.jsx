import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { Upload, Briefcase, MapPin, Settings2, FileText, Globe } from 'lucide-react';
import { businessSetupSchema } from '../../validations/businessValidation';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { Select } from '../../components/ui/Select';
import { TextArea } from '../../components/ui/TextArea';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Label } from '../../components/ui/Label';
import { useBusiness } from '../../hooks/useBusiness';
import { useAuth } from '../../hooks/useAuth';

export const BusinessSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { business, updateBusiness, isUpdating, uploadLogo, isUploadingLogo } = useBusiness();
  const fileInputRef = useRef();

  const initialValues = {
    name: business?.name || '',
    businessType: business?.businessType || '',
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
    description: business?.description || '',
    logo: business?.logo || '',
  };

  const handleLogoUpload = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('logo', file);
      uploadLogo(formData, {
        onSuccess: (response) => {
          setFieldValue('logo', response.data.logo);
        },
      });
    }
  };

  const handleSubmit = (values) => {
    updateBusiness(values, {
      onSuccess: () => {
        navigate('/dashboard', { replace: true });
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Configure Your Shop/Business Setup
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Provide company details to launch your custom tenant environment
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={businessSetupSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Form className="space-y-8">
              {/* Logo Upload Card */}
              <Card title="Business Logo" subtitle="Upload your company or shop logo">
                <div className="flex items-center gap-6 flex-wrap">
                  <Avatar
                    src={values.logo ? (values.logo.startsWith('/') ? `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}${values.logo}` : values.logo) : ''}
                    name={values.name || 'Business'}
                    size="xl"
                  />
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleLogoUpload(e, setFieldValue)}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      startIcon={<Upload className="h-4 w-4" />}
                      loading={isUploadingLogo}
                      onClick={() => fileInputRef.current.click()}
                    >
                      Choose Image
                    </Button>
                    <span className="text-xs text-slate-400 font-medium">
                      Supports JPG, PNG, WEBP. Max size 5MB.
                    </span>
                  </div>
                </div>
              </Card>

              {/* General details */}
              <Card title="General Profile" subtitle="Basic company description & type" extra={<Briefcase className="h-5 w-5 text-slate-400" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    label="Business Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Shree Mobile Shop"
                    error={touched.name && errors.name}
                    required
                  />

                  <Select
                    label="Business Type"
                    name="businessType"
                    value={values.businessType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={[
                      { value: 'retail', label: 'Retail Shop' },
                      { value: 'wholesale', label: 'Wholesale' },
                      { value: 'manufacturing', label: 'Manufacturing' },
                      { value: 'services', label: 'Service Provider' },
                      { value: 'electronics', label: 'Electronics & Mobiles' },
                      { value: 'furniture', label: 'Furniture' },
                      { value: 'other', label: 'Other' },
                    ]}
                    error={touched.businessType && errors.businessType}
                    required
                  />

                  <div className="md:col-span-2">
                    <TextArea
                      label="Business Description"
                      name="description"
                      value={values.description || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Briefly describe your company..."
                      error={touched.description && errors.description}
                    />
                  </div>
                </div>
              </Card>

              {/* Contact and address */}
              <Card title="Contact & Address" subtitle="Where can your customers reach you?" extra={<MapPin className="h-5 w-5 text-slate-400" />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    label="Contact Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="contact@shop.com"
                    error={touched.email && errors.email}
                    required
                  />

                  <TextField
                    label="Website URL"
                    name="website"
                    value={values.website || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="https://myshop.com"
                    error={touched.website && errors.website}
                  />

                  <div className="md:col-span-3">
                    <TextField
                      label="Street Address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Shop No, Building, Street Address"
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
                    placeholder="State"
                    error={touched.state && errors.state}
                    required
                  />

                  <TextField
                    label="Pincode"
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

              {/* Settings, Tax & Invoicing */}
              <Card title="Billing & Tax Settings" subtitle="Configure tax registration and defaults" extra={<Settings2 className="h-5 w-5 text-slate-400" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextField
                    label="GST Number (GSTIN)"
                    name="gstNumber"
                    value={values.gstNumber || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="15-digit GSTIN"
                    error={touched.gstNumber && errors.gstNumber}
                  />

                  <TextField
                    label="PAN Number"
                    name="panNumber"
                    value={values.panNumber || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="10-digit PAN"
                    error={touched.panNumber && errors.panNumber}
                  />

                  <TextField
                    label="Invoice Number Prefix"
                    name="invoicePrefix"
                    value={values.invoicePrefix}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="INV"
                    error={touched.invoicePrefix && errors.invoicePrefix}
                    required
                  />

                  <Select
                    label="Currency"
                    name="currency"
                    value={values.currency}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={[
                      { value: 'INR', label: 'INR (₹)' },
                      { value: 'USD', label: 'USD ($)' },
                      { value: 'EUR', label: 'EUR (€)' },
                    ]}
                    error={touched.currency && errors.currency}
                    required
                  />

                  <Select
                    label="Timezone"
                    name="timezone"
                    value={values.timezone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={[
                      { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
                      { value: 'UTC', label: 'UTC' },
                      { value: 'America/New_York', label: 'America/New_York (EST)' },
                    ]}
                    error={touched.timezone && errors.timezone}
                    required
                  />
                </div>
              </Card>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-4 shrink-0">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isUpdating}
                >
                  Complete Setup & Launch Dashboard
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BusinessSetup;
