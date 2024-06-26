import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Input, Select } from "antd";
import _ from "lodash";
import * as API from "src/api/plan";
import moment from "moment";
import { FilterMatchMode } from "primereact/api";
import { usePlanContext } from "src/contexts/planContext";
import { useUserContext } from "src/contexts/userContext";
import Swal from "sweetalert2";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

const Workers = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    setLoading(true);
    API.getPlanWorker({
      year: moment(state.date).format("Y"),
      type_id: state.typeid,
      department_id: state.department_id,
    })
      .then((res) => {
        setList(
          _.orderBy(
            _.filter(res, (a) => a.tn !== "0"),
            ["department_code"],
            ["firstname"]
          )
        );

        dispatch({
          type: "STATE",
          data: { list_planworker: _.map(res, (item) => item.tn) },
        });
      })
      .catch((error) =>
        message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
      )
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.department_id, state.date, state.moduleid, state.refresh]);

  return (
    <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
      <DataTable
        size="small"
        value={list}
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
        groupRowsBy="negj_name"
        scrollHeight={window.innerHeight - 360}
        globalFilterFields={["tn", "shortname", "position_name"]}
        emptyMessage={
          <div className="text-xs text-orange-500 italic font-semibold">
            Мэдээлэл олдсонгүй...
          </div>
        }
        header={
          <div className="flex items-center justify-between  text-sm">
            {state.info_type.year} оны {state.info_type.type_name}-нд хамрагдах
            ажилтнууд
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
        }
        rowGroupHeaderTemplate={(data) => {
          return (
            <div className="text-xs font-semibold">
              <span className="ml-1">
                {data.negj_code} | {data.negj_name}
              </span>
            </div>
          );
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
          header="БД"
          field="tn"
          align="center"
          sortable
          className="text-xs"
          headerClassName="flex items-center justify-center"
          style={{ minWidth: "80px", maxWidth: "80px", color: "black" }}
        />

        <Column
          header="Овог нэр"
          field="short_name"
          align="center"
          sortable
          className="text-xs"
          headerClassName="flex items-center justify-center"
          style={{ minWidth: "150px", maxWidth: "150px", color: "black" }}
        />
        <Column
          header="Албан тушаал"
          field="position_name"
          align="left"
          sortable
          className="text-xs"
          headerClassName="flex items-center justify-center"
        />
        <Column
          header="Сургалтанд суусан огноо"
          field="last_register_date"
          sortable
          align="center"
          className="text-xs"
          style={{ minWidth: "120px", maxWidth: "120px" }}
          headerClassName="flex items-center justify-center"
          body={(rowData) => {
            return (
              rowData.last_register_date &&
              moment(rowData.last_register_date).format("YYYY-MM-DD")
            );
          }}
        />
        {state.moduleid === 1
          ? checkRole(["plan_delete"]) && (
              <Column
                align="center"
                header=""
                className="text-xs"
                style={{ minWidth: "70px", maxWidth: "70px" }}
                headerClassName="flex items-center justify-center"
                body={(item) => {
                  return item.insert_type === "plan" ? (
                    <button
                      className="p-1 flex items-center justify-center font-semibold text-red-500 rounded-full border-2 border-red-500 hover:bg-red-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                      onClick={() => {
                        Swal.fire({
                          text: item.short_name + "-г сургалтнаас хасах уу",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#1890ff",
                          cancelButtonColor: "rgb(244, 106, 106)",
                          confirmButtonText: "Тийм",
                          cancelButtonText: "Үгүй",
                          reverseButtons: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            API.deletePlanWorker(item.id)
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
                                  title: "Албан тушаалаас норм хасаж чадсангүй",
                                });
                              });
                          }
                        });
                      }}
                    >
                      <i className="ft-trash-2" />
                    </button>
                  ) : (
                    ""
                  );
                }}
              />
            )
          : !state.isapprove &&
            checkRole(["plan_delete"]) && (
              <Column
                align="center"
                header=""
                className="text-xs"
                style={{ minWidth: "70px", maxWidth: "70px" }}
                headerClassName="flex items-center justify-center"
                body={(item) => {
                  return item.insert_type === "plan" ? (
                    <button
                      className="p-1 flex items-center justify-center font-semibold text-red-500 rounded-full border-2 border-red-500 hover:bg-red-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                      onClick={() => {
                        Swal.fire({
                          text: item.short_name + "-г сургалтнаас хасах уу",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#1890ff",
                          cancelButtonColor: "rgb(244, 106, 106)",
                          confirmButtonText: "Тийм",
                          cancelButtonText: "Үгүй",
                          reverseButtons: true,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            API.deletePlanWorker(item.id)
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
                                  title: "Албан тушаалаас норм хасаж чадсангүй",
                                });
                              });
                          }
                        });
                      }}
                    >
                      <i className="ft-trash-2" />
                    </button>
                  ) : (
                    ""
                  );
                }}
              />
            )}
      </DataTable>
    </Spin>
  );
};

export default React.memo(Workers);
