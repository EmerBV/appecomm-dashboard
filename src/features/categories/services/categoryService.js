import axiosInstance from '../../../services/axiosInstance';

/**
 * Service for category-related API calls
 */
const categoryService = {
  /**
   * Get all categories
   * @returns {Promise<Array>} Array of categories
   */
  async getCategories() {
    try {
      const response = await axiosInstance.get('/categories/all');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get a category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Object>} Category data
   */
  async getCategoryById(id) {
    try {
      const response = await axiosInstance.get(`/categories/category/${id}/category`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new category
   * @param {Object} categoryData - New category data
   * @returns {Promise<Object>} Created category
   */
  async createCategory(categoryData) {
    try {
      const response = await axiosInstance.post('/categories/add', categoryData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Update an existing category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object>} Updated category
   */
  async updateCategory(id, categoryData) {
    try {
      const response = await axiosInstance.put(`/categories/category/${id}/update`, categoryData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a category
   * @param {number} id - Category ID
   * @returns {Promise<Object>} API response
   */
  async deleteCategory(id) {
    try {
      const response = await axiosInstance.delete(`/categories/category/${id}/delete`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload category image
   * @param {number} categoryId - Category ID
   * @param {FormData} formData - Form data containing image
   * @returns {Promise<Object>} Uploaded image data
   */
  async uploadCategoryImage(categoryId, formData) {
    try {
      const response = await axiosInstance.post(`/categories/${categoryId}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error uploading image for category ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a category image
   * @param {number} categoryId - Category ID
   * @returns {Promise<Object>} API response
   */
  async deleteCategoryImage(categoryId) {
    try {
      const response = await axiosInstance.delete(`/categories/image/${categoryId}/delete-image`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting image for category ${categoryId}:`, error);
      throw error;
    }
  }
};

export default categoryService;