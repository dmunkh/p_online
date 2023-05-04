import React, { useContext, useReducer } from "react";
import { reducer } from "src/reducers/planReducer";
import moment from "moment";

const context = React.createContext();

const _state = {
  list: [],
  refresh: 0,
  modal: false,
  date: moment(),
  department: null,
  moduleid: null,
  typeid: null,
  module_name: null,
  isapprove: null,

  single_page: false,
};

export const usePlanContext = () => {
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
