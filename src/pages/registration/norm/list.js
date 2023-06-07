import React, { useState, useMemo, useLayoutEffect } from "react";
import { useUserContext } from "src/contexts/userContext";
import { useNormContext } from "src/contexts/normContext";
import * as API from "src/api/norm";
import { Spin, Input, Checkbox, Row, Tooltip } from "antd";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import Header from "./header";
import ColumnGroup from "antd/lib/table/ColumnGroup";

const List = () => {
  const { message} = useUserContext();
  const { state, dispatch } = useNormContext();
  const [checkAll, setCheckAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [indeterminate, setIndeterminate] = useState(false);

  const [draw, setdraw] = useState(1);

  // жагсаалт
  useLayoutEffect(() => {
    API.getPosition({
      department_id: state.department,
    })
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_position: _.orderBy(res, ["departmentcode", "ordern"]),
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: "STATE",
          data: {
            list_position: [],
          },
        });
        message({
          type: "error",
          error,
          title: "Сургалтын төрөл жагсаалт татаж чадсангүй",
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.department]);

  // const deleteItem = (item) => {
  //   Swal.fire({
  //     text: "Устгахдаа итгэлтэй байна уу?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#1890ff",
  //     cancelButtonColor: "rgb(244, 106, 106)",
  //     confirmButtonText: "Тийм",
  //     cancelButtonText: "Үгүй",
  //     reverseButtons: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // API.deleteLessonTypeID(item.id)
  //       //   .then(() => {
  //       //     message({
  //       //       type: "success",
  //       //       title: "Амжилттай устгагдлаа",
  //       //     });
  //       //     dispatch({ type: "STATE", data: { refresh: state.refresh + 1 } });
  //       //   })
  //       //   .catch((error) => {
  //       //     message({
  //       //       type: "error",
  //       //       error,
  //       //       title: "Сургалтын төрөл устгаж чадсангүй",
  //       //     });
  //       //   });
  //       // message({
  //       //   type: "error",
  //       //   title: "Амжилттай устгагдлаа",
  //       // });
  //     }
  //   });
  // };
  // const updateItem = (item) => {
  //   // API.getLessonTypeID(item.id)
  //   //   .then((res) => {
  //   //     dispatch({
  //   //       type: "SET_TYPE",
  //   //       data: {
  //   //         id: res.id,
  //   //         module_id: res.module_id,
  //   //         interval_id: res.interval_id,
  //   //         type_name: res.type_name,
  //   //         price_emc: res.price_emc,
  //   //         price_organization: res.price_organization,
  //   //         hour: res.hour,
  //   //         description: res.description,
  //   //         interval_name: res.interval_name,
  //   //         time: res.time,
  //   //       },
  //   //     });
  //   //     dispatch({
  //   //       type: "STATE",
  //   //       data: { modal: true },
  //   //     });
  //   //     //loadItemTypeList(res.itemtypeid);
  //   //   })
  //   //   .catch((error) => {
  //   //     message({
  //   //       type: "error",
  //   //       error,
  //   //       title: "Мэдээлэл татаж чадсангүй.",
  //   //     });
  //   //     dispatch({
  //   //       type: "CLEAR",
  //   //     });
  //   //   });
  // };
  const check_position = (e, item) => {
    var result = state.checked_positionList;

    if (e.target.checked) {
      dispatch({
        type: "STATE",
        data: { selectedpositionname: item.positionname },
      });
      result.push({
        departmentid: item.departmentid,
        positionid: item.positionid,
        positionname: item.positionname,
      });
    } else {
      dispatch({
        type: "STATE",
        data: { selectedpositionname: [] },
      });
      result = _.reject(
        state.checked_positionList,
        (a) =>
          a.departmentid === item.departmentid &&
          a.positionid === item.positionid
      );
    }

    dispatch({
      type: "CHECKED_POSITIONLIST",
      data: result,
    });
    dispatch({
      type: "REFRESH_NORM",
    });

    result.length > 1 &&
      dispatch({
        type: "STATE",
        data: { list_norm: [], selectedpositionname: null },
      });
    setdraw((prev) => prev + 1);
  };

  const memo_table = useMemo(() => {
    var result = state.list_position;

    if (state.checkNoNorm) result = _.filter(result, (a) => a.normcount === 0);

    if (search) {
      result = _.filter(
        result,
        (a) =>
          _.includes(_.toLower(a.positionratename), _.toLower(search)) ||
          _.includes(_.toLower(a.positionname), _.toLower(search)) ||
          _.includes(_.toLower(a.workercount), _.toLower(search)) ||
          _.includes(_.toLower(a.workercount), _.toLower(search)) ||
          _.includes(_.toLower(a.normcount), _.toLower(search))
      );
    }

    return (
      <DataTable
        scrollable
        dataKey="id"
        size="small"
        stripedRows
        showGridlines
        className="text-xs"
        sortMode="single"
        removableSort
        scrollHeight={window.innerHeight - 265}
        responsiveLayout="scroll"
        value={result}
        rowGroupMode="subheader"
        groupRowsBy="departmentcode"
        header={
          <div className="flex items-center justify-between">
            <div className="w-full md:max-w-[300px]">
              <Input
                placeholder="Хайх..."
                prefix={<SearchOutlined />}
                className="w-full rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 ">
              <Checkbox
                className="font-semibold text-xs whitespace-nowrap"
                checked={state.checkNoNorm}
                onChange={(e) => {
                  dispatch({
                    type: "CLEAR",
                  });
                  dispatch({
                    type: "NONORM",
                    data: e.target.checked,
                  });

                  setCheckAll(false);
                }}
              >
                Нормгүй а/т:
              </Checkbox>
              <img
                alt=""
                title="Excel татах"
                src="/assets/images/excel.png"
                className="w-6 h-6 object-cover cursor-pointer hover:scale-125 duration-300"
                // onClick={() => exportToExcel(result)}
              />
              {/* <img
                    alt=""
                    title="Pdf татах"
                    src="/assets/images/pdf.png"
                    className="w-6 h-6 object-cover cursor-pointer hover:scale-125 duration-300"
                    onClick={() => exportToPdf()}
                  /> */}
            </div>
          </div>
        }
        rowClassName={(data) => {
          var result = " ";
          var check = _.find(state.checked_positionList, {
            positionid: data.positionid,
            departmentid: data.departmentid,
          });
          if (check) result += "bg-blue-500 text-white";
          return result;
        }}
        emptyMessage={
          <div className="text-xs text-orange-500 italic font-semibold">
            Мэдээлэл олдсонгүй...
          </div>
        }
        rowGroupHeaderTemplate={(data) => {
          return (
            <React.Fragment>
              <span className="text-xs font-semibold">
                <span>{data.departmentcode}</span> |
                <span className="ml-1">{data.departmentname}</span>
              </span>
            </React.Fragment>
          );
        }}
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
                              Object.entries(
                                _.groupBy(result, "positionratename")
                              ),
                              (item, index) => {
                                return (
                                  <div key={index} className="">
                                    <span>
                                      {item[0] === "null"
                                        ? "Тодорхойгүй"
                                        : item[0]}
                                    </span>
                                    - <span>{item[1].length}</span>,
                                    {" Нормын тоо: "}
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
      >
        <Column
          align="center"
          header={
            <Checkbox
              indeterminate={indeterminate}
              onChange={(e) => {
                var list = [];
                var result = [];
                if (state.checkNoNorm)
                  list = _.filter(
                    state.list_Position,
                    (a) => a.normcount === 0
                  );
                else list = state.list_Position;
                if (!checkAll) {
                  list.forEach((p) =>
                    result.push({
                      departmentid: p.departmentid,
                      positionid: p.positionid,
                      positionname: p.positionname,
                    })
                  );
                }
                dispatch({
                  type: "CHECKED_POSITIONLIST",
                  data: result,
                });
                setCheckAll(e.target.checked);

                setIndeterminate(false);
                setdraw((prev) => prev + 1);
              }}
              checked={checkAll}
            />
          }
          style={{ minWidth: "50px", maxWidth: "50px" }}
          className="text-xs w-[50px]"
          body={(item) => {
            var checked = false;

            var aa = _.find(state.checked_positionList, {
              departmentid: item.departmentid,
              positionid: item.positionid,
              positionname: item.positionname,
            });

            if (aa !== undefined) checked = true;

            return (
              <Checkbox
                key={item.id}
                checked={checked}
                onChange={(e) => check_position(e, item)}
              />
            );
          }}
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
        />

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
          header="Албан тушаалын нэр"
          field="positionname"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-start text-left"
          body={(item) => {
            var str = item.positionname;
            if (item.positioncats !== "-")
              str += "  (" + item.positioncats + ")";
            return (
              <span
                className="text-brown-500 cursor-pointer"
                onClick={() => {
                  dispatch({
                    type: "STATE",
                    data: { selectedpositionname: item.positionname },
                  });
                  API.getPositionNormList({
                    department_id: item.departmentid,
                    position_id: item.positionid,
                  })
                    .then((res) => {
                      dispatch({
                        type: "STATE",
                        data: {
                          list_norm: _.orderBy(res, ["itemtypeid", "itemname"]),
                        },
                      });
                    })
                    .catch((error) => {
                      dispatch({ type: "STATE", data: { list_norm: [] } });
                      message({
                        type: "error",
                        error,
                        title: "Албан тушаалын нормын мэдээлэл татаж чадсангүй",
                      });
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                }}
              >
                {str}
              </span>
            );
          }}
        />
        <Column
          sortable
          // align="center"
          header="Албан тушаалын ангилал"
          field="positionratename"
          style={{ minWidth: "150px", maxWidth: "150px" }}
          className="text-xs"
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-start"
        />
        <Column
          sortable
          align="center"
          header="Ажилтны тоо"
          field="workercount"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          className="text-xs"
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
        />
        <Column
          sortable
          align="center"
          header="Нормын тоо"
          field="normcount"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          className="text-xs"
          body={(item) => {
            return (
              <span
                className={item.normcount === 0 ? "text-red-500 font-bold" : ""}
              >
                {item.normcount}
              </span>
            );
          }}
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
        />
      </DataTable>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.list_position,
    state.checkNoNorm,
    search,
    state.checked_positionList,
    draw,
    checkAll,
    state.refresh,
  ]);

  return (
    <>
      <div className="card flex p-2 border rounded text-xs">
        <div className="flex flex-col rounded">
          <Header />
          <div className="card flex justify-center text-xs rounded p-2">
            <Spin
              tip="Уншиж байна."
              className="min-h-full first-line:bg-opacity-80"
              spinning={loading}
            >
              {memo_table}
            </Spin>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(List);
