import React, { Suspense, lazy, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "src/contexts/userContext";

import { ConfigProvider } from "antd";
import mnMN from "antd/lib/locale/mn_MN";

import Loading from "src/components/Loading";
import Layout from "src/components/Layout";
import MainRoute from "src/routers/main";
import ReferenceRoute from "src/routers/reference";
import ConfirmationRoute from "src/routers/confirmation";
import PlanRoute from "src/routers/plan";
import NormRoute from "src/routers/norm";
import PlanHabRoute from "src/routers/planhab";
import RegisterEmplRoute from "src/routers/registerEmpl";
import TrainingRoute from "src/routers/training";

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
