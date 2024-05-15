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
        <div className="flex item-center gap-2 ">
          {state.single_page ? (
            <div
              title="Буцах"
              className="px-3 flex items-center justify-center text-blue-700 text-lg border rounded-md cursor-pointer hover:scale-110 duration-300 h-10"
              onClick={() =>
                dispatch({ type: "STATE", data: { single_page: false } })
              }
            >
              <i className="fa fa-arrow-left" />
            </div>
          ) : (
            ""
          )}
        </div>
        <span className="md:w-[50px] font-semibold">Огноо:</span>
        <div className="w-full md:min-w-[110px] ">
          <DatePicker
            allowClear={false}
            className="w-full md:w-[110px] text-xs"
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

      <div className="flex items-center md:w-[190px] text-xs gap-2">
        <span className="font-semibold whitespace-nowrap"> - </span>
        <DatePicker
          allowClear={false}
          className="w-full md:w-[110px] text-xs"
          value={state.date}
          onChange={(date) => {
            dispatch({
              type: "STATE",
              data: { date: date },
            });
          }}
        />
        {/* <Department
          menu={1}
          value={state.department_id}
          onChange={(value) =>
            dispatch({ type: "STATE", data: { department_id: value } })
          }
        /> */}
      </div>
      <div className="flex items-center w-full  md:w-[250px] text-xs gap-2">
        {/* {!state.single_page ? (
          <>
            {" "}
            <span className="font-semibold whitespace-nowrap">Модуль:</span>
            <Module
              value={state.moduleid}
              onChange={(value) =>
                dispatch({ type: "STATE", data: { moduleid: value } })
              }
            />
          </>
        ) : (
          ""
        )} */}
      </div>
    </div>
  );
};
export default Header;
