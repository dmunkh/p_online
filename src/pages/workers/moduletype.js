import React, { useLayoutEffect, useState } from "react";
// import Department from "src/components/custom/departmentTseh";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";

// import Type from "src/components/custom/type";
// import { DatePicker } from "antd";
import _ from "lodash";
// import { useUserContext } from "src/contexts/userContext";
import * as API from "src/api/request";
import moment from "moment";

const Moduletype = () => {
  // const { user, message, checkRole } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();
  const [list, setList] = useState([]);
  const [type_id, setType_id] = useState(null);

  useLayoutEffect(() => {
    state.moduletypeid &&
      API.getTypesYear({
        year: moment(state.date).format("Y"),
        module_id: state.moduletypeid,
      }).then((res) => {
        setList(_.orderBy(res, "type_name"));
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.moduletypeid, state.date]);

  return (
    <div className="mb-2 pb-2 flex flex-col md:flex-row gap-2 mt-2.5">
      <div className="flex flex-col items-left w-full  md:min-w-[100px] text-xs gap-2">
        <div className="card-body" style={{ padding: 0 }}>
          <ul className="list-group mb-3">
            <li
              className="list-group-item bg-slate-200 hover:bg-[#dedbf1] cursor-pointer"
              style={{ paddingTop: "5px", paddingBottom: "2px" }}
              onClick={(value) => {
                dispatch({
                  type: "STATE",
                  data: {
                    lessonlistfilter: state.lessonlist,
                    selected_typeId: null,
                  },
                });

                // setType_id(null);
              }}
            >
              <span className="text-xs font-bold">НИЙТ СУРГАЛТ</span>
              <span className="badge bg-light-primary float-right font-bold border-1 text-sx border-gray-500">
                {_.sumBy(_.map(list, (a) => a.count_lesson))}
              </span>
            </li>
            <hr></hr>
            {_.map(list, (item) => {
              return (
                <li
                  key={item.id}
                  className={
                    "list-group-item hover:bg-[#dedbf1] cursor-pointer flex items-center justify-between " +
                    (state.selected_typeId === item.type_id
                      ? " text-blue-500 font-bold"
                      : "")
                  }
                  style={{ paddingTop: "5px", paddingBottom: "2px" }}
                  onClick={(value) => {
                    var result = [];
                    result = state.lessonlist;

                    var filter = _.filter(
                      result,
                      (a) => a.type_id === item.type_id
                    );

                    dispatch({
                      type: "STATE",
                      data: {
                        lessonlistfilter: filter,
                        selected_typeId: item.type_id,
                      },
                    });
                  }}
                >
                  <span>{item.type_name}</span>
                  <span className="badge bg-light-primary float-right">
                    {/* {_.replace(item.count_lesson, "0", "-")} */}
                    {item.count_lesson}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Moduletype);
