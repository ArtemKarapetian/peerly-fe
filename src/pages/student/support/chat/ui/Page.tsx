import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { ConversationList, ChatThread } from "@/widgets/support-chat";
import type { ChatMessage } from "@/widgets/support-chat";

import { DEMO_MESSAGES } from "../model/mockMessages";

export default function SupportChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const [showConversationList, setShowConversationList] = useState(true);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = (text: string) => {
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, message]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, status: "delivered" as const } : m)),
      );
    }, 500);
  };

  const lastMessage = messages[messages.length - 1];
  const lastMessageTime = formatTime(lastMessage.timestamp);

  return (
    <AppShell title="Чат с поддержкой">
      {/* Mobile/Tablet: Show conversation list or chat */}
      <div className="hide-on-desktop h-[calc(100vh-64px)]">
        {showConversationList ? (
          <div className="bg-card border border-border rounded-[20px] overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Чаты</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                lastMessageText={lastMessage.text}
                lastMessageTime={lastMessageTime}
                onSelect={() => setShowConversationList(false)}
              />
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-[20px] overflow-hidden h-full flex flex-col">
            <ChatThread
              messages={messages}
              onSendMessage={handleSendMessage}
              compact
              headerAction={
                <button
                  onClick={() => setShowConversationList(true)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              }
            />
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
              <ConversationList
                lastMessageText={lastMessage.text}
                lastMessageTime={lastMessageTime}
                isSelected
              />
            </div>
          </div>

          {/* Right: Chat Thread */}
          <div className="flex-1 bg-card border border-border rounded-[20px] overflow-hidden flex flex-col min-w-0">
            <ChatThread messages={messages} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
