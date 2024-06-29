import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import UseTrainingContext from "src/contexts/trainingContext";

import TrainingList from "src/pages/registration/training/index";
import PlanReport from "src/pages/reports/index";
import PlanDepReport from "src/pages/reports/planDep";
import ReportRegister from "src/pages/reports/register";
import Login from "src/pages/login";

const Training = () => {
  const data = [
    {
      path: "/login",
      component: (
        <UseTrainingContext>
          <Login />
        </UseTrainingContext>
      ),
    },
    {
      path: "/planreport",
      component: (
        <UseTrainingContext>
          <PlanReport />
        </UseTrainingContext>
      ),
    },
    {
      path: "/plandep",
      component: (
        <UseTrainingContext>
          <PlanDepReport />
        </UseTrainingContext>
      ),
    },
    // {
    //   path: "/report",
    //   component: (
    //     <UseTrainingContext>
    //       <ReportRegister />
    //     </UseTrainingContext>
    //   ),
    // },
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
export default React.memo(Training);
