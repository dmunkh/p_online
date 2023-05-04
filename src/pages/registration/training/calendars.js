import React, { useLayoutEffect, useMemo, useState } from "react";
import { useUserContext } from "src/contexts/userContext";
import { useTrainingContext } from "src/contexts/trainingContext";
import Header from "src/pages/registration/training/header";
import * as API from "src/api/training";
import _ from "lodash";
import { Spin, Badge, Calendar } from "antd";
import Swal from "sweetalert2";
import moment from "moment";
import dayjs from "dayjs";

const Calendars = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useTrainingContext();
  const [value, setValue] = useState(() => dayjs("2017-01-25"));
  const [loading, setLoading] = useState(false);
  // const getListData = (value) => {
  //   let listData;
  //   switch (value.date()) {
  //     case 1:
  //       listData = [
  //         {
  //           type: "warning",
  //           content: "This is warning event.",
  //         },
  //         {
  //           type: "success",
  //           content: "This is usual event.",
  //         },
  //       ];
  //       break;
  //     case 2:
  //       listData = [
  //         {
  //           type: "warning",
  //           content: "This is warning event.",
  //         },
  //         {
  //           type: "success",
  //           content: "This is usual event.",
  //         },
  //         {
  //           type: "error",
  //           content: "This is error event.",
  //         },
  //       ];
  //       break;
  //     case 15:
  //       listData = [
  //         {
  //           type: "warning",
  //           content: "This is warning event",
  //         },
  //         {
  //           type: "success",
  //           content: "This is very long usual event。。....",
  //         },
  //         {
  //           type: "error",
  //           content: "This is error event 1.",
  //         },
  //         {
  //           type: "error",
  //           content: "This is error event 2.",
  //         },
  //         {
  //           type: "error",
  //           content: "This is error event 3.",
  //         },
  //         {
  //           type: "error",
  //           content: "This is error event 4.",
  //         },
  //       ];
  //       break;
  //     default:
  //   }
  //   return listData || [];
  // };
  // const getMonthData = (value) => {
  //   if (value.month() === 5) {
  //     return 1394;
  //   }
  // };
  // жагсаалт
  useLayoutEffect(() => {
    setLoading(true);
    state.module_id &&
      API.getLesson({
        year: state.change_year,
        module_id: state.module_id,
      })
        .then((res) => {
          dispatch({
            type: "STATE",
            data: {
              list_training: _.orderBy(res, ["id"]),
            },
          });
        })
        .catch((error) => {
          dispatch({
            type: "STATE",
            data: {
              list_training: [],
            },
          });
          message({
            type: "error",
            error,
            title: "Сургалтын төрөл жагсаалт татаж чадсангүй",
          });
        })
        .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.change_year, state.module_id]);

  // const monthCellRender = (value) => {
  //   const num = getMonthData(value);
  //   return num ? (
  //     <div className="notes-month">
  //       <section>{num}</section>
  //       <span>Backlog number</span>
  //     </div>
  //   ) : null;
  // };

  // const dateCellRender = (value) => {
  //   const listData = getListData(value);
  //   return (
  //     <ul className="events">
  //       {listData.map((item) => (
  //         <li key={item.content}>
  //           <Badge status={item.type} text={item.content} />
  //         </li>
  //       ))}
  //     </ul>
  //   );
  // };

  // const cellRender = (current, info) => {
  //   console.log("current, info: ", current, info);
  //   if (info.type === "date") return dateCellRender(current);
  //   if (info.type === "month") return monthCellRender(current);
  //   return info.originNode;
  // };

  const onPanelChange = (newValue) => {
    setValue(newValue);
    console.log("newValue: ", newValue);
  };
  const memo_calendar = useMemo(() => {
    return (
      <div className="flex  gap-5 p-4">
        <div className="w-1/6 ">
          <div id="external-events">
            <h4 className="mt-2">Сургалтын төрөл</h4>
            <div className="fc-events-container">
              <div
                className="fc-event"
                data-color="#975AFF"
                style={{
                  backgroundColor: "rgb(151, 90, 255)",
                  borderColor: "rgb(151, 90, 255)",
                }}
              >
                All Day Event
              </div>
              <div
                className="fc-event"
                data-color="#40C057"
                style={{
                  backgroundColor: "rgb(64, 192, 87)",
                  borderColor: "rgb(64, 192, 87)",
                }}
              >
                Long Event
              </div>
              <div
                className="fc-event"
                data-color="#2F8BE6"
                style={{
                  backgroundColor: "rgb(47, 139, 230)",
                  borderColor: "rgb(47, 139, 230)",
                }}
              >
                Meeting
              </div>
              <div
                className="fc-event"
                data-color="#F77E17"
                style={{
                  backgroundColor: "rgb(247, 126, 23)",
                  borderColor: "rgb(247, 126, 23)",
                }}
              >
                Birthday party
              </div>
              <div
                className="fc-event"
                data-color="#F55252"
                style={{
                  backgroundColor: "rgb(245, 82, 82)",
                  borderColor: "rgb(245, 82, 82)",
                }}
              >
                Lunch
              </div>
              <div
                className="fc-event"
                data-color="#FCC173"
                style={{
                  backgroundColor: "rgb(252, 193, 115)",
                  borderColor: "rgb(252, 193, 115)",
                }}
              >
                Conference Meeting
              </div>
              <div
                className="fc-event"
                data-color="#465375"
                style={{
                  backgroundColor: "rgb(70, 83, 117)",
                  borderColor: "rgb(70, 83, 117)",
                }}
              >
                Party
              </div>
              <div
                className="fc-event"
                data-color="#BDBDBD"
                style={{
                  backgroundColor: "rgb(189, 189, 189)",
                  borderColor: "rgb(189, 189, 189)",
                }}
              >
                Happy Hour
              </div>
              <div className="checkbox mb-2">
                <input type="checkbox" id="drop-remove" />
                <label htmlFor="drop-remove">
                  <span>Remove after drop</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="w-5/6">
          <div
            id="fc-external-drag"
            className="fc fc-ltr fc-unthemed"
            style={{}}
          >
            <Calendar
              mode="month"
              value={state.begin_date}
              //onPanelChange={onPanelChange}
              dateCellRender={(date) => {
                console.log("object", date.format("D"));
                const list = state.list_training.filter(
                  (el) =>
                    moment(el.begin_date).format("YYYY.MM.DD") ===
                    moment(date).format("YYYY.MM.DD")
                );
                return (
                  <ul className="events">
                    <i className="pi pi-check"></i>
                    {list.map((item) => {
                      return (
                        <li key={item.id} className="text-xs">
                          <Badge
                            className="text-[10px] font-semibold border-b py-1"
                            status={item.id}
                            text={item.type_name}
                          />
                        </li>

                        // <div
                        //   key={index}
                        //   className="text-[10px] font-semibold border-b py-1"
                        // >
                        //   {item.type_name}
                        // </div>
                      );
                    })}
                  </ul>
                );
              }}
            />
          </div>
        </div>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.list_training]);

  return (
    <div className="">
      <div className=" ">{memo_calendar}</div>
    </div>
  );
};
export default React.memo(Calendars);
