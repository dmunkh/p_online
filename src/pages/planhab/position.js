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

    state.department &&
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
            globalFilterFields={["tn", "shortname", "positionname"]}
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
              if (state.id === data.id) result = " bg-blue-200 text-white";
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
              style={{ minWidth: "150px", maxWidth: "150px" }}
            />
          </DataTable>
        </Spin>
      </div>
    </>
  );
};

export default React.memo(List);
