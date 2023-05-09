import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useUserContext } from "src/contexts/userContext";
import { useReferenceContext } from "src/contexts/referenceContext";
import Module from "src/components/custom/module";
import Modal from "./modal";

import * as API from "src/api/request";
import { Select, Input, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import dayjs from "dayjs";

import _ from "lodash";
import moment from "moment";
import Swal from "sweetalert2";
import EditButton from "src/components/button/editButton";
import PlusButton from "src/components/button/plusButton";
import DeleteButton from "src/components/button/deleteButton";

const List = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useReferenceContext();
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);
  const yearFormat = "YYYY";
  const [date, setDate] = useState(moment(Date.now()).format("YYYY"));
  const [module, setModule] = useState();
  const [isPrice, setIsPrice] = useState(false);

  // жагсаалт
  useLayoutEffect(() => {
    setLoading(true);
    API.getTypesYear({ module_id: module, year: date })
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_typeyear: _.orderBy(res, ["id"], "desc"),
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: "STATE",
          data: {
            list_typeyear: [],
          },
        });
        message({
          type: "error",
          error,
          title: "Сургалтын төрлийн жагсаалт татаж чадсангүй",
        });
      })
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, module, date]);

  useLayoutEffect(() => {
    module &&
    API.getType({ module_id: module })
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_type: _.orderBy(res, ["type_name"]),
          },
        });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Жагсаалт татаж чадсангүй",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module]);
  useLayoutEffect(
    () => {
      state.selected_typeyear.type_id &&
        API.getTypes(state.selected_typeyear.type_id)
          .then((res) => {
            dispatch({
              type: "STATE",
              data: {
                selected_typeyear: {
                  ...state.selected_typeyear,
                  price_emc: res.price_emc,
                  price_organization: res.price_organization,
                },
              },
            });
          })
          .catch((error) => {
            message({
              type: "error",
              error,
              title: "Жагсаалт татаж чадсангүй",
            });
          });
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.selected_typeyear.type_id]
  );

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
        API.deleteTypeYear(item.id)
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
              title: " Устгаж чадсангүй",
            });
          });
      }
    });
  };
  const updateItem = (item) => {
    dispatch({
      type: "STATE",
      data: {
        selected_typeyear: item,
      },
    });

    //     //loadItemTypeList(res.itemtypeid);
    dispatch({
      type: "STATE",
      data: { modal: true },
    });
  };

  var result = state.list_typeyear;
  if (search) {
    result = _.filter(result, (a) =>
      _.includes(_.toLower(a.type_name), _.toLower(search))
    );
  }
  return (
    <div className="card flex justify-center text-xs rounded p-2">
      <div className="md:flex justify-start rounded gap-4 my-3 mx-2 md:w-1/3">
        <div className="w-full flex items-center pl-2">
          <span className="pr-3 font-semibold text-xs">Огноо:</span>
          <DatePicker
            size="large"
            defaultValue={dayjs(date, yearFormat)}
            format={yearFormat}
            picker="year"
            className="h-9    "
            onChange={(e) => {
              setDate(e.$y);
            }}
          />
          <span className="px-3 font-semibold text-xs whitespace-nowrap">Сургалтын бүлэг:</span>
          <Module
            value={module}
            onChange={(value) => {
              setModule(value);
            }}
          />
        </div>
      </div>
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
              {checkRole(["type_year_add"]) && (
                <PlusButton
                  title="Нэмэх"
                  onClick={() => {
                    dispatch({
                      type: "CLEAR_TYPEYEAR",
                    });

                    dispatch({
                      type: "STATE",
                      data: { modal: true },
                    });
                  }}
                />
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
          style={{ minWidth: "400px", maxWidth: "400px" }}
          className="text-xs "
          headerClassName="flex items-center justify-left"
          bodyClassName="flex items-center justify-start text-left"
        />
        <Column
          sortable
          header="Танхим"
          field="place_name"
          className="text-xs "
          headerClassName="flex items-center justify-left"
          bodyClassName="flex items-center justify-start text-left"
        />
        <Column
          sortable
          header="Суух ажилчидын тоо	"
          field="limit"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center text-center"
          bodyClassName="flex items-center justify-center"
        />
        <Column
          sortable
          header="Сургалтын үргэлжлэх хугацаа"
          field="hour"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center text-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          sortable
          header="Сургалтын үнэ"
          field="price_emc"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          sortable
          header="Сургалтын үнэ /Гаднын байгууллага/"
          field="price_organization"
          style={{ minWidth: "120px", maxWidth: "120px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          sortable
          header="Шалгалтын оноо"
          field="percent"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          sortable
          header="Тэнцэх хувь"
          field="point"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          align="center"
          header="Үйлдэл"
          className="text-xs"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          headerClassName="flex items-center justify-center"
          body={(item) => {
            return (
              <div className="flex items-center justify-center gap-2">
                {checkRole(["type_year_edit"]) && (
                  <EditButton onClick={() => updateItem(item)} />
                  // <button
                  //   className="p-1 flex items-center justify-center font-semibold text-green-500 rounded-full border-2 border-green-500 hover:bg-green-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                  //   onClick={() => updateItem(item)}
                  // >
                  //   <i className="ft-edit" />
                  // </button>
                )}

                {checkRole(["type_year_delete"]) && (
                  <DeleteButton onClick={() => deleteItem(item)} />
                )}
              </div>
            );
          }}
        />
      </DataTable>
      <Modal setIsPrice={setIsPrice} isPrice={isPrice} />
    </div>
  );
};

export default React.memo(List);
