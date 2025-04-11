import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiEdit, FiTrash2, FiPlus, FiTag } from 'react-icons/fi';
import Table from '../../../components/common/Table';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { ConfirmationModal } from '../../../components/common/Modal';

const CategoryList = ({ 
  categories = [], 
  isLoading = false, 
  onDelete,
  onEdit 
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete button click
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(categoryToDelete.id);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'id',
      title: 'ID',
      className: 'w-16',
    },
    {
      key: 'name',
      title: 'Category',
      className: 'min-w-[200px]',
      render: (category) => (
        <div className="flex items-center">
          {category.imageDownloadUrl ? (
            <img 
              src={category.imageDownloadUrl} 
              alt={category.name}
              className="w-10 h-10 object-cover rounded-md mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center mr-3">
              <FiTag className="text-gray-500" />
            </div>
          )}
          <div className="font-medium text-gray-900">{category.name}</div>
        </div>
      )
    },
    {
      key: 'productsCount',
      title: 'Products',
      render: (category) => (category.products?.length || 0)
    },
    {
      key: 'actions',
      title: 'Actions',
      className: 'w-32',
      render: (category) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(category)}
          >
            <FiEdit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDeleteClick(category)}
          >
            <FiTrash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <>
      <Card 
        title="Categories" 
        description="Manage your product categories"
        noPadding
      >
        <Table
          columns={columns}
          data={categories}
          isLoading={isLoading}
          emptyMessage="No categories found. Create a category to organize your products."
        />
      </Card>

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Category"
        message={
          <>
            <p>Are you sure you want to delete "{categoryToDelete?.name}"?</p>
            {categoryToDelete?.products?.length > 0 && (
              <p className="mt-2 text-red-600">
                Warning: This category has {categoryToDelete.products.length} products associated with it.
              </p>
            )}
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </>
  );
};

CategoryList.propTypes = {
  categories: PropTypes.array,
  isLoading: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default CategoryList;