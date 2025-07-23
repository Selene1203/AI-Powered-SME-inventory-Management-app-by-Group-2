import React, { useState } from 'react';
import { Settings, Copy, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { 
  getWebhookConfig, 
  getEmailTemplate, 
  getSlackTemplate, 
  getSheetHeaders,
  getMakeConfigStatus,
  generateExampleData 
} from '../../utils/makeIntegration';

const ConfigurationHelper: React.FC = () => {
  const [selectedWebhook, setSelectedWebhook] = useState('sales');
  const [selectedTemplate, setSelectedTemplate] = useState('low_stock_alert');
  const [copiedText, setCopiedText] = useState('');
  
  const configStatus = getMakeConfigStatus();
  const webhookTypes = ['sales', 'low_stock_alert', 'ai_prediction', 'demand_forecast'];
  const templateTypes = ['low_stock_alert', 'restock_reminder', 'sales_summary'];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const webhookConfig = getWebhookConfig(selectedWebhook);
  const emailTemplate = getEmailTemplate(selectedTemplate);
  const slackTemplate = getSlackTemplate(selectedTemplate);
  const exampleData = generateExampleData(selectedWebhook);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <Settings className="w-8 h-8 text-sky-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Make.com Configuration Helper</h1>
            <p className="text-gray-600">Set up your webhooks and templates easily</p>
          </div>
        </div>
      </div>

      {/* Configuration Status */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            {configStatus.sales_webhook ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm">Sales Webhook</span>
          </div>
          <div className="flex items-center space-x-2">
            {configStatus.ai_webhook ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm">AI Webhook</span>
          </div>
          <div className="flex items-center space-x-2">
            {configStatus.analytics_webhook ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm">Analytics Webhook</span>
          </div>
          <div className="flex items-center space-x-2">
            {configStatus.alerts_webhook ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm">Alerts Webhook</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Webhook Configuration */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Webhook Data Formats</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Webhook Type:
            </label>
            <select
              value={selectedWebhook}
              onChange={(e) => setSelectedWebhook(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            >
              {webhookTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {webhookConfig && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Example Data:</h3>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(exampleData, null, 2), 'example')}
                    className="flex items-center space-x-1 text-sm text-sky-600 hover:text-sky-700"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedText === 'example' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto">
                  {JSON.stringify(exampleData, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description:</h3>
                <p className="text-sm text-gray-600">{webhookConfig.description}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Use Cases:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {webhookConfig.use_cases.map((useCase, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-sky-500">•</span>
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Email Templates */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Template:
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
            >
              {templateTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {emailTemplate && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Subject Line:</h3>
                  <button
                    onClick={() => copyToClipboard(emailTemplate.subject, 'subject')}
                    className="flex items-center space-x-1 text-sm text-sky-600 hover:text-sky-700"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedText === 'subject' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg text-sm">
                  {emailTemplate.subject}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">HTML Body:</h3>
                  <button
                    onClick={() => copyToClipboard(emailTemplate.html_body, 'html')}
                    className="flex items-center space-x-1 text-sm text-sky-600 hover:text-sky-700"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedText === 'html' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="bg-gray-100 p-3 rounded-lg text-sm overflow-x-auto max-h-40">
                  {emailTemplate.html_body}
                </pre>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Variables to Replace:</h3>
                <div className="flex flex-wrap gap-2">
                  {emailTemplate.variables.map((variable, index) => (
                    <span key={index} className="px-2 py-1 bg-sky-100 text-sky-800 text-xs rounded">
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Google Sheets Headers */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Google Sheets Headers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(getSheetHeaders('inventory_tracking') || {}).map(([sheetType, headers]) => (
            <div key={sheetType}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 capitalize">{sheetType.replace('_', ' ')}</h3>
                <button
                  onClick={() => copyToClipboard((headers as string[]).join('\t'), sheetType)}
                  className="flex items-center space-x-1 text-sm text-sky-600 hover:text-sky-700"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedText === sheetType ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="space-y-1">
                {(headers as string[]).map((header, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    {header}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-8 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Setup Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://make.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <ExternalLink className="w-5 h-5 text-sky-600" />
            <span className="text-sm font-medium">Open Make.com</span>
          </a>
          <a
            href="https://docs.make.com/webhooks"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <ExternalLink className="w-5 h-5 text-sky-600" />
            <span className="text-sm font-medium">Webhook Documentation</span>
          </a>
          <a
            href="https://docs.make.com/modules/google-sheets"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <ExternalLink className="w-5 h-5 text-sky-600" />
            <span className="text-sm font-medium">Google Sheets Guide</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationHelper;