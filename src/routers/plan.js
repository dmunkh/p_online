import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import UsePlanContext from "src/contexts/planContext";
import PlanList from "src/pages/plan/index";
import PlanWorker from "src/pages/plan/workers";

const Plan = () => {
  const data = [
    {
      path: "/plan",
      component: (
        <UsePlanContext>
          <PlanList />
        </UsePlanContext>
      ),
    },
    {
      path: "/plan/:id",
      component: (
        <UsePlanContext>
          <PlanWorker />
        </UsePlanContext>
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
export default React.memo(Plan);
