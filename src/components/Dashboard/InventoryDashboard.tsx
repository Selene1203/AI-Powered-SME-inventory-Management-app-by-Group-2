import React from 'react';
import { Package, AlertTriangle, TrendingDown, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getWebhookConfig, getSheetHeaders } from '../../utils/makeIntegration';

const InventoryDashboard: React.FC = () => {
  const { inventoryStats, products, restockSuggestions } = useApp();

  const criticalItems = products.filter(p => p.currentStock <= p.reorderLevel);
  
  // Get Google Sheets headers for inventory tracking
  const inventoryHeaders = getSheetHeaders('inventory_tracking');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalItems}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-orange-600">{inventoryStats.lowStock}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600 mb-2">Last Updated</p>
          <div className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            <button className="text-sky-600 text-sm hover:text-sky-700">View All</button>
          </div>
          
          <div className="space-y-4">
            {inventoryStats.categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-700">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-medium">{category.count} items</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: category.color,
                        width: `${(category.count / inventoryStats.categories.reduce((sum, c) => sum + c.count, 0)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Items */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Critical Items</h2>
            <button className="text-sky-600 text-sm hover:text-sky-700">AI Suggestions</button>
          </div>
          
          <div className="space-y-3">
            {criticalItems.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    product.currentStock === 0 ? 'bg-red-500' : 'bg-orange-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.currentStock === 0 ? 'Out of stock' : `Low stock (${product.currentStock} units)`}
                    </p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-sky-500 text-white text-sm rounded-lg hover:bg-sky-600 transition-colors">
                  Reorder
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button className="flex-1 bg-sky-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-sky-600 transition-colors">
          Sales Insights
        </button>
        <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Print Report
        </button>
      </div>

      {/* Navigation Pills */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-2 py-2 flex space-x-1">
        <button className="p-3 text-sky-600 bg-sky-50 rounded-full">
          <Package className="w-5 h-5" />
        </button>
        <button className="p-3 text-gray-400 hover:text-gray-600 rounded-full">
          <Eye className="w-5 h-5" />
        </button>
        <button className="p-3 text-gray-400 hover:text-gray-600 rounded-full">
          <TrendingDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default InventoryDashboard;