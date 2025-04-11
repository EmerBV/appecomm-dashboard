import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { FiSave, FiUpload, FiTrash2 } from 'react-icons/fi';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Card from '../../../components/common/Card';
import Loading from '../../../components/common/Loading';

const CategoryForm = ({
  initialData,
  onSubmit,
  onUploadImage,
  onDeleteImage,
  isLoading = false,
  isEditMode = false
}) => {
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageDownloadUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Set up form with defaultValues
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      id: initialData?.id || '',
      name: initialData?.name || ''
    }
  });
  
  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id || '',
        name: initialData.name || ''
      });
      setPreviewUrl(initialData.imageDownloadUrl || null);
    }
  }, [initialData, reset]);
  
  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Create preview URL
    const localPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(localPreviewUrl);
    
    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    
    setIsUploading(true);
    try {
      await onUploadImage(initialData.id, formData);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };
  
  // Handle image delete
  const handleDeleteImage = async () => {
    if (!initialData?.id || !initialData?.imageDownloadUrl) return;
    
    setIsDeleting(true);
    try {
      await onDeleteImage(initialData.id);
      setPreviewUrl(null);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Form submission
  const onFormSubmit = (data) => {
    onSubmit(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="space-y-6">
        <Card title="Category Information">
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Category Name"
              {...register('name', { required: 'Category name is required' })}
              error={errors.name?.message}
              required
            />
          </div>
        </Card>
        
        {isEditMode && (
          <Card 
            title="Category Image" 
            description="Upload an image to represent this category"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {previewUrl ? (
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Category preview" 
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleDeleteImage}
                      isLoading={isDeleting}
                      disabled={isDeleting}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <p className="text-gray-500">No image uploaded</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col justify-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {isUploading && <Loading size="sm" className="ml-2" />}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Recommended size: 300x300px. Max file size: 5MB.
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
            {isEditMode ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </div>
    </form>
  );
};

CategoryForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onUploadImage: PropTypes.func,
  onDeleteImage: PropTypes.func,
  isLoading: PropTypes.bool,
  isEditMode: PropTypes.bool
};

export default CategoryForm;