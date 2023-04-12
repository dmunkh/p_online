import React, { Suspense } from "react";

import { useUserContext } from "src/contexts/userContext";

import { ConfigProvider } from "antd";
import mnMN from "antd/lib/locale/mn_MN";
import "antd/dist/antd.min.css";
import "moment/locale/mn";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import Loader from "src/components/layout/loader";
import Layout from "src/components/layout/layout";

import MainRoute from "src/routers/main";
import ReferenceRoute from "src/routers/reference";
import ConfirmationRoute from "src/routers/confirmation";
import PlanRoute from "src/routers/plan";
import PlanXabRoute from "src/routers/planXab";
import RegisterEmplRoute from "src/routers/registerEmpl";
import TrainingRoute from "src/routers/training";

const Router = () => {
  const { user } = useUserContext();

  return (
    <>
      {user?.loggedIn && (
        <Suspense fallback={<Loader />}>
          <ConfigProvider locale={mnMN}>
            <Layout>
              <MainRoute />
              <ReferenceRoute />
              <ConfirmationRoute />
              <PlanRoute />
              <PlanXabRoute />
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
