import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import useProducts from '../hooks/useProducts';
import useCategories from '../../categories/hooks/useCategories';
import useToast from '../../../hooks/useToast';
import Loading from '../../../components/common/Loading';

const EditProductPage = () => {
  const { productId } = useParams();
  const { getProduct, updateProduct, isLoading } = useProducts();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  
  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoadingProduct(true);
      try {
        const data = await getProduct(productId);
        setProduct(data);
      } catch (error) {
        toast.error('Failed to load product. Please try again.');
        navigate('/products');
      } finally {
        setIsLoadingProduct(false);
      }
    };
    
    fetchProduct();
  }, [productId, getProduct, toast, navigate]);
  
  const handleSubmit = async (productData) => {
    try {
      await updateProduct(productId, productData);
      toast.success('Product updated successfully!');
      navigate(`/products/view/${productId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product. Please try again.');
    }
  };
  
  // Page title and description for SEO
  document.title = product ? `Edit ${product.name} | Admin Dashboard` : 'Edit Product | Admin Dashboard';
  
  if (isLoadingProduct) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update information for {product?.name}
        </p>
      </div>
      
      {product && (
        <ProductForm 
          initialData={product}
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          categories={categories}
          isEditMode
        />
      )}
    </div>
  );
};

export default EditProductPage;