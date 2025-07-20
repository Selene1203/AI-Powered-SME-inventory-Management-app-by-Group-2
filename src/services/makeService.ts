const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL;

export interface MakeWebhookData {
  type: 'sale' | 'restock' | 'low_stock_alert';
  data: any;
  timestamp: string;
  user_code: string;
}

export const sendToMake = async (webhookData: MakeWebhookData): Promise<boolean> => {
  if (!MAKE_WEBHOOK_URL) {
    console.warn('Make.com webhook URL not configured');
    return false;
  }

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    if (!response.ok) {
      throw new Error(`Make.com webhook failed: ${response.status}`);
    }

    console.log('Successfully sent data to Make.com');
    return true;
  } catch (error) {
    console.error('Error sending to Make.com:', error);
    return false;
  }
};

export const sendSaleToMake = async (sale: any, userCode: string) => {
  return sendToMake({
    type: 'sale',
    data: sale,
    timestamp: new Date().toISOString(),
    user_code: userCode,
  });
};

export const sendRestockAlertToMake = async (product: any, userCode: string) => {
  return sendToMake({
    type: 'restock',
    data: {
      product_id: product.id,
      product_name: product.name,
      current_stock: product.current_stock,
      reorder_level: product.reorder_level,
    },
    timestamp: new Date().toISOString(),
    user_code: userCode,
  });
};

export const sendLowStockAlertToMake = async (products: any[], userCode: string) => {
  return sendToMake({
    type: 'low_stock_alert',
    data: {
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        current_stock: p.current_stock,
        reorder_level: p.reorder_level,
      })),
      count: products.length,
    },
    timestamp: new Date().toISOString(),
    user_code: userCode,
  });
};