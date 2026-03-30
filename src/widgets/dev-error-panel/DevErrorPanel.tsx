import { Bug, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Dev-only panel for testing error pages
 * Only visible in development mode
 */
export function DevErrorPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  const errorLinks = [
    { code: "401", path: "/401", label: "Unauthorized" },
    { code: "403", path: "/403", label: "Forbidden" },
    { code: "404", path: "/404", label: "Not Found" },
    { code: "500", path: "/500", label: "Server Error" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden w-64">
          {/* Header */}
          <div className="bg-muted px-4 py-2 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Error Pages</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-accent rounded transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Error links */}
          <div className="p-2 space-y-1">
            {errorLinks.map((error) => (
              <button
                key={error.code}
                onClick={() => void navigate(error.path)}
                className="w-full px-3 py-2 text-left rounded hover:bg-accent transition-colors flex items-center justify-between group"
              >
                <span className="text-sm">{error.label}</span>
                <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground">
                  {error.code}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-card border border-border rounded-lg shadow-lg px-3 py-2 flex items-center gap-2 hover:bg-accent transition-colors"
        >
          <Bug className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Test Errors</span>
          <ChevronUp className="w-3 h-3 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
