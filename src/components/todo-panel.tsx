"use client";

import { Todo } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  Circle,
  ListTodo,
  PartyPopper,
  Trash2,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TodoPanelProps {
  activeTodos: Todo[];
  doneTodos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoPanel({
  activeTodos,
  doneTodos,
  onToggle,
  onDelete,
}: TodoPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <ListTodo className="h-5 w-5 text-primary" />
        <h2 className="font-semibold">My Tasks</h2>
        {activeTodos.length > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {activeTodos.length}
          </Badge>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {activeTodos.length === 0 && doneTodos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Circle className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No tasks yet. Chat with Momentum and
              </p>
              <p className="text-sm text-muted-foreground">
                {"they'll help you get organized!"}
              </p>
            </div>
          )}

          {activeTodos.map((todo) => (
            <div
              key={todo.id}
              className="group flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/50"
            >
              <Checkbox
                checked={false}
                onCheckedChange={() => onToggle(todo.id)}
                className="mt-0.5 cursor-pointer"
              />
              <span className="flex-1 text-sm leading-relaxed">
                {todo.text}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => onDelete(todo.id)}
              >
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
          ))}

          {doneTodos.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex items-center gap-2 mb-3 px-3">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Completed
                </span>
                <Badge
                  variant="outline"
                  className="ml-auto text-amber-600 border-amber-200 bg-amber-50"
                >
                  <PartyPopper className="h-3 w-3 mr-1" />
                  {doneTodos.length} win{doneTodos.length !== 1 ? "s" : ""}
                </Badge>
              </div>
              {doneTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="group flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted/50"
                >
                  <Checkbox
                    checked={true}
                    onCheckedChange={() => onToggle(todo.id)}
                    className="mt-0.5 cursor-pointer"
                  />
                  <span className="flex-1 text-sm leading-relaxed line-through text-muted-foreground">
                    {todo.text}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                </div>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
