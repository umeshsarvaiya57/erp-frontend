import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../api/productApi';
import { toast } from '../components/ui/toast/toastService';

export const useProducts = (filters = {}) => {
  const queryClient = useQueryClient();

  // Retrieve products query
  const productsQuery = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productApi.getProducts(filters),
  });

  // Create Product mutation
  const createMutation = useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product added successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to add product.');
    }
  });

  // Update Product mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => productApi.updateProduct(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      toast.success('Product updated successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update product.');
    }
  });

  // Delete Product mutation
  const deleteMutation = useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete product.');
    }
  });

  return {
    products: productsQuery.data?.data || [],
    pagination: productsQuery.data?.pagination || null,
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    refetch: productsQuery.refetch,
    
    createProduct: createMutation.mutate,
    isCreating: createMutation.isPending,
    
    updateProduct: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    
    deleteProduct: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};

export const useProduct = (id) => {
  const productQuery = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductById(id),
    enabled: !!id,
    select: (res) => res.data,
  });

  return {
    product: productQuery.data,
    isLoading: productQuery.isLoading,
    isError: productQuery.isError,
    error: productQuery.error,
    refetch: productQuery.refetch,
  };
};
