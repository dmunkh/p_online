import React, { useEffect, useState } from "react";
import * as API from "src/api/planhab";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Modal, Input, Select } from "antd";
import _ from "lodash";
import { FilterMatchMode } from "primereact/api";
import { usePlanHabContext } from "src/contexts/planhabContext";
import MODAL from "src/pages/planhab/modal";
import { useUserContext } from "src/contexts/userContext";
import Swal from "sweetalert2";
import moment from "moment";

const List = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = usePlanHabContext();
  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // dispatch({
    //   type: "STATE",
    //   data: { loading: true },
    // });
    setLoading(true);
    API.getNormPosition({
      department_id: state.department,
    })
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_normposition: _.orderBy(
              res,
              ["departmentcode"],
              ["asc", "asc"]
            ),
          },
        });
      })
      .catch((error) =>
        message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
      )
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.department, state.date]);

  return (
    <>
      <Modal
        style={{ width: "600" }}
        width={800}
        height={550}
        visible={state.modal}
        // visible={true}
        onCancel={() => dispatch({ type: "STATE", data: { modal: false } })}
        title={"ХСБ-ний 1 ажилтан авах тоо бүртгэл"}
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <MODAL />
      </Modal>

      <div className="p-2 rounded text-xs">
        <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
          <DataTable
            size="small"
            value={state.list_normposition}
            dataKey="id"
            filters={search}
            paginator
            scrollable
            removableSort
            showGridlines
            className="table-xs"
            filterDisplay="menu"
            responsiveLayout="scroll"
            sortMode="multiple"
            rowGroupMode="subheader"
            groupRowsBy="departmentname"
            scrollHeight={window.innerHeight - 360}
            globalFilterFields={["tn", "shortname", "position_namemn"]}
            emptyMessage={
              <div className="text-xs text-orange-500 italic font-semibold">
                Мэдээлэл олдсонгүй...
              </div>
            }
            header={
              <div className="flex items-center justify-between border-b pb-2 mb-2  text-xs">
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
                  (
                  <div
                    title="Нэмэх"
                    className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer mr-1"
                    onClick={() => {
                      // dispatch({
                      //   type: "STATE",
                      //   data: { rightdrawer: true },
                      // });
                      dispatch({
                        type: "STATE",
                        data: { modal: true },
                      });
                      dispatch({
                        type: "STATE",
                        data: { modalcheck: 1 },
                      });
                      dispatch({
                        type: "STATE",
                        data: { modalselected_department: [] },
                      });
                      dispatch({
                        type: "STATE",
                        data: { modalplancount: 0 },
                      });
                      dispatch({
                        type: "STATE",
                        data: { modalcompany: null },
                      });
                    }}
                  >
                    <i className="fa fa-edit" />
                  </div>
                  )
                </div>
              </div>
            }
            rowGroupHeaderTemplate={(data) => {
              return (
                <div className="text-xs font-semibold">
                  <span className="ml-1">
                    {data.departmentcode} | {data.departmentname}
                  </span>
                </div>
              );
            }}
            rowClassName={(data) => {
              var result = "cursor-pointer";
              if (state.id === data.id) result = " bg-red-500";
              return result;
            }}
            onRowClick={(e) => {
              dispatch({
                type: "STATE",
                data: {
                  id: e.data.id,
                  position_id: e.data.positionid,
                  department_id: e.data.departmentid,
                },
              });
            }}
            rows={per_page}
            first={first}
            onPage={(event) => {
              set_first(event.first);
              set_per_page(event.rows);
            }}
            paginatorTemplate={{
              layout:
                "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
              RowsPerPageDropdown: (options) => {
                const dropdownOptions = [
                  { label: 50, value: 50 },
                  { label: 100, value: 100 },
                  { label: 200, value: 200 },
                  { label: 500, value: 500 },
                ];
                return (
                  <>
                    <span
                      className="text-xs mx-1"
                      style={{
                        color: "var(--text-color)",
                        userSelect: "none",
                      }}
                    >
                      <span className="font-semibold">Нэг хуудсанд:</span>
                    </span>
                    <Select
                      size="small"
                      showSearch={false}
                      value={options.value}
                      onChange={(value) => {
                        options.onChange({
                          value: value,
                        });
                      }}
                    >
                      {_.map(dropdownOptions, (item) => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.value}
                        </Select.Option>
                      ))}
                    </Select>
                  </>
                );
              },
              CurrentPageReport: (options) => {
                return (
                  <span
                    style={{
                      color: "var(--text-color)",
                      userSelect: "none",
                      width: "200px",
                      textAlign: "center",
                    }}
                  >
                    <span className="text-xs font-semibold">
                      <span>
                        {options.first} - {options.last}
                      </span>
                      <span className="ml-3">Нийт: {options.totalRecords}</span>
                    </span>
                  </span>
                );
              },
            }}
            paginatorClassName="justify-content-end"
          >
            <Column
              align="center"
              className="text-xs"
              style={{ minWidth: "50px", maxWidth: "50px" }}
              body={(data, row) => row.rowIndex + 1}
            />
            <Column
              header="Албан тушаал"
              field="positionname"
              sortable
              className="text-xs"
              headerClassName="flex items-center justify-center"

              // body={(rowData) => {
              //   return <>{rowData.company_name}</>;
              // }}
            />

            <Column
              header="Ажилтны тоо"
              field="worker_count"
              align="center"
              sortable
              className="text-xs"
              headerClassName="flex items-center justify-center"
              style={{ minWidth: "150px", maxWidth: "150px", color: "red" }}
            />
            <Column
              align="center"
              header=""
              className="text-xs"
              style={{ minWidth: "70px", maxWidth: "70px" }}
              headerClassName="flex items-center justify-center"
              body={(item) => {
                return (
                  !item.enddate && (
                    <div className="flex items-center justify-center gap-2">
                      {checkRole(["product_plan_edit"]) && (
                        <button
                          className="p-1 flex items-center justify-center font-semibold text-yellow-500 rounded-full border-2 border-yellow-500 hover:bg-yellow-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                          onClick={() => {
                            dispatch({
                              type: "STATE",
                              data: {
                                modaldepartment: item.department_code,
                              },
                            });
                            dispatch({
                              type: "STATE",
                              data: {
                                id: item.id,
                              },
                            });
                            dispatch({
                              type: "STATE",
                              data: {
                                modalselected_department: item.department_code,
                              },
                            });
                            dispatch({
                              type: "STATE",
                              data: { modalcompany: item.product_id },
                            });
                            dispatch({
                              type: "STATE",
                              data: { modalplancount: item.plan_count },
                            });
                            dispatch({
                              type: "STATE",
                              data: { modal: true },
                            });
                            dispatch({
                              type: "STATE",
                              data: { modalcheck: 2 },
                            });
                          }}
                        >
                          <i className="fe fe-edit" />
                        </button>
                      )}

                      {checkRole(["product_plan_delete"]) && (
                        <button
                          className="p-1 flex items-center justify-center font-semibold text-red-500 rounded-full border-2 border-red-500 hover:bg-red-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                          onClick={() => {
                            Swal.fire({
                              text:
                                item.department_name +
                                "-г ХСБ-ний жагсаалтаас хасах уу",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#1890ff",
                              cancelButtonColor: "rgb(244, 106, 106)",
                              confirmButtonText: "Тийм",
                              cancelButtonText: "Үгүй",
                              reverseButtons: true,
                            }).then((result) => {
                              if (result.isConfirmed) {
                                // API.deletePlan(item.id)
                                //   .then(() => {
                                //     dispatch({
                                //       type: "STATE",
                                //       data: { refresh: state.refresh + 1 },
                                //     });
                                //     message({
                                //       type: "success",
                                //       title: "Амжилттай устгагдлаа..",
                                //     });
                                //   })
                                //   .catch((error) => {
                                //     message({
                                //       type: "error",
                                //       error,
                                //       title:
                                //         "Албан тушаалаас норм хасаж чадсангүй",
                                //     });
                                //   });
                              }
                            });
                          }}
                        >
                          <i className="fe fe-trash-2" />
                        </button>
                      )}
                    </div>
                  )
                );
              }}
            />
          </DataTable>
        </Spin>
      </div>
    </>
  );
};

export default React.memo(List);
