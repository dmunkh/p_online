import { API } from "src/api/request";
import _ from "lodash";

const save = (state, dispatch, date, toast) => {
  var error = [];
  state.selected_typeyear.type_id || error.push("Сургалтын төрөл:");
  state.selected_typeyear.place_id || error.push("Танхим:");
  const data = {
    hour: state.selected_typeyear.hour,
    limit: state.selected_typeyear.limit,
    percent: state.selected_typeyear.percent,
    place_id: state.selected_typeyear.place_id,
    point: state.selected_typeyear.point,
    price_emc: state.selected_typeyear.price_emc,
    price_organization: state.selected_typeyear.price_organization,
    type_id: state.selected_typeyear.type_id,
    year: date,
  };

  if (error.length > 0) {
    toast.current.show({
        sticky: true ,
      severity: "warn",
      //   summary: "Дараах мэдээлэл дутуу байна",
      className: "",
      content: (
        <div
          className="flex flex-column align-items-center "
          style={{ flex: "1" }}
        >
          <div className="text-center">
            <div className="font-bold text-xl my-3">
              Дараах мэдээлэл дутуу байна
            </div>
          </div>
          <div className="flex gap-2">
            {_.map(error, (item, index) => (
              <div key={index}>
                - <span className="ml-1">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    });
    
  } else if (state.selected_typeyear.id === null) {
    API.postTypeYear({
      ...data,
    })
      .then(() => {
        dispatch({
          type: "STATE",
          data: {
            refresh: state.refresh + 1,
          },
        });
        dispatch({ type: "CLEAR_TYPEYEAR" });
        dispatch({ type: "STATE", data: { modal: false } });
        toast.current.show({
          severity: "success",
          summary: "Амжилттай",
          detail: "Амжилттай хадгалагдлаа",
        });
        // message({ type: "success", title: "Амжилттай хадгалагдлаа" });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Алдаа",
          detail: error.response.data.msg,
        });

        // message({
        //   type: "error",
        //   error,
        //   title: error.response.data.msg,
        // });
      });
  } else {
    API.putTypeYear(state.selected_typeyear.id, {
      ...data,
    })
      .then(() => {
        dispatch({
          type: "STATE",
          data: {
            refresh: state.refresh + 1,
          },
        });
        dispatch({ type: "STATE", data: { modal: false } });
        toast.current.show({
          severity: "success",
          summary: "Амжилттай",
          detail: "Амжилттай хадгалагдлаа",
        });

        // message({ type: "success", title: "Амжилттай хадгалагдлаа" });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Алдаа",
          detail: error.response.data.msg,
        });

        // message({
        //   type: "error",
        //   error,
        //   title: error.response.data.msg,
        // });
      });
  }
};

export default save;
