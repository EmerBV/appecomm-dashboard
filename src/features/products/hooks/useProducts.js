import { useState, useCallback, useEffect } from 'react';
import productService from '../services/productService';
import useToast from '../../../hooks/useToast';

/**
 * Hook for managing products
 * @returns {Object} Products data and methods
 */
const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toast = useToast();

  /**
   * Load all products
   */
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Get a product by ID
   * @param {number} id - Product ID
   */
  const getProduct = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.getProductById(id);
      setSelectedProduct(data);
      return data;
    } catch (err) {
      setError(err.message || `Failed to load product ${id}`);
      toast.error(`Failed to load product #${id}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Create a new product
   * @param {Object} productData - New product data
   */
  const createProduct = useCallback(async (productData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.createProduct(productData);
      setProducts((prev) => [...prev, data]);
      toast.success('Product created successfully');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to create product');
      toast.error(err.response?.data?.message || 'Failed to create product');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Update an existing product
   * @param {number} id - Product ID
   * @param {Object} productData - Updated product data
   */
  const updateProduct = useCallback(async (id, productData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.updateProduct(id, productData);
      
      // Update products list
      setProducts((prev) => 
        prev.map((item) => (item.id === id ? data : item))
      );
      
      // Update selected product if it's the one being updated
      if (selectedProduct?.id === id) {
        setSelectedProduct(data);
      }
      
      toast.success('Product updated successfully');
      return data;
    } catch (err) {
      setError(err.message || `Failed to update product ${id}`);
      toast.error(err.response?.data?.message || `Failed to update product #${id}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, toast]);

  /**
   * Delete a product
   * @param {number} id - Product ID
   */
  const deleteProduct = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await productService.deleteProduct(id);
      
      // Remove from products list
      setProducts((prev) => prev.filter((item) => item.id !== id));
      
      // Clear selected product if it's the one being deleted
      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
      
      toast.success('Product deleted successfully');
      return true;
    } catch (err) {
      setError(err.message || `Failed to delete product ${id}`);
      toast.error(`Failed to delete product #${id}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, toast]);

  /**
   * Upload product images
   * @param {number} productId - Product ID
   * @param {FormData} formData - Form data with images
   */
  const uploadProductImages = useCallback(async (productId, formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.uploadProductImages(productId, formData);
      
      // If we have the selected product loaded, update its images
      if (selectedProduct?.id === productId) {
        setSelectedProduct((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...data]
        }));
      }
      
      toast.success('Images uploaded successfully');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to upload images');
      toast.error('Failed to upload images');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, toast]);

  /**
   * Delete a product image
   * @param {number} imageId - Image ID
   * @param {number} productId - Product ID
   */
  const deleteProductImage = useCallback(async (imageId, productId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await productService.deleteProductImage(imageId);
      
      // If we have the selected product loaded, update its images
      if (selectedProduct?.id === productId) {
        setSelectedProduct((prev) => ({
          ...prev,
          images: prev.images.filter((img) => img.id !== imageId)
        }));
      }
      
      toast.success('Image deleted successfully');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete image');
      toast.error('Failed to delete image');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, toast]);

  /**
   * Add a product variant
   * @param {number} productId - Product ID
   * @param {Object} variantData - Variant data
   */
  const addProductVariant = useCallback(async (productId, variantData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.addProductVariant(productId, variantData);
      
      // If we have the selected product loaded, update its variants
      if (selectedProduct?.id === productId) {
        setSelectedProduct((prev) => ({
          ...prev,
          variants: [...(prev.variants || []), data]
        }));
      }
      
      toast.success('Variant added successfully');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to add variant');
      toast.error('Failed to add variant');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, toast]);

  /**
   * Update a product variant
   * @param {number} variantId - Variant ID
   * @param {Object} variantData - Updated variant data
   */
  const updateProductVariant = useCallback(async (variantId, variantData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await productService.updateProductVariant(variantId, variantData);
      
      // If we have the selected product loaded, update its variant
      if (selectedProduct && selectedProduct.variants) {
        setSelectedProduct((prev) => ({
          ...prev,
          variants: prev.variants.map((v) => v.id === variantId ? data : v)
        }));
      }
      
      toast.success('Variant updated successfully');
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update variant');
      toast.error('Failed to update variant');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, toast]);

  /**
   * Delete a product variant
   * @param {number} variantId - Variant ID
   */
  const deleteProductVariant = useCallback(async (variantId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await productService.deleteProductVariant(variantId);
      
      // If we have the selected product loaded, remove the variant
      if (selectedProduct && selectedProduct.variants) {
        setSelectedProduct((prev) => ({
          ...prev,
          variants: prev.variants.filter((v) => v.id !== variantId)
        }));
      }
      
      toast.success('Variant deleted successfully');
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete variant');
      toast.error('Failed to delete variant');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, toast]);

  // Load products on mount
  useEffect(() => {
    // Añadir una bandera para prevenir múltiples intentos
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const data = await productService.getProducts();
        if (isMounted) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load products');
          // Solo mostrar el toast una vez
          toast.error('Failed to load products', { id: 'products-error' });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    setIsLoading(true);
    fetchData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
    
    // Elimina loadProducts de las dependencias
  }, [toast]);

  return {
    products,
    isLoading,
    error,
    selectedProduct,
    loadProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    deleteProductImage,
    addProductVariant,
    updateProductVariant,
    deleteProductVariant
  };
};

export default useProducts;