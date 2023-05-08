export const reducer = (state, action) => {
  switch (action.type) {
    case "STATE":
      return {
        ...state,
        ...action.data,
      };
    case "SET_TYPE":
      return {
        ...state,
        id: action.data.id,
        module_id: action.data.module_id,
        interval_id: action.data.interval_id,
        type_name: action.data.type_name,
        price_emc: action.data.price_emc,
        price_organization: action.data.price_organization,
        hour: action.data.hour,
        description: action.data.description,
        interval_name: action.data.interval_name,
        time: action.data.time,
      };
    case "CLEAR_TYPE":
      return {
        ...state,
        
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
      };

    case "CLEAR_PLACE":
      return {
        ...state,
        placeID: null,
        place_name: "",
      };
      case "CLEAR_TYPEYEAR":
      return {
        ...state,
        selected_typeyear: {
          id:null,
          type_name:"",
          hour: null,
          limit: null,
          percent: null,
          place_id:null,
          point: null,
          price_emc: null,
          price_organization: null,
          type_id: null,
          year: null,}
      };
      case "CLEAR_EMPLOYEE":
        return {
          ...state,
          selected_employee:{
            id:null,
            organization_id: null,
            position_name:null,
            register_number:null,
            short_name:null,
          }
        };

    default:
      return state;
  }
};
