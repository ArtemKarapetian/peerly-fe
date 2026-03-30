import { createRoot } from "react-dom/client";

import { initSentry } from "@/shared/lib/sentry";

import App from "./app/App.tsx";
import "@/shared/lib/i18n/config";
import "@/shared/styles/index.css";

initSentry();

createRoot(document.getElementById("root")!).render(<App />);
