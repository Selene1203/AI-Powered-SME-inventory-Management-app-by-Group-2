import { User, Product, Sale } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    code: 'user_001',
    name: 'Maria Santos',
    email: 'sliqman42@gmail.com',
    businessName: 'Yarona Pharmacy'
  },
  {
    id: '2',
    code: 'user_002',
    name: 'John Dela Cruz',
    email: 'john@healthplus.com',
    businessName: 'HealthPlus Clinic'
  }
];

export const mockProducts: Product[] = [
  // User 001 products
  {
    id: 'user_001_prod_1',
    name: 'Paracetamol 500mg',
    sku: 'MED-1234',
    price: 24.00, // M24.00
    currentStock: 8,
    category: 'Prescription',
    reorderLevel: 20,
    lastSold: new Date('2024-01-15')
  },
  {
    id: 'user_001_prod_2',
    name: 'Amoxicillin 250mg',
    sku: 'MED-5678',
    price: 35.50, // M35.50
    currentStock: 15,
    category: 'Prescription',
    reorderLevel: 25,
    lastSold: new Date('2024-01-14')
  },
  {
    id: 'user_001_prod_3',
    name: 'Vitamin C 1000mg',
    sku: 'VIT-9012',
    price: 18.75, // M18.75
    currentStock: 5,
    category: 'OTC',
    reorderLevel: 30,
    lastSold: new Date('2024-01-13')
  },
  {
    id: 'user_001_prod_4',
    name: 'Ibuprofen 400mg',
    sku: 'MED-3456',
    price: 28.50, // M28.50
    currentStock: 12,
    category: 'OTC',
    reorderLevel: 20,
    lastSold: new Date('2024-01-12')
  },
  {
    id: 'user_001_prod_5',
    name: 'Insulin Novomix',
    sku: 'INS-7890',
    price: 450.00, // M450.00
    currentStock: 3,
    category: 'Prescription',
    reorderLevel: 10,
    lastSold: new Date('2024-01-11')
  },
  {
    id: 'user_001_prod_6',
    name: 'Ventolin Inhaler',
    sku: 'INH-2345',
    price: 285.00, // M285.00
    currentStock: 0,
    category: 'Prescription',
    reorderLevel: 15,
    lastSold: new Date('2024-01-10')
  },
  // User 002 products
  {
    id: 'user_002_prod_1',
    name: 'Aspirin 325mg',
    sku: 'MED-ASP1',
    price: 15.00, // M15.00
    currentStock: 45,
    category: 'OTC',
    reorderLevel: 25,
    lastSold: new Date('2024-01-15')
  }
];

export const mockSales: Sale[] = [
  {
    id: 'sale_1',
    userCode: 'user_001',
    productId: 'user_001_prod_1',
    quantity: 2,
    totalAmount: 48.00, // M48.00
    timestamp: new Date('2024-01-15T10:30:00')
  },
  {
    id: 'sale_2',
    userCode: 'user_001',
    productId: 'user_001_prod_2',
    quantity: 1,
    totalAmount: 35.50, // M35.50
    timestamp: new Date('2024-01-15T11:15:00')
  },
  {
    id: 'sale_3',
    userCode: 'user_002',
    productId: 'user_002_prod_1',
    quantity: 3,
    totalAmount: 45.00, // M45.00
    timestamp: new Date('2024-01-15T09:45:00')
  }
];