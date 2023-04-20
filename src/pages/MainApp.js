import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "antd/dist/antd.min.css";
import "moment/locale/mn";
// import { ConfigProvider } from "antd";
// import mnMN from "antd/lib/locale/mn_MN";

import UserContext from "../contexts/userContext";
import Router from "../Router";
import SSO from "../pages/Callback";

const MainApp = () => {
  
  return (
    <BrowserRouter>
      {window.location.pathname === "/callback" ? (
        <SSO />
      ) : (
        <UserContext>
          <Router />
        </UserContext>
      )}
    </BrowserRouter>
  );
};

export default React.memo(MainApp);
