import axiosInstance from '../../../services/axiosInstance';

/**
 * Service for product-related API calls
 */
const productService = {
  /**
   * Get all products
   * @returns {Promise<Array>} Array of products
   */
  async getProducts() {
    try {
      const response = await axiosInstance.get('/products/all');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Get a product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} Product data
   */
  async getProductById(id) {
    try {
      const response = await axiosInstance.get(`/products/product/${id}/product`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new product
   * @param {Object} productData - New product data
   * @returns {Promise<Object>} Created product
   */
  async createProduct(productData) {
    try {
      const response = await axiosInstance.post('/products/add', productData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  /**
   * Update an existing product
   * @param {number} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise<Object>} Updated product
   */
  async updateProduct(id, productData) {
    try {
      const response = await axiosInstance.put(`/products/product/${id}/update`, productData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a product
   * @param {number} id - Product ID
   * @returns {Promise<Object>} API response
   */
  async deleteProduct(id) {
    try {
      const response = await axiosInstance.delete(`/products/product/${id}/delete`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload product images
   * @param {number} productId - Product ID
   * @param {FormData} formData - Form data containing images
   * @returns {Promise<Array>} Array of uploaded images
   */
  async uploadProductImages(productId, formData) {
    try {
      const response = await axiosInstance.post(`/images/upload?productId=${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(`Error uploading images for product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a product image
   * @param {number} imageId - Image ID
   * @returns {Promise<Object>} API response
   */
  async deleteProductImage(imageId) {
    try {
      const response = await axiosInstance.delete(`/images/image/${imageId}/delete`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting image ${imageId}:`, error);
      throw error;
    }
  },
  
  /**
   * Add a product variant
   * @param {number} productId - Product ID
   * @param {Object} variantData - Variant data
   * @returns {Promise<Object>} Created variant
   */
  async addProductVariant(productId, variantData) {
    try {
      const response = await axiosInstance.post(`/variants/variant/add?productId=${productId}`, variantData);
      return response.data.data;
    } catch (error) {
      console.error(`Error adding variant to product ${productId}:`, error);
      throw error;
    }
  },
  
  /**
   * Update a product variant
   * @param {number} variantId - Variant ID
   * @param {Object} variantData - Updated variant data
   * @returns {Promise<Object>} Updated variant
   */
  async updateProductVariant(variantId, variantData) {
    try {
      const response = await axiosInstance.put(`/variants/variant/${variantId}/update`, variantData);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating variant ${variantId}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a product variant
   * @param {number} variantId - Variant ID
   * @returns {Promise<Object>} API response
   */
  async deleteProductVariant(variantId) {
    try {
      const response = await axiosInstance.delete(`/variants/variant/${variantId}/delete`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting variant ${variantId}:`, error);
      throw error;
    }
  }
};

export default productService;