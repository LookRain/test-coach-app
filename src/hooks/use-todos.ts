"use client";

import { useState, useCallback, useEffect } from "react";
import type { Todo } from "@/lib/types";

const STORAGE_KEY = "momentum-todos";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTodos(loadTodos());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveTodos(todos);
    }
  }, [todos, loaded]);

  const addTodo = useCallback((text: string): string => {
    const id = generateId();
    const newTodo: Todo = {
      id,
      text,
      completed: false,
      createdAt: Date.now(),
    };
    setTodos((prev) => [...prev, newTodo]);
    return id;
  }, []);

  const completeTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: true, completedAt: Date.now() }
          : todo,
      ),
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const updateTodo = useCallback((id: string, text: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo)),
    );
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? Date.now() : undefined,
            }
          : todo,
      ),
    );
  }, []);

  const activeTodos = todos.filter((t) => !t.completed);
  const doneTodos = todos
    .filter((t) => t.completed)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));

  return {
    todos,
    activeTodos,
    doneTodos,
    addTodo,
    completeTodo,
    deleteTodo,
    updateTodo,
    toggleTodo,
    loaded,
  };
}
