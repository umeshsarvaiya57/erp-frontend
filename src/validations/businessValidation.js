import * as Yup from 'yup';

export const businessSetupSchema = Yup.object().shape({
  name: Yup.string()
    .required('Business name is required')
    .max(100, 'Business name must be less than 100 characters'),
  businessType: Yup.string()
    .required('Business type is required'),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile must be a 10 digit number')
    .required('Mobile number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  website: Yup.string()
    .url('Invalid URL format (include http:// or https://)')
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
  address: Yup.string()
    .required('Address is required'),
  city: Yup.string()
    .required('City is required'),
  state: Yup.string()
    .required('State is required'),
  country: Yup.string()
    .required('Country is required'),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, 'Pincode must be a 6 digit number')
    .required('Pincode is required'),
  gstNumber: Yup.string()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format (e.g. 22AAAAA1111A1Z1)')
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
  panNumber: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g. ABCDE1234F)')
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
  invoicePrefix: Yup.string()
    .max(10, 'Prefix must be less than 10 characters')
    .required('Invoice prefix is required'),
  currency: Yup.string()
    .required('Currency is required'),
  timezone: Yup.string()
    .required('Timezone is required'),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters')
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
});
