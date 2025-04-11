import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import PropTypes from 'prop-types';
import { FiPlus, FiX, FiSave, FiTrash2 } from 'react-icons/fi';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Card from '../../../components/common/Card';

const ProductForm = ({
  initialData,
  categories = [],
  onSubmit,
  isLoading = false,
  isEditMode = false
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  
  // Set up form with defaultValues
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    control,
    reset,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      id: initialData?.id || '',
      name: initialData?.name || '',
      brand: initialData?.brand || '',
      price: initialData?.price || '',
      inventory: initialData?.inventory || 0,
      description: initialData?.description || '',
      category: initialData?.category?.id || '',
      status: initialData?.status || 'IN_STOCK',
      discountPercentage: initialData?.discountPercentage || 0,
      preOrder: initialData?.preOrder || false,
      variants: initialData?.variants || []
    }
  });
  
  // Setup variants field array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants'
  });
  
  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id || '',
        name: initialData.name || '',
        brand: initialData.brand || '',
        price: initialData.price || '',
        inventory: initialData.inventory || 0,
        description: initialData.description || '',
        category: initialData.category?.id || '',
        status: initialData.status || 'IN_STOCK',
        discountPercentage: initialData.discountPercentage || 0,
        preOrder: initialData.preOrder || false,
        variants: initialData.variants || []
      });
    }
  }, [initialData, reset]);
  
  // Add empty variant
  const handleAddVariant = () => {
    append({ 
      name: '', 
      price: '', 
      inventory: 0 
    });
  };
  
  // Form submission
  const onFormSubmit = (data) => {
    // Convert numeric fields
    const formattedData = {
      ...data,
      price: parseFloat(data.price),
      inventory: parseInt(data.inventory, 10),
      discountPercentage: parseInt(data.discountPercentage, 10),
      category: {
        id: parseInt(data.category, 10),
        name: categories.find(c => c.id === parseInt(data.category, 10))?.name || ''
      },
      variants: data.variants.map(variant => ({
        ...variant,
        price: parseFloat(variant.price),
        inventory: parseInt(variant.inventory, 10)
      }))
    };
    
    onSubmit(formattedData);
  };
  
  // Tabs configuration
  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'variants', label: 'Variants' },
    { id: 'advanced', label: 'Advanced' }
  ];
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="space-y-6">
        {/* Tab navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <Card title="Basic Information">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Input
                label="Product Name"
                {...register('name', { required: 'Product name is required' })}
                error={errors.name?.message}
                required
              />
              
              <Input
                label="Brand"
                {...register('brand', { required: 'Brand is required' })}
                error={errors.brand?.message}
                required
              />
              
              <Input
                label="Price"
                type="number"
                step="0.01"
                min="0"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' } 
                })}
                error={errors.price?.message}
                required
              />
              
              <Input
                label="Inventory"
                type="number"
                min="0"
                {...register('inventory', {
                  required: 'Inventory is required',
                  min: { value: 0, message: 'Inventory cannot be negative' }
                })}
                error={errors.inventory?.message}
                required
              />
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  {...register('category', { required: 'Category is required' })}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="4"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  {...register('description')}
                ></textarea>
              </div>
            </div>
          </Card>
        )}
        
        {/* Variants Tab */}
        {activeTab === 'variants' && (
          <Card 
            title="Product Variants" 
            description="Add variants for different options like size, color, etc."
            footer={
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddVariant}
              >
                <FiPlus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            }
          >
            {fields.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">No variants added yet.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Click the button below to add a variant.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        Variant #{index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => remove(index)}
                      >
                        <FiTrash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Input
                        label="Variant Name"
                        {...register(`variants.${index}.name`, {
                          required: 'Variant name is required'
                        })}
                        error={errors.variants?.[index]?.name?.message}
                        required
                      />
                      
                      <Input
                        label="Price"
                        type="number"
                        step="0.01"
                        min="0"
                        {...register(`variants.${index}.price`, {
                          required: 'Variant price is required',
                          min: { value: 0, message: 'Price must be positive' }
                        })}
                        error={errors.variants?.[index]?.price?.message}
                        required
                      />
                      
                      <Input
                        label="Inventory"
                        type="number"
                        min="0"
                        {...register(`variants.${index}.inventory`, {
                          required: 'Inventory is required',
                          min: { value: 0, message: 'Inventory cannot be negative' }
                        })}
                        error={errors.variants?.[index]?.inventory?.message}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
        
        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <Card title="Advanced Settings">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  {...register('status')}
                >
                  <option value="IN_STOCK">In Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>
              
              <Input
                label="Discount Percentage"
                type="number"
                min="0"
                max="100"
                {...register('discountPercentage', {
                  min: { value: 0, message: 'Discount cannot be negative' },
                  max: { value: 100, message: 'Discount cannot exceed 100%' }
                })}
                error={errors.discountPercentage?.message}
              />
              
              <div className="sm:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="preOrder"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    {...register('preOrder')}
                  />
                  <label htmlFor="preOrder" className="ml-2 block text-sm text-gray-900">
                    Available for Pre-Order
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Mark this product as available for pre-order
                </p>
              </div>
            </div>
          </Card>
        )}
        
        {/* Form actions */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
          >
            <FiSave className="h-4 w-4 mr-2" />
            {isEditMode ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </div>
    </form>
  );
};

ProductForm.propTypes = {
  initialData: PropTypes.object,
  categories: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isEditMode: PropTypes.bool
};

export default ProductForm;