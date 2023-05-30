import React, { useLayoutEffect, useState } from "react";
import * as API from "src/api/request";
import _ from "lodash";
import { Select } from "antd";

const LessTypeYear = (props) => {
  const [list, setList] = useState([]);
  const { Option } = Select;

  useLayoutEffect(() => {
    // API.getTypesYear({ module_id: _.toInteger(props.module_id) }).then(
    //   (res) => {
    //     setList(res);

    //     if (res.length > 0 && !props.value) props.onChange(res[0].type_id);
    //   }
    // );
    props.module_id &&
      API.getTypesYear({ module_id: props.module_id, year: props.year }).then(
        (res) => {
          setList(_.orderBy(res, ["id"]));

          //if (res.length > 0 && !props.value) props.onChange(res[0].id);
        }
      );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.module_id, props.year]);

  return (
    <div>
      <Select
        showSearch
        className="w-full"
        placeholder="Сонгоно уу."
        optionFilterProp="children"
        style={{ minWidth: 450 }}
        {...props}
      >
        {_.map(list, (item) => {
          return (
            <Option key={item.id} value={item.id}>
              {item.id} | {item.type_name}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};

export default React.memo(LessTypeYear);
