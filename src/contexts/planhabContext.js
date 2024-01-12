import React, { useContext, useReducer, useLayoutEffect } from "react";
import { reducer } from "src/reducers/planhabReducer";
import * as API from "src/api/planhab";
import moment from "moment";
import _ from "lodash";

const context = React.createContext();

const _state = {
  id: null,
  list: [],
  date: moment(),
  refresh: 0,
  modal: false,
  modaltypeid: null,
  loading: false,
  list_department: [],
  list_normposition: [],
  list_norm: [],
  list_type: [],
  department_id: null,
  position_id: null,
  moduleid: null,

  info_position: [],
};

export const usePlanHabContext = () => {
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
