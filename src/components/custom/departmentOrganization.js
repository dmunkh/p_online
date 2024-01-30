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
    API.getOrganization().then((res) => {
      var result = res;

      setList(_.orderBy(result, ["organization_name"], ["asc"]));
      props.onChange(res[0].id);
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
            {item.id} | {item.organization_name}
          </Option>
        );
      })}
    </Select>
  );
};

export default React.memo(DepartmentTseh);
