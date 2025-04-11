import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTag, FiShoppingCart, FiUsers, FiPackage, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import Card from '../../../components/common/Card';
import useProducts from '../../products/hooks/useProducts';
import useCategories from '../../categories/hooks/useCategories';
import Loading from '../../../components/common/Loading';
import { formatCurrency } from '../../../utils/formatters';

const DashboardPage = () => {
  const { products, isLoading: productsLoading, loadProducts } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();
  
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  
  // Calculate summary metrics
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalInventory = products.reduce((sum, product) => sum + product.inventory, 0);
  
  // Find popular products (by sales count)
  const popularProducts = [...products]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);
    
  // Find low inventory products
  const lowInventoryThreshold = 5;
  const lowInventoryProducts = products
    .filter(product => product.inventory <= lowInventoryThreshold)
    .slice(0, 5);
  
  // Calculate inventory status distribution
  const inStockProducts = products.filter(p => p.status === 'IN_STOCK').length;
  const outOfStockProducts = products.filter(p => p.status === 'OUT_OF_STOCK').length;
  const preOrderProducts = products.filter(p => p.preOrder).length;
  
  // Page title and description for SEO
  document.title = 'Dashboard | Admin Dashboard';
  
  const isLoading = productsLoading || categoriesLoading;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your store's performance and inventory
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loading size="lg" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-primary-100 text-primary-600">
                  <FiShoppingBag className="h-6 w-6" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    Total Products
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {totalProducts}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-green-100 text-green-600">
                  <FiTag className="h-6 w-6" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    Total Categories
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {totalCategories}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-indigo-100 text-indigo-600">
                  <FiPackage className="h-6 w-6" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    Total Inventory
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {totalInventory} units
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-purple-100 text-purple-600">
                  <FiShoppingCart className="h-6 w-6" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 truncate">
                    Pre-Orders
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {preOrderProducts}
                  </p>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Data Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Products */}
            <Card 
              title="Popular Products" 
              description="Best selling products in your store"
              headerActions={
                <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700">
                  View all
                </Link>
              }
            >
              {popularProducts.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {popularProducts.map((product) => (
                    <div key={product.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        {product.images && product.images[0] ? (
                          <img 
                            src={product.images[0].downloadUrl} 
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                            <FiShoppingBag className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(product.price)}</p>
                        <p className="text-xs text-gray-500">Sold: {product.salesCount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No sales data available yet</p>
                </div>
              )}
            </Card>
            
            {/* Low Inventory Alert */}
            <Card 
              title="Low Inventory Alert" 
              description={`Products with inventory below ${lowInventoryThreshold} units`}
              headerActions={
                <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700">
                  View all
                </Link>
              }
            >
              {lowInventoryProducts.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {lowInventoryProducts.map((product) => (
                    <div key={product.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center">
                        {product.images && product.images[0] ? (
                          <img 
                            src={product.images[0].downloadUrl} 
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                            <FiShoppingBag className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.brand}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          product.inventory === 0 ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {product.inventory} units
                        </p>
                        <Link 
                          to={`/products/edit/${product.id}`} 
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          Update
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">All products have adequate inventory</p>
                </div>
              )}
            </Card>
            
            {/* Inventory Status */}
            <Card 
              title="Inventory Status" 
              description="Overview of product availability"
              className="lg:col-span-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <FiTrendingUp className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">In Stock</p>
                      <p className="text-2xl font-semibold text-green-600">{inStockProducts}</p>
                      <p className="text-xs text-gray-500">products available</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600">
                      <FiBarChart2 className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Out of Stock</p>
                      <p className="text-2xl font-semibold text-red-600">{outOfStockProducts}</p>
                      <p className="text-xs text-gray-500">products unavailable</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                      <FiShoppingCart className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Pre-Order</p>
                      <p className="text-2xl font-semibold text-purple-600">{preOrderProducts}</p>
                      <p className="text-xs text-gray-500">products on pre-order</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;