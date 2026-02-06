import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, tool } from "ai";
import { z } from "zod";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const result = streamText({
    model: openrouter("moonshotai/kimi-k2"),
    system: SYSTEM_PROMPT,
    messages,
    tools: {
      addTodo: tool({
        description:
          "Add a new todo item to the user's task list. Use this when the user mentions a task they need to do, or when breaking down a larger task into smaller steps.",
        inputSchema: z.object({
          text: z
            .string()
            .describe(
              "The todo item text. Keep it short, clear, and specific.",
            ),
        }),
      }),
      completeTodo: tool({
        description:
          "Mark a todo item as completed. Use this when the user says they finished a task. This moves it to the done list to celebrate the win!",
        inputSchema: z.object({
          id: z.string().describe("The ID of the todo item to mark as done."),
        }),
      }),
      deleteTodo: tool({
        description:
          "Delete a todo item from the list. Use this when a task is no longer relevant or the user wants to remove it.",
        inputSchema: z.object({
          id: z.string().describe("The ID of the todo item to delete."),
        }),
      }),
      updateTodo: tool({
        description:
          "Update the text of an existing todo item. Use this to refine or clarify a task.",
        inputSchema: z.object({
          id: z.string().describe("The ID of the todo item to update."),
          text: z.string().describe("The new text for the todo item."),
        }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
