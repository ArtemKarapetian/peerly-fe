import { Send, Clock, CheckCheck } from "lucide-react";
import { useState } from "react";

export interface ChatMessage {
  id: string;
  sender: "user" | "support";
  text: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

interface ChatThreadProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  headerAction?: React.ReactNode;
  compact?: boolean;
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Сегодня";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Вчера";
  } else {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    });
  }
}

export function ChatThread({ messages, onSendMessage, headerAction, compact }: ChatThreadProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = formatDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {} as Record<string, ChatMessage[]>,
  );

  const padding = compact ? "p-4" : "p-6";
  const messagePadding = compact ? "px-4 py-2.5" : "px-5 py-3";
  const messageMaxWidth = compact ? "max-w-[80%]" : "max-w-[70%]";
  const messageSpacing = compact ? "space-y-4" : "space-y-6";
  const dateSpacing = compact ? "mb-4" : "mb-6";
  const itemSpacing = compact ? "mb-3" : "mb-4";

  return (
    <>
      {/* Header */}
      <div className={`${padding} border-b border-border flex items-center gap-3`}>
        {headerAction}
        <div className="flex-1">
          <h2 className={`font-semibold text-foreground ${compact ? "" : "text-xl mb-1"}`}>
            Служба поддержки
          </h2>
          <div
            className={`flex items-center gap-1.5 text-muted-foreground ${compact ? "text-xs" : "text-sm"}`}
          >
            <Clock className={compact ? "w-3 h-3" : "w-4 h-4"} />
            <span>
              {compact ? "Обычно отвечаем в течение 24ч" : "Обычно отвечаем в течение 24 часов"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto ${padding} ${messageSpacing}`}>
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <div className={`flex justify-center ${dateSpacing}`}>
              <span
                className={`text-xs text-muted-foreground bg-muted px-3 ${compact ? "py-1" : "py-1.5"} rounded-full`}
              >
                {date}
              </span>
            </div>
            {msgs.map((message) => (
              <div
                key={message.id}
                className={`flex ${itemSpacing} ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`${messageMaxWidth} rounded-[16px] ${messagePadding} ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p
                    className={`${compact ? "text-sm" : "text-[15px] leading-relaxed"} whitespace-pre-wrap break-words`}
                  >
                    {message.text}
                  </p>
                  <div
                    className={`flex items-center gap-1${compact ? "" : ".5"} justify-end ${compact ? "mt-1" : "mt-2"} ${
                      message.sender === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs">{formatTime(message.timestamp)}</span>
                    {message.sender === "user" && message.status === "delivered" && (
                      <CheckCheck className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Composer */}
      <form onSubmit={handleSubmit} className={`${padding} border-t border-border`}>
        <div className={`flex ${compact ? "gap-2" : "gap-3"}`}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Напишите сообщение..."
            className={`flex-1 px-4 ${compact ? "py-2.5" : "py-3"} border border-border rounded-[12px] bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors`}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`${compact ? "px-4 py-2.5" : "px-6 py-3"} bg-primary text-primary-foreground rounded-[12px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${compact ? "" : "font-medium"}`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </>
  );
}
