import * as Yup from 'yup';

export const customerSchema = Yup.object().shape({
  name: Yup.string()
    .required('Customer name is required')
    .max(50, 'Name must be less than 50 characters'),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Mobile must be a 10 digit number')
    .required('Mobile number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
  address: Yup.string()
    .max(150, 'Address must be less than 150 characters')
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
  city: Yup.string().nullable().transform((curr, orig) => orig === '' ? null : curr),
  state: Yup.string().nullable().transform((curr, orig) => orig === '' ? null : curr),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, 'Pincode must be a 6 digit number')
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
  gstNumber: Yup.string()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format')
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
  panNumber: Yup.string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
  creditLimit: Yup.number()
    .min(0, 'Credit limit cannot be negative')
    .default(0),
  openingBalance: Yup.number()
    .default(0),
  notes: Yup.string()
    .max(200, 'Notes must be less than 200 characters')
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
});

export default customerSchema;
