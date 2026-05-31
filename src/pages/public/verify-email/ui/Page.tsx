import { useVerifyEmail } from "../model/useVerifyEmail";

import { ConfirmingView } from "./ConfirmingView";
import { ErrorView } from "./ErrorView";
import { PendingView } from "./PendingView";
import { VerifiedView } from "./VerifiedView";

export default function VerifyEmailPage() {
  const { state, errorMsg, email, resendCooldown, resending, handleResend } = useVerifyEmail();

  if (state === "confirming") return <ConfirmingView />;
  if (state === "verified") return <VerifiedView />;
  if (state === "expired" || state === "error") {
    return (
      <ErrorView
        state={state}
        email={email}
        errorMsg={errorMsg}
        resending={resending}
        resendCooldown={resendCooldown}
        onResend={() => void handleResend()}
      />
    );
  }
  return <PendingView email={email} />;
}
