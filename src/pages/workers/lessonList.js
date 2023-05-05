import React, { useEffect, useState } from "react";
import * as API from "src/api/registerEmpl";
import { Spin } from "antd";
import _ from "lodash";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";
import { useUserContext } from "src/contexts/userContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";
// import { FilterMatchMode } from "primereact/api";
// import Swal from "sweetalert2";
// import moment from "moment";

const List = () => {
  const navigate = useNavigate();
  const { message } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    state.moduletypeid &&
      API.getLesson({
        year: moment(state.date).format("Y"),
        module_id: state.moduletypeid,
      })
        .then((res) => {
          dispatch({ type: "STATE", data: { lessonlist: res } });
          dispatch({ type: "STATE", data: { lessonlistfilter: res } });
        })
        .catch((error) =>
          message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
        )
        .finally(() => {
          setLoading(false);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.department, state.date, state.moduletypeid]);

  // function getDate(dayString) {
  //   const today = new Date();
  //   const year = today.getFullYear().toString();
  //   let month = (today.getMonth() + 1).toString();

  //   if (month.length === 1) {
  //     month = "0" + month;
  //   }

  //   return dayString.replace("YEAR", year).replace("MONTH", month);
  // }

  const divStyles = {
    boxShadow: "1px 2px 9px #F4AAB9",
    margin: "10px",
    padding: "10px",
  };
  return (
    <div className="card" style={divStyles}>
      <div className="card-content">
        <div className="card-body" style={{ padding: "3px" }}>
          <div id="users-list" className="list-group">
            <Spin
              tip="Уншиж байна."
              className="bg-opacity-80"
              spinning={loading}
            >
              <div className="users-list-padding position-relative ps ps--active-y  ">
                {_.map(state.lessonlistfilter, (item) => {
                  return (
                    <div
                      key={"main_" + item.id}
                      className="list-group-item  hover:bg-[#dedbf1] cursor-pointer"
                      onClick={() => {
                        dispatch({
                          type: "STATE",
                          data: {
                            lesson: item,
                          },
                        });
                      }}
                    >
                      <div className="media align-items-center py-1">
                        <span className="avatar avatar-md mr-2">
                          <img src="/img/safety_round.png" alt="Avatar" />
                          <span className="avatar-status-online"></span>
                          <i></i>
                        </span>
                        <div className="media-body">
                          <h4 className="list-group-item-heading mb-1">
                            {item.type_name}
                            <span className="font-small-2 float-right grey darken-1">
                              {item.begin_date} - {item.end_date}
                            </span>
                          </h4>
                          <p className="list-group-item-text grey darken-2 m-0">
                            <i className="ft-check primary font-small-2 mr-1"></i>
                            <span>
                              <i className="ft-users"></i> Суудлын тоо:{" "}
                              {item.limit}/{item.count_register},{" "}
                              <i className="ft-clock "></i> Сургалтын цаг:{" "}
                              {item.hour},{" "}
                              <span className="text-blue-900 !important">
                                {" "}
                                <i className="ft-edit text-blue-800 bg-blend-color-dodge "></i>{" "}
                              </span>
                              Ирцийн бүртгэл: {item.hour}
                            </span>
                            <span className="float-right primary">
                              <i className="font-medium-1 icon-pin"></i>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Spin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(List);
