import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import UseReferenceContext from "src/contexts/referenceContext";

import LessonType from "src/pages/reference/type/lessonsType";

const RegisterEmpl = () => {
  const data = [
    {
      path: "/reference/lesson",
      component: (
        <UseReferenceContext>
          <LessonType />
        </UseReferenceContext>
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
export default React.memo(RegisterEmpl);
