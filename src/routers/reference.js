import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import UseReferenceContext from "../contexts/referenceContext";
import FormContextProvider from "../contexts/formContext";

import LessonType from "../pages/reference/type/lessonsType";
import LessonRegister from "../pages/reference/lessonsRegister";
import Chamber from "../pages/reference/place";
import Organization from "../pages/reference/organizations";
import Employee from "../pages/reference/worker/employee";
import Frequency from "../pages/reference/frequency";
import Worker from "../pages/registration/worker2";
import Place from "../pages/reference/place";
import Module from "../pages/reference/module";

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
      path: "/reference/organization",
      component: (
        <UseReferenceContext>
          <Organization />
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
      path: "/reference/frequency",
      component: (
        <UseReferenceContext>
          <Frequency />
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
