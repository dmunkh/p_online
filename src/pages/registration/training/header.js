import React from "react";
import { DatePicker } from "antd";
import moment from "moment";
import { useTrainingContext } from "../../../contexts/trainingContext";

import Module from "src/components/custom/module";
import TypeYear from "src/components/custom/typeYear";

const Header = () => {
  const { state, dispatch } = useTrainingContext();

  return (
    <div className="mb-2 pb-2 flex flex-col md:flex-row gap-5 border-b">
      <div className="flex flex-col md:justify-between md:flex-row md:items-center gap-3  pb-2">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex items-center  ml-10 mt-3">
            <div className=" flex items-center  ml-10 form-group">
              <input
                type="checkbox"
                id="switchery"
                className="switchery"
                defaultChecked
                data-switchery="true"
                style={{ display: "none" }}
              />
              <span
                className="switchery switchery-default"
                style={{
                  backgroundColor: "rgb(151, 90, 255)",
                  borderColor: "rgb(151, 90, 255)",
                  boxShadow: "rgb(151, 90, 255) 0px 0px 0px 12.5px inset",
                  transition:
                    "border 0.4s ease 0s, box-shadow 0.4s ease 0s, background-color 1.2s ease 0s",
                }}
              >
                <small
                  style={{
                    left: 18,
                    backgroundColor: "rgb(255, 255, 255)",
                    transition:
                      "background-color 0.4s ease 0s, left 0.2s ease 0s",
                  }}
                />
              </span>
              <span className="pr-3 font-semibold text-xs pl-5">Он:</span>
            </div>
          </div>

          <div className="w-full flex items-center">
            {/* <span className="pr-3 font-semibold text-xs">Он:</span> */}

            <DatePicker
              allowClear={false}
              className="w-full md:w-[150px] text-xs rounded-lg"
              picker="year"
              format="YYYY"
              value={state.change_year}
              onChange={(date) =>
                dispatch({
                  type: "YEAR",
                  data: moment(date, "YYYY"),
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
                  console.log("value: ", value);
                  dispatch({ type: "STATE", data: { moduleid: value } });
                }}
              />
            </div>
          </div>
          {console.log("object", state.moduleid)}
          <div className="flex flex-col  md:flex-row md:items-center gap-3 ml-5">
            <span className="md:w-max pr-3 font-semibold text-xs whitespace-nowrap">
              Сургалтын төрөл:
            </span>
            <div className="w-full md:min-w-[200px]">
              <TypeYear
                value={state.moduleid}
                onChange={(value) =>
                  dispatch({ type: "STATE", data: { modaltypeid: value } })
                }
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
