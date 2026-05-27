import { RegisterForm } from "@/features/auth/register-form";

import { PublicLayout } from "@/widgets/public-layout";

export default function RegisterPage() {
  return (
    <PublicLayout maxWidth="md" showLoginButton={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 tablet:py-12">
        <RegisterForm />
      </div>
    </PublicLayout>
  );
}
