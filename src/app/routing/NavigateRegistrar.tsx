import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { registerNavigate } from "@/shared/lib/navigate";

/** Registers react-router's navigate function for use outside React tree. */
export function NavigateRegistrar() {
  const navigate = useNavigate();

  useEffect(() => {
    registerNavigate(navigate);
  }, [navigate]);

  return null;
}
