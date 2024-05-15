import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import Store from "src/pages/delguur/index";

const Confirmation = () => {
  const data = [
    {
      path: "/store....",
      component: <Store />,
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
