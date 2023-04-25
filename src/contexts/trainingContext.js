import React, { useContext, useReducer } from "react";
import { reducer } from "../reducers/trainingReducer";

const context = React.createContext();

const _state = {
  list_training: [],
  refresh: 0,
  modal: false,
  change_year: null,
  change_btn: false,

  moduleid: null,
  modaltypeid: null,
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
