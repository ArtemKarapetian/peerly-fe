import { Router } from '@/app/RouterExtended';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { RoleProvider } from '@/app/contexts/RoleContext';
import { FeatureFlagsProvider } from '@/app/contexts/FeatureFlagsContext';
import { Toaster } from '@/app/components/ui/sonner';
import { DevErrorPanel } from '@/app/components/DevErrorPanel';

export default function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <FeatureFlagsProvider>
          <Router />
          <Toaster />
          <DevErrorPanel />
        </FeatureFlagsProvider>
      </RoleProvider>
    </AuthProvider>
  );
}