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

const Modal_att = () => {
  const { message, checkGroup } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const { Option } = Select;

  const ref = useRef(null);

  const [card, setCard] = useState({
    modal: false,
    list_attendace: [],
    attendance: null,
    tn: null,
    info: null,
  });

  // const { state, dispatch } = useUserContext();

  useEffect(() => {
    setLoading(true);
    API.getAtt({
      lesson_id: state.lessonid,
    })
      .then((res) => {
        setCard({ ...card, list_attendace: res });
      })
      .catch((error) =>
        message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
      )
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.department_id, state.date, state.moduleid, state.refresh]);

  const check_worker = (tn) => {
    setCard({ ...card, tn: tn });
    ref.current.focus();

    REQ.getWorkerTn({
      tn: tn,
    })
      .then((res) => {
        setCard({ ...card, info: res });

        API.postAttendanceCard({
          lesson_id: state.lessonid,
          attendance_id: card.attendance,
          tn: tn,
        })
          .then((res) => {
            dispatch({ type: "STATE", data: { refresh: state.refresh + 1 } });
            setCard({ ...card, info: null, tn: null });
          })
          .catch((error) =>
            message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
          )
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((error) => {
        message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" });
        setCard({ ...card, info: null });
      })
      .finally(() => {
        setLoading(false);
      });
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
          onChange={(value) => setCard({ ...card, attendance: value })}
          value={card.attendance}
        >
          {_.map(card.list_attendace, (item) => {
            return (
              <Option key={item.id} value={item.id}>
                {moment(item.attendance_date).format("YYYY.MM.DD HH:mm")}
              </Option>
            );
          })}
        </Select>
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
          value={card.tn}
          onPressEnter={(e) => check_worker(e.target.value)}
        ></InputNumber>
      </div>
      <hr className="my-2" />
      <div className="w-full min-h-[150px] flex border rounded-2xl">
        <div className="w-1/4 flex flex-col items-center justify-center gap-2 font-semibold rounded-l-2xl text-center">
          <Image
            className="p-2 flex rounded-2xl"
            src={
              "https://minio-action.erdenetmc.mn/emp/" + card.info?.tn + ".jpg"
            }
            alt="Image"
            width="80"
            height="60"
          />
        </div>

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
                  {card.info?.tn}
                </td>
              </tr>
              <tr>
                <td className="p-2 text-left border text-gray-600 font-bold">
                  Овог нэр:
                </td>
                <td className="p-2 left-center text-black font-bold border">
                  {card.info?.shortname}
                </td>
              </tr>
              <tr>
                <td className="p-2 text-left border text-gray-600 font-bold">
                  Цех:
                </td>
                <td className="p-2 text-left b text-black font-bold border ">
                  {card.info?.tseh_namemn}
                </td>
              </tr>
              <tr>
                <td className="p-2 text-left border text-gray-600 font-bold">
                  Албан тушаал
                </td>
                <td className="p-2 t text-black text-left font-bold border">
                  {card.info?.position_namemn}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default React.memo(Modal_att);
