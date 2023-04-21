import React, { useState, useMemo, useLayoutEffect, useEffect } from "react";
import { useUserContext } from "../../../contexts/userContext";
import { useReferenceContext } from "../../../contexts/referenceContext";
import * as API from "../../../api/request";
import Header from "./header";
import { Spin, Select, Input, Modal } from "antd";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import Swal from "sweetalert2";

const Employee = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useReferenceContext();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);

  //жагсаалт
  useLayoutEffect(() => {
    API.getPerson()
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_employee: _.orderBy(res, ["id"]),
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: "STATE",
          data: {
            list_employee: [],
          },
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);

  // жагсаалт
  useEffect(() => {
    API.getOrganization()
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_organization: _.orderBy(res, ["id"]),
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
  }, [state.refresh]);

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
        API.deletePerson(item.id)
          .then(() => {
            message({
              type: "success",
              title: "Амжилттай устгагдлаа",
            });
            dispatch({ type: "STATE", data:{ refresh:state.refresh+1} });
          })
          .catch((error) => {
            message({
              type: "error",
              error,
              title: "Ажлын байр устгаж чадсангүй",
            });
          });
      }
    });
  };
  const updateItem = (item) => {
    dispatch({
      type: "STATE",
      data: { selected_employee: item },
    });
    dispatch({
      type: "STATE",
      data: { modal: true },
    });
  };

  const memo_table = useMemo(() => {
    var result = state.list_employee;

    if (search) {
      result = _.filter(
        result,
        (a) =>
          _.includes(_.toLower(a.organization_name), _.toLower(search)) ||
          _.includes(_.toLower(a.short_name), _.toLower(search))
      );
    }

    return (
      <DataTable
        scrollable
        dataKey="id"
        size="small"
        stripedRows
        showGridlines
        className="w-full "
        sortMode="single"
        removableSort
        scrollHeight={window.innerHeight - 275}
        responsiveLayout="scroll"
        value={result}
        rowGroupMode="subheader"
        groupRowsBy="OrganizationName"
        rowGroupHeaderTemplate={(data) => {
          return (
            <span className="ml-6 text-sm font-semibold ">
              <span className="ml-1"> {data.organization_name}</span>
            </span>
          );
        }}
        header={
          <div className="flex items-center justify-between">
            <div className="w-full md:max-w-[200px]">
              <Input
                placeholder="Хайх..."
                prefix={<SearchOutlined />}
                className="w-full rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 ">
              {checkRole(["person_add"]) && ( 
              <div
                title="Нэмэх"
                className="p-1 flex items-center justify-center font-semibold  border-2 border-violet-500 rounded-full bg-violet-500 text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer mr-1"
                onClick={() => {
                  dispatch({
                    type: "CLEAR_EMPLOYEE",
                  });
                  dispatch({
                    type: "STATE",
                    data: { modal: true },
                  });
                }}
              >
                <i className="ft-plus" />
              </div>
             )} 
            </div>
          </div>
        }
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
          header="Байгууллагын нэр"
          field="organization_name"
        
          className="text-xs "
          headerClassName="flex items-center justify-left"
          bodyClassName="flex items-center justify-start text-left"
        />
        <Column
          sortable
          header="Нэр"
          field="short_name"
          style={{ minWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-left"
          bodyClassName="flex items-center justify-start text-left"
        />
        <Column
          sortable
          header="Регистерийн дугаар"
          field="register_number"
          style={{ minWidth: "80px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          sortable
          header="Албан тушаал"
          field="position_name"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-start text-left"
        />

        <Column
          align="center"
          header="Үйлдэл"
          className="text-xs"
          style={{ minWidth: "90px", maxWidth: "90px" }}
          headerClassName="flex items-center justify-center"
          body={(item) => {
            return (
              <div className="flex items-center justify-center gap-2">
              {checkRole(["person_edit"]) && ( 
                <button
                  className="p-1 flex items-center justify-center font-semibold  rounded-full border-2 border-teal-600 bg-teal-500 hover:scale-125 text-white focus:outline-none duration-300"
                  onClick={() => updateItem(item)}
                >
                  <i className="ft-edit" />
                </button>
               )}

                  {checkRole(["person_delete"]) && ( 
                <button
                  className="p-1 flex items-center justify-center font-semibold  rounded-full border-3 border-red-600 bg-red-500 hover:scale-125 text-white focus:outline-none duration-300"
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
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.list_employee,
    state.selected_organizationID,
    state.selected_orgName,
    search,
    first,
    per_page,
  ]);
  const save = () => {
    var error = [];
    state.selected_employee.organization_id ||
        error.push("Байгууллага:") ||
        state.selected_employee.short_name ||
        error.push("Нэр:");
      const data = {
        organization_id: state.selected_employee.organization_id,
        position_name: state.selected_employee.position_name,
        register_number: state.selected_employee.register_number,
        short_name: state.selected_employee.short_name,
      };

    if (error.length > 0) {
      message({
        type: "warning",
        title: (
          <div className="text-orange-500 font-semibold">
            Дараах мэдээлэл дутуу байна
          </div>
        ),
        description: (
          <div className="flex flex-col gap-1">
            {_.map(error, (item, index) => (
              <div key={index}>
                - <span className="ml-1">{item}</span>
              </div>
            ))}
          </div>
        ),
      });
    } else if (state.id === null) {
      API.postPerson({
        ...data,
      })
        .then(() => {
          dispatch({
            type: "STATE",
            data: {
              refresh: state.refresh + 1,
            },
          });
          dispatch({ type: "CLEAR_PERSON" });
          dispatch({ type: "STATE", data: { modal: false } });
          message({ type: "success", title: "Амжилттай хадгалагдлаа" });
        })
        .catch((error) => {
          message({
            type: "error",
            error,
            title: error.response.data.msg,
          });
        });
    } else {
      API.putPerson(state.selected_employee.id, {
        data
      })
        .then(() => {
          dispatch({
            type: "STATE",
            data: {
              refresh: state.refresh + 1,
            },
          });
          dispatch({ type: "STATE", data: { modal: false } });
          message({ type: "success", title: "Амжилттай хадгалагдлаа" });
        })
        .catch((error) => {
          message({
            type: "error",
            error,
            title: error.response.data.msg,
          });
        });
    }
  };

 

  return (
    <>
      <Modal
        centered
        width={700}
        title={
          <div className="text-center">
            Гадны ажилчид
            {state.selected_employee.id ? " засварлах " : " бүртгэх "} цонх
          </div>
        }
        visible={state.modal}
        onCancel={() => {
          dispatch({
            type: "STATE",
            data: { modal: false },
          });
        }}
        footer={null}
      >
        <div className="flex flex-col  text-xs">
          <div className="flex  flex-col justify-start">
            <span className="w-1/3 pb-1 font-semibold">
              Байгууллага:<b className="ml-1 text-red-500">*</b>
            </span>
            <Select
              className="w-full"
              placeholder="Сонгоно уу."
              optionFilterProp="children"
              value={state.selected_employee.organization_id}
              onChange={(value) => {
                dispatch({
                  type: "STATE",
                  data: {
                    ...state.selected_employee,
                    selected_employee: {organization_id: value },
                  },
                });
              }}
            >
              {_.map(state.list_organization, (item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.organization_name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <hr className="my-2" />
          <div className="flex flex-col justify-start">
            <span className="font-semibold pb-1">
              Нэр :<b className="ml-1 text-red-500">*</b>
            </span>
            <Input
              size="small"
              className=" p-1 w-full text-gray-900 border border-gray-200 rounded-sm "
              defaultValue={state.selected_employee.short_name}
              onChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: {
                    selected_employee: {
                      ...state.selected_employee,
                      short_name: e.target.value,
                    },
                  },
                });
              }}
            />
          </div>
          <hr className="my-2" />
          <div className="flex flex-col justify-start">
            <span className="font-semibold pb-1">
              Албан тушаал :<b className="ml-1 text-red-500">*</b>
            </span>
            <Input
              size="small"
              className=" p-1 w-full text-gray-900 border border-gray-200 rounded-sm "
              defaultValue={state.selected_employee.position_name}
              onChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: {
                    selected_employee: {
                      ...state.selected_employee,
                      position_name: e.target.value,
                    },
                  },
                });
              }}
            />
          </div>
          <hr className="my-2" />
          <div className="flex flex-col justify-start">
            <span className="font-semibold pb-1">
              Регистерийн дугаар :<b className="ml-1 text-red-500">*</b>
            </span>
            <Input
              size="small"
              className=" p-1 w-full text-gray-900 border border-gray-200 rounded-sm "
              value={state.selected_employee.register_number}
              onChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: {
                    selected_employee: {
                      ...state.selected_employee,
                      register_number: e.target.value,
                    },
                  },
                });
              }}
            />
          </div>
        </div>

        <div className="my-3 border " />

        <button
          className="w-full py-2 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-md hover:bg-violet-500 hover:text-white focus:outline-none duration-300 "
          onClick={() => save()}
        >
          <i className="fas fa-save" />
          <span className="ml-2">Хадгалах</span>
        </button>
      </Modal>
      <div className="card flex p-2 border rounded text-xs">
        <div className="flex flex-col rounded">
          <Header />
          <div className=" text-xs rounded p-2">
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

export default React.memo(Employee);
