import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Sale, InventoryStats, RestockSuggestion, SalesInsight } from '../types';
import { supabase } from '../lib/supabase';
import { sendSaleToMake, sendLowStockAlertToMake } from '../services/makeService';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [currentSaleItems, setCurrentSaleItems] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [loading, setLoading] = useState(false);

  // Load data from Supabase when user logs in
  useEffect(() => {
    if (currentUser) {
      loadUserData();
    } else {
      setProducts([]);
      setSales([]);
    }
  }, [currentUser]);

  const loadUserData = async () => {
    if (!currentUser) return;
    
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

  const login = (email: string, password: string): boolean => {
    // Simple login check - in real app this would connect to database
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
    // If login fails
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentSaleItems([]);
  };

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

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    try {
      // Update in Supabase
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
    } catch (error) {
      console.error('Error updating product:', error);
    }

    // Update local state
    setProducts(prev => 
      prev.map(p => p.id === productId ? { ...p, ...updates } : p)
    );
  };

  const getCurrentSale = () => {
    const total = currentSaleItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    return { items: currentSaleItems, total };
  };

  const clearCurrentSale = () => {
    setCurrentSaleItems([]);
  };

  // Calculate inventory stats
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

  // Generate restock suggestions
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

  // Generate sales insights
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
      clearCurrentSale
    }}>
      {children}
    </AppContext.Provider>
  );
};