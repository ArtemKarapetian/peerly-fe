import { Router } from "@/app/RouterExtended";
import { AppProviders } from "@/app/providers/index.tsx";
import { Toaster } from "@/shared/ui/sonner";
import { DevErrorPanel } from "@/app/components/DevErrorPanel";

export default function App() {
  return (
    <AppProviders>
      <Router />
      <Toaster />
      <DevErrorPanel />
    </AppProviders>
  );
}
