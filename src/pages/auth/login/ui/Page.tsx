import { LoginForm } from "@/features/auth/login-form";

import { PublicLayout } from "@/widgets/public-layout";

export default function LoginPage() {
  return (
    <PublicLayout maxWidth="md" showLoginButton={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 tablet:py-12">
        <div className="w-full max-w-[440px]">
          <LoginForm />
        </div>
      </div>
    </PublicLayout>
  );
}
