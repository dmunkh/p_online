import React, { useState } from "react";
import Header from "./Header";

import RightBar from "./RightBar";
import NavBar from "./Navbar";

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [rightbar, setRightbar] = useState(false);
  const rightbarToggle = () => {
    setRightbar(!rightbar);
  };

  const [search, setSearch] = useState(false);
  const searchToggle = () => {
    setSearch(!search);
  };
  // const [menu, setMenu] = useState([]);
  const [mode, setMode] = useState(
    localStorage.getItem("srs-theme") === "dark" ? true : false
  );

  return (
    <div
      className={`horizontal-layout horizontal-menu horizontal-menu-padding 2-columns navbar-sticky ${
        isCollapsed
          ? "vertical-layout vertical-overlay-menu fixed-navbar pace-done menu-hide text-sm "
          : "vertical-layout vertical-overlay-menu fixed-navbar pace-done menu-open text-sm"
      }`}
      data-open="hover"
      data-menu="horizontal-menu"
      data-col="2-columns"
      style={isCollapsed ? { overflow: "hidden" } : { overflow: "hidden" }}
    >
      <Header
        rightbarToggle={rightbarToggle}
        searchToggle={searchToggle}
        search={search}
        setMode={setMode}
        mode={mode}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className="wrapper">
        <NavBar />

        <div className="main-panel">
          <div className="main-content">
            <div className="content-wrapper"><div className="card h-[window.innerHeight - 400">{children}</div></div>
          </div>

          <button className="btn btn-primary scroll-top" type="button">
            <i className="ft-arrow-up"></i>
          </button>
        </div>
      </div>

      {/* <div
        className={`sidenav-overlay ${isCollapsed ? "d-none" : "d-block"}`}
      ></div> */}

      <RightBar />
    </div>
  );
};

export default React.memo(Layout);
