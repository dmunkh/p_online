import React, { useLayoutEffect, useState } from "react";
import * as API from "src/api/request";
import _ from "lodash";
import { Select } from "antd";
import { useUserContext } from "src/contexts/userContext";

const DepartmentTseh = (props) => {
  const { user, checkGroup } = useUserContext();
  const [list, setList] = useState([]);
  const { Option } = Select;

  useLayoutEffect(() => {
    API.getUserDepartment().then((res) => {
      var result = res;

      checkGroup([173, 306, 307, 378, 386, 387]) &&
        result.push({
          departmentcode: 0,
          departmentlevelid: 2,
          departmentname: "Бүгд",
          id: 0,
          paranetid: 0,
        });

      setList(
        _.orderBy(
          _.filter(
            result,
            (a) => a.departmentlevelid > 1 && a.departmentlevelid < 5
          ),
          ["departmentcode"]
        )
      );

      if (res?.length > 0 && !props.value) {
        var department = _.find(res, {
          departmentcode: user?.info?.tseh_code,
        });

        if(department)
          props.onChange(department.id);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Select
      showSearch
      allowClear
      placeholder="Сонгоно уу."
      optionFilterProp="children"
      className="w-full"
      {...props}
    >
      {_.map(list, (item) => {
        return (
          <Option key={item.id} value={item.id}>
            {item.departmentcode} | {item.departmentname}
          </Option>
        );
      })}
    </Select>
  );
};

export default React.memo(DepartmentTseh);
