import React from 'react';
import { TrendingUp, Brain, BarChart3, PieChart, Zap, Webhook } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatCurrencyShort } from '../../utils/currency';

const SalesInsights: React.FC = () => {
  const { salesInsights, runAIAnalysis } = useApp();
  const [isRunningAnalysis, setIsRunningAnalysis] = React.useState(false);

  const monthlyData = [
    { month: 'Jan', sales: 180000 },
    { month: 'Feb', sales: 195000 },
    { month: 'Mar', sales: 220000 },
    { month: 'Apr', sales: 240000 },
    { month: 'May', sales: 248320 },
    { month: 'Jun', sales: 277000 }
  ];

  const categoryData = [
    { name: 'Prescription', value: 45, color: '#0EA5E9' },
    { name: 'OTC Medicines', value: 30, color: '#06B6D4' },
    { name: 'First Aid', value: 15, color: '#8B5CF6' },
    { name: 'Baby Care', value: 10, color: '#F59E0B' }
  ];

  const topProducts = [
    { name: 'Paracetamol 500mg', sales: 1250, growth: 12 },
    { name: 'Amoxicillin 250mg', sales: 980, growth: 8 },
    { name: 'Vitamin C 1000mg', sales: 875, growth: 15 },
    { name: 'Ibuprofen 400mg', sales: 750, growth: -3 }
  ];

  const handleRunAIAnalysis = async () => {
    setIsRunningAnalysis(true);
    try {
      await runAIAnalysis();
      alert('AI analysis completed! Advanced insights have been sent to your Make.com workflows.');
    } catch (error) {
      alert('Error running AI analysis. Please check your webhook configuration.');
    } finally {
      setIsRunningAnalysis(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-8 h-8 text-sky-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Insights</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className="px-2 py-1 bg-sky-100 text-sky-800 text-xs rounded-full">Inventory</span>
              <span className="text-gray-600 text-sm">Last 6 months</span>
              <button
                onClick={handleRunAIAnalysis}
                disabled={isRunningAnalysis}
                className="flex items-center space-x-1 px-3 py-1 bg-sky-500 text-white text-xs rounded-full hover:bg-sky-600 transition-colors disabled:opacity-50"
              >
                {isRunningAnalysis ? (
                  <>
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Running AI Analysis...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3" />
                    <span>Run AI Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Sales</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(248320)}</p>
          <p className="text-sm text-green-600">+12.4% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Growth</span>
            <BarChart3 className="w-5 h-5 text-sky-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">+12.4%</p>
          <p className="text-sm text-gray-600">Monthly growth rate</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Daily Average</span>
            <PieChart className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(8277)}</p>
          <p className="text-sm text-gray-600">Per day this month</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Transactions</span>
            <Brain className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">1,245</p>
          <p className="text-sm text-gray-600">This month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Sales Trend */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Sales Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Sales']} />
                <Line type="monotone" dataKey="sales" stroke="#0EA5E9" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <RechartsPieChart data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                <span className="text-sm text-gray-600">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Generated Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg p-6 mb-8">
        <div className="flex items-start space-x-4">
          <Brain className="w-6 h-6 text-sky-600 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Generated Insights</h3>
            <p className="text-gray-700 mb-4">
              Sales of cold medications have increased by 27% this week, suggesting a seasonal illness outbreak. 
              Consider increasing stock levels for related products like cough syrups and throat lozenges.
              All AI insights are automatically sent to your Make.com workflows for automated decision-making.
            </p>
            <div className="flex items-center space-x-4">
              <button className="text-sky-600 text-sm hover:text-sky-700 font-medium">
                View suggestions →
              </button>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Webhook className="w-3 h-3" />
                <span>Connected to Make.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-600 font-medium">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} units sold</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.growth >= 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.growth >= 0 ? '+' : ''}{product.growth}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alert</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Amoxicillin 500mg</p>
              <p className="text-sm text-red-600">Only 3 units left</p>
            </div>
            <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
              Reorder
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Ibuprofen 650mg</p>
              <p className="text-sm text-orange-600">Low stock - 8 units left</p>
            </div>
            <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
              Reorder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesInsights;
