import * as Yup from 'yup';

const saleItemSchema = Yup.object().shape({
  productId: Yup.string().required('Product is required'),
  quantity: Yup.number()
    .integer('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .required('Quantity is required'),
  discount: Yup.number()
    .min(0, 'Discount cannot be negative')
    .default(0),
});

export const saleSchema = Yup.object().shape({
  customerId: Yup.string().required('Customer is required'),
  items: Yup.array()
    .of(saleItemSchema)
    .min(1, 'Sale must contain at least one item')
    .required('Items are required'),
  paidAmount: Yup.number()
    .min(0, 'Paid amount cannot be negative')
    .default(0),
  paymentMethod: Yup.string().required('Payment method is required'),
  notes: Yup.string().max(200, 'Max 200 characters').nullable(),
});

export default saleSchema;
