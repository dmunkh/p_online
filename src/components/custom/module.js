import React, { useLayoutEffect, useState } from "react";
import * as API from "src/api/request";
import _ from "lodash";
import { Select } from "antd";

const DepartmentTseh = (props) => {
  const [list, setList] = useState([]);
  const { Option } = Select;

  useLayoutEffect(() => {
    API.getModule().then((res) => {
      setList(res);
      if (res.length > 0 && !props.value) props.onChange(res[0].id);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Select
      showSearch
      placeholder="Сонгоно уу."
      optionFilterProp="children"
      className="w-full "
      {...props}
    >
      {_.map(list, (item) => {
        return (
          <Option key={item.id} value={item.id}>
            {item.id} | {item.module_name}
          </Option>
        );
      })}
    </Select>
  );
};

export default React.memo(DepartmentTseh);
