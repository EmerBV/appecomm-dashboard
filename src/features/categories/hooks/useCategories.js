import { useState, useCallback, useEffect } from 'react';
import categoryService from '../services/categoryService';
import useToast from '../../../hooks/useToast';

/**
 * Hook for managing categories
 * @returns {Object} Categories data and methods
 */
const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const toast = useToast();

  /**
   * Load all categories
   */
  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Get a category by ID
   * @param {number} id - Category ID
   */
  const getCategory = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await categoryService.getCategoryById(id);
      setSelectedCategory(data);
      return data;
    } catch (err) {
      setError(err.message || `Failed to load category ${id}`);
      toast.error(`Failed to load category #${id}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Create a new category
   * @param {Object} categoryData - New category data
   */
  const createCategory = useCallback(async (categoryData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await categoryService.createCategory(categoryData);
      setCategories((prev) => [...prev, data]);
      toast.success('Category created successfully');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create category');
      toast.error(err.response?.data?.message || 'Failed to create category');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Update an existing category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   */
  const updateCategory = useCallback(async (id, categoryData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await categoryService.updateCategory(id, categoryData);
      
      // Update categories list
      setCategories((prev) => 
        prev.map((item) => (item.id === id ? data : item))
      );
      
      // Update selected category if it's the one being updated
      if (selectedCategory?.id === id) {
        setSelectedCategory(data);
      }
      
      toast.success('Category updated successfully');
      return data;
    } catch (err) {
      setError(err.message || `Failed to update category ${id}`);
      toast.error(err.response?.data?.message || `Failed to update category #${id}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, toast]);

  /**
   * Delete a category
   * @param {number} id - Category ID
   */
  const deleteCategory = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await categoryService.deleteCategory(id);
      
      // Remove from categories list
      setCategories((prev) => prev.filter((item) => item.id !== id));
      
      // Clear selected category if it's the one being deleted
      if (selectedCategory?.id === id) {
        setSelectedCategory(null);
      }
      
      toast.success('Category deleted successfully');
      return true;
    } catch (err) {
      setError(err.message || `Failed to delete category ${id}`);
      toast.error(`Failed to delete category #${id}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, toast]);

  /**
   * Upload category image
   * @param {number} categoryId - Category ID
   * @param {FormData} formData - Form data with image
   */
  const uploadCategoryImage = useCallback(async (categoryId, formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await categoryService.uploadCategoryImage(categoryId, formData);
      
      // If we have the selected category loaded, update its image
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory((prev) => ({
          ...prev,
          imageFileName: data.imageFileName,
          imageFileType: data.imageFileType,
          imageDownloadUrl: data.imageDownloadUrl
        }));
      }
      
      // Update in categories list
      setCategories((prev) => 
        prev.map((cat) => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              imageFileName: data.imageFileName,
              imageFileType: data.imageFileType,
              imageDownloadUrl: data.imageDownloadUrl
            };
          }
          return cat;
        })
      );
      
      toast.success('Image uploaded successfully');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to upload image');
      toast.error('Failed to upload image');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, toast]);

  /**
   * Delete a category image
   * @param {number} categoryId - Category ID
   */
  const deleteCategoryImage = useCallback(async (categoryId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await categoryService.deleteCategoryImage(categoryId);
      
      // If we have the selected category loaded, remove its image
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory((prev) => ({
          ...prev,
          imageFileName: null,
          imageFileType: null,
          imageDownloadUrl: null
        }));
      }
      
      // Update in categories list
      setCategories((prev) => 
        prev.map((cat) => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              imageFileName: null,
              imageFileType: null,
              imageDownloadUrl: null
            };
          }
          return cat;
        })
      );
      
      toast.success('Image deleted successfully');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete image');
      toast.error('Failed to delete image');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, toast]);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    isLoading,
    error,
    selectedCategory,
    loadCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    deleteCategoryImage
  };
};

export default useCategories;