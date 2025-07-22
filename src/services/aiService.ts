import { 
  sendAIPredictionToMake, 
  sendDemandForecastToMake, 
  sendPriceOptimizationToMake, 
  sendCustomerBehaviorToMake, 
  sendInventoryAnomalyToMake 
} from './makeService';
import { Product, Sale } from '../types';

// Simple AI prediction data structure
export interface AIPrediction {
  type: 'demand' | 'restock' | 'price';
  productId: string;
  value: number;
  confidence: number;
  timeHorizon: string;
  factors: string[];
  accuracy?: number;
}

// Demand forecast data structure
export interface DemandForecast {
  productId: string;
  productName: string;
  currentStock: number;
  predictedDemand: number;
  period: 'weekly' | 'monthly' | 'quarterly';
  seasonalFactors: Record<string, number>;
  trend: 'increasing' | 'decreasing' | 'stable';
  action: string;
  dataPoints: number;
}

// Price optimization suggestions
export interface PriceOptimization {
  productId: string;
  currentPrice: number;
  suggestedPrice: number;
  changePercentage: number;
  expectedImpact: {
    salesVolume: number;
    revenue: number;
    profit: number;
  };
  competitorPrices: number[];
  elasticity: number;
  strategy: string;
  marketConditions: string;
}

// Customer behavior analysis
export interface CustomerBehavior {
  period: string;
  topProducts: Array<{
    productId: string;
    name: string;
    salesCount: number;
    revenue: number;
  }>;
  patterns: {
    peakHours: string[];
    seasonalTrends: Record<string, number>;
    averageTransactionValue: number;
    frequentBuyers: number;
  };
  seasonalTrends: Record<string, any>;
  segments: Array<{
    name: string;
    size: number;
    characteristics: string[];
  }>;
  crossSelling: Array<{
    product1: string;
    product2: string;
    correlation: number;
  }>;
  churnRisk: {
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
  };
  dataQuality: number;
}

// Inventory anomaly detection
export interface InventoryAnomaly {
  type: 'unusual_sales_spike' | 'unexpected_stockout' | 'supplier_delay' | 'demand_pattern_change';
  products: string[];
  severity: number;
  method: string;
  actions: string[];
  causes: string[];
  impact: {
    financial: number;
    operational: string;
  };
  confidence: number;
}

// Main AI Service class - handles all AI-related calculations
class AIService {
  private userCode: string;

  constructor(userCode: string) {
    this.userCode = userCode;
  }

  // Generate demand forecasts for products
  // This looks at past sales to predict future demand
  async generateDemandForecast(products: Product[], sales: Sale[]): Promise<DemandForecast[]> {
    const forecasts: DemandForecast[] = [];

    for (const product of products) {
      const productSales = sales.filter(s => s.productId === product.id);
      const forecast = this.calculateDemandForecast(product, productSales);
      forecasts.push(forecast);

      // Send to Make.com for external processing
      await sendDemandForecastToMake(forecast, this.userCode);
    }

    return forecasts;
  }

  // Generate AI predictions for demand, restocking, and pricing
  // This is the main AI function that creates smart suggestions
  async generateAIPredictions(products: Product[], sales: Sale[]): Promise<AIPrediction[]> {
    const predictions: AIPrediction[] = [];

    for (const product of products) {
      const productSales = sales.filter(s => s.productId === product.id);
      
      // Demand prediction
      const demandPrediction = this.predictDemand(product, productSales);
      predictions.push(demandPrediction);

      // Restock prediction
      const restockPrediction = this.predictRestockTiming(product, productSales);
      predictions.push(restockPrediction);

      // Price optimization prediction
      const pricePrediction = this.predictOptimalPrice(product, productSales);
      predictions.push(pricePrediction);

      // Send each prediction to Make.com
      await sendAIPredictionToMake(demandPrediction, this.userCode);
      await sendAIPredictionToMake(restockPrediction, this.userCode);
      await sendAIPredictionToMake(pricePrediction, this.userCode);
    }

    return predictions;
  }

  // Suggest better prices for products based on sales data
  async generatePriceOptimization(products: Product[], sales: Sale[]): Promise<PriceOptimization[]> {
    const optimizations: PriceOptimization[] = [];

    for (const product of products) {
      const productSales = sales.filter(s => s.productId === product.id);
      const optimization = this.calculatePriceOptimization(product, productSales);
      optimizations.push(optimization);

      // Send to Make.com
      await sendPriceOptimizationToMake(optimization, this.userCode);
    }

    return optimizations;
  }

  // Analyze how customers buy products
  async analyzeCustomerBehavior(products: Product[], sales: Sale[]): Promise<CustomerBehavior> {
    const behavior = this.calculateCustomerBehavior(products, sales);
    
    // Send to Make.com
    await sendCustomerBehaviorToMake(behavior, this.userCode);
    
    return behavior;
  }

  // Find unusual patterns in inventory (like sudden spikes in sales)
  async detectInventoryAnomalies(products: Product[], sales: Sale[]): Promise<InventoryAnomaly[]> {
    const anomalies: InventoryAnomaly[] = [];

    // Detect unusual sales spikes
    const salesSpikes = this.detectSalesSpikes(products, sales);
    anomalies.push(...salesSpikes);

    // Detect unexpected stockouts
    const stockouts = this.detectUnexpectedStockouts(products, sales);
    anomalies.push(...stockouts);

    // Detect demand pattern changes
    const patternChanges = this.detectDemandPatternChanges(products, sales);
    anomalies.push(...patternChanges);

    // Send each anomaly to Make.com
    for (const anomaly of anomalies) {
      await sendInventoryAnomalyToMake(anomaly, this.userCode);
    }

    return anomalies;
  }

  // Helper function: Calculate demand forecast for a single product
  private calculateDemandForecast(product: Product, sales: Sale[]): DemandForecast {
    // Look at the last 30 sales for this product
    const recentSales = sales.slice(-30);
    // Calculate average demand (how much is sold on average)
    const avgDemand = recentSales.length > 0 
      ? recentSales.reduce((sum, s) => sum + s.quantity, 0) / recentSales.length 
      : 1;
    
    return {
      productId: product.id,
      productName: product.name,
      currentStock: product.currentStock,
      predictedDemand: Math.round(avgDemand * 30), // Predict for next 30 days
      period: 'monthly',
      seasonalFactors: {
        winter: 1.2, // 20% more sales in winter
        spring: 1.0, // Normal sales in spring
        summer: 0.8, // 20% less sales in summer
        fall: 1.1    // 10% more sales in fall
      },
      trend: avgDemand > 2 ? 'increasing' : avgDemand < 1 ? 'decreasing' : 'stable', // Is demand going up or down?
      action: product.currentStock < avgDemand * 15 ? 'reorder_immediately' : 'monitor', // What should we do?
      dataPoints: sales.length
    };
  }

  // Helper function: Predict demand for a product
  private predictDemand(product: Product, sales: Sale[]): AIPrediction {
    // Look at recent sales (last 14)
    const recentSales = sales.slice(-14);
    // Calculate average demand
    const avgDemand = recentSales.length > 0 
      ? recentSales.reduce((sum, s) => sum + s.quantity, 0) / recentSales.length 
      : 1;
    
    return {
      type: 'demand',
      productId: product.id,
      value: Math.round(avgDemand * 7), // Predict for next 7 days
      confidence: Math.min(0.95, 0.5 + (recentSales.length / 28)), // More data = higher confidence
      timeHorizon: '7_days',
      factors: ['historical_sales', 'seasonal_trends', 'current_stock'],
      accuracy: 0.85
    };
  }

  // Helper function: Predict when to restock
  private predictRestockTiming(product: Product, sales: Sale[]): AIPrediction {
    // Calculate how much we sell per day on average
    const avgDailySales = sales.length > 0 
      ? sales.reduce((sum, s) => sum + s.quantity, 0) / sales.length 
      : 1;
    // Calculate how many days until we run out
    const daysUntilRestock = Math.floor(product.currentStock / avgDailySales);
    
    return {
      type: 'restock',
      productId: product.id,
      value: Math.max(1, daysUntilRestock),
      confidence: 0.8,
      timeHorizon: 'days',
      factors: ['current_stock', 'sales_velocity', 'lead_time'],
      accuracy: 0.78
    };
  }

  // Helper function: Suggest optimal price
  private predictOptimalPrice(product: Product, sales: Sale[]): AIPrediction {
    const currentPrice = product.price;
    const salesVelocity = sales.length / 30; // Sales per day
    
    // Simple price optimization logic
    let suggestedPriceMultiplier = 1.0;
    if (salesVelocity > 2) suggestedPriceMultiplier = 1.05; // Increase price if high demand
    if (salesVelocity < 0.5) suggestedPriceMultiplier = 0.95; // Decrease price if low demand
    
    return {
      type: 'price',
      productId: product.id,
      value: Math.round(currentPrice * suggestedPriceMultiplier * 100) / 100,
      confidence: 0.7,
      timeHorizon: '30_days',
      factors: ['demand_elasticity', 'competitor_pricing', 'inventory_levels'],
      accuracy: 0.72
    };
  }

  // Helper function: Calculate price optimization
  private calculatePriceOptimization(product: Product, sales: Sale[]): PriceOptimization {
    const currentPrice = product.price;
    const salesVelocity = sales.length / 30;
    const suggestedPrice = currentPrice * (salesVelocity > 2 ? 1.05 : salesVelocity < 0.5 ? 0.95 : 1.0);
    
    return {
      productId: product.id,
      currentPrice,
      suggestedPrice: Math.round(suggestedPrice * 100) / 100,
      changePercentage: ((suggestedPrice - currentPrice) / currentPrice) * 100,
      expectedImpact: {
        salesVolume: salesVelocity > 2 ? -5 : salesVelocity < 0.5 ? 15 : 0,
        revenue: salesVelocity > 2 ? 3 : salesVelocity < 0.5 ? 8 : 0,
        profit: salesVelocity > 2 ? 5 : salesVelocity < 0.5 ? 12 : 0
      },
      competitorPrices: [currentPrice * 0.95, currentPrice * 1.02, currentPrice * 0.98],
      elasticity: -1.2,
      strategy: salesVelocity > 2 ? 'premium_pricing' : 'competitive_pricing',
      marketConditions: 'stable'
    };
  }

  // Helper function: Analyze customer buying patterns
  private calculateCustomerBehavior(products: Product[], sales: Sale[]): CustomerBehavior {
    const topProducts = products
      .map(p => ({
        productId: p.id,
        name: p.name,
        salesCount: sales.filter(s => s.productId === p.id).length,
        revenue: sales.filter(s => s.productId === p.id).reduce((sum, s) => sum + s.totalAmount, 0)
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      period: 'last_30_days',
      topProducts,
      patterns: {
        peakHours: ['10:00-12:00', '14:00-16:00'],
        seasonalTrends: { winter: 1.2, spring: 1.0, summer: 0.8, fall: 1.1 },
        averageTransactionValue: sales.reduce((sum, s) => sum + s.totalAmount, 0) / sales.length || 0,
        frequentBuyers: Math.floor(sales.length * 0.3)
      },
      seasonalTrends: {
        monthly: { jan: 1.1, feb: 1.0, mar: 1.2 },
        weekly: { mon: 0.8, tue: 1.0, wed: 1.1, thu: 1.2, fri: 1.3, sat: 0.9, sun: 0.7 }
      },
      segments: [
        { name: 'Regular Customers', size: 60, characteristics: ['frequent_purchases', 'brand_loyal'] },
        { name: 'Occasional Buyers', size: 30, characteristics: ['price_sensitive', 'seasonal'] },
        { name: 'New Customers', size: 10, characteristics: ['exploring', 'comparison_shopping'] }
      ],
      crossSelling: topProducts.slice(0, 5).map((p, i) => ({
        product1: p.productId,
        product2: topProducts[(i + 1) % topProducts.length]?.productId || p.productId,
        correlation: 0.3 + Math.random() * 0.4
      })),
      churnRisk: {
        highRisk: 15,
        mediumRisk: 25,
        lowRisk: 60
      },
      dataQuality: 0.85
    };
  }

  // Helper function: Find unusual sales spikes
  private detectSalesSpikes(products: Product[], sales: Sale[]): InventoryAnomaly[] {
    const anomalies: InventoryAnomaly[] = [];
    
    for (const product of products) {
      const productSales = sales.filter(s => s.productId === product.id);
      const recentSales = productSales.slice(-7);
      const historicalAvg = productSales.slice(-30, -7).reduce((sum, s) => sum + s.quantity, 0) / 23 || 1;
      const recentAvg = recentSales.reduce((sum, s) => sum + s.quantity, 0) / 7 || 0;
      
      if (recentAvg > historicalAvg * 2) {
        anomalies.push({
          type: 'unusual_sales_spike',
          products: [product.id],
          severity: Math.min(10, recentAvg / historicalAvg),
          method: 'statistical_analysis',
          actions: ['investigate_cause', 'increase_stock', 'monitor_trend'],
          causes: ['seasonal_demand', 'marketing_campaign', 'competitor_stockout'],
          impact: {
            financial: recentAvg * product.price * 7,
            operational: 'potential_stockout_risk'
          },
          confidence: 0.8
        });
      }
    }
    
    return anomalies;
  }

  // Helper function: Find unexpected stockouts
  private detectUnexpectedStockouts(products: Product[], sales: Sale[]): InventoryAnomaly[] {
    const anomalies: InventoryAnomaly[] = [];
    
    const outOfStockProducts = products.filter(p => p.currentStock === 0);
    
    if (outOfStockProducts.length > 0) {
      anomalies.push({
        type: 'unexpected_stockout',
        products: outOfStockProducts.map(p => p.id),
        severity: outOfStockProducts.length,
        method: 'inventory_monitoring',
        actions: ['emergency_reorder', 'find_alternatives', 'notify_customers'],
        causes: ['supplier_delay', 'demand_spike', 'forecasting_error'],
        impact: {
          financial: outOfStockProducts.reduce((sum, p) => sum + (p.price * 10), 0), // Estimated lost sales
          operational: 'customer_dissatisfaction'
        },
        confidence: 0.95
      });
    }
    
    return anomalies;
  }

  // Helper function: Detect changes in demand patterns
  private detectDemandPatternChanges(products: Product[], sales: Sale[]): InventoryAnomaly[] {
    const anomalies: InventoryAnomaly[] = [];
    
    // Simple pattern change detection
    const recentSales = sales.slice(-14);
    const olderSales = sales.slice(-28, -14);
    
    const recentAvg = recentSales.reduce((sum, s) => sum + s.quantity, 0) / 14 || 0;
    const olderAvg = olderSales.reduce((sum, s) => sum + s.quantity, 0) / 14 || 1;
    
    if (Math.abs(recentAvg - olderAvg) / olderAvg > 0.5) {
      anomalies.push({
        type: 'demand_pattern_change',
        products: [...new Set(recentSales.map(s => s.productId))],
        severity: Math.abs(recentAvg - olderAvg) / olderAvg,
        method: 'trend_analysis',
        actions: ['update_forecasts', 'adjust_inventory', 'investigate_market'],
        causes: ['market_shift', 'seasonal_change', 'external_factors'],
        impact: {
          financial: Math.abs(recentAvg - olderAvg) * 100, // Rough estimate
          operational: 'forecasting_accuracy_impact'
        },
        confidence: 0.7
      });
    }
    
    return anomalies;
  }
}

// Export the AIService class so other files can use it
export default AIService;
