import React, { useState, useEffect, useRef } from "react";
import * as API from "src/api/registerEmpl";
import * as REQ from "src/api/request";
import { InputSwitch } from "primereact/inputswitch";
import { Switch, Spin, Select, InputNumber } from "antd";
import { Image } from "primereact/image";
// import Swal from "sweetalert2";
import { useUserContext } from "src/contexts/userContext";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";
import DepartmentTseh from "src/components/custom/departmentTseh";
import Department from "src/pages/workers/department";
import DepartmentPlan from "src/pages/workers/departmentPlan";
import _ from "lodash";
import moment from "moment";
import { isNullOrUndef } from "chart.js/dist/helpers/helpers.core";

const Modal_att = () => {
  const { message, checkGroup } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();
  const [checked, setChecked] = useState(false);
  const [loadingbtn, setLoadingbtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [worker, setWorker] = useState();
  const { Option } = Select;
  const ref = useRef(null);

  // const { state, dispatch } = useUserContext();

  useEffect(() => {
    setLoading(true);
    API.getAtt({
      lesson_id: 1,
    })
      .then((res) => {
        setList(res);
      })
      .catch((error) =>
        message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
      )
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.department_id, state.date, state.moduleid, state.refresh]);

  const check_worker = (e) => {
    ref.current.focus();

    REQ.getWorkerTn({
      tn: e,
    })
      .then((res) => {
        setWorker(res);
      })
      .catch((error) =>
        message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
      )
      .finally(() => {
        setLoading(false);
      });
  };

  const PlanApprove = (id, ischecked) => {
    setLoadingbtn(false);
  };
  return (
    <div className="flex flex-col text-xs">
      <hr className="my-2" />
      <div className="flex items-center">
        <span className="w-1/6 font-semibold">
          Ирц:<b className="ml-1 text-red-500">*</b>
        </span>
        <Select
          showSearch
          allowClear
          placeholder="Сонгоно уу."
          optionFilterProp="children"
          className="w-full"
          // value={}
        >
          {_.map(list, (item) => {
            return (
              <Option key={item.id} value={item.id}>
                {moment(item.attendance_date).format("YYYY.MM.DD HH:mm")}
              </Option>
            );
          })}
        </Select>
      </div>
      <hr className="my-2" />
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
      <div className="flex items-center">
        <span className="w-1/6 font-semibold">
          Карт уншуулах:<b className="ml-1 text-red-500">*</b>
        </span>
        <InputNumber
          ref={ref}
          id="message"
          name="message"
          className="w-full"
          // value={val}
          onPressEnter={(e) => check_worker(e.target.value)}
        ></InputNumber>
      </div>
      <hr className="my-2" />
      <div className="w-full min-h-[150px] flex border rounded-2xl">
        {state.list && (
          <div className="w-1/4 flex flex-col items-center justify-center gap-2 font-semibold rounded-l-2xl text-center">
            <Image
              className="p-2 flex rounded-2xl"
              src={
                "https://minio-action.erdenetmc.mn/emp/" + worker?.tn + ".jpg"
              }
              alt="Image"
              width="80"
              height="60"
            />
          </div>
        )}
        {state.list && (
          <div className="w-3/4 border-l rounded-r-2xl">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-1 text-center text-sm  w-12" colSpan={2}>
                    Ажилтны мэдээлэл
                  </th>
                </tr>
              </thead>

              <tbody className="p-5">
                <tr>
                  <td className="p-2 text-left border text-gray-600 font-bold">
                    БД:
                  </td>
                  <td className="p-2 text-left border font-bold">
                    {worker?.tn}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 text-left border text-gray-600 font-bold">
                    Овог нэр:
                  </td>
                  <td className="p-2 left-center text-black font-bold border">
                    {worker?.shortname}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 text-left border text-gray-600 font-bold">
                    Цех:
                  </td>
                  <td className="p-2 text-left b text-black font-bold border ">
                    {worker?.tseh_namemn}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 text-left border text-gray-600 font-bold">
                    Албан тушаал
                  </td>
                  <td className="p-2 t text-black text-left font-bold border">
                    {worker?.position_namemn}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default React.memo(Modal_att);
