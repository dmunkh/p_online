import React, { useLayoutEffect, useState } from "react";
import * as API from "src/api/request";
import _ from "lodash";
import { Select } from "antd";
import { useUserContext } from "src/contexts/userContext";
import { usePlanContext } from "src/contexts/planContext";

const Company = (props) => {
  const { state, dispatch } = usePlanContext();
  const { user, checkGroup } = useUserContext();
  const [list, setList] = useState([]);
  const { Option } = Select;

  return (
    <Select
      showSearch
      allowClear
      placeholder="Сонгоно уу."
      optionFilterProp="children"
      className="w-full"
      {...props}
    >
      {_.map(state?.company?.list, (item) => (
        <Select.Option key={item.sub_code} value={item.sub_code}>
          {item.id + " - " + item.company_ner + " - " + item.sub_code}
        </Select.Option>
      ))}
    </Select>
  );
};

export default React.memo(Company);
