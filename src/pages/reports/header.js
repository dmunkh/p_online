import React, { useLayoutEffect, useState } from "react";
import { DatePicker } from "antd";
import { useTrainingContext } from "src/contexts/trainingContext";
import Module from "src/components/custom/module";
import Department from "src/components/custom/departmentTseh";
import moment from "moment";
import { Select } from "antd";
import * as API from "src/api/request";
import _ from "lodash";

const Header = () => {
  const { state, dispatch } = useTrainingContext();
  const [list, setList] = useState([]);
  const { Option } = Select;
  useLayoutEffect(() => {
    API.getUserModule().then((res) => {
      var result = res;
      result.push({ id: 0, module_name: "Бүгд" });
      setList(_.orderBy(res, ["id"]));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex border-b pb-1">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="w-full flex items-center pl-1">
          <span className="pr-1 font-semibold text-xs">Огноо:</span>

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
        <div className="flex items-center w-full  md:w-[400px] text-xs gap-2">
          <span className="font-semibold whitespace-nowrap">Бүтцийн нэгж:</span>
          <div className="w-full md:min-w-[400px]">
            <Department
              menu={1}
              value={state.department_id}
              onChange={(value) =>
                dispatch({ type: "STATE", data: { department_id: value } })
              }
            />
          </div>
        </div>

        <div className="flex flex-col  md:flex-row md:items-center gap-3 ">
          <span className="md:w-max pr-1 font-semibold text-xs whitespace-nowrap">
            Сургалтын бүлэг:
          </span>
          <div className="w-full md:min-w-[250px]">
            <Select
              showSearch
              allowClear
              placeholder="Сонгоно уу."
              optionFilterProp="children"
              className="w-full"
              value={state.moduleid}
              onChange={(value) => {
                dispatch({ type: "STATE", data: { moduleid: value } });
              }}
            >
              {_.map(list, (item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.module_name}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
