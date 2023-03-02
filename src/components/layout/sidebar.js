import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "src/contexts/userContext";
import { userAction } from "src/reducers/userReducer";

import * as API from "src/api/request";
import Swal from "sweetalert2";

const _ = require("lodash");

const Sidebar = () => {
  const { user, userDispatch } = useUserContext();
  const [menu, setMenu] = useState(false);
const [expanded, setExpanded]=useState(false);
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
    <aside className="main-sidebar app-sidebar sidebar-scroll">
      <div className="main-sidebar-header">
        <Link className="desktop-logo logo-light active" to="/">
          <img src="/img/logo.png" className="main-logo" alt="" />
        </Link>
        <Link className="desktop-logo icon-logo active" to="/">
          <img src="/img/logo.png" className="logo-icon" alt="" />
        </Link>
        <Link className="desktop-logo logo-dark active" to="/">
          <img
            src="/img/logo_white.png"
            className="main-logo dark-theme"
            alt="logo"
          />
        </Link>
        <Link className="logo-icon mobile-logo icon-dark active" to="/">
          <img
            src="/img/logo_white.png"
            className="logo-icon dark-theme"
            alt="logo"
          />
        </Link>
      </div>

      <div className="main-sidebar-loggedin">
        <div className="app-sidebar__user">
          <div className="dropdown user-pro-body text-center">
            <div className="user-pic flex items-center justify-center">
              <img
                src={"https://ef.erdenetmc.mn/emp/" + user.tn + ".jpg"}
                alt="user-img"
                className="rounded-circle mCS_img_loaded"
              />
            </div>
            <div className="user-info">
              <h6 className=" mb-0 text-dark">{user.info.shortname}</h6>
              <span
                className="text-muted app-sidebar__user-name text-sm"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {user.info.position_namemn}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar-navs">
        <ul className="nav nav-pills-circle">
          <li
            className="nav-item"
            data-toggle="tooltip"
            data-placement="top"
            data-original-title="Гарах"
          >
            <a
              href="/"
              className="nav-link text-center m-2"
              onClick={(e) => {
                e.preventDefault();
                API.logOut()
                  .then(() => {
                    userDispatch({ type: userAction.LOG_OUT });
                    window.location = "https://digital.erdenetmc.mn/dashboard";
                  })
                  .catch(() =>
                    Swal.fire({
                      icon: "warning",
                      title: "Гарах сервис ажиллахгүй байна.",
                      html: "",
                    })
                  );
              }}
            >
              <i className="fe fe-power" />
            </a>
          </li>
        </ul>
      </div>
      <div className="main-sidebar-body">
        <ul className="side-menu">
          
          {/* {menu.map((item) => {
            return item.children.length === 0 ? (
              <li key={item.id} className="slide">
                <Link
                  className={
                    "side-menu__item" +
                    (user.current.menu1ID === item.id ? " active" : "")
                  }
                  to={"/" + item.menu_link}
                  onClick={() => {
                    userDispatch({
                      type: userAction.CHANGE_MENU1_ID,
                      data: item.id,
                    });
                    userDispatch({
                      type: userAction.CHANGE_MENU2_ID,
                      data: 0,
                    });
                    userDispatch({
                      type: userAction.CHANGE_MENU_EXPANDED,
                      data: 0,
                    });
                    userDispatch({
                      type: userAction.CHANGE_MENU_NAME,
                      data: item.caption,
                    });
                  }}
                >
                  <i
                    className={
                      "side-menu__icon" +
                      (item.description === null ? "" : " " + item.description)
                    }
                  />
                  <span className="side-menu__label">{item.caption}</span>
                </Link>
              </li>
            ) : (
              <li
                key={item.id}
                className={
                  "slide" +
                  (user.current.menuExpanded === item.id ? " is-expanded" : "")
                }
              >
                <a
                  className={
                    "side-menu__item" +
                    (user.current.menu1ID === item.id ? " active" : "")
                  }
                  data-toggle="slide"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    userDispatch({
                      type: userAction.CHANGE_MENU1_ID,
                      data: item.id,
                    });
                    userDispatch({
                      type: userAction.CHANGE_MENU_EXPANDED,
                      data: user.current.menuExpanded === item.id ? 0 : item.id,
                    });
                  }}
                >
                  <i
                    className={
                      "side-menu__icon" +
                      (item.description === null ? "" : " " + item.description)
                    }
                  />
                  <span className="side-menu__label">{item.caption}</span>
                  <i className="angle fe fe-chevron-down" />
                </a>
                <ul className="slide-menu">
                  {item.children.map((children) => {
                    return (
                      <li key={children.id}>
                        <Link
                          className={
                            "slide-item" +
                            (user.current.menu2ID === children.id
                              ? " active"
                              : "")
                          }
                          to={"/" + children.menu_link}
                          onClick={() => {
                            userDispatch({
                              type: userAction.CHANGE_MENU2_ID,
                              data: children.id,
                            });
                            userDispatch({
                              type: userAction.CHANGE_MENU_NAME,
                              data: item.caption + " > " + children.caption,
                            });
                          }}
                        >
                          {children.caption}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })} */}
          <li className={expanded? "slide is-expanded ":"slide "} onClick={() => {
           setExpanded(!expanded)
          }}>
						<a className="side-menu__item" data-toggle="slide" href="#"><i className="side-menu__icon fe fe-database menu-icons"></i><span className="side-menu__label">Лавлах сан</span><i className="angle fe fe-chevron-down"></i></a>
						<ul className="slide-menu" >
							<li><a className="slide-item" href="http://localhost:3000/reference/lesson">Сургалтын төрөл</a></li>
							<li><a className="slide-item" href="http://localhost:3000/reference/lessontype">Сургалтын төрөл жил</a></li>
							<li><a className="slide-item" href="http://localhost:3000/reference/chamber">Танхим</a></li>
							<li><a className="slide-item" href="http://localhost:3000/reference/organization">Гаднын байгууллага</a></li>
							<li><a className="slide-item" href="http://localhost:3000/reference/employee">Гаднын ажилчид</a></li>
						</ul>
					</li>
          <li className={menu? "slide is-expanded ":"slide "} onClick={() => {
           setMenu(!menu)
          }}>
						<a className="side-menu__item" data-toggle="slide" href="#"><i className="side-menu__icon fe fe-file-plus"></i><span className="side-menu__label">Бүртгэл</span>
            <i className="angle fe fe-chevron-down"></i></a>
						<ul className="slide-menu">
							<li><a className="slide-item" href="#">Сургалт</a></li>
							<li><a className="slide-item" href="http://localhost:3000/registration/worker">Ажилчдын бүртгэл</a></li>
						
						</ul>
					</li>
        </ul>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);
