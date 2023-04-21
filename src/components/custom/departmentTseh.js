import React, { useLayoutEffect, useState } from "react";
import * as API from "src/api/request";
import _ from "lodash";
import { Select } from "antd";
import { useUserContext } from "src/contexts/userContext";

const DepartmentTseh = (props) => {
  const { user } = useUserContext();
  const [list, setList] = useState([]);
  const { Option } = Select;

  useLayoutEffect(() => {
    API.getUserDepartment().then((res) => {
      setList(
        _.orderBy(
          _.filter(
            res,
            (a) => a.departmentlevelid > 1 && a.departmentlevelid < 5
          ),
          ["departmentcode"]
        )
      );

      if (res?.length > 0 && !props.value) {
        var department = _.find(res, {
          departmentcode: user?.info?.tseh_code,
        });
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
