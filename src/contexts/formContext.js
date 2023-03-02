import React, { useContext, useReducer } from "react";
import FormReducer from "../reducers/formReducer";

const FormContext = React.createContext();

const initialState = {
  form: {
    id: null,
    name:"",
    chamber:"",
    organization:"",
  },
  
};

export const useFormState = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error(
      "FormReducer нь таны энэ хуудасны гадуур агуулагдаагүй байна."
    );
  }
  return context;
};

const FormContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(FormReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

export default React.memo(FormContextProvider);
