import React, { useState, useMemo, useLayoutEffect } from "react";
import { useUserContext } from "../../../contexts/userContext";
import { useReferenceContext } from "../../../contexts/referenceContext";
import * as API from "../../../api/reference";
import { Spin, Select, Input } from "antd";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import Swal from "sweetalert2";
import Header from "./header";
import Modal from "./modal";

const LessonsType = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useReferenceContext();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);

  // жагсаалт
  useLayoutEffect(() => {
    setLoading(true);
    state.selected_moduleID &&
      API.getLessonType({
        module_id: state.selected_moduleID,
      })
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
        })
        .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.selected_moduleID]);

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
        API.deleteLessonTypeID(item.id)
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
              title: "Сургалтын төрөл устгаж чадсангүй",
            });
          });
        message({
          type: "error",
          title: "Амжилттай устгагдлаа",
        });
      }
    });
  };
  const updateItem = (item) => {
    API.getLessonTypeID(item.id)
      .then((res) => {
        dispatch({
          type: "SET_TYPE",
          data: {
            id: res.id,
            module_id: res.module_id,
            interval_id: res.interval_id,
            type_name: res.type_name,
            price_emc: res.price_emc,
            price_organization: res.price_organization,
            hour: res.hour,
            description: res.description,
            interval_name: res.interval_name,
            time: res.time,
          },
        });
        dispatch({
          type: "STATE",
          data: { modal: true },
        });
        //loadItemTypeList(res.itemtypeid);
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Мэдээлэл татаж чадсангүй.",
        });
        dispatch({
          type: "CLEAR",
        });
      });
  };

  const memo_table = useMemo(() => {
    var result = state.list_type;

    if (state.selected_moduleID)
      result = _.filter(result, (a) => a.module_id === state.selected_moduleID);

    if (search) {
      result = _.filter(
        result,
        (a) =>
          _.includes(_.toLower(a.type_name), _.toLower(search)) ||
          _.includes(_.toLower(a.price_emc), _.toLower(search)) ||
          _.includes(_.toLower(a.hour), _.toLower(search)) ||
          _.includes(_.toLower(a.description), _.toLower(search)) ||
          _.includes(_.toLower(a.interval_name), _.toLower(search)) ||
          _.includes(_.toLower(a.price_organization), _.toLower(search))
      );
    }

    return (
      <DataTable
        scrollable
        dataKey="id"
        size="small"
        stripedRows
        showGridlines
        className="w-full text-sm"
        sortMode="single"
        removableSort
        scrollHeight={window.innerHeight - 400}
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
              {checkRole(["type_add"]) && (
                <div
                  title="Нэмэх"
                  className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer "
                  onClick={() => {
                    dispatch({
                      type: "CLEAR_TYPE",
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
          header="Сургалтын төрөл"
          field="type_name"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-start "
        />
        <Column
          sortable
          header="Сургалтын давтамж"
          field="interval_name"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />

        <Column
          sortable
          header="Сургалтын үргэлжлэх хугацаа"
          field="hour"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
        />
        <Column
          sortable
          header="Үнэ /бүтцийн нэгжүүдэд/"
          field="price_emc"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
        />
        <Column
          sortable
          header="Үнэ /гадны байгууллагууд/"
          field="price_organization"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
        />
        <Column
          sortable
          header="Сургалтын төрөл, хэлбэр давтамж"
          field="time"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
        />
        <Column
          sortable
          header="Сургалтын тайлбар"
          field="description"
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
                {checkRole(["type_edit"]) && (
                  <button
                  className="p-1 flex items-center justify-center font-semibold text-yellow-500 rounded-full border-2 border-yellow-500 hover:bg-yellow-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                    onClick={() => updateItem(item)}
                  >
                    <i className="ft-edit" />
                  </button>
                )}

                {checkRole(["type_delete"]) && (
                  <button
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
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.list_type, state.selected_moduleID, search, first, per_page]);

  return (
    <>
      <Modal />
      <div className="card flex p-2 border rounded text-xs">
        <div className="flex flex-col rounded">
          <Header />
          <div className="card flex justify-center text-xs rounded p-2">
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

export default React.memo(LessonsType);
