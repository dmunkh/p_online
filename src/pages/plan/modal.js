import React, { useState, useEffect } from "react";
import * as API from "src/api/plan";
import { Select, InputNumber } from "antd";
// import Swal from "sweetalert2";
import { useUserContext } from "src/contexts/userContext";
import { usePlanContext } from "src/contexts/planContext";
import Module from "src/components/custom/module";
import _ from "lodash";

import moment from "moment";
// import _ from "lodash";

const { Option } = Select;

const ModalNormDetail = () => {
  const { message } = useUserContext();
  const [module, setModule] = useState(null);
  const { state, dispatch } = usePlanContext();
  const [list, setList] = useState([]);

  // const { state, dispatch } = useUserContext();
  // useEffect(() => {
  //   API.postPlanApprove({ module_id: 1 })
  //     .then((res) => {
  //       setList(_.orderBy(res, ["type_name"]));
  //     })
  //     .catch((error) =>
  //       message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
  //     )
  //     .finally(() => {});

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.refresh, state.department]);

  return (
    <div className="flex flex-col text-xs">
      <hr className="my-2" />
      <div className="flex items-center">
        <Module
          value={state.moduleid}
          onChange={(value) =>
            dispatch({ type: "STATE", data: { moduleid: value } })
          }
        />
        {/* <Select
          className="w-2/3"
          placeholder="Сонгоно уу."
          optionFilterProp="children"
          value={state.modaltypeid}
          onChange={(value) => {
            dispatch({ type: "STATE", data: { modaltypeid: value } });
          }}
        >
          {_.map(list, (item) => {
            return (
              <Option key={item.id} value={item.id}>
                {item.type_name}
              </Option>
            );
          })}
        </Select> */}
      </div>
      <hr className="my-2" />
      <button
        className="w-full py-2 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-md hover:bg-violet-500 hover:text-white focus:outline-none duration-300 "
        onClick={() => {
          API.postPlanApprove({
            module_id: state.moduleid,
            year: moment(state.date).format("Y"),
            is_closed: 1,
            department_id: state.department_id,
          })
            .then((res) => {
              dispatch({ type: "STATE", data: { modal: false } });
              message({
                type: "success",
                title: "Уншлаа",
              });
            })
            .catch((error) =>
              message({
                type: "error",
                error,
                title: "Жагсаалт татаж чадсангүй",
              })
            )
            .finally(() => {});
        }}
      >
        <i className="fa fa-save" />
        <span className="ml-2">Хадгалах</span>
      </button>
    </div>
  );
};
export default React.memo(ModalNormDetail);
