import React, { useEffect, useContext, useReducer } from "react";
import { userAction, userReducer } from "src/reducers/userReducer";
import * as api from "src/api/request";
import Swal from "sweetalert2";

const _user = {
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

const context = React.createContext();

export const useUserContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("useAuthState must be used within a AuthProvider");
  }
  return ctx;
};

const UserContext = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, _user);

  useEffect(() => {
    if (navigator.onLine) {
      var token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (token === null) {
        api
          .API()
          .get(`/auth`)
          .then((res) => {
            const result = res.data;
            let url = result.url;
            if (window.location.hostname === "localhost") {
              url = url.replace(
                "https://task.erdenetmc.mn/callback",
                "http://localhost:3000/callback"
              );
            }
            window.location.replace(url);
          });
      } else {
        if (state.tn === 0) {
          api.getUserInfo().then((userInfo) => {
            dispatch({
              type: userAction.LOG_IN,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tn]);

  useEffect(() => {
    var menu1ID = localStorage.getItem("menu1ID");
    dispatch({
      type: userAction.CHANGE_MENU1_ID,
      data: menu1ID === null ? 1863 : menu1ID,
    });

    var menu2ID = localStorage.getItem("menu2ID");
    dispatch({
      type: userAction.CHANGE_MENU2_ID,
      data: menu2ID === null ? 0 : menu2ID,
    });

    var menuExpanded = localStorage.getItem("menuExpanded");
    dispatch({
      type: userAction.CHANGE_MENU_EXPANDED,
      data: menuExpanded === null ? 0 : menuExpanded,
    });

    var menuName = localStorage.getItem("menuName");
    dispatch({
      type: userAction.CHANGE_MENU_NAME,
      data: menuName === null ? "Миний үүрэг даалгавар" : menuName,
    });

    var theme = localStorage.getItem("theme");
    !theme || dispatch({ type: userAction.CHANGE_THEME, data: theme });

    var header = localStorage.getItem("header");
    !header || dispatch({ type: userAction.CHANGE_HEADER, data: header });

    var sidebar = localStorage.getItem("sidebar");
    !sidebar || dispatch({ type: userAction.CHANGE_SIDEBAR, data: sidebar });
  }, []);

  return (
    <context.Provider
      value={{
        user: state,
        userDispatch: dispatch,
        userAction: userAction,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default React.memo(UserContext);
