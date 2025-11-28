import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import SimpleMarkdown from './SimpleMarkdown';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm your AI Plant Doctor. 🌿\n\nI can help diagnose plant issues, identify pests, and suggest care tips. Upload a photo of your plant for the best advice!",
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; base64: string; mimeType: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, selectedImage]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1]; 
        setSelectedImage({
          url: URL.createObjectURL(file),
          base64: base64Data,
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      image: selectedImage?.url
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    const currentImage = selectedImage; 
    setSelectedImage(null); 
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const contents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: msg.image 
           ? [{ text: msg.text }] 
           : [{ text: msg.text }]
      }));

      const currentParts: any[] = [{ text: newMessage.text }];
      if (currentImage) {
        currentParts.push({
          inlineData: {
            mimeType: currentImage.mimeType,
            data: currentImage.base64
          }
        });
      }
      contents.push({ role: 'user', parts: currentParts });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: "You are an expert Plant Doctor and botanist. Your goal is to help users identify plant diseases, pests, and provide care advice. When an image is provided, analyze it thoroughly for signs of stress, disease, or nutrient deficiency. Keep answers concise, helpful, and encouraging. Use emojis sparingly.",
        }
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Chat Error", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm sorry, I encountered an error while analyzing your request. Please check your connection and try again.",
        isLoading: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[90%] md:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
               {/* Avatar */}
               <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                 msg.role === 'user' 
                   ? 'bg-emerald-200 text-emerald-800' 
                   : 'bg-indigo-100 text-indigo-700'
               }`}>
                 {msg.role === 'user' ? 'ME' : 'AI'}
               </div>

               {/* Bubble */}
               <div
                className={`relative px-5 py-4 shadow-sm text-sm md:text-base ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl rounded-tr-none'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-none'
                }`}
              >
                {msg.image && (
                  <div className="mb-3 overflow-hidden rounded-lg border border-white/20">
                    <img src={msg.image} alt="Uploaded plant" className="max-w-full h-auto object-cover max-h-64 w-full" />
                  </div>
                )}
                {msg.role === 'model' ? (
                  <div className="prose prose-sm prose-emerald max-w-none">
                      <SimpleMarkdown content={msg.text} />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start w-full">
            <div className="flex items-end gap-2">
               <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">AI</div>
               <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-6 py-4 shadow-sm flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-medium mr-2">Analyzing</span>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 z-10 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          {selectedImage && (
            <div className="mb-3 flex items-center justify-between p-2 pl-3 bg-emerald-50 rounded-lg border border-emerald-100 animate-slide-up">
              <div className="flex items-center">
                <img src={selectedImage.url} alt="Preview" className="w-10 h-10 object-cover rounded mr-3" />
                <span className="text-sm text-emerald-800 font-medium truncate max-w-[150px] sm:max-w-xs">Photo attached</span>
              </div>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-1 hover:bg-red-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="flex items-end space-x-2 bg-slate-100 p-2 rounded-3xl border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500/50 focus-within:bg-white transition-all shadow-inner">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all active:scale-95"
              title="Upload plant photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask for advice..."
              className="w-full bg-transparent border-none focus:ring-0 resize-none h-12 py-3 text-slate-700 placeholder-slate-400"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSendMessage}
              disabled={(!inputText.trim() && !selectedImage) || isLoading}
              className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex-shrink-0 mb-1 mr-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;