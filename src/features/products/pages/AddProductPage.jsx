import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import useProducts from '../hooks/useProducts';
import useCategories from '../../categories/hooks/useCategories';
import useToast from '../../../hooks/useToast';

const AddProductPage = () => {
  const { createProduct, isLoading } = useProducts();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const toast = useToast();
  
  const handleSubmit = async (productData) => {
    try {
      const newProduct = await createProduct(productData);
      toast.success('Product created successfully!');
      navigate(`/products/view/${newProduct.id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product. Please try again.');
    }
  };
  
  // Page title and description for SEO
  document.title = 'Add Product | Admin Dashboard';
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create a new product in your catalog
        </p>
      </div>
      
      <ProductForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading}
        categories={categories}
      />
    </div>
  );
};

export default AddProductPage;