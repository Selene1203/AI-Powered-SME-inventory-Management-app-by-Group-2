# Make.com Integration Guide

This guide will help you set up Make.com integration with your AI-Powered Inventory Management app.

## Quick Start (5 minutes)

### Step 1: Get Your Webhook URLs from Make.com

1. Go to [Make.com](https://make.com) and log in
2. Click "Create a new scenario"
3. Search for "Webhooks" and add it
4. Choose "Custom webhook"
5. Click "Add" - you'll get a URL like: `https://hook.us1.make.com/abc123xyz789`
6. **Copy this URL** - you'll need it in Step 2

### Step 2: Add URLs to Your App

1. Create a `.env` file in your project root
2. Add your webhook URLs:

```env
# Basic webhook for sales and general data
VITE_MAKE_WEBHOOK_URL=https://hook.us1.make.com/your-webhook-url-here

# AI predictions and insights
VITE_MAKE_AI_WEBHOOK_URL=https://hook.us1.make.com/your-ai-webhook-url-here

# Analytics and reports
VITE_MAKE_ANALYTICS_WEBHOOK_URL=https://hook.us1.make.com/your-analytics-webhook-url-here

# Alerts and notifications
VITE_MAKE_ALERTS_WEBHOOK_URL=https://hook.us1.make.com/your-alerts-webhook-url-here
```

### Step 3: Test the Connection

1. Start your app: `npm run dev`
2. Go to the Chat section
3. Click "Test Webhooks"
4. Check Make.com - you should see data arrive!

## Available JSON Configuration Files

Your app now includes these helpful JSON files:

### 1. `src/config/makeWebhooks.json`
- **What it does:** Defines all webhook types and data formats
- **Use it for:** Understanding what data your app sends to Make.com
- **Example:** See exactly what a "sale" webhook looks like

### 2. `src/config/makeScenarios.json`
- **What it does:** Pre-built scenario templates for common use cases
- **Use it for:** Step-by-step guides to create Make.com scenarios
- **Includes:** Beginner, intermediate, and advanced scenarios

### 3. `src/config/makeTemplates.json`
- **What it does:** Ready-to-use templates for emails, Slack messages, etc.
- **Use it for:** Copy-paste templates for your Make.com scenarios
- **Includes:** HTML emails, Slack blocks, Google Sheets headers

## Beginner Scenarios (Start Here!)

### Scenario 1: Sales to Google Sheets
**Time:** 10 minutes | **Difficulty:** Beginner

1. **In Make.com:**
   - Add Webhooks → Custom webhook
   - Add Google Sheets → Add a row
   - Connect your Google account
   - Choose your spreadsheet

2. **Map the data:**
   - Product Name → `{{product_name}}`
   - Quantity → `{{quantity}}`
   - Amount → `{{total_amount}}`
   - Date → `{{timestamp}}`

3. **Test:** Make a sale in your app, check Google Sheets!

### Scenario 2: Low Stock Email Alerts
**Time:** 15 minutes | **Difficulty:** Beginner

1. **In Make.com:**
   - Add Webhooks → Custom webhook (use ALERTS webhook URL)
   - Add Filter → Only process "high" or "critical" urgency
   - Add Email → Send an email

2. **Use the template from `makeTemplates.json`:**
   - Copy the "low_stock_alert" email template
   - Paste into Make.com email body
   - The `{{variables}}` will be automatically replaced

## Intermediate Scenarios

### Scenario 3: AI Insights to Slack
**Time:** 20 minutes | **Difficulty:** Intermediate

Perfect for getting AI predictions in your team Slack channel.

### Scenario 4: Automated Supplier Orders
**Time:** 30 minutes | **Difficulty:** Intermediate

Automatically email suppliers when stock is low.

## Advanced Scenarios

### Scenario 5: Business Intelligence Dashboard
**Time:** 45 minutes | **Difficulty:** Advanced

Send all data to Google Data Studio or Power BI for advanced analytics.

## Data Types Your App Sends

### Sales Data
```json
{
  "type": "sale",
  "product_name": "Paracetamol 500mg",
  "quantity": 2,
  "total_amount": 48.00,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Low Stock Alerts
```json
{
  "type": "low_stock_alert",
  "products": [
    {
      "name": "Amoxicillin 250mg",
      "current_stock": 5,
      "reorder_level": 20
    }
  ],
  "urgency_level": "high"
}
```

### AI Predictions
```json
{
  "type": "ai_prediction",
  "prediction_type": "demand",
  "product_name": "Paracetamol 500mg",
  "predicted_value": 14,
  "confidence_score": 0.85,
  "time_horizon": "7_days"
}
```

## Troubleshooting

### No Data Arriving in Make.com?
1. Check your `.env` file has the correct webhook URLs
2. Make sure your app is running (`npm run dev`)
3. Try the "Test Webhooks" button in the Chat section

### Scenario Not Running?
1. Make sure it's activated in Make.com (toggle switch)
2. Check the execution history for errors
3. Verify your filters aren't too restrictive

### Wrong Data Format?
1. Check the Make.com execution logs
2. Compare with examples in `makeWebhooks.json`
3. Use the validation functions in `makeIntegration.ts`

## Next Steps

1. **Start with Scenario 1** (Sales to Google Sheets)
2. **Add email alerts** (Scenario 2)
3. **Explore AI insights** (Scenario 3)
4. **Build custom scenarios** using the JSON templates

## Need Help?

- Check the JSON files for examples and templates
- Use the helper functions in `src/utils/makeIntegration.ts`
- Look at Make.com's documentation for specific modules
- Test with small scenarios first, then build bigger ones

Happy automating! 🚀