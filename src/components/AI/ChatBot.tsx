import React, { useState } from 'react';
import { MessageSquare, Send, User, Bot, TrendingUp, Package, BarChart3, Zap, TestTube } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const { currentUser, runAIAnalysis, testWebhookConnection } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello! I'm your ${currentUser?.businessName} AI assistant. I can help with inventory, sales, forecasts, and Make.com webhook integrations. How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRunningAnalysis, setIsRunningAnalysis] = useState(false);

  const quickActions = [
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'forecast', label: 'Forecast', icon: BarChart3 },
    { id: 'ai_analysis', label: 'Run AI Analysis', icon: Zap },
    { id: 'test_webhooks', label: 'Test Webhooks', icon: TestTube }
  ];

  const predefinedResponses = {
    inventory: "I've analyzed your inventory. You're running low on Amoxicillin (15 units) and Azithromycin (8 units). Both are below your set threshold of 20 units. Would you like me to prepare a restock order?",
    sales: "I've prepared a restock order. For last month's sales, antibiotics generated M15,420 in revenue, up 12% from the previous month. Amoxicillin was your top seller with 78 units sold.",
    forecast: "Would you like to see detailed sales analytics for antibiotics? I can prepare a report or you can check the Inventory Dashboard for a quick overview.",
    ai_analysis: "I'm running a comprehensive AI analysis of your inventory data. This includes demand forecasting, price optimization, customer behavior analysis, and anomaly detection. All results will be sent to your Make.com webhooks for further processing.",
    test_webhooks: "I'm testing the connection to your Make.com webhooks. This will verify that all webhook endpoints are properly configured and responding.",
    default: "I'm here to help with inventory management, sales analysis, and forecasting. You can ask me about stock levels, reorder suggestions, sales trends, or anything else related to your pharmacy operations."
  };

  const handleRunAIAnalysis = async () => {
    setIsRunningAnalysis(true);
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Run comprehensive AI analysis',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      await runAIAnalysis();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'AI analysis completed successfully! I\'ve generated demand forecasts, price optimizations, customer behavior insights, and anomaly detections. All data has been sent to your Make.com webhooks for further processing and automation.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'There was an error running the AI analysis. Please check your webhook configuration and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsRunningAnalysis(false);
    }
  };

  const handleTestWebhooks = async () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Test webhook connections',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const success = await testWebhookConnection();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: success 
          ? 'Webhook connection test successful! All Make.com endpoints are responding properly.'
          : 'Webhook connection test failed. Please check your Make.com webhook URLs in the environment variables.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Error testing webhook connections. Please verify your configuration.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let botResponse = predefinedResponses.default;
      
      if (content.toLowerCase().includes('antibiotic') || content.toLowerCase().includes('low')) {
        botResponse = predefinedResponses.inventory;
      } else if (content.toLowerCase().includes('sales') || content.toLowerCase().includes('revenue')) {
        botResponse = predefinedResponses.sales;
      } else if (content.toLowerCase().includes('forecast') || content.toLowerCase().includes('analytics')) {
        botResponse = predefinedResponses.forecast;
      } else if (content.toLowerCase().includes('ai analysis') || content.toLowerCase().includes('run analysis')) {
        botResponse = predefinedResponses.ai_analysis;
      } else if (content.toLowerCase().includes('test webhook') || content.toLowerCase().includes('webhook test')) {
        botResponse = predefinedResponses.test_webhooks;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    let message = '';
    switch (action) {
      case 'inventory':
        message = 'Can you check if we\'re running low on any antibiotics?';
        break;
      case 'sales':
        message = 'How were our sales for antibiotics last month?';
        break;
      case 'forecast':
        message = 'Would you like to see detailed sales analytics for antibiotics?';
        break;
      case 'ai_analysis':
        handleRunAIAnalysis();
        return;
      case 'test_webhooks':
        handleTestWebhooks();
        return;
    }
    handleSendMessage(message);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-sky-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Chatbot</h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-gray-600">{currentUser?.businessName}</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm h-[600px] flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-sm text-green-600">Online</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">Today</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-sky-500' : 'bg-gray-500'
                }`}>
                  {message.type === 'user' ? 
                    <User className="w-5 h-5 text-white" /> : 
                    <Bot className="w-5 h-5 text-white" />
                  }
                </div>
                <div className={`p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-sky-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-sky-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2 mb-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const isDisabled = (action.id === 'ai_analysis' && isRunningAnalysis);
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  disabled={isDisabled}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isDisabled 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`} />
                  <span className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}>
                    {action.id === 'ai_analysis' && isRunningAnalysis ? 'Running...' : action.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
