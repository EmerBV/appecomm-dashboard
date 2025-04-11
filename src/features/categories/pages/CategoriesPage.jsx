import { useState, useEffect } from 'react';
import CategoryList from '../components/CategoryList';
import CategoryForm from '../components/CategoryForm';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import useCategories from '../hooks/useCategories';
import useToast from '../../../hooks/useToast';
import { FiPlus } from 'react-icons/fi';

const CategoriesPage = () => {
  const { 
    categories, 
    isLoading, 
    error, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    uploadCategoryImage,
    deleteCategoryImage 
  } = useCategories();
  
  const toast = useToast();
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, toast]);
  
  // Open modal for creating a new category
  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormModalOpen(true);
  };
  
  // Open modal for editing a category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormModalOpen(true);
  };
  
  // Handle form submission
  const handleSubmitForm = async (data) => {
    setIsSubmitting(true);
    
    try {
      if (editingCategory) {
        // Update existing category
        await updateCategory(editingCategory.id, data);
        toast.success('Category updated successfully!');
      } else {
        // Create new category
        await createCategory(data);
        toast.success('Category created successfully!');
      }
      
      // Close modal
      setFormModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle category deletion
  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      toast.success('Category deleted successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to delete category. Please try again.');
      return false;
    }
  };
  
  // Handle image upload
  const handleUploadImage = async (categoryId, formData) => {
    try {
      await uploadCategoryImage(categoryId, formData);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
      throw error;
    }
  };
  
  // Handle image deletion
  const handleDeleteImage = async (categoryId) => {
    try {
      await deleteCategoryImage(categoryId);
      toast.success('Image deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete image. Please try again.');
      throw error;
    }
  };
  
  // Header actions for the category list
  const headerActions = (
    <Button 
      variant="primary" 
      size="sm"
      onClick={handleAddCategory}
    >
      <FiPlus className="h-4 w-4 mr-1" />
      Add Category
    </Button>
  );
  
  // Page title and description for SEO
  document.title = 'Categories | Admin Dashboard';
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your product categories
          </p>
        </div>
        {headerActions}
      </div>
      
      <CategoryList 
        categories={categories} 
        isLoading={isLoading} 
        onDelete={handleDeleteCategory}
        onEdit={handleEditCategory}
      />
      
      {/* Category form modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        size="lg"
      >
        <CategoryForm
          initialData={editingCategory}
          onSubmit={handleSubmitForm}
          onUploadImage={handleUploadImage}
          onDeleteImage={handleDeleteImage}
          isLoading={isSubmitting}
          isEditMode={!!editingCategory}
        />
      </Modal>
    </div>
  );
};

export default CategoriesPage;
