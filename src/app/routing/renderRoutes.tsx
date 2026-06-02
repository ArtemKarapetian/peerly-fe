import { ComponentType, ReactElement, createElement } from "react";
import { Route } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { RoleRoute } from "./RoleRoute";
import type { Access, RouteConfig } from "./routeRegistry";

function leafElement(config: RouteConfig): ReactElement {
  if (!config.component) {
    throw new Error(`Route ${config.path} has no component`);
  }
  return createElement(config.component as ComponentType);
}

function renderLeaf(config: RouteConfig): ReactElement {
  return <Route key={config.path} path={config.path} element={leafElement(config)} />;
}

function routesWithAccess(configs: RouteConfig[], access: Access): RouteConfig[] {
  return configs.filter((c) => c.access === access);
}

export function renderRoutes(registry: RouteConfig[]): ReactElement {
  const publics = routesWithAccess(registry, "public");
  const publicOnly = routesWithAccess(registry, "publicOnly");
  const auth = routesWithAccess(registry, "auth");
  const students = routesWithAccess(registry, "student");
  const teachers = routesWithAccess(registry, "teacher");
  const admins = routesWithAccess(registry, "admin");

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
