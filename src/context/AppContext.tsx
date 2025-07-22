import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Sale, InventoryStats, RestockSuggestion, SalesInsight } from '../types';
import { supabase } from '../lib/supabase';
import { sendSaleToMake, sendLowStockAlertToMake, testMakeWebhookConnection } from '../services/makeService';
import AIService from '../services/aiService';

// Define what our app context provides to all components
interface AppContextType {
  currentUser: User | null;
  products: Product[];
  sales: Sale[];
  inventoryStats: InventoryStats;
  restockSuggestions: RestockSuggestion[];
  salesInsights: SalesInsight[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addSale: (productId: string, quantity: number) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  getCurrentSale: () => { items: Array<{ product: Product; quantity: number }>, total: number };
  clearCurrentSale: () => void;
  runAIAnalysis: () => Promise<void>;
  testWebhookConnection: () => Promise<boolean>;
}

// Create the context (this is like a global state for our app)
const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook to use the app context in components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Main provider component that wraps our entire app
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [currentSaleItems, setCurrentSaleItems] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [aiService, setAiService] = useState<AIService | null>(null);

  // Load user data when someone logs in
  // This runs automatically when currentUser changes
  useEffect(() => {
    if (currentUser) {
      loadUserData();
    } else {
      setProducts([]);
      setSales([]);
      setAiService(null);
    }
  }, [currentUser]);

  // Set up AI service for the current user
  // Each user gets their own AI service instance
  useEffect(() => {
    if (currentUser) {
      setAiService(new AIService(currentUser.code));
    }
  }, [currentUser]);

  const loadUserData = async () => {
    // Don't try to load data if no user is logged in
    if (!currentUser) return;
    
    // If Supabase is not configured, use mock data
    if (!supabase) {
      console.warn('Supabase not configured, using mock data');
      return;
    }
    
    setLoading(true);
    try {
      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_code', currentUser.code);

      if (productsError) throw productsError;

      // Load sales
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .eq('user_code', currentUser.code)
        .order('created_at', { ascending: false });

      if (salesError) throw salesError;

      // Transform data to match our types
      const transformedProducts: Product[] = productsData?.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: p.price,
        currentStock: p.current_stock,
        category: p.category,
        image: p.image,
        reorderLevel: p.reorder_level,
        lastSold: p.last_sold ? new Date(p.last_sold) : undefined,
      })) || [];

      const transformedSales: Sale[] = salesData?.map(s => ({
        id: s.id,
        userCode: s.user_code,
        productId: s.product_id,
        quantity: s.quantity,
        totalAmount: s.total_amount,
        timestamp: new Date(s.timestamp),
      })) || [];

      setProducts(transformedProducts);
      setSales(transformedSales);

      // Check for low stock and send alerts to Make.com
      const lowStockProducts = transformedProducts.filter(p => p.currentStock <= p.reorderLevel);
      if (lowStockProducts.length > 0) {
        sendLowStockAlertToMake(lowStockProducts, currentUser.code);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simple login function - checks email and password
  const login = (email: string, password: string): boolean => {
    // In a real app, this would check against a database
    if (email === 'maria@yaronapharmacy.com' && password === 'password') {
      const userData: User = {
        id: '1',
        code: 'user_001',
        name: 'Maria Santos',
        email: 'maria@yaronapharmacy.com',
        businessName: 'Yarona Pharmacy'
      };
      setCurrentUser(userData);
      return true;
    }
    if (email === 'john@healthplus.com' && password === 'password') {
      const userData: User = {
        id: '2',
        code: 'user_002',
        name: 'John Dela Cruz',
        email: 'john@healthplus.com',
        businessName: 'HealthPlus Clinic'
      };
      setCurrentUser(userData);
      return true;
    }
    // Return false if login credentials don't match
    return false;
  };

  // Log out the current user
  const logout = () => {
    setCurrentUser(null);
    setCurrentSaleItems([]);
  };

  // Add a sale (when someone buys something)
  const addSale = async (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (product && currentUser) {
      // Add to current sale
      const existingItem = currentSaleItems.find(item => item.product.id === productId);
      if (existingItem) {
        setCurrentSaleItems(prev => 
          prev.map(item => 
            item.product.id === productId 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        setCurrentSaleItems(prev => [...prev, { product, quantity }]);
      }

      // Create sale record
      const newSale: Sale = {
        id: `sale_${Date.now()}`,
        userCode: currentUser.code,
        productId,
        quantity,
        totalAmount: product.price * quantity,
        timestamp: new Date()
      };

      try {
        // Save sale to Supabase
        if (supabase) {
          const { error: saleError } = await supabase
            .from('sales')
            .insert({
              user_code: currentUser.code,
              product_id: productId,
              quantity,
              total_amount: product.price * quantity,
              timestamp: new Date().toISOString(),
            });

          if (saleError) throw saleError;

          // Update product stock in Supabase
          const { error: productError } = await supabase
            .from('products')
            .update({ 
              current_stock: product.currentStock - quantity,
              last_sold: new Date().toISOString()
            })
            .eq('id', productId);

          if (productError) throw productError;
        }

        // Send sale data to Make.com
        await sendSaleToMake(newSale, currentUser.code);

      } catch (error) {
        console.error('Error saving sale:', error);
      }

      // Update local state
      setProducts(prev => 
        prev.map(p => 
          p.id === productId 
            ? { ...p, currentStock: p.currentStock - quantity, lastSold: new Date() }
            : p
        )
      );

      setSales(prev => [...prev, newSale]);
    }
  };

  // Update product information
  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      // Update in Supabase
      if (supabase) {
        const supabaseUpdates: any = {};
        if (updates.name) supabaseUpdates.name = updates.name;
        if (updates.price) supabaseUpdates.price = updates.price;
        if (updates.currentStock !== undefined) supabaseUpdates.current_stock = updates.currentStock;
        if (updates.category) supabaseUpdates.category = updates.category;
        if (updates.reorderLevel) supabaseUpdates.reorder_level = updates.reorderLevel;

        const { error } = await supabase
          .from('products')
          .update(supabaseUpdates)
          .eq('id', productId);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }

    // Update local state
    setProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, ...updates } : p)
    );
  };

  // Get the current sale being processed
  const getCurrentSale = () => {
    const total = currentSaleItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    return { items: currentSaleItems, total };
  };

  // Clear the current sale (after completing it)
  const clearCurrentSale = () => {
    setCurrentSaleItems([]);
  };

  // Run AI analysis on all products and sales
  const runAIAnalysis = async () => {
    if (!aiService || !currentUser) return;
    
    setLoading(true);
    try {
      console.log('Running AI analysis...');
      
      // Run all AI analyses
      await Promise.all([
        aiService.generateDemandForecast(products, sales),
        aiService.generateAIPredictions(products, sales),
        aiService.generatePriceOptimization(products, sales),
        aiService.analyzeCustomerBehavior(products, sales),
        aiService.detectInventoryAnomalies(products, sales)
      ]);
      
      console.log('AI analysis completed and sent to Make.com');
    } catch (error) {
      console.error('Error running AI analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test if our webhook connection to Make.com is working
  const testWebhookConnection = async (): Promise<boolean> => {
    return await testMakeWebhookConnection();
  };

  // Calculate statistics about our inventory
  // This gives us totals, low stock counts, etc.
  const inventoryStats: InventoryStats = {
    totalItems: products.reduce((sum, p) => sum + p.currentStock, 0),
    lowStock: products.filter(p => p.currentStock <= p.reorderLevel && p.currentStock > 0).length,
    outOfStock: products.filter(p => p.currentStock === 0).length,
    categories: [
      { name: 'Prescription', count: products.filter(p => p.category === 'Prescription').length, color: '#0EA5E9' },
      { name: 'OTC Medicines', count: products.filter(p => p.category === 'OTC').length, color: '#06B6D4' },
      { name: 'First Aid', count: products.filter(p => p.category === 'First Aid').length, color: '#8B5CF6' },
      { name: 'Baby Care', count: products.filter(p => p.category === 'Baby Care').length, color: '#F59E0B' },
    ]
  };

  // Create suggestions for what products to restock
  const restockSuggestions: RestockSuggestion[] = products
    .filter(p => p.currentStock <= p.reorderLevel)
    .map(p => ({
      productId: p.id,
      productName: p.name,
      currentStock: p.currentStock,
      suggestedQuantity: Math.max(50, p.reorderLevel * 2),
      priority: p.currentStock === 0 ? 'high' : p.currentStock <= p.reorderLevel / 2 ? 'medium' : 'low',
      reason: p.currentStock === 0 ? 'Out of stock' : 'Low stock (3 units)'
    }));

  // Create insights about sales performance
  const salesInsights: SalesInsight[] = [
    {
      type: 'trend',
      title: 'Monthly Sales Growth',
      description: 'Sales increased by 12.4% from last month with ₱8,277 daily average',
      data: { growth: 12.4, average: 8277 }
    },
    {
      type: 'forecast',
      title: 'AI-Generated Insights',
      description: 'Sales of cold medications have increased by 27% this week, suggesting seasonal illness outbreak. Consider increasing stock levels.'
    }
  ];

  // Provide all the data and functions to child components
  return (
    <AppContext.Provider value={{
      currentUser,
      products,
      sales,
      inventoryStats,
      restockSuggestions,
      salesInsights,
      login,
      logout,
      addSale,
      updateProduct,
      getCurrentSale,
      clearCurrentSale,
      runAIAnalysis,
      testWebhookConnection
    }}>
      {children}
    </AppContext.Provider>
  );
};
