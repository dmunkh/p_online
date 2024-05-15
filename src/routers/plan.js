import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import UsePlanContext from "src/contexts/planContext";
import PlanList from "src/pages/plan/index";
import PlanWorker from "src/pages/plan/workers";
import Store from "src/pages/delguur/index";
import Balance from "src/pages/balance/index";
import Order from "src/pages/order/index";
import Company from "src/pages/company/index";
import User from "src/pages/user/index";
import Login from "src/pages/login";

const Plan = () => {
  const data = [
    {
      path: "/login",
      component: (
        <UsePlanContext>
          <Login />
        </UsePlanContext>
      ),
    },
    {
      path: "/user",
      component: (
        <UsePlanContext>
          <User />
        </UsePlanContext>
      ),
    },
    {
      path: "/company",
      component: (
        <UsePlanContext>
          <Company />
        </UsePlanContext>
      ),
    },
    {
      path: "/order",
      component: (
        <UsePlanContext>
          <Order />
        </UsePlanContext>
      ),
    },
    {
      path: "/store",
      component: (
        <UsePlanContext>
          <Store />
        </UsePlanContext>
      ),
    },
    {
      path: "/balance",
      component: (
        <UsePlanContext>
          <Balance />
        </UsePlanContext>
      ),
    },
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
