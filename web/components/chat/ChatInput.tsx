"use client";

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = "Type your message..." }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <div
      className="flex items-end gap-3 p-4 border-t"
      style={{ borderColor: "#D4D0CA", backgroundColor: "#F0EFEC" }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none bg-transparent text-base placeholder-slate-500 outline-none"
        style={{
          color: "#2C1D12",
          fontSize: "17px",
          lineHeight: "1.6",
          minHeight: "56px",
          paddingTop: "14px",
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="flex-shrink-0 px-5 font-medium text-sm transition-colors"
        style={{
          backgroundColor: disabled || !value.trim() ? "#D4D0CA" : "#D42B1E",
          color: disabled || !value.trim() ? "#8A7E72" : "#FAF9F6",
          borderRadius: "2px",
          height: "56px",
          minWidth: "80px",
          cursor: disabled || !value.trim() ? "not-allowed" : "pointer",
          border: "none",
        }}
      >
        Send
      </button>
    </div>
  );
}
