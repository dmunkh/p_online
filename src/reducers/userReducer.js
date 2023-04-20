export const userType = {
  LOG_IN: "LOG_IN",
  LOG_OUT: "LOG_OUT",
  CHANGE_THEME: "CHANGE_THEME",
  CHANGE_HEADER: "CHANGE_HEADER",
  CHANGE_SIDEBAR: "CHANGE_SIDEBAR",
  CHANGE_MENU1_ID: "CHANGE_MENU1_ID",
  CHANGE_MENU2_ID: "CHANGE_MENU2_ID",
  CHANGE_MENU_EXPANDED: "CHANGE_MENU_EXPANDED",
  CHANGE_MENU_NAME: "CHANGE_MENU_NAME",
  CHANGE_SHOW_SIDEBAR: "CHANGE_SHOW_SIDEBAR",
  CHANGE_MODAL: "MODAL",
  LIST_DEPARTMENT: "LIST_DEPARTMENT",
  DEPARTMENT: "DEPARTMENT",
};

const _ = require("lodash");

export const userReducer = (state, action) => {
  switch (action.type) {
    case userType.LOG_IN:
      var list = _.split(action.data.usergroup, ",").map((a) => +a);
      return {
        ...state,
        ...action.data,
        userGroupList: list,
        loggedIn: true,
      };
    case userType.modal:
      return {
        ...state,
        modal: action.data,
      };
    case userType.LOG_OUT:
      localStorage.removeItem("token");
      localStorage.removeItem("menu1ID");
      localStorage.removeItem("menu2ID");
      localStorage.removeItem("menuName");
      localStorage.removeItem("menuExpanded");
      return { ...state, ...action.data, loggedIn: false };

    case userType.CHANGE_MENU:
      var menuID = action.data.id;
      var menuName = action.data.caption;
      localStorage.setItem("menuID", menuID);
      localStorage.setItem("menuName", menuName);
      return {
        ...state,
        current: { ...state.current, menuID, menuName },
      };

    case userType.CHANGE_MENU1_ID:
      localStorage.setItem("menu1ID", action.data);
      return {
        ...state,
        current: { ...state.current, menu1ID: parseInt(action.data) },
      };

    case userType.CHANGE_MENU_EXPANDED:
      localStorage.setItem("menuExpanded", action.data);
      return {
        ...state,
        current: { ...state.current, menuExpanded: parseInt(action.data) },
      };

    case userType.CHANGE_MENU2_ID:
      localStorage.setItem("menu2ID", action.data);
      return {
        ...state,
        current: { ...state.current, menu2ID: parseInt(action.data) },
      };

    case userType.CHANGE_MENU_NAME:
      localStorage.setItem("menuName", action.data);
      return {
        ...state,
        current: { ...state.current, menuName: action.data },
      };

    case userType.CHANGE_THEME:
      localStorage.setItem("theme", action.data);
      document.body.classList.remove("dark-theme");
      !action.data || document.body.classList.add(action.data);
      return {
        ...state,
        template: { ...state.template, theme: action.data, header: "" },
      };

    case userType.CHANGE_HEADER:
      localStorage.setItem("header", action.data);
      document.body.classList.remove("header-dark3");
      !action.data || document.body.classList.add(action.data);
      return { ...state, template: { ...state.template, header: action.data } };

    case userType.CHANGE_SIDEBAR:
      localStorage.setItem("sidebar", action.data);
      document.body.classList.remove("leftmenu-light");
      document.body.classList.remove("leftmenu-dark");
      !action.data || document.body.classList.add(action.data);
      return {
        ...state,
        template: { ...state.template, sidebar: action.data },
      };

    case userType.CHANGE_SHOW_SIDEBAR:
      action.data
        ? document.body.classList.add("sidenav-toggled")
        : document.body.classList.remove("sidenav-toggled");
      return {
        ...state,
        template: { ...state.template, showSidebar: action.data },
      };

    default:
      return state;
  }
};
