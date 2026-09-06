import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  User, 
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react';
import { api } from '../services/api';
import { 
  ZigAvatar, 
  ZigChatHeaderTitle, 
  ZigThinkingAnimation, 
  ZigEmptyChatIllustration 
} from './ZigMascot';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface AiShoppingAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDealId?: (dealId: string) => void;
}

const ZIG_WELCOME_MESSAGE = `“Hey, I’m ZIG. Give me a store, a product, or a budget and I’ll hunt down the best deal I can find.”\n\nI don't invent fake codes or estimate without evidence—I run real numbers through the SNAGZ calculation engine, stack manufacturer coupons with store rewards, and calculate your exact out-of-pocket register price.`;

export const AiShoppingAssistant: React.FC<AiShoppingAssistantProps> = ({
  isOpen,
  onClose,
  onSelectDealId
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: ZIG_WELCOME_MESSAGE,
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "🏪 What's the best deal at CVS?",
    "💰 Find me a money maker",
    "🎁 Find me something FREE",
    "💵 I have $20. What should I buy?",
    "🧺 Build me the best CVS transaction",
    "⏰ What's expiring today?",
    "👟 Best deal on Nike shoes?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await api.askAssistant(textToSend);
      const botMsg: Message = {
        role: 'assistant',
        content: response.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "⚡ ZIG Alert: I had trouble scanning the live server feed right now. Check your connection or try again in a moment!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    setMessages([
      {
        role: 'assistant',
        content: ZIG_WELCOME_MESSAGE,
        time: 'Just now'
      }
    ]);
  };

  return (
    <div 
      id="zig-assistant-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-end sm:p-4 bg-black/75 backdrop-blur-sm transition-all"
      onClick={onClose}
      aria-label="ZIG — Your Deal Hunter"
    >
      <div 
        id="zig-deal-hunter-drawer"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:w-[480px] h-full sm:h-[88vh] bg-neutral-900 border-l sm:border border-neutral-800 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
      >
        {/* Header with ZIG Mascot Branding */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <ZigChatHeaderTitle />

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleResetConversation}
              title="Reset conversation with ZIG"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="btn-close-zig-assistant"
              type="button"
              onClick={onClose}
              aria-label="Close ZIG"
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs leading-relaxed">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className="shrink-0 pt-0.5">
                {m.role === 'user' ? (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-neutral-950 font-bold flex items-center justify-center shadow-md">
                    <User className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-neutral-950 border border-emerald-500/30 flex items-center justify-center overflow-hidden shadow-md">
                    <ZigAvatar size={30} expression="confident" />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[86%] rounded-2xl p-3.5 ${
                m.role === 'user'
                  ? 'bg-emerald-500 text-neutral-950 font-semibold'
                  : 'bg-neutral-950 border border-neutral-800 text-neutral-200 shadow-md'
              }`}>
                {m.role === 'assistant' && (
                  <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-1">
                    <Zap className="w-3 h-3 fill-emerald-400" />
                    <span>ZIG</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {m.content}
                </div>
                <span className={`text-[10px] block mt-2 ${m.role === 'user' ? 'text-emerald-950/70' : 'text-neutral-500'}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {/* Show ZIG Empty State Illustration if only welcome message is present */}
          {messages.length === 1 && (
            <div className="pt-2">
              <ZigEmptyChatIllustration onSelectPrompt={(p) => handleSend(p)} />
            </div>
          )}

          {/* Active Hunting Radar State */}
          {isLoading && (
            <div className="py-2">
              <ZigThinkingAnimation />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-neutral-950/80 border-t border-neutral-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 hover:text-emerald-300 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 font-medium"
            >
              <span>{p}</span>
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              id="input-zig-chat"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Give ZIG a store, product, or budget (e.g. CVS deals)..."
              className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            id="btn-send-zig-chat"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            aria-label="Send to ZIG"
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-950 font-bold transition-all shadow-md flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
