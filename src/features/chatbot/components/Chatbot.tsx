import React from 'react';
import { useChatbot } from '../hooks/useChatbot';
import type { Message } from '../types';
import { quickQuestions } from '../constants';
import { formatTimestamp } from '../utils';
import { 
  PaperAirplaneIcon, 
  ComputerDesktopIcon,  
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  MinusIcon 
} from '@heroicons/react/24/outline';

interface OlympicChatbotWidgetProps {
  initialMessages?: Message[];
}

const OlympicChatbotWidget: React.FC<OlympicChatbotWidgetProps> = ({ initialMessages = [] }) => {
  const {
    isOpen,
    isMinimized,
    isMobile,
    messages,
    inputText,
    setInputText,
    isTyping,
    hasNewMessage,
    messagesEndRef,
    toggleChat,
    minimizeChat,
    restoreChat,
    handleSendMessage,
    handleKeyPress,
    handleQuickQuestion,
  } = useChatbot(initialMessages);

  if (isMobile && isOpen && !isMinimized) {
    return (
      <div className="fixed py-5 inset-0 z-50 bg-white flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <ComputerDesktopIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base">Olympic Tin Học 2025</h1>
              <p className="text-blue-100 text-sm">Tư vấn trực tuyến</p>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-2 bg-gray-50 border-b">
          <p className="text-sm text-gray-600 mb-3 font-medium">Câu hỏi thường gặp:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((item, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(item.question)}
                className="flex items-center space-x-2 bg-white hover:bg-blue-50 text-blue-700 p-3 rounded-lg text-sm border border-blue-200 hover:border-blue-300 transition-colors shadow-sm"
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-left">{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                  message.isBot
                    ? 'bg-white text-gray-400 border border-gray-200 shadow-sm'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {message.isBot && (
                    <div className="bg-blue-100 p-1.5 rounded-full mt-1 flex-shrink-0">
                      <ComputerDesktopIcon className="w-3 h-3 text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {message.text}
                    </div>
                    <div className={`text-xs mt-2 ${message.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-2xl max-w-[85%] shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-1.5 rounded-full">
                    <ComputerDesktopIcon className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập câu hỏi..."
              className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-full hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed z-50 ${isMobile ? 'bottom-6 right-4' : 'bottom-6 right-4 sm:bottom-6 sm:right-6'}`}>
      {!isOpen && (
        <button
          onClick={toggleChat}
          className={`relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 animate-pulse ${
            isMobile ? 'p-3' : 'p-4'
          }`}
        >
          <ChatBubbleLeftRightIcon className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
          {hasNewMessage && (
            <div className={`absolute -top-1 -right-1 bg-red-500 rounded-full flex items-center justify-center ${
              isMobile ? 'w-3 h-3' : 'w-4 h-4'
            }`}>
              <span className={`text-white font-bold ${isMobile ? 'text-xs' : 'text-xs'}`}>1</span>
            </div>
          )}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-20" style={{animationDelay: '0.5s'}}></div>
        </button>
      )}

      {isOpen && !isMobile && (
  <div className={`fixed z-50 bottom-[26px] right-4 sm:bottom-[34px] sm:right-6`}>
    <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
      isMinimized ? 'w-72 h-16 sm:w-80 md:w-96' : 'w-72 h-[400px] sm:w-80 sm:h-[450px] md:w-96 md:h-[500px]'
    }`}>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-full">
            <ComputerDesktopIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm">Olympic Tin Học 2025</h1>
            <p className="text-blue-100 text-xs">Tư vấn trực tuyến</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={isMinimized ? restoreChat : minimizeChat}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <button
            onClick={toggleChat}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="p-3 bg-gray-50 border-b">
            <p className="text-xs text-gray-600 mb-2">Câu hỏi thường gặp:</p>
            <div className="grid grid-cols-2 gap-1">
              {quickQuestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(item.question)}
                  className="flex items-center space-x-1 bg-white hover:bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-[10px] border border-blue-200 hover:border-blue-300 transition-colors"
                >
                  <item.icon className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{item.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 h-64 sm:h-72 md:h-80">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800 border border-gray-200'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.isBot && (
                      <div className="bg-blue-100 p-1 rounded-full mt-1 flex-shrink-0">
                        <ComputerDesktopIcon className="w-2 h-2 text-blue-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="whitespace-pre-line text-[10px] leading-relaxed">
                        {message.text}
                      </div>
                      <div className={`text-[9px] mt-1 ${message.isBot ? 'text-gray-500' : 'text-white/70'}`}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 border border-gray-200 px-3 py-2 rounded-2xl max-w-[85%]">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 p-1 rounded-full">
                      <ComputerDesktopIcon className="w-2 h-2 text-blue-600" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi..."
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-full hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
};

export default OlympicChatbotWidget;