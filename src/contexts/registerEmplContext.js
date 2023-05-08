import React, { useContext, useReducer } from "react";
import { reducer } from "../reducers/registerEmplReducer";
import moment from "moment";

const context = React.createContext();

const _state = {
  date: moment(),
  module: null,
  department: null,
  list: [],
  refresh: 0,

  lessonlistfilter: [],
  lessonlist: [],

  lesson: null,
  selected_typeId: null,

  modal: false,
  modaltransfer: false,
  modaltransferTypeYear: null,
  moduleid: null,
  modaltypeid: null,

  list_checked: [],
  list_position: [],
  selectedpositionname: null,
  tns: null,

  list_planworker: [],
  list_typeworker: [],

  modal_att: false,
  info_type: [],

  page: {
    date: moment(),
    module: null,
    department: null,
    list: [],
    list_filter: [],
    filter: null,
    refresh: 0,
  },
  register: {
    list: [],
  },
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
