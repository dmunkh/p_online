import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { useUserContext } from "../contexts/userContext";

import _ from "lodash";

const data = [
  {
    caption: "Компани",
    description: "ft-calendar",
    id: 2178,
    isaction: false,
    isactive: true,
    isconst: false,
    isdelete: 1,
    isinsert: 1,
    isupdate: 1,
    menu_iconp: null,
    menu_keys: null,
    menu_link: "company",
    ordern: 1,
    parent_id: 0,
    software_id: 154,
  },
  {
    caption: "Бараа",
    description: "ft-calendar",
    id: 2179,
    isaction: false,
    isactive: true,
    isconst: false,
    isdelete: 1,
    isinsert: 1,
    isupdate: 1,
    menu_iconp: null,
    menu_keys: null,
    menu_link: "plan",
    ordern: 2,
    parent_id: 0,
    software_id: 154,
  },
  {
    caption: "Дэлгүүр",
    description: "ft-airplay",
    id: 2180,
    isaction: false,
    isactive: true,
    isconst: false,
    isdelete: 1,
    isinsert: 1,
    isupdate: 1,
    menu_iconp: null,
    menu_keys: null,
    menu_link: "store",
    ordern: 5,
    parent_id: 0,
    software_id: 154,
  },
  {
    caption: "Бүртгэл",
    description: "ft-user-plus",
    id: 2181,
    isaction: false,
    isactive: true,
    isconst: false,
    isdelete: 1,
    isinsert: 1,
    isupdate: 1,
    menu_iconp: null,
    menu_keys: null,
    menu_link: "balance",
    ordern: 6,
    parent_id: 0,
    software_id: 154,
  },
  {
    caption: "Захиалга",
    description: "ft-user-plus",
    id: 2182,
    isaction: false,
    isactive: true,
    isconst: false,
    isdelete: 1,
    isinsert: 1,
    isupdate: 1,
    menu_iconp: null,
    menu_keys: null,
    menu_link: "order",
    ordern: 6,
    parent_id: 0,
    software_id: 154,
  },
  {
    caption: "Хэрэглэгч",
    description: "ft-user-plus",
    id: 2183,
    isaction: false,
    isactive: true,
    isconst: false,
    isdelete: 1,
    isinsert: 1,
    isupdate: 1,
    menu_iconp: null,
    menu_keys: null,
    menu_link: "user",
    ordern: 6,
    parent_id: 0,
    software_id: 154,
  },
];

const Navbar = () => {
  // const { user } = useUserContext();

  const [menu, setMenu] = useState([]);
  const [dropdown, setDropDown] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    console.log(data);
    // if (user.tn !== 0) {
    var allMenu = data;
    var menu1 = data;

    // _.sortBy(
    //   user.usermenu.filter((a) => a.parent_id === 0),
    //   ["ordern"]
    // );
    _.map(menu1, (item) => {
      var menu2 = _.orderBy(
        allMenu.filter((a) => a.parent_id === item.id),
        ["ordern"],
        ["asc"]
      );
      item.children = menu2;
    });
    setMenu(menu1);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [user.tn]);
  }, []);

  return (
    <>
      <div
        className="main-menu menu-light menu-fixed menu-shadow app-sidebar "
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
          className="navbar-container main-menu-content center-layout sidebar-content "
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
                    <i
                      className={
                        "side-menu__icon" +
                        (item.description === null
                          ? ""
                          : " " + item.description)
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
                    }}
                  >
                    <i
                      className={
                        "side-menu__icon" +
                        (item.description === null
                          ? ""
                          : " " + item.description)
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
            className="navigation-main nav navbar-nav space-x-4 cursor-pointer"
            id="main-menu-navigation"
            data-menu="menu-navigation"
          >
            {menu.map((item, index) => {
              if (item.menu_link === window.location.pathname.split("/")[1]) {
              }

              return item.children.length === 0 ? (
                <li
                  key={item.id}
                  className={`dropdown nav-item ${
                    selectedMenu
                      ? selectedMenu === index
                        ? "sidebar-group-active active"
                        : ""
                      : window.location.pathname.split("/")[1] ===
                        item.menu_link
                      ? "sidebar-group-active active"
                      : ""
                  } `}
                >
                  <div className="dropdown-toggle nav-link d-flex align-items-center">
                    <Link
                      to={"/" + item.menu_link}
                      onClick={() => setSelectedMenu(index)}
                    >
                      <i
                        className={
                          "side-menu__icon " +
                          (item.description === null
                            ? ""
                            : " " + item.description)
                        }
                      ></i>

                      <span data-i18n="Apps" className=" md:uppercase text-sm">
                        {item.caption}
                      </span>
                    </Link>
                  </div>
                </li>
              ) : (
                <li
                  className={`dropdown nav-item `}
                  key={item.id}
                  data-menu="dropdown"
                >
                  <div
                    className={`dropdown-toggle nav-link d-flex align-items-center ${
                      item.menu_link === window.location.pathname.split("/")[1]
                        ? "bg-[#EFDEFF] rounded "
                        : ""
                    } `}
                    data-toggle="dropdown"
                  >
                    <i
                      className={
                        "side-menu__icon" +
                        (item.description === null
                          ? ""
                          : " " + item.description)
                      }
                    ></i>
                    <span data-i18n="Apps" className="md:uppercase text-sm">
                      {item.caption}
                    </span>

                    <i className="ft-chevron-right ml-2" />
                  </div>

                  <ul className="dropdown-menu">
                    {item.children.map((child) => {
                      return (
                        <li data-menu="" key={child.id}>
                          <Link
                            to={`/${child.menu_link} `}
                            onClick={() => setSelectedMenu(index)}
                            className="dropdown-item d-flex align-items-center"
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
