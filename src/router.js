import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { useUserContext } from "src/contexts/userContext";
import FormContextProvider from "src/contexts/formContext";
import { ConfigProvider } from "antd";
import mnMN from "antd/lib/locale/mn_MN";
import "src/index.css";
import "antd/dist/antd.min.css";
import "moment/locale/mn";

import Loader from "src/components/layout/loader";
import Layout from "src/components/layout/layout";

const Dashboard = lazy(() => import("src/pages/dashboard"));
const LessonType = lazy(() => import("src/pages/reference/lessontype"));
const LessonTypeYear = lazy(()=>import("src/pages/reference/lessontypeyear"))
const Chamber =lazy(()=>import ("src/pages/reference/chamber"))
const Organization =lazy(()=> import("src/pages/reference/organization"))
const Employee =lazy(()=> import("src/pages/reference/employee"))
const Worker=lazy(()=> import ("src/pages/registration/worker"))
const Router = () => {
  const { user } = useUserContext();

  return (
    user?.loggedIn && (
      <ConfigProvider locale={mnMN}>
        <Suspense fallback={<Loader />}>
          <Layout>
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <FormContextProvider>
                    <Dashboard />
                  </FormContextProvider>
                }
              />
              <Route
                exact
                path="/reference/lesson"
                element={
                  <FormContextProvider>
                    <LessonType />
                  </FormContextProvider>
                }
              />
                <Route
                exact
                path="/reference/lessontype"
                element={
                  <FormContextProvider>
                    <LessonTypeYear />
                  </FormContextProvider>
                }
              />
              <Route
                exact
                path="/reference/chamber"
                element={
                  <FormContextProvider>
                    <Chamber />
                  </FormContextProvider>
                }
              />
               <Route
                exact
                path="/reference/organization"
                element={
                  <FormContextProvider>
                    <Organization />
                  </FormContextProvider>
                }
              />
                <Route
                exact
                path="/reference/employee"
                element={
                  <FormContextProvider>
                    <Employee />
                  </FormContextProvider>
                }
              />
              <Route
                exact
                path="/registration/worker"
                element={
                  <FormContextProvider>
                    <Worker />
                  </FormContextProvider>
                }
              />
            </Routes>
          </Layout>
        </Suspense>
      </ConfigProvider>
    )
  );
};

export default React.memo(Router);
