import React, { useContext, useLayoutEffect, useReducer } from "react";
import { reducer } from "../reducers/referenceReducer";
import * as API from "../api/request";
import _ from "lodash";

const context = React.createContext();

const _state = {
  list_module: [],
  selected_moduleID: null,

  list_interval: [],
  selected_interval: null,

  list_type: [],
  typeID: null,

  list_lesson_ID: [],

  refresh: 0,
  modal: false,
  id: null,
  module_id: null,
  interval_id: null,
  type_name: null,
  price_emc: null,
  price_organization: null,
  hour: null,
  description: null,
  interval_name: null,
  time: null,

  list_organization: [],
  organizationID: null,
  organization_name: "",

  list_employee: [],
  selected_orgName: null,
  selected_organizationID: null,

  list_chamber: [],
  placeID: null,
  place_name: "",

  list_typeyear: [],
  selected_typeyear: {
    hour: null,
    limit: null,
    percent: null,
    place_id: null,
    point: null,
    price_emc: null,
    price_organization: null,
    type_id: null,
    year: null,
  },

  list_lessonsRegister: [],
  selected_lessonsTypeID: [],

  list_modul: [],
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
