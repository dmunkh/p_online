import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import UseNormContext from "../contexts/normContext";

import List from "../pages/registration/norm/list";

const PlanXab = () => {
  const data = [
    {
      path: "/planhab",
      component: (
        <UseNormContext>
          <List />
        </UseNormContext>
      ),
    },
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
export default React.memo(PlanXab);
