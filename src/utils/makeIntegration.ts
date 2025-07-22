// Helper functions to work with Make.com integration
import webhookConfig from '../config/makeWebhooks.json';
import scenarioConfig from '../config/makeScenarios.json';
import templateConfig from '../config/makeTemplates.json';

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