import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import UsePlanHabContext from "src/contexts/planhabContext";

import Planhab from "src/pages/planhab/index";

const PlanXab = () => {
  const data = [
    {
      path: "/planhab",
      component: (
        <UsePlanHabContext>
          <Planhab />
        </UsePlanHabContext>
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
