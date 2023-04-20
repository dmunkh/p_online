import React, { useContext, useLayoutEffect, useReducer } from "react";
import { reducer } from "../reducers/normReducer";
import * as API from "../api/request";
import _ from "lodash";

const context = React.createContext();

const _state = {
  list_department: [],
  department: null,

  refresh: 0,
  modal: false,

  list_position: [],
  checked_positionList: [],
  checkNoNorm: false,
  list_norm: [],
  selectedpositionname: null,
};

export const useNormContext = () => {
  const ctx = useContext(context);
  if (ctx === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return ctx;
};

const Context = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, _state);

  useLayoutEffect(() => {
    API.getUserDepartment().then((res) => {
      console.log("res: ", res);
      var result = [];
      _.map(_.orderBy(res, ["departmentlevelid", "departmentcode"]), (item) => {
        result.push({
          ...item,
          title: item.departmentcode + " | " + item.departmentname,
          key: item.id,
          value: item.id,
          id: item.id,
          pId: item.parentid,
          selectable: item.departmentlevelid !== -1,
        });
      });
      dispatch({
        type: "LIST_DEPARTMENT",
        data: result,
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <context.Provider value={{ state: state, dispatch: dispatch }}>
      {children}
    </context.Provider>
  );
};
export default React.memo(Context);
