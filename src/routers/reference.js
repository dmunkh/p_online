import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import UseReferenceContext from "src/contexts/referenceContext";
import FormContextProvider from "src/contexts/formContext";

import LessonType from "src/pages/reference/type/lessonsType";
import LessonRegister from "src/pages/reference/lessonsRegister";
import Chamber from "src/pages/reference/place";
import Employee from "src/pages/reference/worker/organization/list";
import Interval from "src/pages/reference/interval";
import Worker from "src/pages/registration/worker2";
import Place from "src/pages/reference/place";
import Module from "src/pages/reference/module";
import LessonTypeYear from "src/pages/reference/typeYear/list";

const Reference = () => {
  const data = [
    {
      path: "/reference/type",
      component: (
        <UseReferenceContext>
          <LessonType />
        </UseReferenceContext>
      ),
    },
    {
      path: "/reference/typeyear",
      component: (
        <UseReferenceContext>
          <LessonTypeYear />
        </UseReferenceContext>
      ),
    },
    {
      path: "/reference/register",
      component: (
        <UseReferenceContext>
          <LessonRegister />
        </UseReferenceContext>
      ),
    },
    {
      path: "/reference/chamber",
      component: (
        <UseReferenceContext>
          <Chamber />
        </UseReferenceContext>
      ),
    },
    {
      path: "/reference/employee",
      component: (
        <UseReferenceContext>
          <Employee />
        </UseReferenceContext>
      ),
    },
    {
      path: "/reference/interval",
      component: (
        <UseReferenceContext>
          <Interval />
        </UseReferenceContext>
      ),
    },
    {
      path: "/reference/place",
      component: (
        <UseReferenceContext>
          <Place />
        </UseReferenceContext>
      ),
    },
    {
      path: "/reference/module",
      component: (
        <UseReferenceContext>
          <Module />
        </UseReferenceContext>
      ),
    },
    {
      path: "/registration/worker",
      component: (
        <FormContextProvider>
          <Worker />
        </FormContextProvider>
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
export default React.memo(Reference);
