import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import Card from '../common/Card';

const ChatbotUI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m AirCare AI Assistant. Ask me anything about air quality, health impacts, or green solutions!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = {
    aqi: 'The current AQI is 87, which is Moderate. Sensitive groups should consider limiting prolonged outdoor activities.',
    health: 'Air pollution can cause respiratory issues, heart problems, and affect vulnerable populations. Use masks and air purifiers for protection.',
    trees: 'Planting trees is one of the most effective ways to improve air quality! Trees absorb CO2 and pollutants while producing oxygen.',
    tips: 'Here are some green tips: 1) Use public transport 2) Plant native trees 3) Reduce energy consumption 4) Support clean energy initiatives',
    default: 'I can help you with information about AQI levels, health impacts, tree planting, and green solutions. What would you like to know?'
  };

  const getResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    if (msg.includes('aqi') || msg.includes('air quality')) return botResponses.aqi;
    if (msg.includes('health') || msg.includes('risk')) return botResponses.health;
    if (msg.includes('tree') || msg.includes('plant')) return botResponses.trees;
    if (msg.includes('tip') || msg.includes('suggestion') || msg.includes('help')) return botResponses.tips;
    return botResponses.default;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: getResponse(input),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    'What\'s the current AQI?',
    'Health tips for pollution',
    'How to plant trees?',
    'Green suggestions'
  ];

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20"
        >
          <Bot className="w-6 h-6 text-indigo-600" />
        </motion.div>
        <div>
          <h3 className="font-semibold text-slate-800">AirCare AI Assistant</h3>
          <div className="flex items-center text-xs text-green-600">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            Online
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'bot'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                }`}>
                  {message.type === 'bot' ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'bot'
                    ? 'bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-800'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.type === 'bot' ? 'text-slate-500' : 'text-white/70'}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-slate-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-slate-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-slate-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="py-3 border-t border-slate-200">
        <div className="flex items-center mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600 mr-2" />
          <span className="text-xs font-semibold text-slate-700">Quick Questions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInput(q)}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-xs font-medium text-indigo-700 hover:shadow-md transition-shadow"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="pt-3 border-t border-slate-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-glow transition-shadow"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </Card>
  );
};

export default ChatbotUI;