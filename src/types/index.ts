export interface User {
  id: string;
  code: string;
  name: string;
  email: string;
  businessName: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  currentStock: number;
  category: string;
  image?: string;
  reorderLevel: number;
  lastSold?: Date;
}

export interface Sale {
  id: string;
  userCode: string;
  productId: string;
  quantity: number;
  totalAmount: number;
  timestamp: Date;
}

export interface InventoryStats {
  totalItems: number;
  lowStock: number;
  outOfStock: number;
  categories: CategoryStats[];
}

export interface CategoryStats {
  name: string;
  count: number;
  color: string;
}

export interface RestockSuggestion {
  productId: string;
  productName: string;
  currentStock: number;
  suggestedQuantity: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

export interface SalesInsight {
  type: 'trend' | 'forecast' | 'alert';
  title: string;
  description: string;
  data?: any;
}