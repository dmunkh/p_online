import React, { useContext, useReducer } from "react";
import { reducer } from "src/reducers/planReducer";
import moment from "moment";
import dayjs from "dayjs";
import register from "src/pages/workers/register";

const date = new Date();
var _startDate = new Date(date.getFullYear(), date.getMonth(), 1);
var _endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

const context = React.createContext();

const _state = {
  tn: 0,
  list: [],
  refresh: 0,
  modal: false,
  modal_add_baraa: false,
  date: moment(),
  department: null,
  moduleid: null,
  typeid: null,
  module_name: null,
  isapprove: null,
  balance_list: [],
  balanceGroup_list: [],
  single_page: false,

  company: {
    id: 0,
    list: [],
    modal: false,
    company_name: null,
    hayag: null,
    utas: null,
    dans: null,
    register: null,
  },

  baraa: {
    id: 0,
    baraa_ner: null,
    company_id: null,
    company_ner: null,
    price: 0,
    unit: 0,
    box_count: 0,
    model: false,
    count: 0,
    bar_code: 0,
  },
  delguur: {
    id: 0,
    delguur_ner: null,
    company_name: null,
    hayag: null,
    utas: null,
    dans: null,
    register: null,
    modal: false,
  },

  order: {
    id: 0,
    modal_driver: false,
    start_date: _startDate,
    end_date: _endDate,
    modal: false,
    delguur_id: null,
    delguur_ner: null,
    order_id: 0,
    filter_order_id: 0,
    is_approve: null,
    cash: 0,
    dt: moment(),
    modal_edit: false,
    baraa_id: 0,
    phone: null,
    user_name: null,
    checked_positionList: [],
  },
  balance: {
    id: 0,
    start_date: _startDate,
    end_date: _endDate,
    modal: false,
    balance: 0,
    bonus: 0,
    type: 1,
    count: 0,
    unit: "",
    price: 0,
    register_date: moment(),
    baraa_id: null,
    seller_id: null,
  },
  user: {
    id: 0,
    modal: false,
    user_name: null,
    user_login: null,
    phone: null,
  },
  report: {
    year: moment(),
    month: moment(),
    date: moment(),
  },
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
