"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { CongressData } from "../../../types/congress";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function GeminiChat({ congress, isEmbedded = false }: { congress: CongressData; isEmbedded?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { colors } = congress;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 100);
    }
    
    // Notify parent about resize
    if (isEmbedded) {
        window.parent.postMessage({
            type: 'CHAT_RESIZE',
            isOpen: isOpen
        }, '*');
    }
  }, [isOpen, isEmbedded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: congress,
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";

      setMessages((prev) => [...prev, { role: "model", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === "model") {
            lastMessage.content = accumulatedResponse;
          }
          return newMessages;
        });
      }

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente mais tarde.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`${
            isEmbedded
            ? "fixed inset-0 m-auto w-14 h-14 flex items-center justify-center rounded-full shadow-lg transform hover:scale-110 transition-all duration-300"
            : "fixed bottom-6 left-6 md:bottom-8 md:left-8 z-40 w-14 h-14 flex items-center justify-center rounded-full shadow-lg transform hover:scale-110 transition-all duration-300"
          }`}
          style={{ backgroundColor: colors.primary, color: "#fff" }}
          aria-label="Abrir chat com IA"
        >
          <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`${
            isEmbedded 
            ? "fixed inset-0 w-full h-full bg-white flex flex-col overflow-hidden font-sans" 
            : "fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 w-[90vw] md:w-[400px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up border border-gray-200 font-sans"
        }`}>
          {/* Header */}
          <div
            className="p-4 flex justify-between items-center text-white"
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <div>
                <h3 className="font-bold text-sm md:text-base">Assistente Virtual</h3>
                <p className="text-xs opacity-90">Tire dúvidas sobre o edital</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" style={{ color: colors.primary }} />
                <p className="text-sm">Olá! Sou a IA do congresso.</p>
                <p className="text-sm">Como posso ajudar com o edital hoje?</p>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                    msg.role === "user" ? "bg-gray-200" : "text-white"
                  }`}
                  style={msg.role === "model" ? { backgroundColor: colors.primary } : {}}
                >
                  {msg.role === "user" ? <User className="w-5 h-5 text-gray-600" /> : <Sparkles className="w-5 h-5" />}
                </div>
                
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-white text-gray-800 border border-gray-100 rounded-tr-none"
                      : "text-white rounded-tl-none"
                  }`}
                  style={msg.role === "model" ? { backgroundColor: colors.secondary } : {}}
                >
                  {msg.role === "model" ? (
                    <ReactMarkdown 
                        components={{
                            p: ({...props}) => <p className="mb-2 last:mb-0" {...props} />,
                            a: ({...props}) => <a className="underline hover:text-blue-200" {...props} />,
                            ul: ({...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                            ol: ({...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                        }}
                    >
                        {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                 <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="bg-gray-200/50 rounded-2xl rounded-tl-none px-4 py-2 flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua dúvida..."
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:bg-white transition-all outline-none text-sm text-gray-700"
                style={{ "--tw-ring-color": colors.primary } as React.CSSProperties}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-md hover:shadow-lg transform active:scale-95"
                style={{ backgroundColor: colors.primary }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
