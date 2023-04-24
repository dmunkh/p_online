import React, { useContext, useReducer } from "react";
import { reducer } from "../reducers/registerEmplReducer";
import moment from "moment";

const context = React.createContext();

const _state = {
  list: [],
  refresh: 0,
  modal: false,
  moduleid: null,
  date: moment(),
};

export const useRegisterEmplContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return ctx;
};

const Context = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, _state);

  return (
    <context.Provider value={{ state: state, dispatch: dispatch }}>
      {children}
    </context.Provider>
  );
};
export default React.memo(Context);
