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
import Header from "src/pages/plan/id/header";
import Swal from "sweetalert2";
import WorkerType from "src/pages/plan/workersType ";

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
    API.getPlanNot({
      year: moment(state.date).format("Y"),
      type_id: state.typeid,
      department_id: state.department_id,
    })
      .then((res) => {
        setList(_.orderBy(res, ["department_code"], ["firstname"]));
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
    <div className=" card flex p-2 border rounded text-xs">
      <Header />
      <div className="flex flex-col md:flex-row gap-2 ">
        <div className="md:w-2/3">
          <WorkerType />
        </div>
        <div className="md:w-2/3">
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
              groupRowsBy="negj_namemnfull"
              scrollHeight={window.innerHeight - 360}
              globalFilterFields={["tn", "shortname", "position_namemn"]}
              emptyMessage={
                <div className="text-xs text-orange-500 italic font-semibold">
                  Мэдээлэл олдсонгүй...
                </div>
              }
              header={
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
                // <div className="flex items-center justify-between  pb-2 mb-2  text-xs">

                // </div>
              }
              rowGroupHeaderTemplate={(data) => {
                return (
                  <div className="text-xs font-semibold">
                    <span className="ml-1">
                      {data.negj_code} | {data.negj_namemnfull}
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
                        <span className="ml-3">
                          Нийт: {options.totalRecords}
                        </span>
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
                field="shortname"
                align="center"
                sortable
                className="text-xs"
                headerClassName="flex items-center justify-center"
                style={{ minWidth: "150px", maxWidth: "150px", color: "black" }}
              />
              <Column
                header="Албан тушаал"
                field="position_namemn"
                align="left"
                sortable
                className="text-xs"
                headerClassName="flex items-center justify-center"
              />

              {!state.isapprove && checkRole(["plan_add"]) && (
                <Column
                  align="center"
                  header=""
                  className="text-xs"
                  style={{ minWidth: "70px", maxWidth: "70px" }}
                  headerClassName="flex items-center justify-center"
                  body={(item) => {
                    return (
                      <button
                        className="p-1 flex items-center justify-center font-semibold text-purple-500 rounded-full border-2 border-purple-500 hover:bg-purple-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                        onClick={() => {
                          Swal.fire({
                            text: item.shortname + "-г сургалтан бүртгэх үү",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#1890ff",
                            cancelButtonColor: "rgb(244, 106, 106)",
                            confirmButtonText: "Тийм",
                            cancelButtonText: "Үгүй",
                            reverseButtons: true,
                          }).then((result) => {
                            if (result.isConfirmed) {
                              API.postPlanWorker({
                                tn: item.tn,
                                type_id: state.typeid,
                                year: moment(state.date).format("Y"),
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
                        <i className="fa fa-plus" />
                      </button>
                    );
                  }}
                />
              )}
            </DataTable>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Workers);
