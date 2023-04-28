import React, { useState, useEffect } from "react";
import * as API from "src/api/registerEmpl";
import { Select, InputNumber } from "antd";
// import Swal from "sweetalert2";
import { useUserContext } from "src/contexts/userContext";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";
import DepartmentTseh from "src/components/custom/departmentTseh";
import Department from "src/pages/workers/department";
import _ from "lodash";

import moment from "moment";
// import _ from "lodash";

const { Option } = Select;

const ModalNormDetail = () => {
  const { message } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();
  const [list, setList] = useState([]);

  // const { state, dispatch } = useUserContext();

  return (
    <div className="flex flex-col text-xs">
      <hr className="my-2" />
      <div className="flex items-center">
        <span className="w-1/3 font-semibold">
          Бүтцийн нэгж:<b className="ml-1 text-red-500">*</b>
        </span>
        <DepartmentTseh
          value={state.department}
          onChange={(value) => {
            dispatch({ type: "STATE", data: { department: value } });
          }}
        />
      </div>
      <hr className="my-2" />

      <Department />

      <hr className="my-2" />
      <button
        className="w-full py-2 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-md hover:bg-violet-500 hover:text-white focus:outline-none duration-300 "
        onClick={() => {
          console.log(_.join(state.list_checked, ","));
          API.postWorker({
            lesson_id: state.lessonid,
            tns: _.join(state.list_checked, ","),
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
        }}
      >
        <i className="fa fa-save" />
        <span className="ml-2">Хадгалах</span>
      </button>
    </div>
  );
};
export default React.memo(ModalNormDetail);
