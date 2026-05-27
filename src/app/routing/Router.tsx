import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import { NavigateRegistrar } from "@/app/routing/NavigateRegistrar";
import { renderRoutes } from "@/app/routing/renderRoutes";
import { routeRegistry } from "@/app/routing/routeRegistry";

const Error404Page = lazy(() => import("@/pages/errors/404/ui/Page"));

function PageFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <NavigateRegistrar />
      <Routes>
        {renderRoutes(routeRegistry)}
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </Suspense>
  );
}
