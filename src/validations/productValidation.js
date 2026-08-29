import * as Yup from 'yup';

export const productSchema = Yup.object().shape({
  name: Yup.string()
    .required('Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  sku: Yup.string()
    .required('SKU code is required')
    .max(50, 'SKU must be less than 50 characters'),
  barcode: Yup.string()
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
  categoryId: Yup.string()
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
  brandId: Yup.string()
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
  unit: Yup.string()
    .required('Unit of measurement is required')
    .default('PCS'),
  purchasePrice: Yup.number()
    .min(0, 'Purchase price cannot be negative')
    .required('Purchase price is required'),
  sellingPrice: Yup.number()
    .min(0, 'Selling price cannot be negative')
    .required('Selling price is required'),
  mrp: Yup.number()
    .min(0, 'MRP cannot be negative')
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
  gstRate: Yup.number()
    .min(0, 'GST rate cannot be negative')
    .max(100, 'GST rate cannot exceed 100%')
    .required('GST rate is required'),
  quantity: Yup.number()
    .min(0, 'Opening quantity cannot be negative')
    .default(0),
  minimumStock: Yup.number()
    .min(0, 'Minimum stock cannot be negative')
    .default(0),
  description: Yup.string()
    .max(500, 'Description must be less than 500 characters')
    .nullable()
    .transform((curr, orig) => orig === '' ? null : curr),
});

export default productSchema;
