import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import UseTrainingContext from "src/contexts/trainingContext";

import TrainingList from "src/pages/registration/training/index";

const Training = () => {
  const data = [
    {
      path: "/training",
      component: (
        <UseTrainingContext>
          <TrainingList />
        </UseTrainingContext>
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
export default React.memo(Training);