import React from "react";
// import { useUserContext } from "src/contexts/userContext";
import { usePlanContext } from "src/contexts/planContext";
import Module from "src/components/custom/module";
// import Tree from "src/components/custom/departmentTree";
// import * as API from "src/api/request";

import { DatePicker } from "antd";
import Department from "src/components/custom/departmentTseh";
// import _ from "lodash";

const Header = () => {
  const { state, dispatch } = usePlanContext();

  return (
    <div className="mb-2 pb-2 flex flex-col md:flex-row gap-2 border-b">
      <div className="flex items-center justify-between text-xs gap-2">
        <span className="md:w-[50px] font-semibold">Огноо:</span>
        <div className="w-full md:min-w-[100px] ">
          <DatePicker
            allowClear={false}
            className="w-full md:w-[100px] text-xs"
            picker="year"
            format="YYYY"
            value={state.date}
            onChange={(date) => {
              dispatch({
                type: "STATE",
                data: { date: date },
              });
            }}
          />
        </div>
      </div>

      <div className="flex items-center w-full  md:w-[400px] text-xs gap-2">
        <span className="font-semibold whitespace-nowrap">Бүтцийн нэгж:</span>
        <Department
          value={state.department_id}
          onChange={(value) =>
            dispatch({ type: "STATE", data: { department_id: value } })
          }
        />
      </div>
      <div className="flex items-center w-full  md:w-[250px] text-xs gap-2">
        <span className="font-semibold whitespace-nowrap">Модуль:</span>
        <Module
          value={state.moduleid}
          onChange={(value) =>
            dispatch({ type: "STATE", data: { moduleid: value } })
          }
        />
      </div>
    </div>
  );
};
export default Header;
