"use client";

import { ChatPanel } from "@/components/chat-panel";
import { TodoPanel } from "@/components/todo-panel";
import { useTodos } from "@/hooks/use-todos";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { ListTodo, MessageCircle, X } from "lucide-react";

export default function Home() {
  const {
    activeTodos,
    doneTodos,
    addTodo,
    completeTodo,
    deleteTodo,
    updateTodo,
    toggleTodo,
  } = useTodos();

  const [showTodos, setShowTodos] = useState(false);

  const handleToolCall = useCallback(
    (toolName: string, args: Record<string, string>): string => {
      switch (toolName) {
        case "addTodo": {
          const id = addTodo(args.text);
          return JSON.stringify({ success: true, id, text: args.text });
        }
        case "completeTodo": {
          completeTodo(args.id);
          return JSON.stringify({ success: true, id: args.id });
        }
        case "deleteTodo": {
          deleteTodo(args.id);
          return JSON.stringify({ success: true, id: args.id });
        }
        case "updateTodo": {
          updateTodo(args.id, args.text);
          return JSON.stringify({ success: true, id: args.id, text: args.text });
        }
        default:
          return JSON.stringify({ error: "Unknown tool" });
      }
    },
    [addTodo, completeTodo, deleteTodo, updateTodo],
  );

  return (
    <div className="flex h-dvh bg-background">
      {/* Chat Panel */}
      <div className="flex flex-1 flex-col relative">
        <ChatPanel onToolCall={handleToolCall} />

        {/* Mobile toggle button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-3 md:hidden z-10 rounded-full cursor-pointer"
          onClick={() => setShowTodos(!showTodos)}
        >
          {showTodos ? (
            <X className="h-4 w-4" />
          ) : (
            <ListTodo className="h-4 w-4" />
          )}
          {activeTodos.length > 0 && !showTodos && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {activeTodos.length}
            </span>
          )}
        </Button>
      </div>

      {/* Desktop Todo Panel */}
      <div className="hidden md:flex w-80 border-l flex-col bg-card">
        <TodoPanel
          activeTodos={activeTodos}
          doneTodos={doneTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </div>

      {/* Mobile Todo Panel */}
      {showTodos && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowTodos(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-card shadow-xl animate-in slide-in-from-right">
            <div className="flex justify-end p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTodos(false)}
                className="cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <TodoPanel
              activeTodos={activeTodos}
              doneTodos={doneTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          </div>
        </div>
      )}
    </div>
  );
}
