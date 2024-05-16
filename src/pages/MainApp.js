import React, { useEffect } from "react";
import { BrowserRouter, Navigate } from "react-router-dom";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "antd/dist/antd.min.css";
import "moment/locale/mn";
import useBearStore from "src/state/state";

import { useUserContext } from "src/contexts/userContext";
// import { ConfigProvider } from "antd";
// import mnMN from "antd/lib/locale/mn_MN";

import UserContext from "../contexts/userContext";

import Router from "../Router";
import Login from "src/pages/login";
import SSO from "../pages/Callback";

const MainApp = () => {
  const isUserValid = useBearStore((state) => state.isUserValid);
  const user_id = useBearStore((state) => state.user_id);
  const main_company_id = useBearStore((state) => state.main_company_id);

  console.log(
    "MainAPp",
    isUserValid,
    user_id,
    main_company_id,
    window.location.pathname
  );

  return (
    <BrowserRouter>
      {/* {window.location.pathname === "/callback" ? (
        <SSO />
      ) : (
        <UserContext>
          <Router />
        </UserContext>
      )} */}
      {isUserValid ? (
        <UserContext>
          <Router />
        </UserContext>
      ) : (
        <Login />
      )}
    </BrowserRouter>
  );
};

export default React.memo(MainApp);
