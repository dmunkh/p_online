import React, { useLayoutEffect, useState, useEffect } from "react";
import { useUserContext } from "src/contexts/userContext";
import Header from "src/pages/reports/header";
import { useTrainingContext } from "src/contexts/trainingContext";
import { Spin, Input } from "antd";
import moment from "moment";
import * as API from "src/api/training";

import { Modal } from "antd";
import _, { result } from "lodash";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Row } from "primereact/row";
import ColumnGroup from "antd/lib/table/ColumnGroup";

const PlanDep = () => {
  const { message } = useUserContext();
  // const [loading] = useState(false);
  const [loading, setloading] = useState(false);
  const { state, dispatch } = useTrainingContext();
  const [list, setList] = useState([]);
  const [price, setPrice] = useState({});

  const [print_modal, setPrint_modal] = useState(false);

  useLayoutEffect(() => {
    if (state.change_year && state.moduleid) {
      setloading(true);
      API.getReportPlanDep({
        year: moment(state.change_year).format("YYYY"),
        module_id: state.moduleid,
      })
        .then((res) => {
          setloading(false);

          dispatch({
            type: "STATE",
            data: {
              list_reportplandep: _.orderBy(
                _.filter(
                  res,
                  (a) =>
                    a.departmentcode !== "0102-68" &&
                    a.departmentcode !== "0102-20" &&
                    a.departmentcode !== "0102-70"
                ),
                ["type_id"]
              ),
            },
          });
        })
        .catch((error) => {
          setloading(false);
          dispatch({
            type: "STATE",
            data: {
              list_reportplandep: [],
            },
          });
          message({
            type: "error",
            error,
            title: "Тайлан татаж чадсангүй",
          });
        });

      API.getTypesYear({
        year: moment(state.change_year).format("YYYY"),
        module_id: state.moduleid,
      })
        .then((res) => {
          var result = _.orderBy(res, ["type_id"]);
          dispatch({
            type: "STATE",
            data: {
              list_lessType: result,
            },
          });
          var _price = {};
          _.map(result, (item) => {
            _price[item.type_id] = item.price_emc;
          });
          setPrice(_price);
        })
        .catch((error) => {
          dispatch({
            type: "STATE",
            data: {
              list_lessType: [],
            },
          });
          message({
            type: "error",
            error,
            title: "Тайлан татаж чадсангүй",
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.change_year, state.moduleid, state.department_id]);

  useEffect(() => {
    let result = [];

    if (state.list_reportplandep.length > 0 && state.list_lessType.length > 0) {
      _.map(state.list_reportplandep, (item) => {
        var sumCount = 0;
        var sumPrice = 0;
        _.map(item.data, (data) => {
          item["col" + data.type_id] = data.count;
          item["col" + data.type_id + "Price"] =
            data.count * price[data.type_id];
          sumCount += data.count;
          sumPrice += data.count * price[data.type_id];
        });
        item["colSumCount"] = sumCount;
        item["colSumPrice"] = sumPrice;

        result.push(item);
      });
    }
    setList(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price, state.moduleid, state.list_reportplandep, state.list_lessType]);

  // const printTo = (list) => {
  //   setPrint_modal(true);
  //   var data = {
  //     year: moment(state.change_year).format("YYYY"),
  //     module_id: state.moduleid,
  //   };
  //   var url = new URL("https://localhost:44335/training/planDepartment");
  //   //var url = new URL("https://training.erdenetmc.mn/api/report/plan/count");

  //   // if (window.location.hostname === "localhost")
  //   //   url = new URL("https://localhost:44335/hse/plan");
  //   Object.keys(data).forEach((key) => url.searchParams.append(key, data[key]));
  //   fetch(url, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "SSO " + localStorage.token,
  //     },
  //   })
  //     .then((response) => response.blob())
  //     .then(function (myBlob) {
  //       const obj_url = URL.createObjectURL(myBlob);

  //       const iframe = document.getElementById("ReportViewer");
  //       iframe.contentWindow.location.replace(obj_url);
  //     })
  //     .catch((error) => {
  //       message({ type: "error", error, title: "Хэвлэж чадсангүй" });
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  // const ss = (list) => {
  //   var result = [];

  //   _.map(list, (item) => {
  //     _.map(item.attendance, (data) => {
  //       data.checked && result.push(data.checked);
  //     });
  //   });

  //   return result.length;
  // };

  return (
    <div className=" card flex p-2 rounded text-xs">
      <Header />
      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <DataTable
          scrollable
          dataKey="id"
          size="small"
          stripedRows
          rowHover
          showGridlines
          className="w-full text-sm"
          sortMode="single"
          removableSort
          scrollHeight={window.innerHeight - 280}
          responsiveLayout="scroll"
          value={_.orderBy(list, ["type_id"])}
          // header={
          //   <div className="flex items-center justify-between">
          //     <div className="w-full md:max-w-[200px]">
          //       <Input
          //         placeholder="Хайх..."
          //         prefix={<SearchOutlined />}
          //         className="w-full rounded-lg"
          //         value={search}
          //         onChange={(e) => setSearch(e.target.value)}
          //       />
          //     </div>
          //     <div className="fonticon-wrap"></div>
          //     <div
          //       className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer"
          //       onClick={() => printTo()}
          //     >
          //       {/* <img
          //         alt=""
          //         title="Excel татах"
          //         src="/assets/images/excel.png"
          //         className="w-6 h-6 object-cover cursor-pointer hover:scale-125 duration-300"
          //         onClick={() => exportTo(true, result)}
          //       /> */}
          //       <i className="ft-printer"></i>
          //     </div>
          //   </div>
          // }
          footerColumnGroup={
            <ColumnGroup>
              <Row>
                <Column colSpan={2} />
                {_.map(state.list_lessType, (item) => {
                  return (
                    <Column
                      key={item.type_id}
                      style={{
                        minWidth: "100px",
                        maxWidth: "100px",
                        width: "100px",
                      }}
                      className="text-xs "
                      align="center"
                      footer={() => {
                        return _.sumBy(list, "col" + item.type_id);
                        // " | " +
                        // Intl.NumberFormat("en-US").format(
                        //   _.sumBy(list, "col" + item.type_id) * item.price_emc
                        // )
                      }}
                    />
                  );
                })}
                <Column
                  sortable
                  style={{
                    minWidth: "100px",
                    maxWidth: "100px",
                    width: "100px",
                  }}
                  className="text-xs "
                  align="center"
                  footer={() => {
                    return _.sumBy(list, (a) => a.colSumCount);
                  }}
                />
                <Column
                  sortable
                  style={{
                    minWidth: "100px",
                    maxWidth: "100px",
                    width: "100px",
                  }}
                  className="text-xs "
                  align="center"
                  footer={() => {
                    return Intl.NumberFormat("en-US").format(
                      _.sumBy(list, "colSumPrice")
                    );
                  }}
                />
              </Row>
            </ColumnGroup>
          }
          emptyMessage={
            <div className="text-xs text-orange-500 italic font-semibold">
              Мэдээлэл олдсонгүй...
            </div>
          }
        >
          <Column
            header="№"
            align="center"
            style={{ minWidth: "50px", maxWidth: "50px" }}
            className="text-xs w-full"
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-center justify-center"
            body={(data, row) => row.rowIndex + 1}
          />
          <Column
            header="Код"
            field="departmentcode"
            align="center"
            style={{ minWidth: "50px", maxWidth: "50px" }}
            className="text-xs w-full"
          />

          <Column
            sortable
            header="Бүтцийн нэгж"
            field="departmentname"
            style={{ minWidth: "350px" }}
            className="text-xs "
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-center justify-start "
          />
          {_.map(state.list_lessType, (item) => {
            return (
              <Column
                sortable
                key={item.type_id}
                header={
                  item.type_name +
                  " Үнэ: " +
                  Intl.NumberFormat("en-US").format(item.price_emc)
                }
                field={"col" + item.type_id}
                style={{ minWidth: "100px", maxWidth: "100px", width: "100px" }}
                className="text-xs "
                align="center"
                body={(data) => {
                  var result = data["col" + item.type_id];
                  var price = data["col" + item.type_id] * item.price_emc;

                  return result !== 0
                    ? result //+ " - " + Intl.NumberFormat("en-US").format(price)
                    : "";
                  // return item.price_emc;
                }}
              />
            );
          })}

          {/* <Column
            sortable
            header="Нийт тоо"
            style={{ minWidth: "100px", maxWidth: "100px", width: "100px" }}
            className="text-xs "
            align="center"
            body={(data) => {
              var result = 0;

              _.map(state.list_lessType, (item) => {
                result += data["col" + item.type_id];
              });

              return result !== 0 ? (
                <span className="font-bold">
                  {" "}
                  {Intl.NumberFormat("en-US").format(result)}{" "}
                </span>
              ) : (
                ""
              );
            }}
          /> */}
          <Column
            sortable
            header="Нийт тоо"
            field="colSumCount"
            style={{ minWidth: "100px", maxWidth: "100px", width: "100px" }}
            className="text-xs "
            align="center"
            body={(data) => {
              return data.colSumPrice !== 0 ? (
                <span className="font-bold">
                  {Intl.NumberFormat("en-US").format(data.colSumCount)}
                </span>
              ) : (
                ""
              );
            }}
          />
          <Column
            sortable
            header="Нийт үнэ"
            field="colSumPrice"
            style={{ minWidth: "100px", maxWidth: "100px", width: "100px" }}
            className="text-xs "
            align="center"
            body={(data) => {
              return data.colSumPrice !== 0 ? (
                <span className="font-bold">
                  {Intl.NumberFormat("en-US").format(data.colSumPrice)}
                </span>
              ) : (
                ""
              );
            }}
          />
        </DataTable>
      </Spin>
    </div>
  );
};

export default React.memo(PlanDep);
