import React, { useEffect, useState } from "react";
import * as API from "src/api/registerEmpl";
import { Spin } from "antd";
import _ from "lodash";
// import { FilterMatchMode } from "primereact/api";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";

import { useUserContext } from "src/contexts/userContext";
import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import moment from "moment";

const List = () => {
  const navigate = useNavigate();
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();
  // const [search, setSearch] = useState({
  //   global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  // });
  // const [first, set_first] = useState(0);
  // const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    // dispatch({
    //   type: "STATE",
    //   data: { loading: true },
    // });
    setLoading(true);
    API.getLesson({
      department_id: state.department,
    })
      .then((res) => {
        // var result = [];
        // _.map(_.orderBy(res, ["id"]), (item) => {
        //   result.push({
        //     id: item.id,
        //     title: item.type_name,

        //     start: getDate(item.begin_date) + " 16:00:00",
        //     //   end: getDate(item.end_date),
        //   });
        // });
        setList(res);
      })
      .catch((error) =>
        message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
      )
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.department, state.date]);

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
    <div className="row">
      <div className="col-12">
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
                    {_.map(list, (item) => {
                      console.log(item);
                      return (
                        <div
                          key={item.id}
                          className="list-group-item  hover:bg-[#dedbf1] cursor-pointer"
                          onClick={(value) => {
                            navigate("/worker/register/worker?id=" + item.id);
                            console.log("partner");
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
                                  {item.hour}
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

                    {/* <div
                    className="list-group-item cursor-pointer"
                    onClick={(value) => {
                      console.log("partner");
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
                          Нийт ажилтны сургалт
                          <span className="font-small-2 float-right grey darken-1">
                            2023-04-23
                          </span>
                        </h4>
                        <p className="list-group-item-text grey darken-2 m-0">
                          <i className="ft-check primary font-small-2 mr-1"></i>
                          <span>Суудлын тоо: 100/60</span>
                          <span className="float-right primary">
                            <i className="font-medium-1 icon-pin"></i>
                          </span>
                        </p>
                      </div>
                    </div>
                  </div> */}
                  </div>
                </Spin>
              </div>
              {/* <div classNameName="media">
                <div classNameName="media-body text-left">
                  <h3 classNameName="mb-1 primary">ХЭМАБ</h3>
                  <span classNameName="ft-calendar"> 2023-04-23</span>
                  <br></br>
                  <span>
                    Өргөх, зөөх, тээвэрлэх механизмтай харьцаж ажиллах аюулгүй
                    ажиллагааны сургалт
                  </span>
                  <br></br>
                  <span classNameName="ft-user"> 100/68</span>
                </div>
                <div classNameName="media-right align-self-center">
                  <i classNameName="ft-book-open primary font-large-2 float-right"></i>
                </div>
              </div> */}
              {/* <div classNameName="progress" style={{ height: "4px" }}>
                <div
                  classNameName="progress-bar bg-primary"
                  role="progressbar"
                  aria-valuenow="80"
                  aria-valuemin="80"
                  aria-valuemax="100"
                  style={{ width: "80%" }}
                ></div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* <div classNameName="col-xl-3 col-lg-6 col-12">
        <div classNameName="card" style={divStyles}>
          <div classNameName="card-content">
            <div classNameName="card-body">
              <div classNameName="media">
                <div classNameName="media-body text-left">
                  <h3 classNameName="mb-1 primary">278</h3>
                  <span>New Posts</span>
                </div>
                <div classNameName="media-right align-self-center">
                  <i classNameName="ft-book-open primary font-large-2 float-right"></i>
                </div>
              </div>
              <div classNameName="progress" style={{ height: "4px" }}>
                <div
                  classNameName="progress-bar bg-primary"
                  role="progressbar"
                  aria-valuenow="80"
                  aria-valuemin="80"
                  aria-valuemax="100"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default React.memo(List);
