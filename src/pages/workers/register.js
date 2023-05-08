import React, { useEffect, useState } from "react";
import * as API from "src/api/registerEmpl";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import _, { rest } from "lodash";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";
import { useUserContext } from "src/contexts/userContext";
import Swal from "sweetalert2";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import MODAL from "src/pages/workers/modal";
import MODALTRANSFER from "src/pages/workers/modaltransfer";
import MODAL_ATT from "src/pages/workers/modal_att";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { MultiSelect } from "primereact/multiselect";

import { Spin, Input, Modal, InputNumber, Checkbox } from "antd";
import moment from "moment";
import * as XLSX from "xlsx";

const List = () => {
  const { user, message, checkRole, checkGroup } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();
  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
    representative: { value: null, matchMode: FilterMatchMode.IN },
  });

  // const [first, set_first] = useState(0);
  // const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  // const [isDialog, setIsDialog] = useState(false);
  // const [selected, setSelected] = useState(null);
  // const [indeterminate, setIndeterminate] = useState(false);
  // const [checkAll, setCheckAll] = useState(false);
  const [draw, setDraw] = useState(0);
  const [cnt, setCnt] = useState([]);

  useEffect(() => {
    if (state.department !== null) {
      setLoading(true);
      API.getWorkers({
        department_id: state.department,
        lesson_id: state.lesson.id,
      })
        .then((res) => {
          // res.list,
          // res.limit,

          dispatch({
            type: "STATE",
            data: {
              lesson: res.lesson,
              list_typeworker: _.map(res.list, (item) => {
                return item.tn;
              }),
            },
          });

          setList(_.orderBy(res.list, ["department_code"]));
        })
        .catch((error) =>
          message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
        )
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.department, state.date]);

  const headerTemplate = (data) => {
    return (
      <React.Fragment>
        {/* <img
          alt={data.representative.tseh_name}
          // src={`https://primefaces.org/cdn/primereact/images/avatar/${data.representative.image}`}
          width="32"
          style={{ verticalAlign: "middle" }}
          className="ml-2"
        /> */}
        <span className="vertical-align-middle ml-2 font-bold line-height-3">
          {data.tseh_name} - {data.negj_name} | (
          {calculateCustomerTotal(data.negj_name)} ажилтан)
        </span>
      </React.Fragment>
    );
  };

  const calculateCustomerTotal = (name) => {
    let total = 0;

    if (list) {
      for (let customer of list) {
        if (customer.negj_name === name) {
          total++;
        }
      }
    }
    return total;
  };

  const exportToExcel = (list) => {
    let Heading = [
      [
        "№",
        "Бүтцийн нэгж",
        "Нэгж",
        "БД",
        "Овог нэр",
        "Албан тушаал",
        "Давтан эсэх",
        "Шалгалтын дүн",
        "Тэнцсэн эсэх",
      ],
    ];
    var result = _.map(list, (a, i) => {
      return {
        i: i + 1,
        tseh: a.tseh_name,
        negj: a.negj_name,
        tn: a.tn,
        name: a.short_name,
        pos: a.position_name,
        repeat: a.is_repeat ? "Тийм" : "Үгүй",
        dun: a.point,
        is_success: a.is_success ? "Тийм" : "Тэнцээгүй",
      };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: "A1" });
    XLSX.utils.sheet_add_json(worksheet, result, {
      origin: "A2",
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(
      workbook,
      "Сургалт_" + user.tn + " " + moment().format("YYYY_MM_сар") + ".xlsx",
      {
        compression: true,
      }
    );
  };
  // const getRepeat = (status) => {
  //   // eslint-disable-next-line default-case
  //   switch (status) {
  //     case "false":
  //       return "danger";

  //     case "true":
  //       return "success";
  //   }
  // };

  // const getSeverity = (status) => {
  //   switch (status) {
  //     case "unqualified":
  //       return "danger";

  //     case "qualified":
  //       return "success";

  //     case "new":
  //       return "info";

  //     case "negotiation":
  //       return "warning";

  //     case "renewal":
  //       return null;
  //   }
  // };
  const ss = (list) => {
    var result = [];

    _.map(list, (item) => {
      _.map(item.attendance, (data) => {
        data.checked && result.push(data.checked);
      });
    });

    return result.length;
  };
  const representatives = [
    { name: "true", image: "amyelsner.png" },
    { name: "false", image: "annafali.png" },
  ];
  const representativeFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={options.value}
        options={representatives}
        itemTemplate={representativesItemTemplate}
        onChange={(e) => {
          console.log(e.value);
          options.filterCallback(e.value.name);
        }}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
      />
    );
  };
  const representativesItemTemplate = (option) => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{option.name}</span>
      </div>
    );
  };

  return (
    <div className="p-2 rounded text-xs max-h-[calc(100vh-250px)] overflow-auto">
      <Modal
        width={800}
        height={600}
        visible={state.modal}
        // visible={true}
        onCancel={() => dispatch({ type: "STATE", data: { modal: false } })}
        title={"Сургалтанд суух ажилтан бүртгэл"}
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <MODAL />
      </Modal>

      <Modal
        width={800}
        height={600}
        visible={state.modal_att}
        // visible={true}
        onCancel={() => dispatch({ type: "STATE", data: { modal_att: false } })}
        title={"Ирц бүртгэл"}
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <MODAL_ATT />
      </Modal>

      <Modal
        width={800}
        height={600}
        visible={state.modaltransfer}
        // visible={true}
        onCancel={() =>
          dispatch({ type: "STATE", data: { modaltransfer: false } })
        }
        title={"Ажилтны сургалт шилжүүлэх"}
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <MODALTRANSFER />
      </Modal>
      <Spin tip="Уншиж байна" className="bg-opacity-80" spinning={loading}>
        <DataTable
          value={list}
          filters={search}
          className="table-xs text-xs"
          size="small"
          responsiveLayout="scroll"
          rowHover
          rowGroupMode="subheader"
          footerColumnGroup={
            <ColumnGroup>
              <Row>
                <Column
                  footer="Нийт ажилтнууд:"
                  footerStyle={{ textAlign: "right" }}
                />
                <Column colSpan={6} footer={list.length} />
                <Column
                  colSpan={6}
                  footer={"Ирц: " + list.length + "/" + ss(list)}
                />
              </Row>
            </ColumnGroup>
          }
          groupRowsBy={state.department === 0 ? "tseh_name" : "negj_name"}
          sortMode="single"
          sortField="tseh_name"
          sortOrder={1}
          expandableRowGroups
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowGroupHeaderTemplate={headerTemplate}
          // rowGroupFooterTemplate={footerTemplate}
          scrollable
          height={window.innerHeight - 800}
          globalFilterFields={["tn", "short_name", "position_name"]}
          header={
            <div className="flex items-center justify-between  text-xs">
              <div>
                <Input.Search
                  className="md:w-80"
                  placeholder="Хайх..."
                  value={search.global.value}
                  onChange={(e) => {
                    let _search = { ...search };
                    _search["global"].value = e.target.value;
                    setSearch(_search);
                    dispatch({ type: "STATE", data: { tn: null } });
                  }}
                />
              </div>

              <div className="flex items-center gap-3">
                {checkRole(["register_attendance_crud"]) && (
                  <div
                    title="Ирц бүртгэх"
                    className="p-1 flex items-center justify-center font-semibold text-green-500 border-2 border-green-500 rounded-full hover:bg-green-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer mr-1"
                    onClick={() => {
                      dispatch({ type: "CLEAR" });
                      dispatch({
                        type: "STATE",
                        data: { list_checked: [] },
                      });
                      dispatch({ type: "STATE", data: { modal_att: true } });
                    }}
                  >
                    <i className="ft-log-in text-sm" />
                    <i className="ft-plus" />
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  {checkGroup([173, 306, 307, 378, 386, 387]) ? (
                    <>
                      <i className="ft-users text-lg" />
                      <div
                        title="Нэмэх"
                        className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer mr-1"
                        onClick={() => {
                          dispatch({ type: "CLEAR" });
                          dispatch({
                            type: "STATE",
                            data: { list_checked: [] },
                          });
                          dispatch({ type: "STATE", data: { modal: true } });
                        }}
                      >
                        {state.lesson.limit}/{state.lesson.count_register}{" "}
                        <i className="ft-plus" />
                      </div>
                    </>
                  ) : state.lesson.limit - state.lesson.count_register > 0 ? (
                    <div
                      title="Нэмэх"
                      className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer mr-1"
                      onClick={() => {
                        dispatch({ type: "CLEAR" });
                        dispatch({
                          type: "STATE",
                          data: { list_checked: [] },
                        });
                        dispatch({ type: "STATE", data: { modal: true } });
                      }}
                    >
                      <i className="ft-users" /> {state.lesson.limit}/
                      {state.lesson.count_register} <i className="ft-plus" />
                    </div>
                  ) : (
                    <div
                      title="Нэмэх"
                      className="p-1 flex items-center justify-center font-semibold text-red-500 border-2 border-red-500 rounded-full hover:bg-red-500 hover:text-white hover:scale-125 focus:outline-none duration-300"
                    >
                      <i className="ft-user-check" /> {state.lesson.limit}/
                      {state.lesson.count_register}
                    </div>
                  )}
                </div>
                {/* )} */}

                <img
                  alt=""
                  title="Excel татах"
                  src="/img/excel.png"
                  className="w-8 h-6 object-cover cursor-pointer hover:scale-125 duration-300"
                  onClick={() => exportToExcel(list)}
                />
              </div>
            </div>
          }
        >
          <Column
            header="№"
            align="center"
            className="text-xs border"
            body={(data, row) => row.rowIndex + 1}
            style={{ minWidth: "40px", maxWidth: "40px" }}
          />
          <Column
            field="tn"
            header="БД"
            className=" text-xs border"
            style={{ minWidth: "100px", maxWidth: "100px" }}
          />
          <Column
            field="short_name"
            className=" text-xs border"
            header="Овог нэр"
            style={{ minWidth: "150px", maxWidth: "150px" }}
          />
          <Column
            field="position_name"
            className=" text-xs border"
            header="Албан тушаал"
          />

          <Column
            field="status"
            header="Ирц"
            sortOrder
            className=" text-xs border"
            style={{ minWidth: "250px", maxWidth: "250px" }}
            body={(data) => {
              return (
                <div className="flex  items-left gap-2 text-xs">
                  {_.map(data.attendance, (item) =>
                    checkRole(["register_attendance_crud"]) ? (
                      <Checkbox
                        key={item.id}
                        checked={item.checked}
                        onChange={
                          (e) => {
                            var result = list;

                            var index = _.findIndex(result, {
                              id: data.id,
                            });
                            var index1 = _.findIndex(result[index].attendance, {
                              id: item.id,
                            });

                            result[index].attendance[index1].checked =
                              e.target.checked;

                            setList(result);
                            setDraw(draw + 1);

                            API.postAttendance({
                              attendance_id: item.id,
                              checked: e.target.checked,
                              register_id: data.id,
                            });
                          }
                          // check_position(e, item)
                        }
                      >
                        <span className="text-xs">
                          {item.checked ? (
                            <>
                              <i className="ft-user-check text-xl text-green-600" />
                              -
                            </>
                          ) : (
                            <>
                              <i className="ft-user-x text-xl text-red-600" />-
                            </>
                          )}{" "}
                          {moment(item.attendance_date).format(
                            "YYYY.MM.DD HH:mm"
                          )}
                        </span>
                      </Checkbox>
                    ) : item.checked ? (
                      <i className="ft-user-check text-xl text-green-600" />
                    ) : (
                      <i className="ft-user-x text-xl text-red-600  " />
                    )
                  )}
                </div>
              );
            }}
          />

          <Column
            field="is_repeat"
            header="Давтан эсэх"
            align="center"
            style={{ minWidth: "100px", maxWidth: "100px" }}
            className="text-xs border"
            body={(item) => {
              return checkRole(["register_repeat_crud"]) ? (
                <Checkbox
                  key={item.id}
                  checked={item.is_repeat}
                  onChange={
                    (e) => {
                      var result = list;
                      var index = _.findIndex(list, { id: item.id });
                      result[index].is_repeat = e.target.checked;

                      setList(result);
                      setDraw(draw + 1);

                      API.putWorker(item.id, {
                        is_repeat: e.target.checked,
                        point: _.toInteger(item.point),
                      });
                    }
                    // check_position(e, item)
                  }
                />
              ) : item.is_repeat ? (
                <span className="border p-1 pl-3 pr-3 bg-orange-100 border-red-400 text-red-500">
                  Тийм
                </span>
              ) : (
                ""
              );
            }}
          />

          <Column
            field="point"
            header="Шалгалтын оноо"
            align="center"
            style={{ minWidth: "100px", maxWidth: "100px" }}
            className=" text-xs border"
            body={(data, row) => {
              return checkRole(["register_point_crud"]) ? (
                <InputNumber
                  max={state?.lesson?.point}
                  align="center"
                  value={data.point}
                  onChange={(value) => {
                    var result = list;
                    var index = _.findIndex(list, { id: data.id });
                    result[index].point = value;

                    dispatch({
                      type: "STATE",
                      data: { list: result },
                    });
                  }}
                  onPressEnter={(e) => {
                    if (e.key === "Enter") {
                      API.putWorker(data.id, {
                        is_repeat: data.is_repeat,
                        point:
                          e.target.value === null
                            ? null
                            : _.toInteger(e.target.value),
                      }).then(() => {
                        dispatch({
                          type: "STATE",
                          data: { refresh: state.refresh + 1 },
                        });
                        message({
                          type: "success",
                          title: "Амжилттай хадгалагдлаа",
                        });
                      });
                    }
                  }}
                  onBlur={(e) => {
                    // API.postEmployeeSize({
                    //   tn: data.tn,
                    //   height: e.target.value,
                    // });
                  }}
                />
              ) : (
                data.point
              );
            }}
          />
          <Column
            field="status"
            header="Шалгалтын хувь"
            align="center"
            className=" text-xs border"
            style={{ minWidth: "100px", maxWidth: "100px" }}
            body={(data) => {
              return (
                Math.round((data.point * 100) / state.lesson.point, 2) + "%"
              );
            }}
          />
          <Column
            field="is_success"
            header="Тэнцсэн эсэх"
            align="center"
            filter
            filterField="representative"
            filterElement={representativeFilterTemplate}
            className=" text-xs border"
            style={{ minWidth: "100px", maxWidth: "100px" }}
            body={(data) => {
              var result = "";
              if (data.is_success !== null)
                result = data.is_success ? (
                  <i className="ft-check-circle text-2xl text-green-600" />
                ) : (
                  <i className="ft-x text-base text-red-600 border-red-600 border rounded-full pl-1 pr-1" />
                );
              else result = "";

              return result;
            }}
          />
          <Column
            align="center"
            header="Үйлдэл"
            className=" text-xs border"
            style={{ minWidth: "100px", maxWidth: "100px" }}
            body={(item) => {
              return (
                <div className="flex items-center justify-center gap-2">
                  {checkRole(["type_delete"]) && (
                    <button
                      className="p-1 flex items-center justify-center font-semibold text-red-500 rounded-full border-2 border-red-500 hover:bg-red-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                      onClick={() => {
                        Swal.fire({
                          text: item.short_name + "-г сургалтаас хасах уу",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#1890ff",
                          cancelButtonColor: "rgb(244, 106, 106)",
                          confirmButtonText: "Тийм",
                          cancelButtonText: "Үгүй",
                          reverseButtons: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            API.deleteWorker(item.id)
                              .then(() => {
                                dispatch({
                                  type: "STATE",
                                  data: { refresh: state.refresh + 1 },
                                });

                                message({
                                  type: "success",
                                  title: "Амжилттай устгагдлаа..",
                                });
                              })
                              .catch((error) => {
                                message({
                                  type: "error",
                                  error,
                                  title: "Ажилтны хасах чадсангүй",
                                });
                              });
                          }
                        });
                      }}
                    >
                      <i className="ft-trash-2" />
                    </button>
                  )}
                </div>
              );
            }}
          />
        </DataTable>
      </Spin>
    </div>
  );
};

export default React.memo(List);
