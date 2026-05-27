import { ComponentType, ReactElement, createElement } from "react";
import { Navigate, Route } from "react-router-dom";

import { DemoFlagRoute } from "./DemoFlagRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { RoleRoute } from "./RoleRoute";
import type { Access, RouteConfig } from "./routeRegistry";

function leafElement(config: RouteConfig): ReactElement {
  if (config.access === "redirect") {
    return <Navigate to={config.redirectTo ?? "/"} replace />;
  }
  if (!config.component) {
    throw new Error(`Route ${config.path} has no component and is not a redirect`);
  }
  return createElement(config.component as ComponentType);
}

function renderLeaf(config: RouteConfig): ReactElement {
  if (config.demoFlag && config.access !== "redirect") {
    return (
      <Route
        key={`${config.path}::flag`}
        element={<DemoFlagRoute flag={config.demoFlag} redirectTo={config.redirectTo} />}
      >
        <Route path={config.path} element={leafElement(config)} />
      </Route>
    );
  }
  return <Route key={config.path} path={config.path} element={leafElement(config)} />;
}

function groupBy(configs: RouteConfig[], access: Access): RouteConfig[] {
  return configs.filter((c) => c.access === access);
}

export function renderRoutes(registry: RouteConfig[]): ReactElement {
  const publics = groupBy(registry, "public");
  const publicOnly = groupBy(registry, "publicOnly");
  const auth = groupBy(registry, "auth");
  const students = groupBy(registry, "student");
  const teachers = groupBy(registry, "teacher");
  const admins = groupBy(registry, "admin");

  return (
    <>
      {publics.map(renderLeaf)}

      <Route element={<PublicOnlyRoute />}>{publicOnly.map(renderLeaf)}</Route>

      <Route element={<ProtectedRoute />}>
        {auth.map(renderLeaf)}

        <Route element={<RoleRoute allow={["Student"]} />}>{students.map(renderLeaf)}</Route>
        <Route element={<RoleRoute allow={["Teacher"]} />}>{teachers.map(renderLeaf)}</Route>
        <Route element={<RoleRoute allow={["Admin"]} />}>{admins.map(renderLeaf)}</Route>
      </Route>
    </>
  );
}
