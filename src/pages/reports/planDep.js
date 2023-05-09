import React, { useLayoutEffect, useMemo, useState } from "react";
import { useUserContext } from "src/contexts/userContext";
import Header from "src/pages/reports/header";
import { useTrainingContext } from "src/contexts/trainingContext";
import { Spin } from "antd";
import moment from "moment";
import * as API from "src/api/training";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { SearchOutlined } from "@ant-design/icons";
import { Input, Tooltip, Row, Modal } from "antd";
import _ from "lodash";
import ColumnGroup from "antd/lib/table/ColumnGroup";

const PlanDep = () => {
  const { message, checkRole } = useUserContext();
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useTrainingContext();
  const [search, setSearch] = useState("");
  const [print_modal, setPrint_modal] = useState(false);

  useLayoutEffect(() => {
    state.moduleid &&
      API.getReportPlanDep({
        year: moment(state.change_year).format("YYYY"),
        module_id: state.moduleid,
      })
        .then((res) => {
          dispatch({
            type: "STATE",
            data: {
              list_reportplandep: _.orderBy(res, ["type_id"]),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.change_year, state.moduleid]);

  const printTo = (list) => {
    setPrint_modal(true);
    var data = {
      year: moment(state.change_year).format("YYYY"),
      module_id: state.moduleid,
    };
    var url = new URL("https://localhost:44335/training/planDepartment");
    //var url = new URL("https://training.erdenetmc.mn/api/report/plan/count");

    // if (window.location.hostname === "localhost")
    //   url = new URL("https://localhost:44335/hse/plan");
    Object.keys(data).forEach((key) => url.searchParams.append(key, data[key]));
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "SSO " + localStorage.token,
      },
    })
      .then((response) => response.blob())
      .then(function (myBlob) {
        const obj_url = URL.createObjectURL(myBlob);

        const iframe = document.getElementById("ReportViewer");
        iframe.contentWindow.location.replace(obj_url);
      })
      .catch((error) => {
        message({ type: "error", error, title: "Хэвлэж чадсангүй" });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const ss = (list) => {
    var result = [];

    _.map(list, (item) => {
      _.map(item.attendance, (data) => {
        data.checked && result.push(data.checked);
      });
    });

    return result.length;
  };
  const memo_header = useMemo(() => {
    var row = [];
    var result = state.list_lessType;

    _.map(result, (i) => {
      row.push(
        <Column
          key={"key_header_" + i + 1}
          header={
            <th style={{ transform: "rotate(-90deg)" }}>
              <span>{i.type_name}</span>{" "}
            </th>
          }
          align="center"
          className="min-w-[220px] max-w-[220px] w-[220px] "
          //headerClassName=" rotate-90"
        />
      );
    });

    return row;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.list_lessType]);

  const memo_header_sub = useMemo(() => {
    var row = [];
    var result = state.list_lessType;

    _.map(result, (i) => {
      row.push(
        <Column
          key={"key_header_sub_1" + i}
          header=" то444о"
          align="center"
          className="min-w-[60px] max-w-[60px] w-[60px]"
        />
      );
    });

    return row;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.list_lessType]);

  const memo_column = useMemo(() => {
    var row = [];
    var result = state.list_reportplandep.data;

    _.map(result, (i) => {
      row.push(
        <Column
          key={"key_column_1" + i}
          header=" тоо"
          align="center"
          field={i.count}
          className="min-w-[70px] max-w-[70px] w-[70px]"
        />
      );
    });

    return row;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.list_reportplandep]);

  const memo_table = useMemo(() => {
    var result = state.list_reportplandep;

    // if (state?.type_id)
    //   result = _.filter(result, (a) => a.type_id === state.type_id);

    if (search) {
      result = _.filter(
        result,
        (a) =>
          _.includes(_.toLower(a.type_name), _.toLower(search)) ||
          _.includes(_.toLower(a.price_emc), _.toLower(search)) ||
          _.includes(_.toLower(a.price_organization), _.toLower(search)) ||
          _.includes(_.toLower(a.count_worker), _.toLower(search))
      );
    }

    return (
      <DataTable
        scrollable
        dataKey="id"
        size="small"
        stripedRows
        showGridlines
        className="w-full text-sm"
        sortMode="single"
        removableSort
        scrollHeight={window.innerHeight - 280}
        responsiveLayout="scroll"
        value={_.orderBy(result, ["type_name"])}
        header={
          <div className="flex items-center justify-between">
            <div className="w-full md:max-w-[200px]">
              <Input
                placeholder="Хайх..."
                prefix={<SearchOutlined />}
                className="w-full rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="fonticon-wrap"></div>
            <div
              className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer"
              onClick={() => printTo(result)}
            >
              {/* <img
                alt=""
                title="Excel татах"
                src="/assets/images/excel.png"
                className="w-6 h-6 object-cover cursor-pointer hover:scale-125 duration-300"
                onClick={() => exportTo(true, result)}
              /> */}
              <i className="ft-printer"></i>
            </div>
          </div>
        }
        footerColumnGroup={
          <ColumnGroup>
            <Row>
              {state.checkNoNorm && (
                <Column className="w-[50px] text-center text-xs" />
              )}
              <Column
                className="w-[50px] max-w-[50px] text-center text-xs"
                footer={result.length}
              />

              <Column
                // className="min-w-[150px]"
                style={{ minWidth: "150px" }}
                footer={() => {
                  return (
                    <div className="flex items-center justify-center">
                      <Tooltip
                        placement="top"
                        title={
                          <div className="flex flex-col gap-2 text-xs">
                            {_.map(
                              Object.entries(_.groupBy(result, "type_id")),
                              (item, index) => {
                                return (
                                  <div key={index} className="">
                                    <span>
                                      {item[0] === "null"
                                        ? "Тодорхойгүй"
                                        : item[0]}
                                    </span>
                                    - <span>{item[1].length}</span>,{"  тоо: "}
                                    <span>
                                      - {_.sumBy(item[1], (a) => a.normcount)}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        }
                      >
                        <div className="flex items-center justify-center text-blue-500 text-lg">
                          <i className="fe fe-info" />
                        </div>
                      </Tooltip>
                    </div>
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
        headerColumnGroup={
          <ColumnGroup>
            <Row>
              <Column
                header="№"
                rowSpan={1}
                className="min-w-[50px] max-w-[50px] w-[50px]"
              />
              <Column
                header="Бүтцийн нэгжийн нэр"
                rowSpan={1}
                className="min-w-[350px]"
              />

              {memo_header}
            </Row>

            {/* <Row>{memo_header_sub}</Row> */}
          </ColumnGroup>
        }
      >
        <Column
          align="center"
          style={{ minWidth: "50px", maxWidth: "50px" }}
          className="text-xs w-full"
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
          body={(data, row) => row.rowIndex + 1}
        />

        <Column
          sortable
          /// header="Бүтцийн нэгжийн нэр"
          field="departmentname"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-start "
        />
        {/* <Column
          sortable
          // header="*"
          field="departmentcode"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-end "
        /> */}

        {memo_column}
      </DataTable>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.list_reportplandep, search]);

  return (
    <div className=" card flex p-2 rounded text-xs">
      <Header />
      <div className="flex  text-xs">
        <div className="flex flex-col ">
          <div className="flex justify-center text-xs  ">
            {/* <Spin
              tip="Уншиж байна."
              className="min-h-full first-line:bg-opacity-80"
              spinning={loading}
            > */}
            {memo_table}
            {/* </Spin> */}
          </div>
        </div>
      </div>

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
