import { useState, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getListGeminiMessagesQueryKey } from "@workspace/api-client-react";

export interface StreamMessage {
  id: string | number;
  role: "user" | "assistant" | "model";
  content: string;
  isStreaming?: boolean;
}

export function useGeminiStream(conversationId: number | null) {
  const [messages, setMessages] = useState<StreamMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync with fetched messages when they load
  const syncMessages = useCallback((serverMessages: any[]) => {
    if (!isStreaming) {
      setMessages(
        serverMessages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        }))
      );
    }
  }, [isStreaming]);

  const sendMessage = async (content: string) => {
    if (!conversationId || !content.trim()) return;

    // Abort previous stream if active
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessageId = Date.now();
    const assistantMessageId = userMessageId + 1;

    setMessages((prev) => [
      ...prev,
      { id: userMessageId, role: "user", content },
      { id: assistantMessageId, role: "assistant", content: "", isStreaming: true },
    ]);
    
    setIsStreaming(true);
    setError(null);

    try {
      const response = await fetch(`/api/gemini/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Failed to send message");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (!dataStr.trim()) continue;

            try {
              const data = JSON.parse(dataStr);
              if (data.done) {
                // Finished
              } else if (data.content) {
                assistantContent += data.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: assistantContent }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error("Failed to parse SSE chunk", dataStr);
            }
          }
        }
      }

      // Finalize the message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
      
      // Invalidate the query to fetch the real IDs from the DB
      queryClient.invalidateQueries({
        queryKey: getListGeminiMessagesQueryKey(conversationId),
      });

    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream aborted");
      } else {
        setError(err.message || "An error occurred");
        setMessages((prev) => prev.filter((m) => m.id !== assistantMessageId));
      }
    } finally {
      setIsStreaming(false);
    }
  };

  return {
    messages,
    syncMessages,
    sendMessage,
    isStreaming,
    error,
  };
}
