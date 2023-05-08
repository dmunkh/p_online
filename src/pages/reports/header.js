import React, { useState } from "react";
import { DatePicker } from "antd";
import { useTrainingContext } from "src/contexts/trainingContext";

import Module from "src/components/custom/module";

import moment from "moment";

const Header = () => {
  const { state, dispatch } = useTrainingContext();

  return (
    <div className="flex border-b pb-1">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="w-full flex items-center pl-2">
          <span className="pr-3 font-semibold text-xs">Огноо:</span>

          <DatePicker
            allowClear={false}
            className="w-full md:w-[150px] text-xs"
            picker={"year"}
            format={"YYYY"}
            value={state.change_year}
            onChange={(date) => {
              dispatch({
                type: "STATE",
                data: {
                  change_year: moment(date, "YYYY"),
                },
              });
            }}
          />
        </div>
        <div className="flex flex-col  md:flex-row md:items-center gap-3 ml-5">
          <span className="md:w-max pr-3 font-semibold text-xs whitespace-nowrap">
            Сургалтын бүлэг:
          </span>
          <div className="w-full md:min-w-[200px]">
            <Module
              value={state.moduleid}
              onChange={(value) => {
                dispatch({ type: "STATE", data: { moduleid: value } });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
