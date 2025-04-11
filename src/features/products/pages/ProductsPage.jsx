import { useEffect } from 'react';
import ProductList from '../components/ProductList';
import useProducts from '../hooks/useProducts';
import useCategories from '../../categories/hooks/useCategories';
import useToast from '../../../hooks/useToast';

const ProductsPage = () => {
  const { products, isLoading, loadProducts, deleteProduct, error } = useProducts();
  const { categories, loadCategories } = useCategories();
  const toast = useToast();
  
  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, toast]);
  
  // Handle product deletion
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  // Page title and description for SEO
  document.title = 'Products | Admin Dashboard';
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your product catalog, add new products, or edit existing ones.
        </p>
      </div>
      
      <ProductList 
        products={products} 
        isLoading={isLoading} 
        onDelete={handleDeleteProduct}
        categories={categories}
      />
    </div>
  );
};

export default ProductsPage;