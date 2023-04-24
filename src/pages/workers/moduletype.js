import React, { useEffect, useLayoutEffect, useState } from "react";
import Department from "src/components/custom/departmentTseh";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";
import Module from "src/components/custom/module";
import Type from "src/components/custom/type";
import { DatePicker } from "antd";
import _ from "lodash";
import { useUserContext } from "src/contexts/userContext";
import * as API from "src/api/request";

const Moduletype = () => {
  const { user, message, checkRole } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();
  const [list, setList] = useState([]);

  useLayoutEffect(() => {
    API.getType({ module_id: 1 }).then((res) => {
      setList(res);

      if (res.length > 0)
        dispatch({ type: "STATE", data: { moduletypeid: res[0].id } });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                {_.map(list, (item) => {
                  return (
                    <li
                      className="list-group-item hover:bg-[#dedbf1] cursor-pointer"
                      style={{ paddingTop: "5px", paddingBottom: "2px" }}
                      onClick={(value) => {
                        console.log("test");
                      }}
                    >
                      <span>{item.type_name}</span>
                      <span className="badge bg-light-primary float-right">
                        {item.id}
                      </span>
                    </li>
                    // <Option key={item.id} value={item.id}>
                    //   {item.id} | {item.type_name}
                    // </Option>
                  );
                })}

                {/* <li className="list-group-item">
                  <span>Apex Angular</span>
                  <span className="badge bg-light-primary float-right">
                    2.5k
                  </span>
                </li>
                <li className="list-group-item">
                  <span>Vuexy VueJS</span>
                  <span className="badge bg-light-info float-right">3.7k</span>
                </li>
                <li className="list-group-item">
                  <span>Frest HTML</span>
                  <span className="badge bg-light-warning float-right">
                    2.3k
                  </span>
                </li>
                <li className="list-group-item">
                  <span>Modern Angular</span>
                  <span className="badge bg-light-success float-right">
                    4.1k
                  </span>
                </li>
                <li className="list-group-item">
                  <span>Frest Sketch</span>
                  <span className="badge bg-light-secondary float-right">
                    2.8k
                  </span>
                </li>
                <li className="list-group-item">
                  <span>Materialize HTML</span>
                  <span className="badge bg-light-danger float-right">
                    5.6k
                  </span>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Moduletype);
