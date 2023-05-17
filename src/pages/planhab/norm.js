import React, { useEffect, useState } from "react";
import * as API from "src/api/planhab";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Modal } from "antd";

import { FilterMatchMode } from "primereact/api";
import { usePlanHabContext } from "src/contexts/planhabContext";
import MODAL from "src/pages/planhab/modal";
import { useUserContext } from "src/contexts/userContext";
import Swal from "sweetalert2";

import _ from "lodash";

const List = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = usePlanHabContext();
  const [search] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    state.department_id &&
      API.getNorm({
        department_id: state.department_id,
        position_id: state.position_id,
      })
        .then((res) => {
          setLoading(true);
          dispatch({
            type: "STATE",
            data: {
              list_norm: res,
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
  }, [
    state.refresh,
    state.department,
    state.date,
    state.department_id,
    state.position_id,
  ]);

  return (
    <>
      <Modal
        style={{ width: "600" }}
        width={800}
        height={550}
        visible={state.modal}
        // visible={true}
        onCancel={() => dispatch({ type: "STATE", data: { modal: false } })}
        title={"Сургалтын төрөл нэмэх"}
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <MODAL />
      </Modal>

      <div className="p-2 rounded text-xs">
        <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
          <DataTable
            size="small"
            value={state.list_norm}
            dataKey="id"
            filters={search}
            scrollable
            removableSort
            showGridlines
            className="table-xs"
            filterDisplay="menu"
            responsiveLayout="scroll"
            sortMode="multiple"
            scrollHeight={window.innerHeight - 360}
            globalFilterFields={["type_name"]}
            emptyMessage={
              <div className="text-xs text-orange-500 italic font-semibold">
                Мэдээлэл олдсонгүй...
              </div>
            }
            header={
              <div className="flex flex-row items-center justify-between  text-xs gap-2">
                {state?.info_position?.data?.positionname}
                <div className="flex items-center justify-between  pb-2   text-xs">
                  {/* <Input.Search
                    className="md:w-80"
                    placeholder="Хайх..."
                    value={search.global.value}
                    onChange={(e) => {
                      let _search = { ...search };
                      _search["global"].value = e.target.value;
                      setSearch(_search);
                      dispatch({ type: "STATE", data: { tn: null } });
                    }}
                  /> */}
                  <div className="flex items-center gap-3">
                    {checkRole(["norm_add"]) && state.position_id && (
                      <div className="flex items-center justify-between gap-2">
                        <div
                          title="Нэмэх"
                          className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer mr-1"
                          onClick={() => {
                            dispatch({ type: "CLEAR" });
                            dispatch({ type: "STATE", data: { modal: true } });
                            dispatch({
                              type: "STATE",
                              data: { modaltypeid: null },
                            });
                          }}
                        >
                          <i className="ft-plus" />
                        </div>
                      </div>
                    )}
                  </div>
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
              if (state.id === data.id) result = " bg-blue-500 text-white";
              return result;
            }}
          >
            <Column
              align="center"
              className="text-xs"
              style={{ minWidth: "50px", maxWidth: "50px" }}
              body={(data, row) => row.rowIndex + 1}
            />
            <Column
              header="Сургалтын нэр"
              field="type_name"
              className="text-xs "
              headerClassName="flex items-center justify-center"
              style={{ color: "black" }}
              body={(rowData) => {
                return <>{rowData.type_name}</>;
              }}
            />

            <Column
              header="Давтамж"
              field="interval_name"
              align="center"
              className="text-xs"
              headerClassName="flex items-center justify-center"
              style={{ minWidth: "150px", maxWidth: "150px", color: "black" }}
            />
            <Column
              align="center"
              header=""
              className="text-xs"
              style={{ minWidth: "70px", maxWidth: "70px" }}
              headerClassName="flex items-center justify-center"
              body={(item) => {
                return (
                  <div className="flex items-center justify-center gap-2">
                    {checkRole(["norm_delete"]) && (
                      <button
                        className="p-1 flex items-center justify-center font-semibold text-red-500 rounded-full border-2 border-red-500 hover:bg-red-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                        onClick={() => {
                          Swal.fire({
                            text: item.type_name + "-г хасах уу",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#1890ff",
                            cancelButtonColor: "rgb(244, 106, 106)",
                            confirmButtonText: "Тийм",
                            cancelButtonText: "Үгүй",
                            reverseButtons: true,
                          }).then((result) => {
                            if (result.isConfirmed) {
                              API.deleteNorm({
                                department_id: state.department_id,
                                position_id: state.position_id,
                                type_id: item.type_id,
                              })
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
                                    title:
                                      "Албан тушаалаас норм хасаж чадсангүй",
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
    </>
  );
};

export default React.memo(List);
