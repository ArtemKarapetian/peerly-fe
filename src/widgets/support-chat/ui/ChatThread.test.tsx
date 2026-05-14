import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ChatThread, type ChatMessage } from "./ChatThread";

const messages: ChatMessage[] = [
  {
    id: "m-1",
    sender: "support",
    text: "Hello, how can I help?",
    timestamp: new Date().toISOString(),
  },
  {
    id: "m-2",
    sender: "user",
    text: "I have a question",
    timestamp: new Date().toISOString(),
    status: "delivered",
  },
];

describe("ChatThread", () => {
  it("renders messages and header", () => {
    render(<ChatThread messages={messages} onSendMessage={vi.fn()} />);
    expect(screen.getByText("Hello, how can I help?")).toBeInTheDocument();
    expect(screen.getByText("I have a question")).toBeInTheDocument();
    expect(screen.getByText(/widget\.chatThread\.supportService/)).toBeInTheDocument();
  });

  it("submits a typed message via the form and clears the input", async () => {
    const user = userEvent.setup();
    const onSendMessage = vi.fn();
    render(<ChatThread messages={messages} onSendMessage={onSendMessage} />);
    const input = screen.getByPlaceholderText(/widget\.chatThread\.placeholder/);
    await user.type(input, "Need help");
    const submitBtn = screen.getByRole("button");
    await user.click(submitBtn);
    expect(onSendMessage).toHaveBeenCalledWith("Need help");
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("disables the send button when input is empty", () => {
    render(<ChatThread messages={[]} onSendMessage={vi.fn()} />);
    const submitBtn = screen.getByRole("button");
    expect(submitBtn).toBeDisabled();
  });
});
