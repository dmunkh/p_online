import React, { useState } from "react";
import { useUserContext } from "src/contexts/userContext";
import Setting from "src/components/layout/setting";

const Header = () => {
  const { user, userDispatch, userAction } = useUserContext();
  const [setting, setSetting] = useState(false);

  return (
    <div className="main-header side-header">
      <div className="container-fluid">
        <div className="main-header-left ">
          <div
            className="app-sidebar__toggle mobile-toggle"
            data-toggle="sidebar"
          >
            <a
              className="text-xl text-white"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                userDispatch({
                  type: userAction.CHANGE_SHOW_SIDEBAR,
                  data: !user.template.showSidebar,
                });
              }}
            >
              <i
                className={
                  "side-menu__icon fe fe-" +
                  (user.template.showSidebar ? "x" : "menu")
                }
              ></i>
            </a>
          </div>
        </div>
        <div className="main-header-right">
          <div className="nav nav-item  navbar-nav-right ml-auto">
            <div
              className={
                "dropdown nav-item main-header-message" +
                (setting ? " show" : "")
              }
            >
              <a
                className="new nav-link"
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setSetting(!setting);
                }}
              >
                <i className="fe fe-settings" />
              </a>
              <div className="dropdown-menu">
                <Setting />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
