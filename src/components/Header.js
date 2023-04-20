import React, { useState } from "react";
import { useUserContext } from "../contexts/userContext";

const Header = (props) => {
  const { user, logOut } = useUserContext();
  const [src, setSrc] = useState();
  const OnError = (e) => {
    if (user.info.gender === 1) {
      setSrc("/img/man.png");
    } else {
      setSrc("/img/women.png");
    }
  };
 
  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light header-navbar navbar-fixed gadot-shadow bg-white `}
    >
      <div className="container-fluid navbar-wrapper">
        <div className="navbar-header d-flex gap-2">
          <div
            className="navbar-toggle menu-toggle d-xl-none d-block float-left align-items-center justify-content-center"
            data-toggle="collapse"
            id="gadotCollapse"
            onClick={() => props.setIsCollapsed(!props.isCollapsed)}
          >
            <i className="ft-menu font-medium-3"></i>
          </div>
          <ul className="navbar-nav">
            <li className="nav-item mr-2 d-none d-lg-block">
              <img
                className=" w-40"
                alt="logo"
                src="/img/logo_black.png"
              />
            </li>
          </ul>
         
        </div>
        <div className="navbar-container ">
          <div className="navbar-collapse d-block">
            <ul className="navbar-nav">
              <li className="dropdown nav-item mr-1">
                <a
                  className="nav-link dropdown-toggle user-dropdown d-flex align-items-end"
                  href="/"
                  data-toggle="dropdown"
                >
                  <div className="user d-md-flex d-none mr-2 text">
                    <span className="text-right  text-black">
                      {user.info.shortname}
                    </span>
                    <span className="text-right text-muted font-small-1">
                      {user.info.position_namemn}
                    </span>
                  </div>
                  <img
                    src={
                      src === undefined
                        ? "https://minio-action.erdenetmc.mn/emp/" +
                          user.tn +
                          ".jpg"
                        : src
                    }
                    className="avatar w-9 h-9"
                    alt=""
                    onError={(e) => OnError(e)}
                  />
                </a>
                <div
                  className="dropdown-menu text-left dropdown-menu-right m-0 pb-0"
                  aria-labelledby="dropdownBasic2"
                >
                  <div
                    className="custom-switch custom-switch-secondary dropdown-item"
                    style={{ paddingLeft: "56px" }}
                  >
                    <input
                      type="checkbox"
                      id="color-switch-2"
                      value={props.mode}
                      checked={props.mode}
                      onChange={() => props.setMode(!props.mode)}
                      className="custom-control-input"
                    />
                    <label
                      htmlFor="color-switch-2"
                      className="custom-control-label mr-1"
                    >
                      <span>{props.mode ? "Хар" : "Цагаан"}</span>
                    </label>
                  </div>
                  <a
                    className="dropdown-item"
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      logOut();
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="ft-power mr-2" />
                      <span>Гарах</span>
                    </div>
                  </a>
                </div>
              </li>
              <li className="nav-item mr-2 mt-1">
                <a
                  className="nav-link notification-sidebar-toggle text-white"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    props.rightbarToggle();
                  }}
                >
                  <i className="ft-align-right font-medium-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Header);
// d-none d-lg-block
