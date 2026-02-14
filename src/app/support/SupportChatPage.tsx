import { useState } from 'react';
import { AppShell } from '@/app/components/AppShell';
import { Send, ArrowLeft, Clock, CheckCheck } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'support';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

const DEMO_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'support',
    text: 'Здравствуйте! Чем могу помочь?',
    timestamp: '2025-01-25T10:00:00',
    status: 'read'
  },
  {
    id: '2',
    sender: 'user',
    text: 'Здравствуйте! У меня вопрос по peer review процессу.',
    timestamp: '2025-01-25T10:05:00',
    status: 'read'
  },
  {
    id: '3',
    sender: 'support',
    text: 'Конечно, задавайте ваш вопрос. Я постараюсь помочь.',
    timestamp: '2025-01-25T10:06:00',
    status: 'read'
  }
];

/**
 * SupportChatPage - Live chat with support team
 */
export default function SupportChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [showConversationList, setShowConversationList] = useState(true);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, status: 'delivered' as const } : m
      ));
    }, 500);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long' 
      });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <AppShell title="Чат с поддержкой">
      {/* Mobile/Tablet: Show conversation list or chat */}
      <div className="hide-on-desktop h-[calc(100vh-64px)]">
        {showConversationList ? (
          // Conversation List (Mobile)
          <div className="bg-card border border-border rounded-[20px] overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Чаты</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <button
                onClick={() => setShowConversationList(false)}
                className="w-full p-4 hover:bg-accent transition-colors text-left border-b border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💬</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-foreground">Служба поддержки</h3>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(messages[messages.length - 1].timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {messages[messages.length - 1].text}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          // Chat Thread (Mobile)
          <div className="bg-card border border-border rounded-[20px] overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <button
                onClick={() => setShowConversationList(true)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <h2 className="font-semibold text-foreground">Служба поддержки</h2>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Обычно отвечаем в течение 24ч</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="flex justify-center mb-4">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {date}
                    </span>
                  </div>
                  {msgs.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-[16px] px-4 py-2.5 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                        <div className={`flex items-center gap-1 justify-end mt-1 ${
                          message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          <span className="text-xs">{formatTime(message.timestamp)}</span>
                          {message.sender === 'user' && message.status === 'delivered' && (
                            <CheckCheck className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Composer */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Напишите сообщение..."
                  className="flex-1 px-4 py-2.5 border border-border rounded-[12px] bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2.5 bg-primary text-primary-foreground rounded-[12px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Desktop: Two-pane layout */}
      <div className="hide-below-desktop h-[calc(100vh-64px)]">
        <div className="flex gap-6 h-full">
          {/* Left: Conversation List */}
          <div className="w-[360px] bg-card border border-border rounded-[20px] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Чаты</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 bg-accent/50 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-foreground">Служба поддержки</h3>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(messages[messages.length - 1].timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {messages[messages.length - 1].text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Chat Thread */}
          <div className="flex-1 bg-card border border-border rounded-[20px] overflow-hidden flex flex-col min-w-0">
            {/* Header */}
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground mb-1">Служба поддержки</h2>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Обычно отвечаем в течение 24 часов</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="flex justify-center mb-6">
                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                      {date}
                    </span>
                  </div>
                  {msgs.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-[16px] px-5 py-3 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-[15px] whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
                        <div className={`flex items-center gap-1.5 justify-end mt-2 ${
                          message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          <span className="text-xs">{formatTime(message.timestamp)}</span>
                          {message.sender === 'user' && message.status === 'delivered' && (
                            <CheckCheck className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Composer */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-border">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Напишите сообщение..."
                  className="flex-1 px-4 py-3 border border-border rounded-[12px] bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-[12px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
