import { createRoot } from "react-dom/client";

import App from "./app/App.tsx";
import "@/shared/lib/i18n/config";
import "@/shared/styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);
