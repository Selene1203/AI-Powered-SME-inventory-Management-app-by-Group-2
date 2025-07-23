// Helper functions to work with Make.com integration
// Import JSON configurations - these files contain templates and examples

// Since JSON imports might not work in all environments, let's create the config inline
const webhookConfig = {
  webhooks: {
    sales: {
      description: "Triggered when a sale is made",
      data_format: {
        type: "string",
        product_name: "string",
        quantity: "number",
        total_amount: "number",
        timestamp: "string"
      },
      example_data: {
        type: "sale",
        product_name: "Paracetamol 500mg",
        quantity: 2,
        total_amount: 48.00,
        timestamp: "2024-01-15T10:30:00Z"
      },
      use_cases: [
        "Track sales in Google Sheets",
        "Send to accounting software",
        "Update inventory systems"
      ],
      url_env_var: "VITE_MAKE_WEBHOOK_URL"
    },
    low_stock_alert: {
      description: "Triggered when products are running low",
      data_format: {
        type: "string",
        products: "array",
        urgency_level: "string"
      },
      example_data: {
        type: "low_stock_alert",
        products: [
          {
            name: "Amoxicillin 250mg",
            current_stock: 5,
            reorder_level: 20
          }
        ],
        urgency_level: "high"
      },
      use_cases: [
        "Email suppliers automatically",
        "Send SMS alerts to managers",
        "Create reorder tasks"
      ],
      url_env_var: "VITE_MAKE_ALERTS_WEBHOOK_URL"
    },
    ai_prediction: {
      description: "AI-generated predictions and insights",
      data_format: {
        type: "string",
        prediction_type: "string",
        product_name: "string",
        predicted_value: "number",
        confidence_score: "number"
      },
      example_data: {
        type: "ai_prediction",
        prediction_type: "demand",
        product_name: "Paracetamol 500mg",
        predicted_value: 14,
        confidence_score: 0.85,
        time_horizon: "7_days"
      },
      use_cases: [
        "Business intelligence dashboards",
        "Automated pricing updates",
        "Inventory optimization"
      ],
      url_env_var: "VITE_MAKE_AI_WEBHOOK_URL"
    }
  }
};

const scenarioConfig = {
  scenarios: [
    {
      name: "Sales to Google Sheets",
      difficulty: "beginner",
      description: "Automatically log all sales to a Google Sheets spreadsheet",
      steps: [
        "Create webhook in Make.com",
        "Add Google Sheets module",
        "Map sales data to columns",
        "Test with sample sale"
      ]
    },
    {
      name: "Low Stock Email Alerts",
      difficulty: "beginner", 
      description: "Send email alerts when inventory runs low",
      steps: [
        "Create webhook for alerts",
        "Add filter for urgency level",
        "Add email module",
        "Use HTML template"
      ]
    }
  ]
};

const templateConfig = {
  email_templates: {
    low_stock_alert: {
      subject: "🚨 Low Stock Alert - {{business_name}}",
      html_body: `
        <h2>Low Stock Alert</h2>
        <p>Hello,</p>
        <p>The following products in {{business_name}} are running low:</p>
        <ul>
          {{#each products}}
          <li><strong>{{name}}</strong> - Only {{current_stock}} left (Reorder at {{reorder_level}})</li>
          {{/each}}
        </ul>
        <p>Please reorder these items as soon as possible.</p>
        <p>Best regards,<br>Inventory Management System</p>
      `,
      variables: ["business_name", "products"]
    }
  },
  slack_templates: {
    low_stock_alert: {
      text: "🚨 Low Stock Alert for {{business_name}}",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Low Stock Alert*\nThe following products need restocking:"
          }
        }
      ]
    }
  },
  google_sheets_headers: {
    sales_tracking: ["Date", "Product Name", "SKU", "Quantity", "Unit Price", "Total Amount", "Customer"],
    inventory_tracking: ["Product Name", "SKU", "Current Stock", "Reorder Level", "Category", "Last Updated"],
    ai_insights: ["Date", "Insight Type", "Product", "Prediction", "Confidence", "Action Required"]
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