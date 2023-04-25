import React from "react";
import _ from "lodash";
import { Routes, Route } from "react-router-dom";

import UserRegisterEmplContext from "../contexts/registerEmplContext";

import Workers from "../pages/workers/index";
import WorkerRegister from "../pages/workers/register";
import WorkerList from "../pages/workers/register/index";

const RegisterEmpl = () => {
  const data = [
    {
      path: "/register",
      component: (
        <UserRegisterEmplContext>
          <Workers />
        </UserRegisterEmplContext>
      ),
    },
    {
      path: "/worker/register",
      component: (
        <UserRegisterEmplContext>
          <WorkerRegister />
        </UserRegisterEmplContext>
      ),
    },
    {
      path: "/worker/register/worker",
      component: (
        <UserRegisterEmplContext>
          <WorkerList />
        </UserRegisterEmplContext>
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
