import React, { useContext, useReducer } from "react";
import { reducer } from "../reducers/referenceReducer";
import moment from "moment";
const context = React.createContext();

const _state = {
  date: moment(),
  list_module: [],
  selected_moduleID: null,

  list_interval: [],
  selected_interval: null,

  list_type: [],
  typeID: null,
  list_types: [],
  list_lesson_ID: [],

  refresh: 0,
  modal: false,
  modal1: false,
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
  selected_employee: {
    id: null,
    organization_id: null,
    position_name: null,
    register_number: null,
    short_name: null,
  },

  list_chamber: [],
  placeID: null,
  place_name: "",

  list_typeyear: [],
  selected_typeyear: {
    id: null,
    type_name: "",
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
  change_year: null,

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
