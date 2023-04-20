import React, { useEffect, useContext, useReducer } from "react";

import { userType, userReducer } from "../reducers/userReducer";
import * as API from "../api/request";
import { notification } from "antd";
import Swal from "sweetalert2";
import _ from "lodash";
const context = React.createContext();

const initialState = {
  tn: 0,
  info: {},
  userdeps: [],
  usergroup: "",
  userGroupList: [],
  usermenu: [],
  userzone: [],
  loggedIn: false,
  workerTree: [],
  current: {
    menu1: 1863,
    menu2: "",
    menuExpanded: "",
    menuName: "Миний үүрэг даалгавар",
  },
  template: {
    theme: "",
    header: "",
    sidebar: "leftmenu-light",
    showSidebar: false,
  },
};

export const useUserContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }
  return ctx;
};

const UserContext = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const [api, contextHolder] = notification.useNotification();
  const checkGroup = (value) =>
    _.some(state.userGroupList, (item) => value.includes(item));
  const checkRole = (value) =>
    _.some(state.userroles, (item) => value.includes(item));

  const message = ({ type, error = null, title, description = null }) => {
    if (type === "error") {
      var message = error?.response?.data?.message
        ? error?.response?.data?.message
        : title;
      var desc = null;
      if (!message) {
        desc = error?.response?.data?.message
          ? error?.response?.data?.message
          : error.toJSON().message;
      }
      api.error({
        message: message,
        description: desc,
        placement: "topRight",
        duration: 5,
      });
    }
    if (type === "info") {
      api.info({
        message: title,
        description: description,
        placement: "topRight",
        duration: 5,
      });
    }
    if (type === "success") {
      api.success({
        message: title,
        description: description,
        placement: "topRight",
        duration: 5,
      });
    }
    if (type === "warning") {
      api.warning({
        message: title,
        description: description,
        placement: "topRight",
        duration: 5,
      });
    }
  };

  useEffect(() => {
    if (navigator.onLine) {
      var token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (token === null) {
        API.getAuth().then((res) => {
          const result = res.data;
          let url = result.url;
          if (window.location.hostname === "localhost") {
            url = url.replace(
              "https://training.erdenetmc.mn/callback",
              "http://localhost:3000/callback"
            );
          }
          window.location.replace(url);
        });
      } else {
        if (state.tn === 0) {
          API.getUserInfo().then((userInfo) => {
            dispatch({
              type: userType.LOG_IN,
              data: userInfo,
            });
          });
        }
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Интернэт холболтоо шалгана уу.",
        html: "",
      });
    }
  }, [state.tn]);

  useEffect(() => {
    var menu1ID = localStorage.getItem("menu1ID");
    dispatch({
      type: userType.CHANGE_MENU1_ID,
      data: menu1ID === null ? 1863 : menu1ID,
    });

    var menu2ID = localStorage.getItem("menu2ID");
    dispatch({
      type: userType.CHANGE_MENU2_ID,
      data: menu2ID === null ? 0 : menu2ID,
    });

    var menuExpanded = localStorage.getItem("menuExpanded");
    dispatch({
      type: userType.CHANGE_MENU_EXPANDED,
      data: menuExpanded === null ? 0 : menuExpanded,
    });

    var theme = localStorage.getItem("theme");
    !theme || dispatch({ type: userType.CHANGE_THEME, data: theme });

    var header = localStorage.getItem("header");
    !header || dispatch({ type: userType.CHANGE_HEADER, data: header });

    var sidebar = localStorage.getItem("sidebar");
    !sidebar || dispatch({ type: userType.CHANGE_SIDEBAR, data: sidebar });
  }, []);

  return (
    <context.Provider
      value={{
        user: state,
        userDispatch: dispatch,
        userType: userType,
        message,
        checkGroup,
        checkRole,
      }}
    >
      {contextHolder}
      {children}
    </context.Provider>
  );
};

export default React.memo(UserContext);
