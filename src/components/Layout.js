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

  // useEffect(() => {
  //   if (user.tn !== 0) {
  //     var allMenu = user.usermenu;
  //     var menu1 = _.sortBy(
  //       user.usermenu.filter((a) => a.parent_id === 0),
  //       ["ordern"]
  //     );
  //     _.map(menu1, (item) => {
  //       var menu2 = _.orderBy(
  //         allMenu.filter((a) => a.parent_id === item.id),
  //         ["ordern"],
  //         ["asc"]
  //       );
  //       item.children = menu2;
  //     });
  //     setMenu(menu1);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user.tn]);

  return (
    <div
      className={`horizontal-layout horizontal-menu horizontal-menu-padding 2-columns navbar-sticky ${
        isCollapsed
          ? "vertical-layout vertical-overlay-menu fixed-navbar pace-done menu-hide text-sm"
          : "vertical-layout vertical-overlay-menu fixed-navbar pace-done menu-open text-sm"
      }`}
      data-open="hover"
      data-menu="horizontal-menu"
      data-col="2-columns"
      style={isCollapsed ? { overflow: "auto" } : { overflow: "hidden" }}
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
            <div className="content-wrapper">{children}</div>
          </div>

          <button className="btn btn-primary scroll-top" type="button">
            <i className="ft-arrow-up"></i>
          </button>
        </div>
      </div>

      <div
        className={`sidenav-overlay ${isCollapsed ? "d-none" : "d-block"}`}
      ></div>
      <button
        className="btn btn-primary scroll-top"
        type="button"
        style={{ display: "inline-block" }}
      >
        <i className="ft-arrow-up"></i>
      </button>
      <RightBar />
    </div>
  );
};

export default React.memo(Layout);
