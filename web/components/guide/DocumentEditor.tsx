"use client";

import { useState, useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Comment {
  id: string;
  anchor: string;
  text: string;
  paragraphIndex: number;
  resolved: boolean;
}

interface DocumentEditorProps {
  document: string;
  comments: Comment[];
  onDocumentChange: (doc: string) => void;
  onAddComment: (comment: Omit<Comment, "id" | "resolved">) => void;
  highlightedParagraphs: Set<number>;
}

export function DocumentEditor({
  document,
  comments,
  onDocumentChange,
  onAddComment,
  highlightedParagraphs,
}: DocumentEditorProps) {
  const [editMode, setEditMode] = useState(false);
  const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null);
  const [selectedParagraph, setSelectedParagraph] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const paragraphRefs = useRef<Map<number, HTMLElement>>(new Map());

  const paragraphs = document.split(/\n\n+/).filter((p) => p.trim());

  function handleParagraphClick(idx: number, text: string) {
    if (editMode) return;
    setSelectedParagraph(idx === selectedParagraph ? null : idx);
    setCommentInput("");
  }

  function handleAddComment(idx: number, paragraphText: string) {
    if (!commentInput.trim()) return;
    onAddComment({
      anchor: paragraphText.slice(0, 100),
      text: commentInput.trim(),
      paragraphIndex: idx,
    });
    setCommentInput("");
    setSelectedParagraph(null);
  }

  const unresolvedOnParagraph = useCallback(
    (idx: number) => comments.filter((c) => c.paragraphIndex === idx && !c.resolved),
    [comments]
  );

  if (editMode) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: "#D4D0CA" }}>
          <span className="text-sm font-medium" style={{ color: "#5C4D3C" }}>Edit mode</span>
          <button
            onClick={() => setEditMode(false)}
            className="text-sm font-medium px-3 py-1.5 transition-colors"
            style={{ backgroundColor: "#D42B1E", color: "#FAF9F6", borderRadius: "2px" }}
          >
            Done editing
          </button>
        </div>
        <textarea
          value={document}
          onChange={(e) => onDocumentChange(e.target.value)}
          className="flex-1 bg-transparent resize-none p-6 text-base outline-none font-mono"
          style={{ color: "#2C1D12", fontSize: "15px", lineHeight: "1.7" }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: "#D4D0CA" }}>
        <span className="text-sm" style={{ color: "#8A7E72" }}>
          Click any paragraph to add a comment
        </span>
        <button
          onClick={() => setEditMode(true)}
          className="text-sm font-medium px-3 py-1.5 border transition-colors"
          style={{
            borderColor: "#D4D0CA",
            color: "#5C4D3C",
            borderRadius: "2px",
            backgroundColor: "transparent",
          }}
        >
          Edit
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {paragraphs.map((para, idx) => {
          const isHighlighted = highlightedParagraphs.has(idx);
          const isHovered = hoveredParagraph === idx;
          const isSelected = selectedParagraph === idx;
          const paraComments = unresolvedOnParagraph(idx);
          const hasComments = paraComments.length > 0;

          return (
            <div key={idx} className="relative mb-4 group">
              <div
                ref={(el) => {
                  if (el) paragraphRefs.current.set(idx, el);
                }}
                onClick={() => handleParagraphClick(idx, para)}
                onMouseEnter={() => setHoveredParagraph(idx)}
                onMouseLeave={() => setHoveredParagraph(null)}
                className={`cursor-pointer transition-all duration-200 p-3 -mx-3 rounded ${
                  isHighlighted ? "highlight-flash" : ""
                }`}
                style={{
                  borderLeft: isSelected || isHovered || hasComments
                    ? "2px solid " + (isSelected ? "#D42B1E" : hasComments ? "#D42B1E" : "#D4D0CA")
                    : "2px solid transparent",
                  paddingLeft: "12px",
                  backgroundColor: isSelected ? "#E8E6E2" : isHovered ? "#F0EFEC88" : "transparent",
                }}
              >
                {/* Comment indicator */}
                {hasComments && (
                  <span
                    className="absolute -right-1 top-2 text-xs font-medium px-1.5 py-0.5"
                    style={{ backgroundColor: "#D42B1E", color: "#FAF9F6", borderRadius: "2px" }}
                  >
                    {paraComments.length}
                  </span>
                )}

                <div
                  className="prose prose-sm max-w-none"
                  style={{
                    color: "#2C1D12",
                    lineHeight: "1.7",
                    fontSize: "16px",
                    "--tw-prose-body": "#2C1D12",
                    "--tw-prose-headings": "#2C1D12",
                    "--tw-prose-bold": "#2C1D12",
                    "--tw-prose-links": "#D42B1E",
                    "--tw-prose-bullets": "#8A7E72",
                    "--tw-prose-code": "#D42B1E",
                    "--tw-prose-quotes": "#5C4D3C",
                    "--tw-prose-quote-borders": "#D4D0CA",
                  } as React.CSSProperties}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {para}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Comment input for selected paragraph */}
              {isSelected && (
                <div
                  className="mt-2 p-3 border animate-fade-in-up"
                  style={{ borderColor: "#D42B1E", borderRadius: "2px", backgroundColor: "#E8E6E2" }}
                >
                  <p className="text-xs mb-2" style={{ color: "#8A7E72" }}>
                    Comment on: <em style={{ color: "#5C4D3C" }}>"{para.slice(0, 60).replace(/[#*`]/g, "").trim()}..."</em>
                  </p>
                  <textarea
                    autoFocus
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add your comment or suggestion..."
                    rows={2}
                    className="w-full bg-transparent resize-none outline-none text-sm"
                    style={{ color: "#2C1D12", fontSize: "15px", lineHeight: "1.5" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        handleAddComment(idx, para);
                      }
                    }}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setSelectedParagraph(null)}
                      className="text-xs px-3 py-1.5"
                      style={{ color: "#8A7E72" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddComment(idx, para)}
                      disabled={!commentInput.trim()}
                      className="text-xs px-3 py-1.5 font-medium"
                      style={{
                        backgroundColor: commentInput.trim() ? "#D42B1E" : "#D4D0CA",
                        color: commentInput.trim() ? "#FAF9F6" : "#8A7E72",
                        borderRadius: "2px",
                      }}
                    >
                      Add comment
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
