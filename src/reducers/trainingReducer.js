import moment from "moment";

export const reducer = (state, action) => {
  switch (action.type) {
    case "STATE":
      return {
        ...state,
        ...action.data,
      };
    case "SET_LESSON":
      return {
        ...state,
        //id: action.data.id,
        begin_date: action.data.begin_date,
        end_date: action.data.end_date,
        hour: action.data.hour,
        limit: action.data.limit,
        percent: action.data.percent,
        place_id: action.data.place_id,
        point: action.data.point,
        price_emc: action.data.price_emc,
        price_organization: action.data.price_organization,
        year: action.data.year,
        // type_name: action.type_name,
        type_id: action.data.type_id,
      };

    case "CLEAR_LESSON":
      return {
        ...state,
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
        year: null,
        attendance_id: null,
        less_id: null,
      };
    default:
      return state;
  }
};
