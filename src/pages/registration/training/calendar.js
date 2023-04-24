import React, { useLayoutEffect, useMemo, useState } from "react";
import { useUserContext } from "../../../contexts/userContext";
import { useTrainingContext } from "../../../contexts/trainingContext";
import Header from "src/pages/registration/training/header";
import * as API from "src/api/training";
import _ from "lodash";
import { Spin } from "antd";
import Swal from "sweetalert2";

const Calendar = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useTrainingContext();

  const [loading, setLoading] = useState(false);

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
            <div className="fc-toolbar fc-header-toolbar">
              <div className="fc-left">
                <div className="fc-button-group pb-1">
                  <button
                    type="button"
                    className="fc-prev-button fc-button fc-button-primary"
                    aria-label="prev"
                  >
                    <span className="fc-icon fc-icon-chevron-left" />
                  </button>
                  <button
                    type="button"
                    className="fc-next-button fc-button fc-button-primary"
                    aria-label="next"
                  >
                    <span className="fc-icon fc-icon-chevron-right" />
                  </button>
                </div>
                <button
                  type="button"
                  className="fc-today-button fc-button fc-button-primary"
                >
                  Өнөөдөр
                </button>
              </div>
              <div className="fc-center">
                <h2>October 2019</h2>
              </div>
              <div className="fc-right">
                <div className="fc-button-group">
                  <button
                    type="button"
                    className="fc-dayGridMonth-button fc-button fc-button-primary fc-button-active"
                  >
                    Сар
                  </button>
                  <button
                    type="button"
                    className="fc-timeGridWeek-button fc-button fc-button-primary"
                  >
                    Жил
                  </button>
                </div>
              </div>
            </div>
            <div className="fc-view-container">
              <div
                className="fc-view fc-dayGridMonth-view fc-dayGrid-view"
                style={{}}
              >
                <table className>
                  <thead className="fc-head">
                    <tr>
                      <td className="fc-head-container fc-widget-header">
                        <div className="fc-row fc-widget-header">
                          <table className>
                            <thead>
                              <tr>
                                <th className="fc-day-header fc-widget-header fc-sun">
                                  <span>Sun</span>
                                </th>
                                <th className="fc-day-header fc-widget-header fc-mon">
                                  <span>Mon</span>
                                </th>
                                <th className="fc-day-header fc-widget-header fc-tue">
                                  <span>Tue</span>
                                </th>
                                <th className="fc-day-header fc-widget-header fc-wed">
                                  <span>Wed</span>
                                </th>
                                <th className="fc-day-header fc-widget-header fc-thu">
                                  <span>Thu</span>
                                </th>
                                <th className="fc-day-header fc-widget-header fc-fri">
                                  <span>Fri</span>
                                </th>
                                <th className="fc-day-header fc-widget-header fc-sat">
                                  <span>Sat</span>
                                </th>
                              </tr>
                            </thead>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </thead>
                  <tbody className="fc-body">
                    <tr>
                      <td className="fc-widget-content">
                        <div
                          className="fc-scroller fc-day-grid-container"
                          style={{ overflow: "hidden", height: "936.5px" }}
                        >
                          <div className="fc-day-grid">
                            <div
                              className="fc-row fc-week fc-widget-content"
                              style={{ height: 156 }}
                            >
                              <div className="fc-bg">
                                <table className>
                                  <tbody>
                                    <tr>
                                      <td
                                        className="fc-day fc-widget-content fc-sun fc-other-month fc-past"
                                        data-date="2019-09-29"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-mon fc-other-month fc-past"
                                        data-date="2019-09-30"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-tue fc-past"
                                        data-date="2019-10-01"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-wed fc-past"
                                        data-date="2019-10-02"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-thu fc-past"
                                        data-date="2019-10-03"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-fri fc-past"
                                        data-date="2019-10-04"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-sat fc-past"
                                        data-date="2019-10-05"
                                      />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="fc-content-skeleton">
                                <table>
                                  <thead>
                                    <tr>
                                      <td
                                        className="fc-day-top fc-sun fc-other-month fc-past"
                                        data-date="2019-09-29"
                                      >
                                        <span className="fc-day-number">
                                          29
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-mon fc-other-month fc-past"
                                        data-date="2019-09-30"
                                      >
                                        <span className="fc-day-number">
                                          30
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-tue fc-past"
                                        data-date="2019-10-01"
                                      >
                                        <span className="fc-day-number">1</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-wed fc-past"
                                        data-date="2019-10-02"
                                      >
                                        <span className="fc-day-number">2</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-thu fc-past"
                                        data-date="2019-10-03"
                                      >
                                        <span className="fc-day-number">3</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-fri fc-past"
                                        data-date="2019-10-04"
                                      >
                                        <span className="fc-day-number">4</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-sat fc-past"
                                        data-date="2019-10-05"
                                      >
                                        <span className="fc-day-number">5</span>
                                      </td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td />
                                      <td />
                                      <td className="fc-event-container">
                                        <a
                                          href="/"
                                          className="fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-draggable fc-resizable"
                                          style={{
                                            backgroundColor: "#975AFF",
                                            borderColor: "#975AFF",
                                          }}
                                        >
                                          <div className="fc-content">
                                            {" "}
                                            <span className="fc-title">
                                              All Day Event
                                            </span>
                                          </div>
                                          <div className="fc-resizer fc-end-resizer" />
                                        </a>
                                      </td>
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className="fc-row fc-week fc-widget-content"
                              style={{ height: 156 }}
                            >
                              <div className="fc-bg">
                                <table className>
                                  <tbody>
                                    <tr>
                                      <td
                                        className="fc-day fc-widget-content fc-sun fc-past"
                                        data-date="2019-10-06"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-mon fc-past"
                                        data-date="2019-10-07"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-tue fc-past"
                                        data-date="2019-10-08"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-wed fc-past"
                                        data-date="2019-10-09"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-thu fc-past"
                                        data-date="2019-10-10"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-fri fc-past"
                                        data-date="2019-10-11"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-sat fc-past"
                                        data-date="2019-10-12"
                                      />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="fc-content-skeleton">
                                <table>
                                  <thead>
                                    <tr>
                                      <td
                                        className="fc-day-top fc-sun fc-past"
                                        data-date="2019-10-06"
                                      >
                                        <span className="fc-day-number">6</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-mon fc-past"
                                        data-date="2019-10-07"
                                      >
                                        <span className="fc-day-number">7</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-tue fc-past"
                                        data-date="2019-10-08"
                                      >
                                        <span className="fc-day-number">8</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-wed fc-past"
                                        data-date="2019-10-09"
                                      >
                                        <span className="fc-day-number">9</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-thu fc-past"
                                        data-date="2019-10-10"
                                      >
                                        <span className="fc-day-number">
                                          10
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-fri fc-past"
                                        data-date="2019-10-11"
                                      >
                                        <span className="fc-day-number">
                                          11
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-sat fc-past"
                                        data-date="2019-10-12"
                                      >
                                        <span className="fc-day-number">
                                          12
                                        </span>
                                      </td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td rowSpan={3} />
                                      <td
                                        className="fc-event-container"
                                        colSpan={3}
                                      >
                                        <a
                                          href="/"
                                          className="fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-draggable fc-resizable"
                                          style={{
                                            backgroundColor: "#40C057",
                                            borderColor: "#40C057",
                                          }}
                                        >
                                          <div className="fc-content">
                                            {" "}
                                            <span className="fc-title">
                                              Long Event
                                            </span>
                                          </div>
                                          <div className="fc-resizer fc-end-resizer" />
                                        </a>
                                      </td>
                                      <td rowSpan={3} />
                                      <td
                                        className="fc-event-container"
                                        colSpan={2}
                                      >
                                        <a
                                          href="/"
                                          className="fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-draggable fc-resizable"
                                          style={{
                                            backgroundColor: "#FCC173",
                                            borderColor: "#FCC173",
                                          }}
                                        >
                                          <div className="fc-content">
                                            {" "}
                                            <span className="fc-title">
                                              Conference Meeting
                                            </span>
                                          </div>
                                          <div className="fc-resizer fc-end-resizer" />
                                        </a>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td rowSpan={2} />
                                      <td rowSpan={2} />
                                      <td
                                        className="fc-event-container"
                                        rowSpan={2}
                                      >
                                        <a
                                          href="/"
                                          className="fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-draggable"
                                          style={{
                                            backgroundColor: "#2F8BE6",
                                            borderColor: "#2F8BE6",
                                          }}
                                        >
                                          <div className="fc-content">
                                            <span className="fc-time">4p</span>{" "}
                                            <span className="fc-title">
                                              Meeting
                                            </span>
                                          </div>
                                        </a>
                                      </td>
                                      <td rowSpan={2} />
                                      <td className="fc-event-container">
                                        <a
                                          href="/"
                                          className="fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-draggable"
                                          style={{
                                            backgroundColor: "#2F8BE6",
                                            borderColor: "#2F8BE6",
                                          }}
                                        >
                                          <div className="fc-content">
                                            <span className="fc-time">
                                              10:30a
                                            </span>{" "}
                                            <span className="fc-title">
                                              Meeting
                                            </span>
                                          </div>
                                        </a>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="fc-event-container">
                                        <a
                                          href="/"
                                          className="fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-draggable"
                                          style={{
                                            backgroundColor: "#465375",
                                            borderColor: "#465375",
                                          }}
                                        >
                                          <div className="fc-content">
                                            <span className="fc-time">8p</span>{" "}
                                            <span className="fc-title">
                                              Party
                                            </span>
                                          </div>
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className="fc-row fc-week fc-widget-content"
                              style={{ height: 156 }}
                            >
                              <div className="fc-bg">
                                <table className>
                                  <tbody>
                                    <tr>
                                      <td
                                        className="fc-day fc-widget-content fc-sun fc-past"
                                        data-date="2019-10-13"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-mon fc-past"
                                        data-date="2019-10-14"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-tue fc-past"
                                        data-date="2019-10-15"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-wed fc-past"
                                        data-date="2019-10-16"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-thu fc-past"
                                        data-date="2019-10-17"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-fri fc-past"
                                        data-date="2019-10-18"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-sat fc-past"
                                        data-date="2019-10-19"
                                      />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="fc-content-skeleton">
                                <table>
                                  <thead>
                                    <tr>
                                      <td
                                        className="fc-day-top fc-sun fc-past"
                                        data-date="2019-10-13"
                                      >
                                        <span className="fc-day-number">
                                          13
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-mon fc-past"
                                        data-date="2019-10-14"
                                      >
                                        <span className="fc-day-number">
                                          14
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-tue fc-past"
                                        data-date="2019-10-15"
                                      >
                                        <span className="fc-day-number">
                                          15
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-wed fc-past"
                                        data-date="2019-10-16"
                                      >
                                        <span className="fc-day-number">
                                          16
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-thu fc-past"
                                        data-date="2019-10-17"
                                      >
                                        <span className="fc-day-number">
                                          17
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-fri fc-past"
                                        data-date="2019-10-18"
                                      >
                                        <span className="fc-day-number">
                                          18
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-sat fc-past"
                                        data-date="2019-10-19"
                                      >
                                        <span className="fc-day-number">
                                          19
                                        </span>
                                      </td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="fc-event-container">
                                        <a
                                          href="/"
                                          className="fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-draggable"
                                          style={{
                                            backgroundColor: "#F77E17",
                                            borderColor: "#F77E17",
                                          }}
                                        >
                                          <div className="fc-content">
                                            <span className="fc-time">7a</span>{" "}
                                            <span className="fc-title">
                                              Birthday Party
                                            </span>
                                          </div>
                                        </a>
                                      </td>
                                      <td />
                                      <td />
                                      <td className="fc-event-container">
                                        <a
                                          href="/"
                                          className="fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-draggable"
                                          style={{
                                            backgroundColor: "#BDBDBD",
                                            borderColor: "#BDBDBD",
                                          }}
                                        >
                                          <div className="fc-content">
                                            <span className="fc-time">4p</span>{" "}
                                            <span className="fc-title">
                                              Happy Hour
                                            </span>
                                          </div>
                                        </a>
                                      </td>
                                      <td />
                                      <td />
                                      <td />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className="fc-row fc-week fc-widget-content"
                              style={{ height: 156 }}
                            >
                              <div className="fc-bg">
                                <table className>
                                  <tbody>
                                    <tr>
                                      <td
                                        className="fc-day fc-widget-content fc-sun fc-past"
                                        data-date="2019-10-20"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-mon fc-past"
                                        data-date="2019-10-21"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-tue fc-past"
                                        data-date="2019-10-22"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-wed fc-past"
                                        data-date="2019-10-23"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-thu fc-past"
                                        data-date="2019-10-24"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-fri fc-past"
                                        data-date="2019-10-25"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-sat fc-past"
                                        data-date="2019-10-26"
                                      />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="fc-content-skeleton">
                                <table>
                                  <thead>
                                    <tr>
                                      <td
                                        className="fc-day-top fc-sun fc-past"
                                        data-date="2019-10-20"
                                      >
                                        <span className="fc-day-number">
                                          20
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-mon fc-past"
                                        data-date="2019-10-21"
                                      >
                                        <span className="fc-day-number">
                                          21
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-tue fc-past"
                                        data-date="2019-10-22"
                                      >
                                        <span className="fc-day-number">
                                          22
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-wed fc-past"
                                        data-date="2019-10-23"
                                      >
                                        <span className="fc-day-number">
                                          23
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-thu fc-past"
                                        data-date="2019-10-24"
                                      >
                                        <span className="fc-day-number">
                                          24
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-fri fc-past"
                                        data-date="2019-10-25"
                                      >
                                        <span className="fc-day-number">
                                          25
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-sat fc-past"
                                        data-date="2019-10-26"
                                      >
                                        <span className="fc-day-number">
                                          26
                                        </span>
                                      </td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className="fc-row fc-week fc-widget-content"
                              style={{ height: 156 }}
                            >
                              <div className="fc-bg">
                                <table className>
                                  <tbody>
                                    <tr>
                                      <td
                                        className="fc-day fc-widget-content fc-sun fc-past"
                                        data-date="2019-10-27"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-mon fc-past"
                                        data-date="2019-10-28"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-tue fc-past"
                                        data-date="2019-10-29"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-wed fc-past"
                                        data-date="2019-10-30"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-thu fc-past"
                                        data-date="2019-10-31"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-fri fc-other-month fc-past"
                                        data-date="2019-11-01"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-sat fc-other-month fc-past"
                                        data-date="2019-11-02"
                                      />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="fc-content-skeleton">
                                <table>
                                  <thead>
                                    <tr>
                                      <td
                                        className="fc-day-top fc-sun fc-past"
                                        data-date="2019-10-27"
                                      >
                                        <span className="fc-day-number">
                                          27
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-mon fc-past"
                                        data-date="2019-10-28"
                                      >
                                        <span className="fc-day-number">
                                          28
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-tue fc-past"
                                        data-date="2019-10-29"
                                      >
                                        <span className="fc-day-number">
                                          29
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-wed fc-past"
                                        data-date="2019-10-30"
                                      >
                                        <span className="fc-day-number">
                                          30
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-thu fc-past"
                                        data-date="2019-10-31"
                                      >
                                        <span className="fc-day-number">
                                          31
                                        </span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-fri fc-other-month fc-past"
                                        data-date="2019-11-01"
                                      >
                                        <span className="fc-day-number">1</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-sat fc-other-month fc-past"
                                        data-date="2019-11-02"
                                      >
                                        <span className="fc-day-number">2</span>
                                      </td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td />
                                      <td className="fc-event-container">
                                        <a
                                          className="fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-draggable fc-resizable"
                                          href="http://google.com/"
                                          style={{
                                            backgroundColor: "#975AFF",
                                            borderColor: "#975AFF",
                                          }}
                                        >
                                          <div className="fc-content">
                                            {" "}
                                            <span className="fc-title">
                                              Click for Google
                                            </span>
                                          </div>
                                          <div className="fc-resizer fc-end-resizer" />
                                        </a>
                                      </td>
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div
                              className="fc-row fc-week fc-widget-content"
                              style={{ height: 156 }}
                            >
                              <div className="fc-bg">
                                <table className>
                                  <tbody>
                                    <tr>
                                      <td
                                        className="fc-day fc-widget-content fc-sun fc-other-month fc-past"
                                        data-date="2019-11-03"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-mon fc-other-month fc-past"
                                        data-date="2019-11-04"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-tue fc-other-month fc-past"
                                        data-date="2019-11-05"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-wed fc-other-month fc-past"
                                        data-date="2019-11-06"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-thu fc-other-month fc-past"
                                        data-date="2019-11-07"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-fri fc-other-month fc-past"
                                        data-date="2019-11-08"
                                      />
                                      <td
                                        className="fc-day fc-widget-content fc-sat fc-other-month fc-past"
                                        data-date="2019-11-09"
                                      />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div className="fc-content-skeleton">
                                <table>
                                  <thead>
                                    <tr>
                                      <td
                                        className="fc-day-top fc-sun fc-other-month fc-past"
                                        data-date="2019-11-03"
                                      >
                                        <span className="fc-day-number">3</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-mon fc-other-month fc-past"
                                        data-date="2019-11-04"
                                      >
                                        <span className="fc-day-number">4</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-tue fc-other-month fc-past"
                                        data-date="2019-11-05"
                                      >
                                        <span className="fc-day-number">5</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-wed fc-other-month fc-past"
                                        data-date="2019-11-06"
                                      >
                                        <span className="fc-day-number">6</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-thu fc-other-month fc-past"
                                        data-date="2019-11-07"
                                      >
                                        <span className="fc-day-number">7</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-fri fc-other-month fc-past"
                                        data-date="2019-11-08"
                                      >
                                        <span className="fc-day-number">8</span>
                                      </td>
                                      <td
                                        className="fc-day-top fc-sat fc-other-month fc-past"
                                        data-date="2019-11-09"
                                      >
                                        <span className="fc-day-number">9</span>
                                      </td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                      <td />
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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
export default React.memo(Calendar);
