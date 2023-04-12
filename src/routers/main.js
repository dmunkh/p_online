import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";
import Dashboard from "src/pages/dashboard";

import Me from "src/pages/me/index";

const Main = () => {
  const data = [
    { path: "/me", component: <Me /> },
    { path: "/dashboard", component: <Dashboard /> },
  ];
  return (
    <Routes>
      {_.map(data, (el) => {
        return (
          <Route key={el.path} exact path={el.path} element={el.component} />
        );
      })}
    </Routes>
  );
};

export default React.memo(Main);
