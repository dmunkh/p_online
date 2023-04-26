import React, { useState } from "react";
import { DatePicker } from "antd";
import { useTrainingContext } from "src/contexts/trainingContext";
import { InputSwitch } from "primereact/inputswitch";
import Module from "src/components/custom/module";
import TypeYear from "src/components/custom/typeYear";
import moment from "moment";

const Header = () => {
  const { state, dispatch } = useTrainingContext();
  const [checked, setChecked] = useState(false);
  return (
    <div className="mb-2 pb-2 flex flex-col md:flex-row gap-5 border-b">
      <div className="flex flex-col md:justify-between md:flex-row md:items-center gap-3  pb-2">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="w-full flex items-center pl-10">
            <span className="pr-3 font-semibold text-xs">Он:</span>

            <DatePicker
              allowClear={false}
              className="w-full md:w-[150px] text-xs rounded-lg"
              picker="year"
              format="YYYY"
              value={state.change_year}
              onChange={(date) =>
                dispatch({
                  type: "STATE",
                  data: { change_year: moment(date, "YYYY") },
                })
              }
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
          <div className="flex items-center  ml-10 mt-3">
            <div className=" flex items-center  ml-10 form-group">
              <div className="card flex justify-content-center">
                <InputSwitch
                  checked={checked}
                  onChange={(e) => {
                    setChecked(e.value);
                    dispatch({ type: "STATE", data: { change_btn: checked } });
                  }}
                />
              </div>
              <span className="pr-3 font-semibold text-xs pl-5">
                {checked ? " " : "Каленьдар "}
              </span>
            </div>
          </div>
          {/* <div className="flex flex-col  md:flex-row md:items-center gap-3 ml-5">
            <span className="md:w-max pr-3 font-semibold text-xs whitespace-nowrap">
              Сургалтын төрөл:
            </span>
            <div className="w-full md:max-w-[450px]">
              <TypeYear
                module_id={state.moduleid}
                year={moment(state.change_year).format("YYYY")}
                value={state.type_id}
                onChange={(value) => {
                  dispatch({ type: "STATE", data: { type_id: value } });
                }}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary fc-button-active bg-primart-500"
              placeholder="Bottom"
              tooltip="Enter your username"
              tooltipoptions={{ position: "bottom" }}
              onClick={() => {
                dispatch({ type: "STATE", data: { change_btn: true } });
              }}
            >
              <i className="ft-calendar"></i>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
