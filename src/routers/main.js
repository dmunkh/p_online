import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import Me from "../pages/Index";


const Main = () => {
  const data = [
    { path: "/hello/ddd", component: <Me /> },
    // { path: "/dashboard", component: <Dashboard /> },
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
