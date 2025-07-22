const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL;
const MAKE_AI_WEBHOOK_URL = import.meta.env.VITE_MAKE_AI_WEBHOOK_URL;
const MAKE_ANALYTICS_WEBHOOK_URL = import.meta.env.VITE_MAKE_ANALYTICS_WEBHOOK_URL;
const MAKE_ALERTS_WEBHOOK_URL = import.meta.env.VITE_MAKE_ALERTS_WEBHOOK_URL;

export interface MakeWebhookData {
  type: 'sale' | 'restock' | 'low_stock_alert' | 'ai_prediction' | 'demand_forecast' | 'price_optimization' | 'supplier_alert' | 'customer_behavior' | 'inventory_anomaly';
  data: any;
  timestamp: string;
  user_code: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

export const sendToMake = async (webhookData: MakeWebhookData, webhookUrl?: string): Promise<boolean> => {
  const targetUrl = webhookUrl || MAKE_WEBHOOK_URL;
  
  if (!targetUrl) {
    console.warn('Make.com webhook URL not configured - data would be sent in production');
    return false;
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'sme-inventory-tool',
        'X-User-Code': webhookData.user_code,
      },
      body: JSON.stringify({
        ...webhookData,
        app_version: '1.0.0',
        environment: import.meta.env.MODE || 'development',
      }),
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json().catch(() => ({}));
    console.log('Successfully sent data to Make.com:', webhookData.type);
    return true;
  } catch (error) {
    console.error('Error sending to Make.com:', error);
    return false;
  }
};

// Sales-related webhooks
export const sendSaleToMake = async (sale: any, userCode: string) => {
  return sendToMake({
    type: 'sale',
    data: {
      sale_id: sale.id,
      product_id: sale.productId,
      quantity: sale.quantity,
      total_amount: sale.totalAmount,
      timestamp: sale.timestamp,
      customer_type: 'walk_in', // Could be enhanced with customer data
    },
    timestamp: new Date().toISOString(),
    user_code: userCode,
    priority: 'medium',
    metadata: {
      source: 'pos_system',
      channel: 'in_store',
    }
  });
};

// AI Prediction webhooks
export const sendAIPredictionToMake = async (prediction: any, userCode: string) => {
  return sendToMake({
    type: 'ai_prediction',
    data: {
      prediction_type: prediction.type, // 'demand', 'restock', 'price'
      product_id: prediction.productId,
      predicted_value: prediction.value,
      confidence_score: prediction.confidence,
      time_horizon: prediction.timeHorizon, // days/weeks/months
      factors: prediction.factors, // influencing factors
    },
    timestamp: new Date().toISOString(),
    user_code: userCode,
    priority: 'high',
    metadata: {
      model_version: '1.2.0',
      accuracy_score: prediction.accuracy,
    }
  }, MAKE_AI_WEBHOOK_URL);
};

// Demand Forecasting webhooks
export const sendDemandForecastToMake = async (forecast: any, userCode: string) => {
  return sendToMake({
    type: 'demand_forecast',
    data: {
      product_id: forecast.productId,
      product_name: forecast.productName,
      current_stock: forecast.currentStock,
      predicted_demand: forecast.predictedDemand,
      forecast_period: forecast.period, // 'weekly', 'monthly', 'quarterly'
      seasonal_factors: forecast.seasonalFactors,
      trend_direction: forecast.trend, // 'increasing', 'decreasing', 'stable'
      recommended_action: forecast.action,
    },
    timestamp: new Date().toISOString(),
    user_code: userCode,
    priority: 'high',
    metadata: {
      algorithm: 'time_series_analysis',
      data_points: forecast.dataPoints,
    }
  }, MAKE_AI_WEBHOOK_URL);
};

// Price Optimization webhooks
export const sendPriceOptimizationToMake = async (optimization: any, userCode: string) => {
  return sendToMake({
    type: 'price_optimization',
    data: {
      product_id: optimization.productId,
      current_price: optimization.currentPrice,
      suggested_price: optimization.suggestedPrice,
      price_change_percentage: optimization.changePercentage,
      expected_impact: optimization.expectedImpact,
      competitor_prices: optimization.competitorPrices,
      demand_elasticity: optimization.elasticity,
    },
    timestamp: new Date().toISOString(),
    user_code: userCode,
    priority: 'medium',
    metadata: {
      optimization_strategy: optimization.strategy,
      market_conditions: optimization.marketConditions,
    }
  }, MAKE_AI_WEBHOOK_URL);
};

// Enhanced Low Stock Alert
export const sendLowStockAlertToMake = async (products: any[], userCode: string) => {
  return sendToMake({
    type: 'low_stock_alert',
    data: {
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        current_stock: p.currentStock,
        reorder_level: p.reorderLevel,
        days_until_stockout: p.daysUntilStockout || calculateDaysUntilStockout(p),
        supplier_info: p.supplierInfo,
        lead_time: p.leadTime || 7,
      })),
      total_affected_products: products.length,
      estimated_revenue_impact: calculateRevenueImpact(products),
      urgency_level: determineUrgencyLevel(products),
    },
    timestamp: new Date().toISOString(),
    user_code: userCode,
    priority: 'critical',
    metadata: {
      alert_trigger: 'automated_monitoring',
      business_impact: 'high',
    }
  }, MAKE_ALERTS_WEBHOOK_URL);
};

// Customer Behavior Analysis webhooks
export const sendCustomerBehaviorToMake = async (behavior: any, userCode: string) => {
  return sendToMake({
    type: 'customer_behavior',
    data: {
      analysis_period: behavior.period,
      top_selling_products: behavior.topProducts,
      buying_patterns: behavior.patterns,
      seasonal_trends: behavior.seasonalTrends,
      customer_segments: behavior.segments,
      cross_selling_opportunities: behavior.crossSelling,
      churn_risk_indicators: behavior.churnRisk,
    },
    timestamp: new Date().toISOString(),
    user_code: userCode,
    priority: 'medium',
    metadata: {
      analysis_type: 'behavioral_analytics',
      data_quality_score: behavior.dataQuality,
    }
  }, MAKE_ANALYTICS_WEBHOOK_URL);
};

// Inventory Anomaly Detection
export const sendInventoryAnomalyToMake = async (anomaly: any, userCode: string) => {
  return sendToMake({
    type: 'inventory_anomaly',
    data: {
      anomaly_type: anomaly.type, // 'unusual_sales_spike', 'unexpected_stockout', 'supplier_delay'
      affected_products: anomaly.products,
      severity_score: anomaly.severity,
      detection_method: anomaly.method,
      recommended_actions: anomaly.actions,
      potential_causes: anomaly.causes,
      business_impact: anomaly.impact,
    },
    timestamp: new Date().toISOString(),
    user_code: userCode,
    priority: 'high',
    metadata: {
      detection_algorithm: 'statistical_analysis',
      confidence_level: anomaly.confidence,
    }
  }, MAKE_ALERTS_WEBHOOK_URL);
};

// Supplier Performance webhooks
export const sendSupplierAlertToMake = async (supplier: any, userCode: string) => {
  return sendToMake({
    type: 'supplier_alert',
    data: {
      supplier_id: supplier.id,
      supplier_name: supplier.name,
      alert_type: supplier.alertType, // 'delivery_delay', 'quality_issue', 'price_change'
      affected_products: supplier.affectedProducts,
      performance_metrics: supplier.metrics,
      recommended_actions: supplier.actions,
      alternative_suppliers: supplier.alternatives,
    },
    timestamp: new Date().toISOString(),
    user_code: userCode,
    priority: 'high',
    metadata: {
      supplier_rating: supplier.rating,
      relationship_duration: supplier.relationshipDuration,
    }
  }, MAKE_ALERTS_WEBHOOK_URL);
};

// Utility functions
const calculateDaysUntilStockout = (product: any): number => {
  // Simple calculation based on average daily sales
  const avgDailySales = product.avgDailySales || 1;
  return Math.floor(product.currentStock / avgDailySales);
};

const calculateRevenueImpact = (products: any[]): number => {
  return products.reduce((total, product) => {
    const dailyRevenue = (product.price || 0) * (product.avgDailySales || 1);
    const daysOut = calculateDaysUntilStockout(product);
    return total + (dailyRevenue * Math.min(daysOut, 30)); // Max 30 days impact
  }, 0);
};

const determineUrgencyLevel = (products: any[]): string => {
  const outOfStock = products.filter(p => p.currentStock === 0).length;
  const criticallyLow = products.filter(p => p.currentStock <= p.reorderLevel * 0.5).length;
  
  if (outOfStock > 0) return 'critical';
  if (criticallyLow > products.length * 0.5) return 'high';
  return 'medium';
};

// Batch webhook sending for efficiency
export const sendBatchWebhooksToMake = async (webhooks: MakeWebhookData[], userCode: string) => {
  const results = await Promise.allSettled(
    webhooks.map(webhook => sendToMake(webhook))
  );
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  console.log(`Batch webhook results: ${successful} successful, ${failed} failed`);
  
  return {
    successful,
    failed,
    total: webhooks.length,
    results
  };
};

// Health check for Make.com webhooks
export const testMakeWebhookConnection = async (): Promise<boolean> => {
  try {
    const testData: MakeWebhookData = {
      type: 'inventory_anomaly',
      data: { test: true, message: 'Connection test from SME Inventory Tool' },
      timestamp: new Date().toISOString(),
      user_code: 'test_user',
      priority: 'low',
      metadata: { test: true }
    };
    
    return await sendToMake(testData);
  } catch (error) {
    console.error('Make.com webhook connection test failed:', error);
    return false;
  }
};
