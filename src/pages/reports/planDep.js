import React, { useLayoutEffect, useState, useEffect } from "react";
import { useUserContext } from "src/contexts/userContext";
import Header from "src/pages/reports/header";
import { useTrainingContext } from "src/contexts/trainingContext";
import { Spin, Input } from "antd";
import moment from "moment";
import * as API from "src/api/training";

import { Modal } from "antd";
import _ from "lodash";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Row } from "primereact/row";
import ColumnGroup from "antd/lib/table/ColumnGroup";

const PlanDep = () => {
  const { message } = useUserContext();
  const [loading] = useState(false);
  const { state, dispatch } = useTrainingContext();
  const [list, setList] = useState([]);
  const [sum, setSum] = useState(0);

  const [print_modal, setPrint_modal] = useState(false);

  useLayoutEffect(() => {
    if (state.change_year && state.moduleid) {
      API.getReportPlanDep({
        year: moment(state.change_year).format("YYYY"),
        module_id: state.moduleid,
      })
        .then((res) => {
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
          dispatch({
            type: "STATE",
            data: {
              list_lessType: _.orderBy(res, ["type_id"]),
            },
          });
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
  }, [state.change_year, state.moduleid]);

  useEffect(() => {
    let result = [];
    let sumCount = 0;

    if (state.list_reportplandep.length > 0 && state.list_lessType.length > 0) {
      _.map(state.list_reportplandep, (item) => {
        _.map(item.data, (data) => {
          item["col" + data.type_id] = data.count;
          sumCount += data.count;
        });
        result.push(item);
      });
    }
    setList(result);
    setSum(sumCount);
  }, [state.list_reportplandep, state.list_lessType]);

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
                    style={{
                      minWidth: "100px",
                      maxWidth: "100px",
                      width: "100px",
                    }}
                    className="text-xs "
                    align="center"
                    footer={_.sumBy(list, "col" + item.type_id)}
                  />
                );
              })}
              <Column
                sortable
                style={{ minWidth: "100px", maxWidth: "100px", width: "100px" }}
                className="text-xs "
                align="center"
                footer={sum}
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
              header={item.type_name}
              field={"col" + item.type_id}
              style={{ minWidth: "100px", maxWidth: "100px", width: "100px" }}
              className="text-xs "
              align="center"
              body={(data) => {
                var result = data["col" + item.type_id];
                return result !== 0 ? result : "";
              }}
            />
          );
        })}
        <Column
          sortable
          header="Нийт"
          style={{ minWidth: "100px", maxWidth: "100px", width: "100px" }}
          className="text-xs "
          align="center"
          body={(data) => {
            var result = 0;
            _.map(state.list_lessType, (item) => {
              result += data["col" + item.type_id];
            });
            return result !== 0 ? (
              <span className="font-bold"> {result} </span>
            ) : (
              ""
            );
          }}
        />
      </DataTable>

      <Modal
        centered
        title={<div className="text-center">Тайлан</div>}
        closeIcon="x"
        visible={print_modal}
        onCancel={() => setPrint_modal(false)}
        footer={null}
        width={1024}
      >
        <Spin
          tip="Уншиж байна."
          className="min-h-full bg-gray-300"
          spinning={loading}
        >
          <iframe
            title="PDF"
            frameBorder={0}
            id="ReportViewer"
            style={{
              width: "100%",
              height: window.innerWidth < 500 ? "450px" : "740px",
            }}
          />
        </Spin>
      </Modal>
    </div>
  );
};

export default React.memo(PlanDep);
