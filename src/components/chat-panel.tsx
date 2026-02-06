"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useCallback, useState } from "react";
import { ChatMessage } from "@/components/chat-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp, Loader2, Sparkles } from "lucide-react";
import type { UIMessage } from "ai";

interface ChatPanelProps {
  onToolCall: (toolName: string, args: Record<string, string>) => string;
}

const STARTER_PROMPTS = [
  "I have a deadline tomorrow and I haven't started yet",
  "I can't seem to start working on anything today",
  "I'm feeling overwhelmed by my task list",
  "Help me break down a task I've been avoiding",
];

const WELCOME_MESSAGE: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Hey there! I'm Momentum, your personal coach for navigating procrastination and ADHD challenges. Whatever you're dealing with right now \u2014 a looming deadline, feeling stuck, or just needing someone to help you get started \u2014 I'm here for you. No judgment, just support. What's on your mind?",
    },
  ],
};

export function ChatPanel({ onToolCall }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  const { messages, sendMessage, status, addToolResult } = useChat({
    id: "momentum-chat",
    messages: [WELCOME_MESSAGE],
    onToolCall: async ({ toolCall }) => {
      const result = onToolCall(
        toolCall.toolName,
        toolCall.input as Record<string, string>,
      );
      await addToolResult({
        tool: toolCall.toolName as "addTodo",
        toolCallId: toolCall.toolCallId,
        output: JSON.parse(result),
      });
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault?.();
      if (!inputValue.trim() || isLoading) return;
      const text = inputValue.trim();
      setInputValue("");
      sendMessage({ text });
    },
    [inputValue, isLoading, sendMessage],
  );

  const handleStarterClick = useCallback(
    (prompt: string) => {
      if (isLoading) return;
      sendMessage({ text: prompt });
    },
    [isLoading, sendMessage],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="font-semibold text-sm">Momentum</h1>
          <p className="text-xs text-muted-foreground">
            Your procrastination coach
          </p>
        </div>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1 px-4">
        <div className="space-y-6 py-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Momentum is thinking...</span>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="pb-4">
            <p className="text-xs text-muted-foreground mb-2">
              Try one of these:
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleStarterClick(prompt)}
                  className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tell me what's on your mind..."
            className="flex-1 rounded-full"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="shrink-0 rounded-full cursor-pointer"
            disabled={isLoading || !inputValue.trim()}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
