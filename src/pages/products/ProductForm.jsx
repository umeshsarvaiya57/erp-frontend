import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import { Package, ArrowLeft } from 'lucide-react';
import { productSchema } from '../../validations/productValidation';
import { useProducts, useProduct } from '../../hooks/useProducts';
import { categoryApi } from '../../api/categoryApi';
import { brandApi } from '../../api/brandApi';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/TextField';
import { Select } from '../../components/ui/Select';
import { TextArea } from '../../components/ui/TextArea';
import { Card } from '../../components/ui/Card';
import { Loader } from '../../components/ui/Loader';
import { toast } from '../../components/ui/toast/toastService';

export const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // 1. Fetch Categories and Brands lists
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories(),
    select: (res) => res.data,
  });

  const brandsQuery = useQuery({
    queryKey: ['brands'],
    queryFn: () => brandApi.getBrands(),
    select: (res) => res.data,
  });

  // 2. Fetch Product if Edit Mode
  const { product, isLoading: isProductLoading } = useProduct(id);

  // 3. Mutation handlers
  const { createProduct, isCreating, updateProduct, isUpdating } = useProducts();

  const initialValues = {
    name: product?.name || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    categoryId: product?.categoryId?._id || '',
    brandId: product?.brandId?._id || '',
    unit: product?.unit || 'PCS',
    purchasePrice: product?.purchasePrice || '',
    sellingPrice: product?.sellingPrice || '',
    mrp: product?.mrp || '',
    gstRate: product?.gstRate || 0,
    quantity: product?.quantity || 0,
    minimumStock: product?.minimumStock || 0,
    description: product?.description || '',
  };

  const handleSubmit = (values) => {
    if (isEdit) {
      updateProduct(
        { id, data: values },
        {
          onSuccess: () => {
            navigate('/products');
          },
        }
      );
    } else {
      createProduct(values, {
        onSuccess: () => {
          navigate('/products');
        },
      });
    }
  };

  if (isEdit && isProductLoading) {
    return <Loader fullscreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 select-none">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/products')}
          startIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-slate-500" />
          <h1 className="text-2xl font-bold text-slate-900 leading-none">
            {isEdit ? 'Modify Product Details' : 'Register New Product'}
          </h1>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={productSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: General Specifications */}
            <div className="lg:col-span-2 space-y-6">
              <Card title="Item Information" subtitle="Describe the catalog item and categories">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <TextField
                      label="Product Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g. iPhone 15 Pro Max"
                      error={touched.name && errors.name}
                      required
                    />
                  </div>

                  <TextField
                    label="SKU Code"
                    name="sku"
                    value={values.sku}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. AP-IP15PM-256"
                    error={touched.sku && errors.sku}
                    required
                  />

                  <TextField
                    label="Barcode / UPC"
                    name="barcode"
                    value={values.barcode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Scan or enter barcode"
                    error={touched.barcode && errors.barcode}
                  />

                  <Select
                    label="Product Category"
                    name="categoryId"
                    value={values.categoryId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={categoriesQuery.data?.map(c => ({ value: c._id, label: c.name })) || []}
                    error={touched.categoryId && errors.categoryId}
                  />

                  <Select
                    label="Product Brand"
                    name="brandId"
                    value={values.brandId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={brandsQuery.data?.map(b => ({ value: b._id, label: b.name })) || []}
                    error={touched.brandId && errors.brandId}
                  />

                  <TextField
                    label="Unit of Measurement"
                    name="unit"
                    value={values.unit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="PCS"
                    error={touched.unit && errors.unit}
                    required
                  />
                </div>
              </Card>

              <Card title="Product Description" subtitle="Additional details of this catalog item">
                <TextArea
                  label="Description"
                  name="description"
                  value={values.description || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Describe technical specs, warranties..."
                  error={touched.description && errors.description}
                  rows={4}
                />
              </Card>
            </div>

            {/* Right Column: Financials & Stock limits */}
            <div className="space-y-6">
              <Card title="Financial Settings" subtitle="Pricing models and GST configuration">
                <div className="space-y-4">
                  <TextField
                    label="Purchase Price (Cost)"
                    name="purchasePrice"
                    type="number"
                    value={values.purchasePrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0.00"
                    error={touched.purchasePrice && errors.purchasePrice}
                    required
                  />

                  <TextField
                    label="Selling Price"
                    name="sellingPrice"
                    type="number"
                    value={values.sellingPrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0.00"
                    error={touched.sellingPrice && errors.sellingPrice}
                    required
                  />

                  <TextField
                    label="MRP"
                    name="mrp"
                    type="number"
                    value={values.mrp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0.00"
                    error={touched.mrp && errors.mrp}
                  />

                  <Select
                    label="GST Tax Rate (%)"
                    name="gstRate"
                    value={values.gstRate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={[
                      { value: 0, label: '0% Exempted' },
                      { value: 5, label: '5% GST' },
                      { value: 12, label: '12% GST' },
                      { value: 18, label: '18% GST' },
                      { value: 28, label: '28% GST' },
                    ]}
                    error={touched.gstRate && errors.gstRate}
                    required
                  />
                </div>
              </Card>

              <Card title="Inventory Settings" subtitle="Configure stock bounds">
                <div className="space-y-4">
                  <TextField
                    label="Opening Quantity"
                    name="quantity"
                    type="number"
                    value={values.quantity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0"
                    error={touched.quantity && errors.quantity}
                    disabled={isEdit} // Quantity must not be modified directly on edits
                  />

                  <TextField
                    label="Minimum Stock Threshold"
                    name="minimumStock"
                    type="number"
                    value={values.minimumStock}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 5"
                    error={touched.minimumStock && errors.minimumStock}
                  />
                </div>
              </Card>

              <div className="flex items-center justify-end gap-3 pt-2 shrink-0">
                <Button variant="outline" onClick={() => navigate('/products')}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={isEdit ? isUpdating : isCreating}
                >
                  {isEdit ? 'Save Changes' : 'Create Product'}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProductForm;
