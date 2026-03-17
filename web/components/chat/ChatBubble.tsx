"use client";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatBubble({ role, content, isStreaming }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in-up`}>
      <div
        className={`max-w-[78%] rounded px-4 py-3 text-base leading-relaxed ${
          isUser
            ? "bg-amber-500 text-navy-900 font-medium"
            : "bg-navy-700 text-slate-100 border border-navy-600"
        }`}
        style={{
          backgroundColor: isUser ? "#D42B1E" : "#E8E6E2",
          color: isUser ? "#FAF9F6" : "#2C1D12",
          borderColor: isUser ? "transparent" : "#D4D0CA",
          borderWidth: isUser ? 0 : 1,
          borderStyle: "solid",
          borderRadius: "4px",
        }}
      >
        {content}
        {isStreaming && (
          <span className="inline-flex items-center gap-[3px] ml-2 align-middle">
            <span className="typing-dot w-[5px] h-[5px] rounded-full inline-block" style={{ backgroundColor: isUser ? "#FAF9F6" : "#8A7E72" }} />
            <span className="typing-dot w-[5px] h-[5px] rounded-full inline-block" style={{ backgroundColor: isUser ? "#FAF9F6" : "#8A7E72" }} />
            <span className="typing-dot w-[5px] h-[5px] rounded-full inline-block" style={{ backgroundColor: isUser ? "#FAF9F6" : "#8A7E72" }} />
          </span>
        )}
      </div>
    </div>
  );
}
