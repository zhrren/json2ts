import { DefaultPage } from "@pages/default/DefaultPage";
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

const renderRoutes = function (routes: any) {
  return routes.map((route: any, index: any) => {
    const { path, element, children } = route;

    if (children) {
      return (
        <Route key={index} path={path} element={element}>
          {renderRoutes(children)}
        </Route>
      );
    }
    return <Route key={index} path={path} element={element} />;
  });
};

export function Router() {
  return (
    <HashRouter>
      <Routes>{renderRoutes(routes)}</Routes>
    </HashRouter>
  );
}

export const routes = [
  {
    path: "/",
    element: <DefaultPage />,
  },
];
