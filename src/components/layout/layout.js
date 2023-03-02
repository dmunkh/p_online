import React from "react";
import { useUserContext } from "src/contexts/userContext";

import Sidebar from "src/components/layout/sidebar";
import Header from "src/components/layout/header";
import Breadcrumb from "src/components/layout/breadcrumb";

const Layout = ({ children }) => {
  const { user, userDispatch, userAction } = useUserContext();

  return (
    <div className="page fadeIn animated">
      {user.template.showSidebar && (
        <div
          className="md:hidden absolute w-full min-h-screen bg-gray-700 opacity-50 z-10"
          onClick={() => {
            userDispatch({
              type: userAction.CHANGE_SHOW_SIDEBAR,
              data: !user.template.showSidebar,
            });
          }}
        ></div>
      )}

      <Sidebar />
      <div className="main-content h-100">
        <Header />
        <div className="container-fluid">
          <Breadcrumb />
          {children}
         
        </div>
      </div>
    </div>
  );
};

export default React.memo(Layout);
