const FormReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_FORM":
      return {
        ...state,
        form: {
          ...state.form,
          ...action.data,
        },
      };
    default:
      return state;
  }
};
export default FormReducer;
