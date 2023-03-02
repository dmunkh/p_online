import React from "react";
import { useUserContext } from "src/contexts/userContext";
import { userAction } from "src/reducers/userReducer";

const template = {
  theme: [
    { text: "Цагаан", value: "" },
    { text: "Хар", value: "dark-theme" },
  ],
  header: [
    { text: "Градиант", value: "" },
    { text: "Хар", value: "header-dark3" },
  ],
  sidebar: [
    { text: "Цагаан", value: "leftmenu-light" },
    { text: "Хар", value: "leftmenu-dark" },
  ],
};

const Setting = () => {
  const { user, userDispatch } = useUserContext();
  return (
    <>
      <div className="menu-header-content bg-primary-gradient text-left d-flex">
        <div>
          <h5 className="menu-header-title text-white mb-0">Тохиргоо</h5>
        </div>
      </div>
      <div className="main-message-list chat-scroll">
        <div className="p-3">
          <h3 className="notification-label">Үндсэн өнгө</h3>
          {template.theme.map((item, index) => {
            return (
              <div key={"theme_" + index}>
                <label className="customradiocontainer">
                  <span>{item.text}</span>
                  <input
                    type="radio"
                    name="theme"
                    value={item.value}
                    checked={item.value === user.template.theme}
                    onChange={(e) =>
                      userDispatch({
                        type: userAction.CHANGE_THEME,
                        data: e.target.value,
                      })
                    }
                  />
                  <span className="checkmark" />
                </label>
              </div>
            );
          })}
        </div>

        <div className="p-3">
          <h5 className="notification-label">Толгой хэсгийн өнгө</h5>
          {template.header.map((item, index) => {
            return (
              <div key={"header_" + index}>
                <label className="customradiocontainer">
                  <span>{item.text}</span>
                  <input
                    type="radio"
                    name="header"
                    value={item.value}
                    checked={item.value === user.template.header}
                    onChange={(e) =>
                      userDispatch({
                        type: userAction.CHANGE_HEADER,
                        data: e.target.value,
                      })
                    }
                  />
                  <span className="checkmark" />
                </label>
              </div>
            );
          })}
        </div>

        <div className="p-3">
          <h5 className="notification-label">Цэсний өнгө</h5>
          {template.sidebar.map((item, index) => {
            return (
              <div key={"sidebar_" + index}>
                <label className="customradiocontainer">
                  <span>{item.text}</span>
                  <input
                    type="radio"
                    name="sidebar"
                    value={item.value}
                    checked={item.value === user.template.sidebar}
                    onChange={(e) =>
                      userDispatch({
                        type: userAction.CHANGE_SIDEBAR,
                        data: e.target.value,
                      })
                    }
                  />
                  <span className="checkmark" />
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default React.memo(Setting);
