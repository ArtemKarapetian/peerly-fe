import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function LayoutDebugger() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getBreakpoint = () => {
    if (windowWidth >= 1200) return "Desktop";
    if (windowWidth >= 800) return "Tablet";
    return "Mobile";
  };

  const getBreakpointRange = () => {
    if (windowWidth >= 1200) return "≥1200px";
    if (windowWidth >= 800) return "800-1199px";
    return "<800px";
  };

  const getSidebarState = () => {
    if (windowWidth >= 1200) return "Expanded (260px)";
    if (windowWidth >= 800) return "Collapsed (80px)";
    return "Drawer (скрыт)";
  };

  const getLayoutColumns = () => {
    if (windowWidth >= 1200) return "2 колонки";
    return "1 колонка";
  };

  const getColumnRatio = () => {
    if (windowWidth >= 1200) return "2fr + 1fr";
    return "N/A";
  };

  const getStickyStatus = () => {
    if (windowWidth >= 1200) return "Active";
    return "Disabled";
  };

  const getContentMaxWidth = () => {
    return "1200px"; // Unified max-width across all breakpoints
  };

  const getGutters = () => {
    if (windowWidth >= 1200) return "40px"; // Desktop
    if (windowWidth >= 800) return "24px"; // Tablet
    return "24px"; // Mobile
  };

  const getRightRailWidth = () => {
    if (windowWidth >= 1200) return "360-420px";
    return "N/A";
  };

  const getGridLayout = () => {
    if (windowWidth >= 1200) return "1fr + minmax(360px, 420px)";
    return "1fr (single column)";
  };

  const getCurrentRoute = () => {
    const hash = window.location.hash.slice(1);
    if (hash.startsWith("/task/")) {
      return `Task ${hash.replace("/task/", "")}`;
    } else if (hash.startsWith("/course/")) {
      return `Course ${hash.replace("/course/", "")}`;
    } else if (hash === "/dashboard") {
      return "Dashboard";
    } else if (hash === "/courses" || hash === "") {
      return "Courses List";
    }
    return "Unknown";
  };

  const getCoursesGridColumns = () => {
    if (windowWidth >= 1200) return "4 cols";
    if (windowWidth >= 800) return "2 cols";
    return "1 col";
  };

  return (
    <div className="fixed bottom-4 right-4 bg-[#21214f]/80 backdrop-blur-sm text-white rounded-[12px] shadow-lg text-sm font-mono z-50 max-w-[300px] transition-all duration-300">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors rounded-[12px]"
      >
        <div className="font-bold text-[#b0e9fb]">Layout Debug Info</div>
        {isCollapsed ? (
          <ChevronUp className="size-4 text-[#b0e9fb]" />
        ) : (
          <ChevronDown className="size-4 text-[#b0e9fb]" />
        )}
      </button>

      {/* Content - Collapsible */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="space-y-1">
            <div>
              <span className="text-[#d7d7d7]">Route:</span>{" "}
              <span className="text-[#f2b2d6]">{getCurrentRoute()}</span>
            </div>
            <div>
              <span className="text-[#d7d7d7]">Ширина:</span>{" "}
              <span className="text-[#9cf38d]">{windowWidth}px</span>
            </div>
            <div>
              <span className="text-[#d7d7d7]">Брейкпоинт:</span>{" "}
              <span className="text-[#b0e9fb] font-bold">{getBreakpoint()}</span>
            </div>
            <div>
              <span className="text-[#d7d7d7]">Range:</span>{" "}
              <span className="text-[#b0e9fb] font-bold">{getBreakpointRange()}</span>
            </div>
            <div>
              <span className="text-[#d7d7d7]">Sidebar:</span>{" "}
              <span className="text-[#b7bdff]">{getSidebarState()}</span>
            </div>
            <div>
              <span className="text-[#d7d7d7]">Layout:</span>{" "}
              <span className="text-[#ffb8b8]">{getLayoutColumns()}</span>
            </div>
            <div>
              <span className="text-[#d7d7d7]">Ratio:</span>{" "}
              <span className="text-[#ffb8b8]">{getColumnRatio()}</span>
            </div>
            <div>
              <span className="text-[#d7d7d7]">Sticky:</span>{" "}
              <span
                className={getStickyStatus() === "Active" ? "text-[#9cf38d]" : "text-[#767692]"}
              >
                {getStickyStatus()}
              </span>
            </div>
            <div>
              <span className="text-[#d7d7d7]">Max-width:</span>{" "}
              <span className="text-[#9cf38d]">{getContentMaxWidth()}</span>
            </div>
            <div>
              <span className="text-[#d7d7d7]">Gutters:</span>{" "}
              <span className="text-[#b0e9fb]">{getGutters()}</span>
            </div>
            <div>
              <span className="text-[#d7d7d7]">Right Rail Width:</span>{" "}
              <span className="text-[#b0e9fb]">{getRightRailWidth()}</span>
            </div>
            <div>
              <span className="text-[#d7d7d7]">Grid Layout:</span>{" "}
              <span className="text-[#b0e9fb]">{getGridLayout()}</span>
            </div>
            <div>
              <span className="text-[#d7d7d7]">Courses Grid:</span>{" "}
              <span className="text-[#b0e9fb]">{getCoursesGridColumns()}</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#4b4963] text-xs text-[#d7d7d7]">
            Resize окно для теста
          </div>
        </div>
      )}
    </div>
  );
}
