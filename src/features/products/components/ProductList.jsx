import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FiEdit, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { ConfirmationModal } from '../../../components/common/Modal';
import { formatCurrency } from '../../../utils/formatters';

const ProductList = ({ 
  products = [], 
  isLoading = false, 
  onDelete,
  categories = [] 
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete button click
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(productToDelete.id);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Create a map of category IDs to names for faster lookup
  const categoryMap = categories.reduce((acc, category) => {
    acc[category.id] = category.name;
    return acc;
  }, {});

  // Table columns configuration
  const columns = [
    {
      key: 'id',
      title: 'ID',
      className: 'w-16',
    },
    {
      key: 'name',
      title: 'Product',
      className: 'min-w-[200px]',
      render: (product) => (
        <div className="flex items-center">
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0].downloadUrl} 
              alt={product.name}
              className="w-10 h-10 object-cover rounded-md mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center mr-3">
              <FiShoppingBag className="text-gray-500" />
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">{product.name}</div>
            <div className="text-xs text-gray-500">{product.brand}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      render: (product) => categoryMap[product.category?.id] || '-'
    },
    {
      key: 'price',
      title: 'Price',
      render: (product) => formatCurrency(product.price)
    },
    {
      key: 'inventory',
      title: 'Inventory',
      render: (product) => {
        // For products with variants, show total inventory across all variants
        if (product.variants && product.variants.length > 0) {
          const totalInventory = product.variants.reduce(
            (sum, variant) => sum + variant.inventory, 
            0
          );
          return `${totalInventory} (${product.variants.length} variants)`;
        }
        return product.inventory;
      }
    },
    {
      key: 'status',
      title: 'Status',
      render: (product) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          product.status === 'IN_STOCK' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {product.status === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      className: 'w-32',
      render: (product) => (
        <div className="flex space-x-2">
          <Link to={`/products/view/${product.id}`}>
            <Button variant="outline" size="sm">
              <FiEye className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={`/products/edit/${product.id}`}>
            <Button variant="outline" size="sm">
              <FiEdit className="h-4 w-4" />
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDeleteClick(product)}
          >
            <FiTrash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  // Get header actions
  const headerActions = (
    <Link to="/products/add">
      <Button variant="primary" size="sm">
        <FiPlus className="h-4 w-4 mr-1" />
        Add Product
      </Button>
    </Link>
  );

  return (
    <>
      <Card 
        title="Products" 
        description="Manage your product catalog"
        headerActions={headerActions}
        noPadding
      >
        <Table
          columns={columns}
          data={products}
          isLoading={isLoading}
          emptyMessage="No products found. Click Add Product to create one."
        />
      </Card>

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
};

// Since FiShoppingBag might be undefined, define it here
const FiShoppingBag = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

FiShoppingBag.propTypes = {
  className: PropTypes.string
};

ProductList.propTypes = {
  products: PropTypes.array,
  isLoading: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
  categories: PropTypes.array
};

export default ProductList;