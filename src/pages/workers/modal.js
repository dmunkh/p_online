import React, { useState } from "react";
import * as API from "src/api/registerEmpl";
import { InputSwitch } from "primereact/inputswitch";
import { Switch, Spin } from "antd";

// import Swal from "sweetalert2";
import { useUserContext } from "src/contexts/userContext";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";
import DepartmentTseh from "src/components/custom/departmentTseh";
import Department from "src/pages/workers/department";
import DepartmentPlan from "src/pages/workers/departmentPlan";
import _ from "lodash";

const ModalNormDetail = () => {
  const { message, checkGroup } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();
  const [checked, setChecked] = useState(false);
  const [loadingbtn, setLoadingbtn] = useState(false);

  // const { state, dispatch } = useUserContext();

  const PlanApprove = (id, ischecked) => {
    setLoadingbtn(false);
  };
  return (
    <div className="flex flex-col text-xs">
      {/* <hr className="my-2" /> */}
      {/* <div className="flex items-center">
        <span className="w-1/3 font-semibold">
          Бүтцийн нэгж:<b className="ml-1 text-red-500">*</b>
        </span>
        <DepartmentTseh
          value={state.department}
          onChange={(value) => {
            dispatch({ type: "STATE", data: { department: value } });
          }}
        />
      </div> */}
      {/* <hr className="my-2" /> */}
      <div className="flex justify-end">
        {/* <InputSwitch
          checked={checked}
          onChange={(e) => {
            setChecked(e.value);
            dispatch({ type: "STATE", data: { change_btn: checked } });
          }}
        >
          Нийт
        </InputSwitch> */}
        <Spin tip="." className="bg-opacity-80" spinning={loadingbtn}>
          <Switch
            className="bg-green-300"
            checkedChildren={
              <span className="text-blue-500 "> Нийт ажилтнууд</span>
            }
            unCheckedChildren={
              <span className="text-blue-500 "> Төлөвлөгөөт ажилтнууд </span>
            }
            checked={checked}
            onChange={(value) => {
              dispatch({ type: "STATE", data: { list_checked: [] } });
              setChecked(value);
              setLoadingbtn(true);
              PlanApprove(value);
            }}
          />
        </Spin>
      </div>

      <hr className="my-2" />
      {checked ? <Department /> : <DepartmentPlan />}

      <hr className="my-2" />
      {checkGroup([173, 306, 307, 378, 386, 387]) ? (
        <button
          className="w-full py-2 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-md hover:bg-violet-500 hover:text-white focus:outline-none duration-300 "
          onClick={() => {
            API.postWorker({
              lesson_id: state.lesson.id,
              tns: _.join(state.list_checked, ","),
            })
              .then((res) => {
                dispatch({
                  type: "STATE",
                  data: { refresh: state.refresh + 1 },
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
      ) : state.limit_count - state.list_count - state.list_checked.length <
        0 ? (
        <span className="text-red-500">"Бүртгэх ажилтны лимит хэтэрлээ"</span>
      ) : (
        <button
          className="w-full py-2 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-md hover:bg-violet-500 hover:text-white focus:outline-none duration-300 "
          onClick={() => {
            API.postWorker({
              lesson_id: state.lesson.id,
              tns: _.join(state.list_checked, ","),
            })
              .then((res) => {
                dispatch({
                  type: "STATE",
                  data: { refresh: state.refresh + 1 },
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
      )}
    </div>
  );
};
export default React.memo(ModalNormDetail);
