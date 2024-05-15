export const reducer = (state, action) => {
  switch (action.type) {
    case "STATE":
      return {
        ...state,
        ...action.data,
      };
    case "ORDER":
      return {
        ...state,
        order: {
          ...state.order,
          ...action.data,
        },
      };
    case "COMPANY":
      return {
        ...state,
        company: {
          ...state.company,
          ...action.data,
        },
      };
    case "BARAA":
      return {
        ...state,
        baraa: {
          ...state.baraa,
          ...action.data,
        },
      };
    case "DELGUUR":
      return {
        ...state,
        delguur: {
          ...state.delguur,
          ...action.data,
        },
      };
    case "BALANCE":
      return {
        ...state,
        balance: {
          ...state.balance,
          ...action.data,
        },
      };
    default:
      return state;
  }
};
