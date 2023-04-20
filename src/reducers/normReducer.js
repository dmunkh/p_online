export const reducer = (state, action) => {
  switch (action.type) {
    case "STATE":
      return {
        ...state,
        ...action.data,
      };
    case "LIST_DEPARTMENT":
      return {
        ...state,
        list_department: action.data,
      };
    case "DEPARTMENT":
      return {
        ...state,
        department: action.data,
      };
    default:
      return state;
  }
};
