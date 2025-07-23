// Helper functions to work with Make.com integration
// Configuration data for webhooks, scenarios, and templates

// Webhook configurations - defines data formats and examples
const webhookConfig = {
  "webhooks": {
    "sales": {
      "description": "Triggered when a sale is made in the system",
      "url_env_var": "VITE_MAKE_WEBHOOK_URL",
      "data_format": {
        "type": "string",
        "product_name": "string",
        "quantity": "number",
        "total_amount": "number",
        "timestamp": "string"
      },
      "example_data": {
        "type": "sale",
        "product_name": "Paracetamol 500mg",
        "quantity": 2,
        "total_amount": 48.00,
        "timestamp": "2024-01-15T10:30:00Z",
        "user_code": "user_001"
      },
      "use_cases": [
        "Track sales in Google Sheets",
        "Send to accounting software",
        "Update inventory in other systems",
        "Generate sales reports"
      ]
    },
    "low_stock_alert": {
      "description": "Triggered when products fall below reorder level",
      "url_env_var": "VITE_MAKE_ALERTS_WEBHOOK_URL",
      "data_format": {
        "type": "string",
        "products": "array",
        "urgency_level": "string",
        "total_affected_products": "number"
      },
      "example_data": {
        "type": "low_stock_alert",
        "products": [
          {
            "id": "prod_123",
            "name": "Amoxicillin 250mg",
            "current_stock": 8,
            "reorder_level": 20,
            "days_until_stockout": 3
          }
        ],
        "urgency_level": "high",
        "total_affected_products": 1,
        "user_code": "user_001"
      },
      "use_cases": [
        "Email suppliers automatically",
        "Send SMS alerts to managers",
        "Create tasks in project management tools",
        "Update procurement systems"
      ]
    },
    "ai_prediction": {
      "description": "AI-generated predictions for demand, pricing, and restocking",
      "url_env_var": "VITE_MAKE_AI_WEBHOOK_URL",
      "data_format": {
        "type": "string",
        "prediction_type": "string",
        "product_id": "string",
        "predicted_value": "number",
        "confidence_score": "number"
      },
      "example_data": {
        "type": "ai_prediction",
        "prediction_type": "demand",
        "product_id": "product_123",
        "predicted_value": 150,
        "confidence_score": 0.85,
        "time_horizon": "7_days",
        "factors": ["historical_sales", "seasonal_trends"],
        "user_code": "user_001"
      },
      "use_cases": [
        "Automated reordering based on predictions",
        "Dynamic pricing adjustments",
        "Business intelligence dashboards",
        "Inventory optimization"
      ]
    },
    "demand_forecast": {
      "description": "Detailed demand forecasting with seasonal factors",
      "url_env_var": "VITE_MAKE_AI_WEBHOOK_URL",
      "data_format": {
        "type": "string",
        "product_id": "string",
        "predicted_demand": "number",
        "forecast_period": "string",
        "trend_direction": "string"
      },
      "example_data": {
        "type": "demand_forecast",
        "product_id": "product_123",
        "product_name": "Amoxicillin 250mg",
        "current_stock": 15,
        "predicted_demand": 45,
        "forecast_period": "monthly",
        "seasonal_factors": {"winter": 1.2, "spring": 1.0},
        "trend_direction": "increasing",
        "recommended_action": "reorder_immediately",
        "user_code": "user_001"
      },
      "use_cases": [
        "Seasonal inventory planning",
        "Supplier contract negotiations",
        "Budget forecasting",
        "Market trend analysis"
      ]
    }
  }
};

// Scenario configurations - step-by-step guides for Make.com setup
const scenarioConfig = {
  "scenarios": [
    {
      "id": "sales_to_sheets",
      "name": "Sales to Google Sheets",
      "difficulty": "beginner",
      "time_estimate": "10 minutes",
      "description": "Automatically log all sales to a Google Sheets spreadsheet",
      "webhook_type": "sales",
      "steps": [
        {
          "step": 1,
          "title": "Add Webhook Module",
          "description": "Add a 'Custom webhook' module and copy the URL to your .env file",
          "details": "This receives data from your inventory app"
        },
        {
          "step": 2,
          "title": "Add Google Sheets Module",
          "description": "Add 'Google Sheets > Add a row' module",
          "details": "Connect your Google account and select your spreadsheet"
        },
        {
          "step": 3,
          "title": "Map the Data",
          "description": "Map webhook data to spreadsheet columns",
          "mapping": {
            "Product Name": "{{product_name}}",
            "Quantity": "{{quantity}}",
            "Amount": "{{total_amount}}",
            "Date": "{{timestamp}}"
          }
        },
        {
          "step": 4,
          "title": "Test and Activate",
          "description": "Test the scenario and activate it",
          "details": "Make a test sale in your app to verify it works"
        }
      ]
    },
    {
      "id": "low_stock_email",
      "name": "Low Stock Email Alerts",
      "difficulty": "beginner",
      "time_estimate": "15 minutes",
      "description": "Send email alerts when products are running low",
      "webhook_type": "low_stock_alert",
      "steps": [
        {
          "step": 1,
          "title": "Add Webhook Module",
          "description": "Add webhook module using ALERTS webhook URL",
          "details": "Use VITE_MAKE_ALERTS_WEBHOOK_URL from your .env file"
        },
        {
          "step": 2,
          "title": "Add Filter",
          "description": "Add filter to only process high/critical urgency alerts",
          "filter_condition": "urgency_level = 'high' OR urgency_level = 'critical'"
        },
        {
          "step": 3,
          "title": "Add Email Module",
          "description": "Add 'Email > Send an email' module",
          "details": "Use the email template from the templates section"
        }
      ]
    },
    {
      "id": "ai_insights_slack",
      "name": "AI Insights to Slack",
      "difficulty": "intermediate",
      "time_estimate": "20 minutes",
      "description": "Send AI predictions and insights to a Slack channel",
      "webhook_type": "ai_prediction",
      "steps": [
        {
          "step": 1,
          "title": "Add Webhook Module",
          "description": "Add webhook for AI predictions",
          "details": "Use VITE_MAKE_AI_WEBHOOK_URL"
        },
        {
          "step": 2,
          "title": "Add Slack Module",
          "description": "Add 'Slack > Create a message' module",
          "details": "Connect your Slack workspace and select channel"
        },
        {
          "step": 3,
          "title": "Format Message",
          "description": "Use the Slack template for professional formatting",
          "details": "Include prediction type, confidence score, and recommendations"
        }
      ]
    }
  ]
};

// Template configurations - ready-to-use templates for emails, Slack, etc.
const templateConfig = {
  "email_templates": {
    "low_stock_alert": {
      "subject": "🚨 Low Stock Alert - {{business_name}}",
      "html_body": `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Low Stock Alert</h1>
            <p style="color: #f0f0f0; margin: 5px 0 0 0;">{{business_name}}</p>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333;">Products Need Restocking</h2>
            <p>The following products are running low and need immediate attention:</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
              {{#each products}}
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <strong>{{name}}</strong><br>
                <span style="color: #666;">Current Stock: {{current_stock}} units</span><br>
                <span style="color: #e74c3c;">Reorder Level: {{reorder_level}} units</span>
              </div>
              {{/each}}
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>⚠️ Action Required:</strong>
              <p>Please review and reorder these items to avoid stockouts.</p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="#" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                View Inventory Dashboard
              </a>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p>This alert was generated automatically by your inventory management system.</p>
            <p>{{timestamp}}</p>
          </div>
        </div>
      `,
      "variables": ["business_name", "products", "timestamp"]
    },
    "restock_reminder": {
      "subject": "📦 Restock Reminder - {{product_name}}",
      "html_body": `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Restock Reminder</h2>
          <p>Hi there,</p>
          <p>This is a friendly reminder that <strong>{{product_name}}</strong> needs to be restocked.</p>
          
          <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Product:</strong> {{product_name}}</p>
            <p><strong>Current Stock:</strong> {{current_stock}} units</p>
            <p><strong>Recommended Order:</strong> {{suggested_quantity}} units</p>
            <p><strong>Supplier:</strong> {{supplier_name}}</p>
          </div>
          
          <p>Please place an order soon to avoid running out of stock.</p>
          <p>Best regards,<br>Your Inventory System</p>
        </div>
      `,
      "variables": ["product_name", "current_stock", "suggested_quantity", "supplier_name"]
    },
    "sales_summary": {
      "subject": "📊 Daily Sales Summary - {{date}}",
      "html_body": `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #27ae60;">Daily Sales Summary</h2>
          <p>Here's your sales summary for {{date}}:</p>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin-top: 0; color: #27ae60;">Key Metrics</h3>
            <p><strong>Total Sales:</strong> {{total_sales}}</p>
            <p><strong>Number of Transactions:</strong> {{transaction_count}}</p>
            <p><strong>Average Transaction:</strong> {{average_transaction}}</p>
          </div>
          
          <h3>Top Selling Products</h3>
          <div style="background: white; border: 1px solid #ddd; border-radius: 8px;">
            {{#each top_products}}
            <div style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>{{name}}</strong> - {{quantity}} units sold
            </div>
            {{/each}}
          </div>
        </div>
      `,
      "variables": ["date", "total_sales", "transaction_count", "average_transaction", "top_products"]
    }
  },
  "slack_templates": {
    "low_stock_alert": {
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "🚨 Low Stock Alert"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*{{business_name}}* has products running low on stock:"
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": "*Product:*\n{{product_name}}"
            },
            {
              "type": "mrkdwn",
              "text": "*Current Stock:*\n{{current_stock}} units"
            }
          ]
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "View Dashboard"
              },
              "url": "{{dashboard_url}}"
            }
          ]
        }
      ]
    },
    "ai_prediction": {
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "🤖 AI Prediction"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Prediction Type:* {{prediction_type}}\n*Product:* {{product_name}}\n*Confidence:* {{confidence_score}}%"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Predicted Value:* {{predicted_value}}\n*Time Horizon:* {{time_horizon}}"
          }
        }
      ]
    }
  },
  "google_sheets_headers": {
    "inventory_tracking": {
      "sales": ["Date", "Product Name", "SKU", "Quantity", "Unit Price", "Total Amount", "Customer Type"],
      "inventory": ["Product Name", "SKU", "Current Stock", "Reorder Level", "Category", "Last Updated"],
      "predictions": ["Date", "Product Name", "Prediction Type", "Predicted Value", "Confidence Score", "Time Horizon"]
    },
    "financial_tracking": {
      "daily_sales": ["Date", "Total Sales", "Transaction Count", "Average Transaction", "Top Product"],
      "monthly_summary": ["Month", "Total Revenue", "Total Transactions", "Growth Rate", "Top Category"]
    }
  }
};

// Get webhook configuration for a specific type
export const getWebhookConfig = (webhookType: string) => {
  return webhookConfig.webhooks[webhookType as keyof typeof webhookConfig.webhooks];
};

// Get all available scenarios
export const getAvailableScenarios = () => {
  return scenarioConfig.scenarios;
};

// Get scenarios by difficulty level
export const getScenariosByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
  return scenarioConfig.scenarios.filter(scenario => scenario.difficulty === difficulty);
};

// Get email template
export const getEmailTemplate = (templateName: string) => {
  return templateConfig.email_templates[templateName as keyof typeof templateConfig.email_templates];
};

// Get Slack template
export const getSlackTemplate = (templateName: string) => {
  return templateConfig.slack_templates[templateName as keyof typeof templateConfig.slack_templates];
};

// Get Google Sheets headers for a specific sheet type
export const getSheetHeaders = (sheetType: string) => {
  return templateConfig.google_sheets_headers[sheetType as keyof typeof templateConfig.google_sheets_headers];
};

// Validate webhook data against expected format
export const validateWebhookData = (webhookType: string, data: any): boolean => {
  const config = getWebhookConfig(webhookType);
  if (!config) return false;

  const expectedFormat = config.data_format;
  
  // Simple validation - check if all required fields exist
  for (const field in expectedFormat) {
    if (!(field in data)) {
      console.warn(`Missing required field: ${field}`);
      return false;
    }
  }
  
  return true;
};

// Generate example data for testing
export const generateExampleData = (webhookType: string) => {
  const config = getWebhookConfig(webhookType);
  return config?.example_data || null;
};

// Helper to replace template variables (simple version)
export const replaceTemplateVariables = (template: string, data: Record<string, any>): string => {
  let result = template;
  
  // Replace simple variables like {{variable_name}}
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value));
  }
  
  return result;
};

// Get webhook URL from environment variables
export const getWebhookUrl = (webhookType: string): string | null => {
  const config = getWebhookConfig(webhookType);
  if (!config) return null;
  
  const envVar = config.url_env_var;
  return import.meta.env[envVar] || null;
};

// Check if Make.com integration is properly configured
export const isMakeConfigured = (): boolean => {
  const requiredEnvVars = [
    'VITE_MAKE_WEBHOOK_URL',
    'VITE_MAKE_AI_WEBHOOK_URL',
    'VITE_MAKE_ANALYTICS_WEBHOOK_URL',
    'VITE_MAKE_ALERTS_WEBHOOK_URL'
  ];
  
  return requiredEnvVars.some(envVar => import.meta.env[envVar]);
};

// Get configuration status for debugging
export const getMakeConfigStatus = () => {
  return {
    sales_webhook: !!import.meta.env.VITE_MAKE_WEBHOOK_URL,
    ai_webhook: !!import.meta.env.VITE_MAKE_AI_WEBHOOK_URL,
    analytics_webhook: !!import.meta.env.VITE_MAKE_ANALYTICS_WEBHOOK_URL,
    alerts_webhook: !!import.meta.env.VITE_MAKE_ALERTS_WEBHOOK_URL,
    overall_configured: isMakeConfigured()
  };
};