import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import Approve from "src/pages/approve/list";

const Confirmation = () => {
  const data = [
    {
      path: "/approve",
      component: <Approve />,
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
export default React.memo(Confirmation);
