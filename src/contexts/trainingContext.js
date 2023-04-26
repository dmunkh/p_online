import React, { useContext, useReducer } from "react";
import { reducer } from "src/reducers/trainingReducer";
import moment from "moment";

const context = React.createContext();

const _state = {
  list_training: [],
  refresh: 0,
  modal: false,
  change_year: moment(),
  change_btn: false,

  moduleid: null,
  type_id: null,

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
