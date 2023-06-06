import React, { useEffect, useState } from "react";
import * as API from "src/api/plan";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Modal, Input, Select, InputNumber } from "antd";
import _ from "lodash";
import { FilterMatchMode } from "primereact/api";
import { useUserContext } from "src/contexts/userContext";
import { usePlanContext } from "src/contexts/planContext";
import MODAL from "src/pages/plan/modal";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import moment from "moment";

const List = () => {
  const { message } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      state.moduleid &&
      state.department_id !== null &&
      state.department_id !== undefined
    ) {
      setLoading(true);
      API.getPlan({
        year: moment(state.date).format("Y"),
        module_id: state.moduleid,
        department_id: state.department_id,
      })
        .then((res) => {
          var result = [];

          _.map(res, (items) => {
            result.push({
              ...items,
              // Intl.NumberFormat("en-US").format(
              plan: items?.count + items?.count_resource,
              sum: (items?.count + items?.count_resource) * items?.price_emc,

              //),
            });
          });

          dispatch({
            type: "STATE",
            data: {
              list_normposition: _.orderBy(
                result,
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.department_id, state.date, state.moduleid]);

  useEffect(() => {
    if (state.moduleid && state.department_id) {
      API.getPlanApprove({
        year: moment(state.date).format("Y"),
        module_id: state.moduleid,
        department_id: state.department_id,
      })
        .then((res) => {
          dispatch({
            type: "STATE",
            data: {
              isapprove: res[0]?.is_closed,
            },
          });
        })
        .catch((error) => message({ type: "error", error, title: "" }))
        .finally(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.moduleid, state.date, state.department_id, state.refresh]);

  return (
    <>
      <Modal
        style={{ width: "600" }}
        width={800}
        height={550}
        visible={state.modal}
        // visible={true}
        onCancel={() => dispatch({ type: "STATE", data: { modal: false } })}
        title={
          moment(state.date).format("Y") + " оны төлөвлөгөөг баталгаажуулах уу"
        }
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
            groupRowsBy="module_id"
            scrollHeight={window.innerHeight - 360}
            globalFilterFields={["type_name"]}
            emptyMessage={
              <div className="text-xs text-orange-500 italic font-semibold">
                Мэдээлэл олдсонгүй...
              </div>
            }
            header={
              <div className="flex items-center justify-between  pb-2  text-xs">
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

                <div className="flex items-center justify-between gap-2">
                  {state.department_id > 0 ? (
                    !state.isapprove ? (
                      <div
                        title="Баталгаажуулах"
                        className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer mr-1"
                        onClick={() => {
                          dispatch({ type: "STATE", data: { modal: true } });
                        }}
                      >
                        <i className="ft-check" />
                      </div>
                    ) : (
                      <div
                        title="Баталгаажуулах"
                        className="p-1 flex items-center justify-center font-semibold text-green-700 border-2 border-green-500 rounded-full"
                      >
                        <i className="fa fa-check" />
                        Баталгаажсан
                      </div>
                    )
                  ) : null}
                </div>
              </div>
            }
            rowGroupHeaderTemplate={(data) => {
              return (
                <div className="text-xs font-semibold">
                  <span className="ml-1">{data.module_name}</span>
                </div>
              );
            }}
            footerColumnGroup={
              <ColumnGroup>
                <Row>
                  <Column
                    align="right"
                    colSpan={3}
                    footer="Нийт сургалтанд суух ажилтнууд ( давхардсан ):"
                    className=" text-xs "
                  />
                  <Column
                    align="center"
                    footer={_.sumBy(state?.list_normposition, (a) => a.count)}
                    className="w-[100px] text-xs"
                  />
                  <Column
                    align="center"
                    footer={_.sumBy(
                      state?.list_normposition,
                      (a) => a.count_resource
                    )}
                    className="w-[100px] text-xs"
                  />
                  <Column
                    align="center"
                    footer={_.sumBy(state?.list_normposition, (a) => a.plan)}
                    className="w-[100px] text-xs"
                  />
                  <Column
                    align="right"
                    footer={Intl.NumberFormat("en-US").format(
                      _.sumBy(state?.list_normposition, (a) => a.sum)
                    )}
                    className="w-[100px] text-xs"
                  />
                </Row>
              </ColumnGroup>
            }
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
              header="Төлөвлөгөөт сургалтын нэр"
              field="type_name"
              sortable
              className="text-xs"
              headerClassName="flex items-center justify-center"
              body={(rowData) => {
                return (
                  <div
                    className="flex items-center gap-1 cursor-pointer hover:underline"
                    onClick={() => {
                      dispatch({
                        type: "STATE",
                        data: {
                          typeid: rowData.type_id,
                          single_page: true,
                          info_type: rowData,
                        },
                      });

                      // navigate("/plan/workers?id=" + rowData.type_id);
                    }}
                  >
                    <span className="">{rowData.type_name}</span>
                  </div>
                );
              }}
            />
            <Column
              header="Давтамж"
              field="interval_name"
              align="center"
              sortable
              className="text-xs"
              headerClassName="flex items-center justify-center"
              style={{ minWidth: "150px", maxWidth: "150px" }}
            />
            <Column
              header="Нэгж үнэ"
              field="price_emc"
              align="center"
              sortable
              className="text-xs"
              headerClassName="flex items-center justify-center"
              style={{ minWidth: "100px", maxWidth: "100px" }}
              body={(data) => {
                return Intl.NumberFormat("en-US").format(data.price_emc);
              }}
            />

            <Column
              header="Ажилтны тоо"
              field="count"
              align="center"
              sortable
              className="text-xs"
              headerClassName="flex items-center justify-center"
              style={{ minWidth: "100px", maxWidth: "100px" }}
            />
            <Column
              header="Нөөц төлөвлөлт"
              field="Count"
              align="center"
              sortable
              className="text-xs"
              headerClassName="flex items-center justify-center"
              style={{ minWidth: "100px", maxWidth: "100px" }}
              body={(data) => {
                return (
                  <InputNumber
                    style={{ fontSize: 12 }}
                    value={data.count_resource}
                    onChange={(value) => {
                      const updatedList = [...state.list_normposition]; // Create a new copy of the array
                      const index = updatedList.findIndex(
                        (employee) => employee.type_id === data.type_id
                      );

                      if (index !== -1) {
                        updatedList[index] = {
                          ...updatedList[index],
                          count_resource: value,
                          plan: updatedList[index].count + value,
                          sum:
                            (updatedList[index].count + value) *
                            updatedList[index].price_emc,
                        }; // Update the height property

                        dispatch({
                          type: "STATE",
                          data: { list_normposition: updatedList },
                        }); // Dispatch the updated array directly
                      }
                    }}
                    onPressEnter={(e) => {
                      if (e.key === "Enter") {
                        console.log(
                          "target",
                          e.target.value === "" ? 0 : e.target.value
                        );

                        API.postPlanCountResource({
                          count: e.target.value === "" ? 0 : e.target.value,
                          type_id: data.type_id,
                          year: moment(state.date).format("Y"),
                          department_id: state.department_id,
                        })
                          .then((res) => {
                            // setdraw((prev) => prev + 1);

                            message({
                              type: "success",
                              title: "Амжилттай хадгалагдлаа",
                            });
                          })
                          .catch((error) =>
                            message({
                              type: "error",
                              error,
                              title: "Амжилтгүй. Дахин оруулна уу",
                            })
                          )
                          .finally(() => {});
                      }
                    }}
                  ></InputNumber>
                );
              }}
            />
            <Column
              header="Нийт төлөвлөлт"
              field="plan"
              align="center"
              sortable
              className="text-xs text-right"
              // headerClassName="flex items-center justify-center"
              style={{ minWidth: "100px", maxWidth: "100px" }}
              body={(data) => {
                return Intl.NumberFormat("en-US").format(data.plan);
              }}
            />
            <Column
              header="Нийт үнэ"
              field="sum"
              align="right"
              sortable
              className="text-xs text-right"
              // headerClassName="flex items-center justify-center"
              style={{ minWidth: "100px", maxWidth: "100px" }}
              body={(data) => {
                return Intl.NumberFormat("en-US").format(data.sum);
              }}
            />
          </DataTable>
        </Spin>
      </div>
    </>
  );
};

export default React.memo(List);
