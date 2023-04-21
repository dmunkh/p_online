import React, { Suspense, lazy, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "./contexts/userContext";

import { ConfigProvider } from "antd";
import mnMN from "antd/lib/locale/mn_MN";

import Loading from "./components/Loading";
import Layout from "./components/Layout";
import MainRoute from "./routers/main";
import ReferenceRoute from "./routers/reference";
import ConfirmationRoute from "./routers/confirmation";
import PlanRoute from "./routers/plan";
import NormRoute from "./routers/norm";
import PlanHabRoute from "src/routers/planhab";
import RegisterEmplRoute from "./routers/registerEmpl";
import TrainingRoute from "./routers/training";

// const Layout = lazy(() => import("./components/Layout"));

const Router = () => {
  const { user } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {user?.loggedIn && (
        <Suspense fallback={<Loading />}>
          <ConfigProvider locale={mnMN}>
            <Layout>
              <MainRoute />
              <ReferenceRoute />
              <ConfirmationRoute />
              <PlanRoute />
              <PlanHabRoute />
              <NormRoute />
              <RegisterEmplRoute />
              <TrainingRoute />
            </Layout>
          </ConfigProvider>
        </Suspense>
      )}
    </>
  );
};

export default React.memo(Router);
