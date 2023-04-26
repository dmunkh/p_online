import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Toast } from "primereact/toast";
import { MultiSelect } from "primereact/multiselect";
import { Input, Select } from "antd";
import { useUserContext } from "src/contexts/userContext";
import { useReferenceContext } from "src/contexts/referenceContext";
import * as API from "src/api/request";
import Header from "./header";
import _ from "lodash";
import Swal from "sweetalert2";
import Employee from "./employee/list";
import Modal from "./modal";
import EmpModal from "./employee/modal";

export default function List() {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useReferenceContext();
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(null);
  const [search, setSearch] = useState("");
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(10);
  const toast = useRef(null);
  useEffect(() => {
    API.getOrganization()
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_organization: _.orderBy(res, ["id"], ["desc"]),
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: "STATE",
          data: {
            list_organization: [],
          },
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.list_employee]);
  var result = state.list_organization;

  const deleteItem = (item) => {
    Swal.fire({
      text: "Устгахдаа итгэлтэй байна уу?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1890ff",
      cancelButtonColor: "rgb(244, 106, 106)",
      confirmButtonText: "Тийм",
      cancelButtonText: "Үгүй",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.deleteOrganization(item.id)
          .then(() => {
            message({
              type: "success",
              title: "Амжилттай устгагдлаа",
            });
            dispatch({ type: "STATE", data: { refresh: state.refresh + 1 } });
          })
          .catch((error) => {
            message({
              type: "error",
              error,
              title: "Байгууллага устгаж чадсангүй",
            });
          });
      }
    });
  };
  const updateItem = (item) => {
    dispatch({
      type: "STATE",
      data: {
        organizationID: item.id,
        organization_name: item.organization_name,
      },
    });
    dispatch({
      type: "STATE",
      data: { modal1: true },
    });
  };
  const onRowExpand = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Ажилчид",
      detail: event.data.name,
      life: 3000,
    });
  };

  const onRowCollapse = (event) => {
    toast.current.show({
      severity: "success",
      summary: "Байгууллага",
      detail: event.data.name,
      life: 3000,
    });
  };

  // const expandAll = () => {
  //   let _expandedRows = {};
  //   console.log(person);
  //   person.forEach((p) => (_expandedRows[`${p.organization_id}`] = true));

  //   setExpandedRows(_expandedRows);
  //   console.log(_expandedRows);
  // };

  // const collapseAll = () => {
  //   setExpandedRows(null);
  // };

  const representativesItemTemplate = (option) => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{option.name}</span>
      </div>
    );
  };

  const representativeRowFilterTemplate = (options) => {
    return (
      <MultiSelect
        value={state.list_organization}
        options={state.list_organization}
        itemTemplate={representativesItemTemplate}
        onChange={(e) => options.filterApplyCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
        maxSelectedLabels={1}
        style={{ minWidth: "14rem" }}
      />
    );
  };

  const allowExpansion = (rowData) => {
    return rowData.id > 0;
  };

  const rowExpansionTemplate = (data) => {
    return <Employee data={data} />;
  };

  const header = (
    <div className="flex justify-between gap-2 ">
      <Input
        placeholder="Хайх..."
        prefix={<SearchOutlined />}
        className="md:w-1/5  rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {checkRole(["person_add"]) && (
        <div className="mt-1">
        <div
          title="Байгууллага нэмэх"
          className="p-1 text-xs flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer mr-16"
          onClick={() => {
            dispatch({
              type: "STATE",
              data: { organizationID: null, organization_name: "" },
            });

            dispatch({
              type: "STATE",
              data: { modal1: true },
            });
          }}
        >
          <i className="ft-plus" /> 
        </div>
        </div>
      )}
    </div>
    
  );
  if (search) {
    result = _.filter(result, (a) =>
      _.includes(_.toLower(a.organization_name), _.toLower(search))
    );
  }
  return (
    <div className="card flex justify-center text-xs rounded p-2">
      <Header />
      <div className=" text-xs rounded p-2">
        <Spin
          tip="Уншиж байна."
          className="min-h-full first-line:bg-opacity-80"
          spinning={loading}
        >
          <Toast ref={toast} />
          <DataTable
            value={result}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            onRowExpand={onRowExpand}
            onRowCollapse={onRowCollapse}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="id"
            header={header}
            responsiveLayout="scroll"
            paginator
            rowHover
            first={first}
            rows={per_page}
            onPage={(event) => {
              set_first(event.first);
              set_per_page(event.rows);
            }}
            paginatorTemplate={{
              layout:
                "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
              RowsPerPageDropdown: (options) => {
                const dropdownOptions = [
                  { label: 10, value: 10 },
                  { label: 20, value: 20 },
                  { label: 50, value: 50 },
                  { label: 100, value: 100 },
                  { label: 200, value: 200 },
                  { label: 500, value: 500 },
                ];
                return (
                  <>
                    <span
                      className="text-xs mx-1"
                      style={{ color: "var(--text-color)", userSelect: "none" }}
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
            emptyMessage={
              <div className="text-xs text-orange-500 italic font-semibold">
                Мэдээлэл олдсонгүй...
              </div>
            }
          >
            <Column expander={allowExpansion} style={{ width: "5rem" }} />

            <Column
              field="organization_name"
              header="Байгуулгын нэр"
              sortable
              className="text-sm"
              filterField="representative"
              showFilterMenu={false}
              filterMenuStyle={{ width: "14rem" }}
              style={{ minWidth: "14rem" }}
              filterElement={representativeRowFilterTemplate}
            />
            <Column
              header="Үйлдэл"
              style={{ width: "10rem" }}
              className="text-sm"
              body={(item) => {
                return (
                  <div className="flex items-center justify-left gap-2">
                    {checkRole(["person_edit"]) && (
                      <button
                        title="Байгууллага засах"
                        className="p-1 flex items-center justify-center font-semibold text-yellow-500 rounded-full border-2 border-yellow-500 hover:bg-yellow-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                        onClick={() => updateItem(item)}
                      >
                        <i className="ft-edit" />
                      </button>
                    )}

                    {checkRole(["person_delete"]) && (
                      <button
                        title="Байгууллага устгах"
                        className="p-1 flex items-center justify-center font-semibold text-red-500 rounded-full border-2 border-red-500 hover:bg-red-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                        onClick={() => deleteItem(item)}
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

      <Modal />
      <EmpModal />
    </div>
  );
}
