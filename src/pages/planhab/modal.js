import React, { useState, useEffect } from "react";
import * as API from "src/api/planhab";
import { Select, InputNumber } from "antd";
// import Swal from "sweetalert2";
import { useUserContext } from "src/contexts/userContext";
import { usePlanHabContext } from "src/contexts/planhabContext";
import Type from "src/components/custom/type";
import _ from "lodash";

import moment from "moment";
// import _ from "lodash";

const { Option } = Select;

const ModalNormDetail = () => {
  const { message } = useUserContext();
  const { state, dispatch } = usePlanHabContext();
  const [list, setList] = useState([]);

  // const { state, dispatch } = useUserContext();

  useEffect(() => {
    API.getType({ module_id: 1 })
      .then((res) => {
        setList(_.orderBy(res, ["type_name"]));
      })
      .catch((error) =>
        message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
      )
      .finally(() => {});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.department]);

  return (
    <div className="flex flex-col text-xs">
      <hr className="my-2" />

      <div className="flex items-center">
        <span className="w-1/3 font-semibold">
          Сургалтын төрөл:<b className="ml-1 text-red-500">*</b>
        </span>
        <Type
          module_id={1}
          value={state.modaltypeid}
          onChange={(value) => {
            dispatch({ type: "STATE", data: { modaltypeid: value } });
          }}
        />
      </div>

      <hr className="my-2" />

      <button
        className="w-full py-2 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-md hover:bg-violet-500 hover:text-white focus:outline-none duration-300 "
        onClick={() => {
          console.log(
            state.modalcompany,
            state.modaldepartment,
            state.modalplancount,
            state.modalselected_department
          );
          if (state.modaltypeid !== null) {
            API.postPostNormType({
              department_id: state.department_id,
              position_id: state.position_id,
              type_id: state.modaltypeid,
            })
              .then((res) => {
                dispatch({
                  type: "STATE",
                  data: { refresh: state.refresh + 1, modaltypeid: null },
                });
              })
              .catch((error) =>
                message({
                  type: "error",
                  error,
                  title: "Хадгалж чадсангүй",
                })
              )
              .finally(() => {});
            dispatch({ type: "STATE", data: { modal: false } });
          } else {
            message({
              type: "error",

              title: "Сургалтын төрөл сонгоно уу",
            });
          }
        }}
      >
        <i className="ft-save" />
        <span className="ml-2">Хадгалах</span>
      </button>
    </div>
  );
};
export default React.memo(ModalNormDetail);
