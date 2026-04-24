import { BrowserRouter } from "react-router-dom";

import { useDemoToolsHotkey } from "@/shared/lib/demo-tools";
import { ErrorBoundary } from "@/shared/ui/ErrorBoundary";
import { Toaster } from "@/shared/ui/sonner";

import { DevErrorPanel } from "@/widgets/dev-error-panel/DevErrorPanel.tsx";

import { AppProviders } from "@/app/providers/index.tsx";
import { Router } from "@/app/routing/Router.tsx";

function DemoToolsHotkeyMount() {
  useDemoToolsHotkey();
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppProviders>
          <DemoToolsHotkeyMount />
          <Router />
          <Toaster />
          <DevErrorPanel />
        </AppProviders>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
