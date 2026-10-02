import * as Yup from 'yup';

// GSTIN Regex: 2 digits + 5 chars + 4 digits + 1 char + 1 entity code + 'Z' + 1 check digit
const gstinRegex = /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}[Zz][0-9A-Za-z]{1}$/;
const panRegex = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;

export const businessSetupSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('Business name is required')
    .max(100, 'Business name must be less than 100 characters'),
  businessType: Yup.string()
    .required('Business type is required'),
  mobile: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, 'Mobile must be a 10 digit number')
    .required('Mobile number is required'),
  email: Yup.string()
    .trim()
    .email('Invalid email address')
    .required('Email is required'),
  website: Yup.string()
    .trim()
    .url('Invalid URL format (must include http:// or https://)')
    .nullable()
    .transform((curr, orig) => (!orig || orig.trim() === '' ? null : curr)),
  address: Yup.string()
    .trim()
    .required('Address is required'),
  city: Yup.string()
    .trim()
    .required('City is required'),
  state: Yup.string()
    .trim()
    .required('State is required'),
  country: Yup.string()
    .trim()
    .required('Country is required'),
  pincode: Yup.string()
    .trim()
    .matches(/^[0-9]{6}$/, 'Pincode must be a 6 digit number')
    .required('Pincode is required'),
  gstNumber: Yup.string()
    .trim()
    .test('valid-gstin', 'Invalid GSTIN format (e.g. 27AAAAA0000A1Z5)', function (value) {
      if (!value || value.trim() === '') return true;
      return gstinRegex.test(value.trim());
    })
    .nullable()
    .transform((curr, orig) => (!orig || orig.trim() === '' ? null : curr?.toUpperCase())),
  panNumber: Yup.string()
    .trim()
    .test('valid-pan', 'Invalid PAN format (e.g. ABCDE1234F)', function (value) {
      if (!value || value.trim() === '') return true;
      return panRegex.test(value.trim());
    })
    .nullable()
    .transform((curr, orig) => (!orig || orig.trim() === '' ? null : curr?.toUpperCase())),
  invoicePrefix: Yup.string()
    .trim()
    .max(10, 'Prefix must be less than 10 characters')
    .required('Invoice prefix is required'),
  currency: Yup.string()
    .required('Currency is required'),
  timezone: Yup.string()
    .required('Timezone is required'),
  description: Yup.string()
    .trim()
    .max(500, 'Description must be less than 500 characters')
    .nullable()
    .transform((curr, orig) => (!orig || orig.trim() === '' ? null : curr)),
});

export const businessProfileSchema = businessSetupSchema;

