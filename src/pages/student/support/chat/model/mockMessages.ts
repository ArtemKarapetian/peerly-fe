export interface Message {
  id: string;
  sender: "user" | "support";
  text: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

export const DEMO_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "support",
    text: "Здравствуйте! Чем могу помочь?",
    timestamp: "2025-01-25T10:00:00",
    status: "read",
  },
  {
    id: "2",
    sender: "user",
    text: "Здравствуйте! У меня вопрос по peer review процессу.",
    timestamp: "2025-01-25T10:05:00",
    status: "read",
  },
  {
    id: "3",
    sender: "support",
    text: "Конечно, задавайте ваш вопрос. Я постараюсь помочь.",
    timestamp: "2025-01-25T10:06:00",
    status: "read",
  },
];
