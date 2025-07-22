import React from 'react';
import { Brain, Package, AlertCircle, CheckCircle, Zap, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const RestockSuggestions: React.FC = () => {
  const { restockSuggestions, runAIAnalysis } = useApp();
  const [isRunningAnalysis, setIsRunningAnalysis] = React.useState(false);

  const priorityColors = {
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-600' },
    medium: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: 'text-orange-600' },
    low: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'text-blue-600' }
  };

  const handleRunAIAnalysis = async () => {
    setIsRunningAnalysis(true);
    try {
      await runAIAnalysis();
      // Show success message - in production, use a proper toast/notification system
      console.log('AI analysis completed! Check your Make.com scenarios for the latest data.');
    } catch (error) {
      console.error('Error running AI analysis. Please try again.', error);
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-sky-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Restocking Suggestions</h1>
            <p className="text-gray-600">5 items to restock</p>
          </div>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg p-6 mb-8 text-white">
        <div className="flex items-start space-x-4">
          <Brain className="w-6 h-6 mt-1" />
          <div>
            <h3 className="font-semibold mb-2">AI-Powered Recommendations</h3>
            <p className="text-sky-100 text-sm leading-relaxed">
              Based on your sales data and current inventory levels, we recommend restocking the following 
              items to maintain optimal stock levels. Our AI analyzes seasonal trends, sales velocity, 
              and demand patterns to suggest the right quantities. All insights are automatically sent to your Make.com workflows.
            </p>
          </div>
          <button
            onClick={handleRunAIAnalysis}
            disabled={isRunningAnalysis}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
          >
            {isRunningAnalysis ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm">Running...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span className="text-sm">Run AI Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-6">
        {restockSuggestions.map((suggestion) => {
          const colors = priorityColors[suggestion.priority];
          return (
            <div key={suggestion.productId} className={`${colors.bg} ${colors.border} border rounded-lg p-6`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <AlertCircle className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{suggestion.productName}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
                        {suggestion.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Stock</p>
                        <p className="font-semibold text-gray-900">{suggestion.currentStock} boxes</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Suggested Order</p>
                        <p className="font-semibold text-sky-600">{suggestion.suggestedQuantity} boxes</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Sales Trend</p>
                        <p className="text-sm text-gray-900">↑ 20% this month</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reason</p>
                        <p className="text-sm text-gray-900">{suggestion.reason}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>
                        {suggestion.priority === 'high' && 'High demand due to flu season'}
                        {suggestion.priority === 'medium' && 'Seasonal demand increase expected'}  
                        {suggestion.priority === 'low' && 'Consistent sales pattern detected'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                    Add to Order
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Bulk Actions</h3>
            <p className="text-sm text-gray-600">Manage multiple suggestions and webhook integrations</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
              View Inventory Dashboard
            </button>
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Order All Suggested
            </button>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Send className="w-4 h-4" />
            <span>
              All restock suggestions and AI insights are automatically sent to your Make.com webhooks for 
              automated supplier ordering, inventory alerts, and business intelligence dashboards.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestockSuggestions;
