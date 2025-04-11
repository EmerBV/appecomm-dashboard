import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiArrowLeft, FiCamera, FiPlus } from 'react-icons/fi';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import { ConfirmationModal } from '../../../components/common/Modal';
import useProducts from '../hooks/useProducts';
import useToast from '../../../hooks/useToast';
import { formatCurrency } from '../../../utils/formatters';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { 
    getProduct, 
    deleteProduct, 
    isLoading,
    selectedProduct: product,
    uploadProductImages,
    deleteProductImage 
  } = useProducts();
  
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoadingProduct(true);
      try {
        await getProduct(productId);
      } catch (error) {
        toast.error('Failed to load product. Please try again.');
        navigate('/products');
      } finally {
        setIsLoadingProduct(false);
      }
    };
    
    fetchProduct();
  }, [productId, getProduct, toast, navigate]);
  
  // Handle product delete
  const handleDeleteProduct = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      toast.success('Product deleted successfully!');
      navigate('/products');
    } catch (error) {
      toast.error('Failed to delete product. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };
  
  // Handle image upload
  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('productId', productId);
    
    setIsUploadingImage(true);
    try {
      await uploadProductImages(productId, formData);
      toast.success('Images uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setIsUploadingImage(false);
      // Reset file input
      event.target.value = '';
    }
  };
  
  // Handle image delete
  const handleDeleteImage = async (imageId) => {
    try {
      await deleteProductImage(imageId, productId);
      toast.success('Image deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete image. Please try again.');
    }
  };
  
  // Page title and description for SEO
  document.title = product ? `${product.name} | Admin Dashboard` : 'Product Details | Admin Dashboard';
  
  if (isLoadingProduct || !product) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading size="lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <Link to="/products" className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700">
            <FiArrowLeft className="mr-1" /> Back to Products
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-1">{product.name}</h1>
          <p className="text-sm text-gray-500">{product.brand}</p>
        </div>
        
        <div className="flex space-x-3">
          <Link to={`/products/edit/${productId}`}>
            <Button variant="outline">
              <FiEdit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button 
            variant="danger"
            onClick={() => setDeleteModalOpen(true)}
          >
            <FiTrash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Images */}
        <div className="lg:col-span-1">
          <Card title="Product Images">
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image) => (
                  <div key={image.id} className="group relative">
                    <img
                      src={image.downloadUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-md">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
            
            {/* Image upload */}
            <div className="mt-4">
              <label className="block">
                <span className="sr-only">Choose images</span>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                />
              </label>
              {isUploadingImage && (
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Loading size="sm" className="mr-2" />
                  Uploading...
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Right column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Price</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {formatCurrency(product.price)}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Inventory</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {product.inventory} units
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {product.category?.name || '-'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.status === 'IN_STOCK' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                  </span>
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Discount</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {product.discountPercentage}%
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pre-Order</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {product.preOrder ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
            
            {product.description && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <div className="mt-2 prose prose-sm max-w-none text-gray-900">
                  {product.description}
                </div>
              </div>
            )}
          </Card>
          
          {/* Variants */}
          <Card 
            title="Variants" 
            description="Product variations and options"
            headerActions={
              <Link to={`/products/edit/${productId}`}>
                <Button variant="outline" size="sm">
                  <FiPlus className="h-4 w-4 mr-1" />
                  Add Variant
                </Button>
              </Link>
            }
          >
            {product.variants && product.variants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inventory
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {product.variants.map((variant) => (
                      <tr key={variant.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {variant.name}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(variant.price)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variant.inventory} units
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No variants available</p>
                <p className="text-sm text-gray-400 mt-1">
                  Click "Add Variant" to add product variations
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteProduct}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProductDetailPage;