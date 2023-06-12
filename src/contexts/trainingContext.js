import React, { useContext, useReducer } from "react";
import { reducer } from "src/reducers/trainingReducer";
import moment from "moment";

const context = React.createContext();

const _state = {
  list_training: [],
  refresh: 0,
  modal: false,
  change_year: moment().add(1, "year"),
  change_btn: false,

  moduleid: null,
  timeRegister: false,

  id: null,
  begin_date: moment(),
  end_date: moment(),
  hour: null,
  limit: null,
  percent: null,
  place_id: null,
  point: null,
  price_emc: null,
  price_organization: null,
  year: moment(),
  type_name: null,
  type_id: null,

  attendance_date: moment(),
  attendance_desc: null,
  attendance_id: null,
  attendance_list: [],
  less_id: null,
  list_attendance_date: [],
  attendance_hour: "",
  attendance_minut: "",

  list_reportplan: [],
  list_reportplandep: [],
  list_lessType: [],
};

export const useTrainingContext = () => {
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
