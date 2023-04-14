import React, { useContext, useReducer } from "react";
import { reducer } from "src/reducers/referenceReducer";

const context = React.createContext();

const _state = {
  list_type: [],
  typeID: null,
  list_lesson_ID: [],

  refresh: 0,
  modal: false,
  lessonsName: null,
  list_organization: [],

  list_employee: [],
  selected_orgName: null,
  selected_organizationID: null,

  list_chamber: [],
  list_lessonsRegister: [],
  selected_lessonsTypeID: [],
};

export const useReferenceContext = () => {
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
