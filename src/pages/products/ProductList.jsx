import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit, 
  Boxes, 
  AlertTriangle 
} from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useInventory } from '../../hooks/useInventory';
import { categoryApi } from '../../api/categoryApi';
import { brandApi } from '../../api/brandApi';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SearchInput } from '../../components/ui/SearchInput';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/ui/Pagination';
import { Modal } from '../../components/ui/Modal';
import { TextField } from '../../components/ui/TextField';
import { toast } from '../../components/ui/toast/toastService';

const adjustmentSchema = Yup.object().shape({
  type: Yup.string().required('Adjustment type is required'),
  quantity: Yup.number()
    .integer('Quantity must be an integer')
    .min(1, 'Minimum adjustment is 1')
    .required('Quantity is required'),
  reason: Yup.string().required('Reason is required').max(200, 'Max 200 characters'),
});

export const ProductList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  
  // Modal state for stock adjustments
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Queries for filtering
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

  // Fetch Products
  const { 
    products, 
    pagination, 
    isLoading, 
    deleteProduct 
  } = useProducts({
    page,
    limit: 10,
    search,
    categoryId,
    brandId,
  });

  // Stock Adjustment Mutation hook
  const { adjustStock, isAdjusting } = useInventory();

  const handleAdjustSubmit = (values, { resetForm }) => {
    adjustStock(
      {
        productId: selectedProduct._id,
        type: values.type,
        quantity: values.quantity,
        reason: values.reason,
      },
      {
        onSuccess: () => {
          setIsAdjustModalOpen(false);
          setSelectedProduct(null);
          resetForm();
        },
      }
    );
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const getStockBadge = (qty, minStock) => {
    if (qty <= 0) return <Badge variant="danger">Out of Stock</Badge>;
    if (qty <= minStock) return <Badge variant="warning">Low Stock ({qty})</Badge>;
    return <Badge variant="success">In Stock ({qty})</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap select-none">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-slate-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-none">Product Catalog</h1>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">Manage items and stock limits</span>
          </div>
        </div>
        <Button
          variant="primary"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={() => navigate('/products/new')}
        >
          Add Product
        </Button>
      </div>

      {/* Filtering Panel */}
      <Card className="p-4" bodyClassName="flex flex-col sm:flex-row gap-4 items-center">
        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search SKU or Name..."
          className="flex-1"
        />

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <Select
            placeholder="All Categories"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            options={categoriesQuery.data?.map(c => ({ value: c._id, label: c.name })) || []}
            className="w-full sm:w-48"
          />

          <Select
            placeholder="All Brands"
            value={brandId}
            onChange={(e) => {
              setBrandId(e.target.value);
              setPage(1);
            }}
            options={brandsQuery.data?.map(b => ({ value: b._id, label: b.name })) || []}
            className="w-full sm:w-48"
          />
        </div>
      </Card>

      {/* Catalog Table */}
      <Table
        headers={['Item Details', 'Category', 'Brand', 'Sell Price', 'Tax (GST)', 'Stock Status', 'Actions']}
        loading={isLoading}
      >
        {products.map((prod) => (
          <tr key={prod._id} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="font-semibold text-slate-950 text-sm leading-snug">{prod.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    SKU: {prod.sku}
                  </span>
                  {prod.barcode && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      Barcode: {prod.barcode}
                    </span>
                  )}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-medium">
              {prod.categoryId?.name || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-500">
              {prod.brandId?.name || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
              ₹ {prod.sellingPrice.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-500">
              {prod.gstRate} %
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {getStockBadge(prod.quantity, prod.minimumStock)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-1">
                <Button
                  variant="text"
                  size="sm"
                  startIcon={<Boxes className="h-4 w-4" />}
                  onClick={() => {
                    setSelectedProduct(prod);
                    setIsAdjustModalOpen(true);
                  }}
                  className="text-primary-600 hover:bg-primary-50"
                >
                  Adjust
                </Button>
                <Button
                  variant="text"
                  size="sm"
                  startIcon={<Edit className="h-4 w-4" />}
                  onClick={() => navigate(`/products/${prod._id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  variant="text"
                  size="sm"
                  startIcon={<Trash2 className="h-4 w-4" />}
                  onClick={() => handleDelete(prod._id)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </td>
          </tr>
        ))}
        {products.length === 0 && !isLoading && (
          <tr>
            <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">
              No products found in catalog. Click "Add Product" to add one.
            </td>
          </tr>
        )}
      </Table>

      <Pagination
        page={page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={(p) => setPage(p)}
        limit={10}
        total={pagination?.total || 0}
      />

      {/* Stock Adjustment Modal */}
      {selectedProduct && (
        <Modal
          isOpen={isAdjustModalOpen}
          onClose={() => {
            setIsAdjustModalOpen(false);
            setSelectedProduct(null);
          }}
          title={`Adjust Inventory - ${selectedProduct.name}`}
          size="md"
        >
          <Formik
            initialValues={{ type: 'ADJUSTMENT_IN', quantity: '', reason: '' }}
            validationSchema={adjustmentSchema}
            onSubmit={handleAdjustSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="space-y-6">
                <div className="text-xs bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col gap-1 select-none">
                  <span className="font-semibold text-slate-700">SKU Code: {selectedProduct.sku}</span>
                  <span className="text-slate-500 font-medium">Current Stock Level: {selectedProduct.quantity} {selectedProduct.unit}</span>
                </div>

                <Select
                  label="Adjustment Direction"
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={[
                    { value: 'ADJUSTMENT_IN', label: 'Stock In (Increase Inventory)' },
                    { value: 'ADJUSTMENT_OUT', label: 'Stock Out (Reduce Inventory)' },
                  ]}
                  error={touched.type && errors.type}
                  required
                />

                <TextField
                  label="Quantity to Adjust"
                  name="quantity"
                  type="number"
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter positive integer"
                  error={touched.quantity && errors.quantity}
                  required
                />

                <TextField
                  label="Reason / Remarks"
                  name="reason"
                  value={values.reason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Broken items, physical audit check"
                  error={touched.reason && errors.reason}
                  required
                />

                {values.type === 'ADJUSTMENT_OUT' && selectedProduct.quantity < values.quantity && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                    <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse" />
                    <span>Warning: Cannot adjust out more than current stock quantity!</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAdjustModalOpen(false);
                      setSelectedProduct(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isAdjusting}
                    disabled={values.type === 'ADJUSTMENT_OUT' && selectedProduct.quantity < values.quantity}
                  >
                    Apply Adjustment
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </div>
  );
};

export default ProductList;
