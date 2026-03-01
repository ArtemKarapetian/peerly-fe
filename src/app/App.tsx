import { Toaster } from "@/shared/ui/sonner";

import { DevErrorPanel } from "@/widgets/dev-error-panel/DevErrorPanel.tsx";

import { AppProviders } from "@/app/providers/index.tsx";
import { Router } from "@/app/routing/Router.tsx";

export default function App() {
  return (
    <AppProviders>
      <Router />
      <Toaster />
      <DevErrorPanel />
    </AppProviders>
  );
}
