import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import UseReferenceContext from "../contexts/referenceContext";
import FormContextProvider from "../contexts/formContext";

import LessonType from "../pages/reference/type/lessonsType";
import LessonRegister from "../pages/reference/lessonsRegister";
import Chamber from "../pages/reference/place";
import Employee from "../pages/reference/worker/organization/list";
import Interval from "../pages/reference/interval";
import Worker from "../pages/registration/worker2";
import Place from "../pages/reference/place";
import Module from "../pages/reference/module";
import LessonTypeYear from "../pages/reference/typeYear/list";

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
