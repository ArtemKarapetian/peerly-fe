import { useState, FormEvent } from 'react';
import { PublicLayout } from '@/app/components/PublicLayout';
import { Button } from '@/app/components/ui/button.tsx';
import { Input, PasswordInput } from '@/app/components/ui/input.tsx';
import { useAuth } from '@/app/contexts/AuthContext';
import { isFlagEnabled } from '@/app/utils/featureFlags';
import { authenticateUser } from '@/app/utils/userStorage';
import { AlertCircle } from 'lucide-react';

/**
 * LoginPage - Authentication screen
 * 
 * Features:
 * - Single identifier field (email OR username)
 * - Demo credentials support
 * - Realistic error states
 * - Feature-flagged password reset
 */

export default function LoginPage() {
  const { login: authLogin } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    identifier: false,
    password: false
  });

  const enablePasswordReset = isFlagEnabled('enablePasswordReset');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    setTouched({ identifier: true, password: true });

    // Validate inputs
    if (!identifier.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // Attempt authentication
    const user = authenticateUser(identifier, password);

    if (user) {
      // Success - login and navigate
      authLogin();
      window.location.hash = '/courses';
    } else {
      // Failed - show error
      setIsLoading(false);
      setError('Invalid credentials. Please check your username/email and password.');
    }
  };

  // Show field-level errors only when touched
  const getIdentifierError = () => {
    if (!touched.identifier) return '';
    if (!identifier.trim()) return 'Required field';
    return '';
  };

  const getPasswordError = () => {
    if (!touched.password) return '';
    if (!password.trim()) return 'Required field';
    return '';
  };

  return (
    <PublicLayout maxWidth="md" showLoginButton={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 tablet:py-12">
        <div className="w-full max-w-[440px]">
          {/* Card */}
          <div className="bg-card border-2 border-border rounded-xl p-6 tablet:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px]">
                Вход
              </h1>
              <p className="text-[15px] text-muted-foreground">
                Войдите в свой аккаунт для доступа к курсам
              </p>
            </div>

            {/* Demo credentials hint */}
            <div className="bg-accent/50 border border-border rounded-lg px-3.5 py-2.5">
              <p className="text-[13px] text-muted-foreground">
                <strong className="font-medium">Demo:</strong> demo / demo или ivan.petrov / password123
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="bg-destructive/10 border-2 border-destructive/50 rounded-lg px-4 py-3 flex items-start gap-3">
                <AlertCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier (username or email) */}
              <Input
                label="Email or username"
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError(''); // Clear error on change
                }}
                onBlur={() => setTouched({ ...touched, identifier: true })}
                placeholder="demo or demo@example.com"
                autoComplete="username"
                disabled={isLoading}
                error={getIdentifierError()}
              />

              {/* Password */}
              <PasswordInput
                label="Пароль"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(''); // Clear error on change
                }}
                onBlur={() => setTouched({ ...touched, password: true })}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                error={getPasswordError()}
              />

              {/* Submit button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={!identifier.trim() || !password.trim()}
                >
                  {isLoading ? 'Вход...' : 'Войти'}
                </Button>
              </div>
            </form>

            {/* Footer links */}
            <div className="space-y-3 pt-2">
              {/* Forgot password link (feature flag controlled) */}
              {enablePasswordReset && (
                <div className="text-center">
                  <a
                    href="#/reset-password"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Забыли пароль?
                  </a>
                </div>
              )}

              {/* Register link */}
              <div className="text-center border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Нет аккаунта?
                </p>
                <a
                  href="#/register"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Создать аккаунт
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}