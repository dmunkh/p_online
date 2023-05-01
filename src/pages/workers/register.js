import React, { useEffect, useState } from "react";
import * as API from "src/api/registerEmpl";
import { FilterMatchMode } from "primereact/api";
import _ from "lodash";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";
import { useUserContext } from "src/contexts/userContext";
import Swal from "sweetalert2";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import MODAL from "src/pages/workers/modal";
import MODALTRANSFER from "src/pages/workers/modaltransfer";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

import { Spin, Input, Modal, InputNumber, Checkbox } from "antd";
import moment from "moment";

const List = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();
  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
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

  useEffect(() => {
    setLoading(true);
    API.getWorkers({
      department_id: state.department,
      lesson_id: state.lessonid,
    })
      .then((res) => {
        setList(_.orderBy(res, ["department_code"]));
      })
      .catch((error) =>
        message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
      )
      .finally(() => {
        setLoading(false);
      });
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

  return (
    <div className="p-2 rounded text-xs">
      <Modal
        width={800}
        height={600}
        visible={state.modal}
        // visible={true}
        onCancel={() => dispatch({ type: "STATE", data: { modal: false } })}
        title={"Төлөвлөгөөт ажилтан бүртгэл"}
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <MODAL />
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
                <Column colSpan={9} footer={list.length} />
              </Row>
            </ColumnGroup>
          }
          groupRowsBy="negj_name"
          sortMode="single"
          sortField="tseh_name"
          sortOrder={1}
          expandableRowGroups
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowGroupHeaderTemplate={headerTemplate}
          // rowGroupFooterTemplate={footerTemplate}
          globalFilterFields={["tn", "short_name", "position_name"]}
          header={
            <div className="flex items-center justify-between  text-xs">
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
              <div className="flex items-center gap-3">
                {/* {checkRole(["norm_add"]) && state.position_id && ( */}
                <div className="flex items-center justify-between gap-2">
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
                    <i className="ft-plus" />
                  </div>
                </div>
                {/* )} */}
              </div>
            </div>
          }
        >
          <Column
            header="№"
            align="center"
            className="text-xs "
            body={(data, row) => row.rowIndex + 1}
            style={{ minWidth: "40px", maxWidth: "40px" }}
          />
          <Column
            field="tn"
            header="БД"
            style={{ minWidth: "100px", maxWidth: "100px" }}
          />
          <Column field="short_name" header="Овог нэр" />
          <Column field="position_name" header="Албан тушаал" />
          <Column
            field="status"
            header="Ирц"
            style={{ minWidth: "200px", maxWidth: "200px" }}
            body={(data) => {
              return (
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {_.map(data.attendance, (item) => (
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
                        {moment(item.attendance_date).format(
                          "YYYY.MM.DD HH:mm"
                        )}
                      </span>
                    </Checkbox>
                  ))}
                </div>
              );
            }}
          />
          <Column
            field="is_repeat"
            align="center"
            header="Давтан эсэх"
            style={{ minWidth: "100px", maxWidth: "100px" }}
            className="text-xs w-[100px]"
            body={(item) => {
              return (
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
              );
            }}
          />

          <Column
            field="point"
            header="Шалгалтын оноо"
            style={{ width: "150px" }}
            body={(data, row) => {
              return (
                <InputNumber
                  max={20}
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
              );
            }}
          />
          <Column
            field="status"
            header="Шалгалтын хувь"
            style={{ minWidth: "100px", maxWidth: "100px" }}
          />
          <Column
            field="is_success"
            header="Тэнцсэн эсэх"
            style={{ minWidth: "100px", maxWidth: "100px" }}
            body={(data) => {
              return data.is_success ? "Тийм" : "Үгүй";
            }}
          />
          <Column
            align="center"
            header="Үйлдэл"
            style={{ minWidth: "100px", maxWidth: "100px" }}
            body={(item) => {
              return (
                <div className="flex items-center justify-center gap-2">
                  {checkRole(["type_edit"]) && (
                    <button
                      className="p-1 flex items-center justify-center font-semibold text-green-500 rounded-full border-2 border-green-500 hover:bg-green-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                      onClick={() => {
                        dispatch({
                          type: "STATE",
                          data: { modaltransfer: true },
                        });
                      }}
                    >
                      <i className="ft-edit" />
                    </button>
                  )}

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
