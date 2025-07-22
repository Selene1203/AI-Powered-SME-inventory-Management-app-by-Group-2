import React, { useState } from 'react';
import { Scan, Search, Plus, ShoppingCart, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/currency';

const SalesEntry: React.FC = () => {
  const { products, addSale, getCurrentSale, clearCurrentSale } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  
  const currentSale = getCurrentSale();
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToSale = (productId: string) => {
    addSale(productId, 1);
  };

  const handleCompleteSale = () => {
    clearCurrentSale();
    console.log('Sale completed successfully!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sales Entry</h1>
        <p className="text-gray-600">Add new sales to the system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Sale */}
          {currentSale.items.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Sale</h2>
              <div className="space-y-3">
                {currentSale.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-sky-500 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-500">SKU: {item.product.sku} • {item.quantity} boxes</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">{formatCurrency(item.product.price * item.quantity)}</p>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(currentSale.total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Search and Scanner */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setShowScanner(!showScanner)}
                className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
              >
                <Scan className="w-5 h-5" />
                <span>Scan Barcode</span>
              </button>
              
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            {showScanner && (
              <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-lg">
                <p className="text-sky-800 text-sm">Barcode scanner simulation - Click on any product below to add it</p>
              </div>
            )}

            {/* Quick Add Products Grid */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add Products</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredProducts.slice(0, 8).map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg mb-3 flex items-center justify-center">
                      <Package className="w-8 h-8 text-sky-600" />
                    </div>
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{product.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">Selling: {formatCurrency(product.price)}</p>
                    <button
                      onClick={() => handleAddToSale(product.id)}
                      disabled={product.currentStock === 0}
                      className={`w-full py-2 px-3 text-xs rounded-lg font-medium transition-colors ${
                        product.currentStock === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-sky-500 text-white hover:bg-sky-600'
                      }`}
                    >
                      <Plus className="w-3 h-3 inline mr-1" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="space-y-6">
          {/* Sale Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleCompleteSale}
                disabled={currentSale.items.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  currentSale.items.length === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-sky-500 text-white hover:bg-sky-600'
                }`}
              >
                Complete Sale
              </button>
              
              <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Manual Entry
              </button>
              
              <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Inventory Dashboard
              </button>
              
              <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Cancel Sale
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Sales</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Transactions</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue</span>
                <span className="font-semibold">{formatCurrency(2450)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Items Sold</span>
                <span className="font-semibold">47</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesEntry;