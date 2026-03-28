import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, Button } from "@/components/ui-custom";
import { useListGeminiConversations, useCreateGeminiConversation } from "@workspace/api-client-react";
import { useGeminiStream } from "@/hooks/use-gemini-stream";
import { Send, Plus, Bot, User, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AiChat() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: isLoadingConvos } = useListGeminiConversations();
  const createMutation = useCreateGeminiConversation();
  const { messages, syncMessages, sendMessage, isStreaming } = useGeminiStream(activeId);

  // Fetch initial messages for active conversation
  useEffect(() => {
    if (!activeId) return;
    fetch(`/api/gemini/conversations/${activeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          syncMessages(data.messages);
        }
      })
      .catch(console.error);
  }, [activeId, syncMessages]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleNewChat = () => {
    createMutation.mutate({ data: { title: "New Financial Query" } }, {
      onSuccess: (data) => {
        setActiveId(data.id);
        syncMessages([]); // clear UI
      }
    });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeId || isStreaming) return;
    
    sendMessage(input);
    setInput("");
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-6rem)] gap-6">
        {/* Sidebar History */}
        <Card className="w-80 hidden md:flex flex-col border-none shadow-lg bg-white overflow-hidden">
          <div className="p-4 border-b border-border bg-slate-50">
            <Button onClick={handleNewChat} className="w-full gap-2" isLoading={createMutation.isPending}>
              <Plus size={18} /> New Conversation
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoadingConvos ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : conversations?.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                  activeId === conv.id 
                    ? "bg-primary text-white shadow-md" 
                    : "hover:bg-muted text-foreground/80"
                )}
              >
                <div className="truncate">{conv.title}</div>
                <div className={cn(
                  "text-xs mt-1",
                  activeId === conv.id ? "text-white/70" : "text-muted-foreground"
                )}>
                  {new Date(conv.createdAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col border-none shadow-lg bg-white overflow-hidden relative">
          {!activeId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="text-primary w-10 h-10" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Your AI Money Mentor</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Ask me about taxes, investment strategies, mutual funds, or explaining complex financial jargon in simple terms.
              </p>
              <Button onClick={handleNewChat} size="lg" className="gap-2 shadow-xl shadow-primary/20">
                <Plus size={20} /> Start a New Conversation
              </Button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                {messages.length === 0 && (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Send a message to start the conversation...
                  </div>
                )}
                
                {messages.map((msg, i) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex gap-4 max-w-[85%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      msg.role === 'user' ? "bg-primary text-white" : "bg-secondary text-white"
                    )}>
                      {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    <div className={cn(
                      "px-5 py-4 rounded-2xl",
                      msg.role === 'user' 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-muted text-foreground rounded-tl-none border border-border"
                    )}>
                      {msg.isStreaming && !msg.content ? (
                        <div className="flex gap-1 items-center h-5">
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce delay-200"></div>
                        </div>
                      ) : (
                        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none break-words" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-border">
                <form onSubmit={handleSend} className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your finances..."
                    disabled={isStreaming}
                    className="w-full pl-6 pr-16 py-4 bg-muted/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isStreaming}
                    className="absolute right-2 p-2.5 bg-primary text-white rounded-xl disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-md"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          )}
        </Card>
      </div>
    </Layout>
  );
}
