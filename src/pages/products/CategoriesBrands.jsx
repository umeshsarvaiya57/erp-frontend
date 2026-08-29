import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FolderTree, Sparkles, Plus, Trash2 } from 'lucide-react';
import { categoryApi } from '../../api/categoryApi';
import { brandApi } from '../../api/brandApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { TextField } from '../../components/ui/TextField';
import { toast } from '../../components/ui/toast/toastService';

const categorySchema = Yup.object().shape({
  name: Yup.string().required('Category name is required').max(50, 'Max 50 characters'),
  description: Yup.string().max(200, 'Max 200 characters').nullable(),
});

const brandSchema = Yup.object().shape({
  name: Yup.string().required('Brand name is required').max(50, 'Max 50 characters'),
  description: Yup.string().max(200, 'Max 200 characters').nullable(),
});

export const CategoriesBrands = () => {
  const queryClient = useQueryClient();

  // Queries
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

  // Mutations for Category
  const createCategoryMutation = useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create category.');
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete category.');
    }
  });

  // Mutations for Brand
  const createBrandMutation = useMutation({
    mutationFn: brandApi.createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand created successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create brand.');
    }
  });

  const deleteBrandMutation = useMutation({
    mutationFn: brandApi.deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand deleted successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete brand.');
    }
  });

  const handleCreateCategory = (values, { resetForm }) => {
    createCategoryMutation.mutate(values, {
      onSuccess: () => resetForm(),
    });
  };

  const handleCreateBrand = (values, { resetForm }) => {
    createBrandMutation.mutate(values, {
      onSuccess: () => resetForm(),
    });
  };

  const categories = categoriesQuery.data || [];
  const brands = brandsQuery.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 select-none">
        <FolderTree className="h-6 w-6 text-slate-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-none">Categories & Brands</h1>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mt-1">Configure Product Parameters</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Manager Card */}
        <Card title="Product Categories" subtitle="Organize inventory by departments">
          <Formik
            initialValues={{ name: '', description: '' }}
            validationSchema={categorySchema}
            onSubmit={handleCreateCategory}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="flex items-start gap-4 mb-6">
                <TextField
                  name="name"
                  placeholder="e.g. Smartphones"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="primary"
                  startIcon={<Plus className="h-4 w-4" />}
                  loading={createCategoryMutation.isPending}
                >
                  Add
                </Button>
              </Form>
            )}
          </Formik>

          <Table headers={['Category Name', 'Description', 'Action']} loading={categoriesQuery.isLoading}>
            {categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                  {cat.name}
                </td>
                <td className="px-6 py-4 font-medium text-slate-500 text-xs truncate max-w-[200px]">
                  {cat.description || 'No description'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    variant="text"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    startIcon={<Trash2 className="h-4 w-4" />}
                    loading={deleteCategoryMutation.isPending && deleteCategoryMutation.variables === cat._id}
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this category?')) {
                        deleteCategoryMutation.mutate(cat._id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && !categoriesQuery.isLoading && (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-slate-400 font-medium">
                  No categories added yet.
                </td>
              </tr>
            )}
          </Table>
        </Card>

        {/* Brands Manager Card */}
        <Card title="Product Brands" subtitle="Configure supplier and manufacture brands">
          <Formik
            initialValues={{ name: '', description: '' }}
            validationSchema={brandSchema}
            onSubmit={handleCreateBrand}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="flex items-start gap-4 mb-6">
                <TextField
                  name="name"
                  placeholder="e.g. Apple"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && errors.name}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="primary"
                  startIcon={<Plus className="h-4 w-4" />}
                  loading={createBrandMutation.isPending}
                >
                  Add
                </Button>
              </Form>
            )}
          </Formik>

          <Table headers={['Brand Name', 'Description', 'Action']} loading={brandsQuery.isLoading}>
            {brands.map((br) => (
              <tr key={br._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                  {br.name}
                </td>
                <td className="px-6 py-4 font-medium text-slate-500 text-xs truncate max-w-[200px]">
                  {br.description || 'No description'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button
                    variant="text"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    startIcon={<Trash2 className="h-4 w-4" />}
                    loading={deleteBrandMutation.isPending && deleteBrandMutation.variables === br._id}
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this brand?')) {
                        deleteBrandMutation.mutate(br._id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {brands.length === 0 && !brandsQuery.isLoading && (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-slate-400 font-medium">
                  No brands added yet.
                </td>
              </tr>
            )}
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default CategoriesBrands;
