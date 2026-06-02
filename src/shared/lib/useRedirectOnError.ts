import { useEffect } from "react";

import { redirectForStatus } from "@/shared/api/errorRedirect";
import { ApiError } from "@/shared/api/httpClient";

export function useRedirectOnError(error: unknown): void {
  useEffect(() => {
    if (error instanceof ApiError) {
      redirectForStatus(error.status);
    }
  }, [error]);
}
