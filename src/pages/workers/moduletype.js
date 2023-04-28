import React, { useEffect, useLayoutEffect, useState } from "react";
import Department from "src/components/custom/departmentTseh";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";
import Module from "src/components/custom/module";
import Type from "src/components/custom/type";
import { DatePicker } from "antd";
import _ from "lodash";
import { useUserContext } from "src/contexts/userContext";
import * as API from "src/api/request";
import moment from "moment";

const Moduletype = () => {
  const { user, message, checkRole } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();
  const [list, setList] = useState([]);

  useLayoutEffect(() => {
    state.moduletypeid &&
      API.getTypesYear({
        year: moment(state.date).format("Y"),
        module_id: state.moduletypeid,
      }).then((res) => {
        setList(res);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.moduletypeid]);

  return (
    <div classNameName="mb-2 pb-2 flex flex-col md:flex-row gap-2 border-b">
      <div classNameName="flex items-center w-full  md:min-w-[100px] text-xs gap-2">
        <span className="text-base">Модуль</span>

        <Module
          value={state.moduletypeid}
          onChange={(value) =>
            dispatch({ type: "STATE", data: { moduletypeid: value } })
          }
        />

        <div className="card">
          <div className="card-content">
            <div className="card-body" style={{ padding: 0 }}>
              <span className="text-base">Сургалтууд</span>

              <ul className="list-group mb-3">
                <li
                  className="list-group-item hover:bg-[#dedbf1] cursor-pointer"
                  style={{ paddingTop: "5px", paddingBottom: "2px" }}
                  onClick={(value) => {
                    dispatch({
                      type: "STATE",
                      data: { lessonlistfilter: state.lessonlist },
                    });
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Нийт сургалт</span>
                  <span class="badge bg-light-primary float-right">4</span>
                </li>
                <hr></hr>
                {_.map(list, (item) => {
                  return (
                    <li
                      className="list-group-item hover:bg-[#dedbf1] cursor-pointer"
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
                          data: { lessonlistfilter: filter },
                        });
                      }}
                    >
                      <span>{item.type_name}</span>
                      <span className="badge bg-light-primary float-right">
                        {item.id}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Moduletype);
