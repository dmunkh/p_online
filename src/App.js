import React from "react";
import { BrowserRouter } from "react-router-dom";
import UserContext from "src/contexts/userContext";

import SSO from "src/pages/sso";
import Router from "src/router";

function App() {
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
}

export default App;
