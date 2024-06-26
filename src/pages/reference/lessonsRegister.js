import React, { useState, useMemo, useLayoutEffect } from "react";
import { useUserContext } from "src/contexts/userContext";
import { useReferenceContext } from "src/contexts/referenceContext";
import * as API from "src/api/reference";
import { Spin, Select, Input, Modal } from "antd";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";

import Swal from "sweetalert2";
import SaveButton from "src/components/button/SaveButton";

const LessonsRegister = () => {
  const { message } = useUserContext();
  const { state, dispatch } = useReferenceContext();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);

  // жагсаалт
  useLayoutEffect(() => {
    API.getLessonType()
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_type: _.orderBy(res, ["ID"]),
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: "STATE",
          data: {
            list_type: [],
          },
        });
        message({
          type: "error",
          error,
          title: "Сургалтын төрөл жагсаалт татаж чадсангүй",
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // жагсаалт
  useLayoutEffect(() => {
    setLoading(true);
    API.getLessonTypeYear()
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_lessonsRegister: _.orderBy(res, ["OrganizationName"]),
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: "STATE",
          data: {
            list_lessonsRegister: [],
          },
        });
        message({
          type: "error",
          error,
          title: "Байгууллагын жагсаалт татаж чадсангүй",
        });
      })
      .finally(() => setLoading(false));
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
        // API.deleteItemWarehouse(item.warehouse_id)
        //   .then(() => {
        //     message({
        //       type: "success",
        //       title: "Амжилттай устгагдлаа",
        //     });
        //     dispatch({ type: "REFRESH" });
        //   })
        //   .catch((error) => {
        //     message({
        //       type: "error",
        //       error,
        //       title: "Ажлын байр устгаж чадсангүй",
        //     });
        //   });
        message({
          type: "error",
          title: "Амжилттай устгагдлаа",
        });
      }
    });
  };
  const updateItem = (item) => {
    dispatch({
      type: "STATE",
      data: { modal: true },
    });
  };

  const memo_table = useMemo(() => {
    var result = state.list_lessonsRegister;
    if (search) {
      result = _.filter(
        result,
        (a) =>
          _.includes(_.toLower(a.OrganizationName), _.toLower(search)) ||
          _.includes(_.toLower(a.InsertDate), _.toLower(search)) ||
          _.includes(_.toLower(a.InsertUsername), _.toLower(search))
      );
    }

    return (
      <DataTable
        scrollable
        dataKey="ID"
        size="small"
        stripedRows
        showGridlines
        className="w-full "
        sortMode="single"
        removableSort
        scrollHeight={window.innerHeight - 275}
        responsiveLayout="scroll"
        value={result}
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
              {/* {checkRole(["xx_act_add"]) && ( */}
              <div
                title="Нэмэх"
                className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer mr-1"
                onClick={() => {
                  dispatch({
                    type: "STATE",
                    data: { modal: true },
                  });
                }}
              >
                <i className="fa fa-plus" />
              </div>
              {/* )} */}
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
          header="Сургалтын төрөл"
          field="TypeName"
          style={{ minWidth: "180px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-start"
        />
        <Column
          sortable
          header="Танхим"
          field="TypeID"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-start "
        />
        <Column
          sortable
          header="Суух ажилчдын тоо"
          field="Limit"
          style={{ minWidth: "90px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          sortable
          header="Сургалтын цаг"
          field="Hour"
          style={{ minWidth: "90px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          sortable
          header="Сургалтын үнэ"
          field="Price"
          style={{ minWidth: "80px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          sortable
          header="Шалгалтын оноо"
          field="Point"
          style={{ minWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          sortable
          header="Тэнцэх хувь"
          field="Percent"
          style={{ minWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
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
                {/* {checkRole(["xx_warehouseItem_edit"]) && ( */}
                <button
                  className="p-1 flex items-center justify-center font-semibold text-green-500 rounded-full border-2 border-green-500 hover:bg-green-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                  onClick={() => updateItem(item)}
                >
                  <i className="fe fe-edit" />
                </button>
                {/* )}

                  {checkRole(["xx_warehouseItem_delete"]) && ( */}
                <button
                  className="p-1 flex items-center justify-center font-semibold text-red-500 rounded-full border-2 border-red-500 hover:bg-red-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                  onClick={() => deleteItem(item)}
                >
                  <i className="fe fe-trash-2" />
                </button>
                {/* )} */}
              </div>
            );
          }}
        />
      </DataTable>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.list_lessonsRegister, search, first, per_page]);

  const save = () => {
    var error = [];
    if (!state.id) {
      state.warehouse_razmer || error.push("Хамгаалах хэрэгслийн төрөл.");
    }

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
    } else {
      //   var data = {
      //     razmer: state.warehouse_razmer,
      //   };
      if (state.id) {
        // API.putWarehouseItemID(state.id, data)
        //   .then(() => {
        //     dispatch({ type: "REFRESH" });
        //     dispatch({ type: "MODAL", data: false });
        //     message({
        //       type: "success",
        //       title: "Амжилттай хадгалагдлаа.",
        //     });
        //   })
        //   .catch((error) => {
        //     message({
        //       type: "error",
        //       error,
        //       title: "Засварлаж чадсангүй",
        //     });
        //   });
      }
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
            {state.list_organization.id ? " засварлах " : " бүртгэх "} цонх
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
        <div className="flex flex-col text-xs">
          <div className="flex  flex-col justify-start">
            <span className="w-1/3 pb-1 font-semibold">
              Сургалтын төрөл:<b className="ml-1 text-red-500">*</b>
            </span>
            <Select
              className="w-full text-xs"
              placeholder="Сонгоно уу."
              optionFilterProp="children"
              value={state.selected_lessonsTypeID}
              onChange={(value) => {
                dispatch({
                  type: "STATE",
                  data: {
                    selected_lessonsTypeID: value,
                  },
                });
              }}
            >
              {_.map(state.list_type, (item) => (
                <Select.Option key={item.ID} value={item.ID}>
                  {item.TypeName}
                </Select.Option>
              ))}
            </Select>
          </div>
          <hr className="my-2" />
          <div className="flex  flex-col justify-start">
            <span className="w-1/3 pb-1 font-semibold">
              Сургалтын давтамж:<b className="ml-1 text-red-500">*</b>
            </span>
            <Select
              className="w-full text-xs"
              placeholder="Сонгоно уу."
              optionFilterProp="children"
              value={state.selected_lessonsTypeID}
              onChange={(value) => {
                dispatch({
                  type: "STATE",
                  data: {
                    selected_lessonsTypeID: value,
                  },
                });
              }}
            >
              {_.map(state.list_type, (item) => (
                <Select.Option key={item.ID} value={item.ID}>
                  {item.TypeName}
                </Select.Option>
              ))}
            </Select>
          </div>
          <hr className="my-2" />
          <div className="flex flex-col justify-start">
            <span className="font-semibold pb-1">
              Давтамжийн тайлбар :<b className="ml-1 text-red-500 ">*</b>
            </span>
            <Input
              size="small"
              className="w-full p-1 text-gray-900 border border-gray-200 rounded-sm "
              defaultValue={state.list_organization.name}
              onChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: { lessonsName: e.target.value },
                });
              }}
            />
          </div>
          <hr className="my-2" />
          <div className="flex flex-col justify-start">
            <span className="font-semibold pb-1">
              Сургалтын үргэлжлэх хугацаа :
              <b className="ml-1 text-red-500">*</b>
            </span>
            <Input
              size="small"
              className=" p-1 w-full text-gray-900 border border-gray-200 rounded-sm "
              defaultValue={state.list_organization.name}
              onChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: { lessonsName: e.target.value },
                });
              }}
            />
          </div>
          <hr className="my-2" />
          <div className="flex flex-col justify-start">
            <span className="font-semibold pb-1">
              Үнэ /Бүтцийн нэгжүүдэд/ :<b className="ml-1 text-red-500">*</b>
            </span>
            <Input
              size="small"
              className=" p-1 w-full text-gray-900 border border-gray-200 rounded-sm "
              defaultValue={state.list_organization.name}
              onChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: { lessonsName: e.target.value },
                });
              }}
            />
          </div>
          <hr className="my-2" />
          <div className="flex flex-col justify-start">
            <span className="font-semibold pb-1">
              Үнэ /Гадны байгууллагуудад/ :
              <b className="ml-1 text-red-500">*</b>
            </span>
            <Input
              size="small"
              className=" p-1 w-full text-gray-900 border border-gray-200 rounded-sm "
              defaultValue={state.list_organization.name}
              onChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: { lessonsName: e.target.value },
                });
              }}
            />
          </div>
          <hr className="my-2" />
          <div className="flex flex-col justify-start">
            <span className="font-semibold pb-1">
              Сургалтын төрөл, хэлбэр, давтамж :
              <b className="ml-1 text-red-500">*</b>
            </span>
            <Input
              size="small"
              className=" p-1 w-full text-gray-900 border border-gray-200 rounded-sm "
              defaultValue={state.list_organization.name}
              onChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: { lessonsName: e.target.value },
                });
              }}
            />
          </div>
          <hr className="my-2" />
          <div className="flex flex-col justify-start">
            <span className="font-semibold pb-1">
              Сургалтын тайлбар :<b className="ml-1 text-red-500">*</b>
            </span>
            <Input
              size="small"
              className=" p-1 w-full text-gray-900 border border-gray-200 rounded-sm "
              defaultValue={state.list_organization.name}
              onChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: { lessonsName: e.target.value },
                });
              }}
            />
          </div>
        </div>

        <SaveButton onClick={() => save()} />
      </Modal>

      <div className="card flex justify-center text-xs rounded p-2">
        <Spin
          tip="Уншиж байна."
          className="min-h-full first-line:bg-opacity-80"
          spinning={loading}
        >
          {memo_table}
        </Spin>
      </div>
    </>
  );
};

export default React.memo(LessonsRegister);
