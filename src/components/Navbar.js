import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";
import _ from "lodash";

const Navbar = () => {
  const { user } = useUserContext();

  const [menu, setMenu] = useState([]);
  const [dropdown, setDropDown] = useState(null);

  useEffect(() => {
    if (user.tn !== 0) {
      var allMenu = user.usermenu;
      var menu1 = _.sortBy(
        user.usermenu.filter((a) => a.parent_id === 0),
        ["ordern"]
      );
      _.map(menu1, (item) => {
        var menu2 = _.orderBy(
          allMenu.filter((a) => a.parent_id === item.id),
          ["ordern"],
          ["asc"]
        );
        item.children = menu2;
      });
      setMenu(menu1);
    }
    console.log(menu)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.tn]);

  return (
    <>
      <div
        className="main-menu menu-light menu-fixed menu-shadow app-sidebar menu-native-scroll "
        role="navigation"
        data-menu="menu-wrapper"
        data-background-color="man-of-steel"
        style={{
          touchAction: "none",
          userSelect: "none",
          WebkitUserDrag: "none",
          WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
        }}
      >
        <div
          className="navbar-container main-menu-content center-layout sidebar-content"
          data-menu="menu-container"
        >
          <ul
            className="navigation navigation-main"
            id="main-menu-navigation"
            data-menu="menu-navigation"
          >
            {menu.map((item, index) => {
              return item.children.length === 0 ? (
                <li className="nav-item" data-menu="dropdown" key={item.id}>
                  <Link to={"/" + item.menu_link}>
                    <i className={
                      "side-menu__icon" +
                      (item.description === null ? "" : " " + item.description)
                    }
></i>
                    {item.caption}
                  </Link>
                </li>
              ) : (
                <li
                  className={`nav-item  has-sub ${
                    dropdown === index ? "hover open" : ""
                  }`}
                  data-menu="dropdown"
                  key={item.id}
                >
                  <Link
                    to={"/" + item.menu_link}
                    onClick={(e) => {
                      e.preventDefault();
                      setDropDown(index === dropdown ? null : index);
                      console.log(index);
                    }}
                  >
                    <i className={
                      "side-menu__icon" +
                      (item.description === null ? "" : " " + item.description)
                    }
></i>
                    {item.caption}
                  </Link>
                  <ul
                    className=""
                    style={
                      dropdown === index
                        ? { overflow: "block" }
                        : { overflow: "hidden" }
                    }
                  >
                    {item.children.map((child) => {
                      return (
                        <li data-menu="" key={child.id}>
                          <a href={`/${child.menu_link}`}>
                            <i className="ft-arrow-right submenu-icon"></i>
                            {child.caption}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div
        className="flex justify-center header-navbar navbar-expand-sm navbar navbar-horizontal navbar-fixed navbar-light navbar-shadow menu-border navbar-brand-center bg-white"
        role="navigation"
        data-menu="menu-wrapper"
      >
        <div
          className="navbar-container main-menu-content center-layout"
          data-menu="menu-container"
        >
          <ul
            className="navigation-main nav navbar-nav "
            id="main-menu-navigation"
            data-menu="menu-navigation"
          >
            {menu.map((item) => {
              return item.children.length === 0 ? (
                <li
                  className="dropdown nav-item uppercase"
                  data-menu="dropdown"
                  key={item.id}
                >
                  <Link
                    to={"/" + item.menu_link}
                    className="dropdown-toggle nav-link d-flex align-items-center"
                    data-toggle="dropdown"
                  >
                    <i className={
                      "side-menu__icon" +
                      (item.description === null ? "" : " " + item.description)
                    }
></i>
                    <span data-i18n="Dashboard">{item.caption}</span>
                  </Link>
                </li>
              ) : (
                <li
                  className="dropdown nav-item "
                  data-menu="dropdown"
                  key={item.id}
                >
                  <a
                    href={"/"}
                    className="dropdown-toggle nav-link d-flex align-items-center"
                    data-toggle="dropdown"
                  >
                    <i className={
                      "side-menu__icon" +
                      (item.description === null ? "" : " " + item.description)
                    }
></i>
                    <span data-i18n="Apps" className="uppercase">
                      {item.caption}
                    </span>
                  </a>

                  <ul className="dropdown-menu">
                    {item.children.map((child) => {
                      return (
                        <li data-menu="" key={child.id}>
                          <Link
                            to={`/${child.menu_link} `}
                            className="dropdown-item d-flex align-items-center"
                            data-toggle="dropdown"
                          >
                            <i className="ft-arrow-right submenu-icon"></i>
                            <span data-i18n="Email">{child.caption}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default React.memo(Navbar);
