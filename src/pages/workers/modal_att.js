import React, { useState, useEffect, useRef } from "react";
import * as API from "src/api/registerEmpl";
import * as REQ from "src/api/request";
import { Select, InputNumber } from "antd";
import { Image } from "primereact/image";
import Swal from "sweetalert2";
import { useUserContext } from "src/contexts/userContext";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";
import _ from "lodash";
import moment from "moment";

const Modal_att = () => {
  const { message } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();
  const [loading, setLoading] = useState(false);
  const { Option } = Select;

  const ref = useRef(null);

  const [card, setCard] = useState({
    list_attendace: [],
    attendance: null,
    tn: null,
    info: null,
  });

  // const { state, dispatch } = useUserContext();

  useEffect(() => {
    API.getAtt({
      lesson_id: state.lesson.id,
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
  }, []);

  useEffect(() => {
    if (!state.modal_att) {
      setCard({
        ...card,
        attendance: null,
        tn: null,
        info: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.modal_att]);

  const check_worker = (tn) => {
    setCard({ ...card, tn: tn });

    ref.current.focus();


    REQ.getWorkerTn({
      tn: tn,
    })
      .then((res) => {
        setCard({ ...card, info: res });

        API.postAttendanceCard({
          lesson_id: state.lesson.id,
          attendance_id: card.attendance,
          tn: _.toString(_.toInteger(tn)),
        })
          .then((res) => {
            dispatch({ type: "STATE", data: { refresh: state.refresh + 1 } });
            message({ type: "success", title: "Ирц бүртгэгдлээ" });
            setTimeout(() => {
              setCard({ ...card, info: null, tn: null });
            }, 1000);
          })
          .catch((error) => {
            message({
              type: "error",
              error,
              title: "Ирц бүртгэж татаж чадсангүй",
            });

            setTimeout(() => {
              setCard({ ...card, tn: null, info: null });
            }, 1000);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((error) => {
        message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" });
        setCard({ ...card, info: null, tn: null });
      })
      .finally(() => {
        // setCard({ ...card, info: null, tn: null });
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
          onChange={(value) => setCard({ ...card, tn: value })}
          onPressEnter={(e) => check_worker(e.target.value)}
        ></InputNumber>
      </div>
      <hr className="my-2" />
      {card.attendance ? (
        <div className="w-full min-h-[150px] flex border rounded-2xl">
          <div className="w-1/4 flex flex-col items-center justify-center gap-2 font-semibold rounded-l-2xl text-center">
            <Image
              className="p-2 flex rounded-2xl"
              src={
                "https://minio-action.erdenetmc.mn/emp/" +
                card.info?.tn +
                ".jpg"
              }
              onError={(e) => {
                e.target.src = "/img/user.png";
              }}
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
      ) : (
        ""
      )}
    </div>
  );
};
export default React.memo(Modal_att);
