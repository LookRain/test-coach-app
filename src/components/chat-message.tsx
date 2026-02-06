"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  CheckCircle2,
  ListPlus,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import type { UIMessage } from "ai";

interface ChatMessageProps {
  message: UIMessage;
}

function ToolCallBadge({
  toolName,
  args,
}: {
  toolName: string;
  args: Record<string, string>;
}) {
  const iconMap: Record<string, React.ReactNode> = {
    addTodo: <ListPlus className="h-3.5 w-3.5" />,
    completeTodo: <CheckCircle2 className="h-3.5 w-3.5" />,
    deleteTodo: <Trash2 className="h-3.5 w-3.5" />,
    updateTodo: <Pencil className="h-3.5 w-3.5" />,
  };

  const labelMap: Record<string, string> = {
    addTodo: "Added task",
    completeTodo: "Completed task",
    deleteTodo: "Removed task",
    updateTodo: "Updated task",
  };

  const colorMap: Record<string, string> = {
    addTodo: "bg-blue-50 text-blue-700 border-blue-200",
    completeTodo: "bg-green-50 text-green-700 border-green-200",
    deleteTodo: "bg-red-50 text-red-700 border-red-200",
    updateTodo: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="my-1">
      <Badge
        variant="outline"
        className={`gap-1.5 py-1 px-2.5 text-xs font-normal ${colorMap[toolName] ?? ""}`}
      >
        {iconMap[toolName] ?? null}
        {labelMap[toolName] ?? toolName}
        {args?.text && (
          <span className="font-medium">: {args.text}</span>
        )}
      </Badge>
    </div>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar
        className={`h-8 w-8 shrink-0 ${isUser ? "bg-primary" : "bg-gradient-to-br from-violet-500 to-indigo-600"}`}
      >
        <AvatarFallback
          className={
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-gradient-to-br from-violet-500 to-indigo-600 text-white"
          }
        >
          {isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={`flex max-w-[80%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
      >
        <span className="text-xs font-medium text-muted-foreground mb-0.5">
          {isUser ? "You" : "Momentum"}
        </span>

        {message.parts.map((part, idx) => {
          if (part.type === "text" && part.text) {
            return (
              <div
                key={idx}
                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted rounded-tl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{part.text}</p>
              </div>
            );
          }

          // Handle tool invocation parts (they have type `tool-{toolName}`)
          if (part.type.startsWith("tool-")) {
            const toolName = part.type.replace("tool-", "");
            const toolPart = part as unknown as {
              type: string;
              toolCallId: string;
              input: Record<string, string>;
            };
            return (
              <ToolCallBadge
                key={idx}
                toolName={toolName}
                args={toolPart.input ?? {}}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
