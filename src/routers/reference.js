import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import UseReferenceContext from "src/contexts/referenceContext";
import FormContextProvider from "src/contexts/formContext";

import LessonType from "src/pages/reference/lessonsType";
import LessonRegister from "src/pages/reference/lessonsRegister";
import Chamber from "src/pages/reference/chamber";
import Organization from "src/pages/reference/organizations";
import Employee from "src/pages/reference/worker/employee";
import Frequency from "src/pages/reference/frequency";
import Worker from "src/pages/registration/worker2";

const Reference = () => {
  const data = [
    {
      path: "/reference/lesson",
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
