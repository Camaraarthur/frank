"use client";

interface Comment {
  id: string;
  anchor: string;
  text: string;
  paragraphIndex: number;
  resolved: boolean;
}

interface CommentsPanelProps {
  comments: Comment[];
  onResolve: (id: string) => void;
  onProcessComments: () => void;
  isProcessing: boolean;
}

export function CommentsPanel({ comments, onResolve, onProcessComments, isProcessing }: CommentsPanelProps) {
  const unresolved = comments.filter((c) => !c.resolved);
  const resolved = comments.filter((c) => c.resolved);

  return (
    <div className="flex flex-col h-full border-l" style={{ borderColor: "#D4D0CA" }}>
      <div className="px-4 py-4 border-b" style={{ borderColor: "#D4D0CA" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm" style={{ color: "#2C1D12" }}>
            Comments
          </h3>
          {unresolved.length > 0 && (
            <span
              className="text-xs font-medium px-2 py-0.5"
              style={{ backgroundColor: "#D42B1E22", color: "#D42B1E", borderRadius: "2px" }}
            >
              {unresolved.length} pending
            </span>
          )}
        </div>

        <button
          onClick={onProcessComments}
          disabled={unresolved.length === 0 || isProcessing}
          className="w-full py-3 font-medium text-sm transition-all"
          style={{
            backgroundColor:
              unresolved.length === 0 || isProcessing ? "#D4D0CA" : "#D42B1E",
            color: unresolved.length === 0 || isProcessing ? "#8A7E72" : "#FAF9F6",
            borderRadius: "2px",
            cursor: unresolved.length === 0 || isProcessing ? "not-allowed" : "pointer",
            border: "none",
            minHeight: "48px",
          }}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-flex gap-1">
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-slate-500" />
              </span>
              Rewriting document...
            </span>
          ) : (
            `Process comments${unresolved.length > 0 ? ` (${unresolved.length})` : ""}`
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {unresolved.length === 0 && resolved.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm" style={{ color: "#8A7E72" }}>
              No comments yet.
            </p>
            <p className="text-xs mt-1" style={{ color: "#8A7E72" }}>
              Click any paragraph in the document to add one.
            </p>
          </div>
        )}

        {unresolved.length > 0 && (
          <div className="py-3">
            {unresolved.map((comment) => (
              <div
                key={comment.id}
                className="mx-3 mb-2 p-3 border-l-2"
                style={{
                  borderLeftColor: "#D42B1E",
                  backgroundColor: "#E8E6E2",
                  borderRadius: "0 2px 2px 0",
                }}
              >
                <p className="text-xs mb-1.5 line-clamp-1" style={{ color: "#8A7E72" }}>
                  On: "{comment.anchor.replace(/[#*`]/g, "").trim().slice(0, 50)}..."
                </p>
                <p className="text-sm mb-2" style={{ color: "#2C1D12" }}>
                  {comment.text}
                </p>
                <button
                  onClick={() => onResolve(comment.id)}
                  className="text-xs px-2 py-1 border transition-colors"
                  style={{
                    borderColor: "#D4D0CA",
                    color: "#8A7E72",
                    borderRadius: "2px",
                    backgroundColor: "transparent",
                  }}
                >
                  Resolve
                </button>
              </div>
            ))}
          </div>
        )}

        {resolved.length > 0 && (
          <div className="py-3 border-t" style={{ borderColor: "#D4D0CA" }}>
            <p className="px-4 text-xs mb-2" style={{ color: "#8A7E72" }}>
              RESOLVED ({resolved.length})
            </p>
            {resolved.map((comment) => (
              <div
                key={comment.id}
                className="mx-3 mb-2 p-3 opacity-40"
                style={{
                  borderLeft: "2px solid #8A7E72",
                  borderRadius: "0 2px 2px 0",
                }}
              >
                <p className="text-sm line-through" style={{ color: "#8A7E72" }}>
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
