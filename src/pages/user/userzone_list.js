import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Input, Select, Modal } from "antd";
import _ from "lodash";
import * as API from "src/api/plan";
import * as REQ from "src/api/request";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { FilterMatchMode } from "primereact/api";
import { usePlanContext } from "src/contexts/planContext";
import MODAL from "src/pages/order/modal";
import MODAL_ADD_BARAA from "src/pages/order/modal_add_baraa";
// import { useUserContext } from "src/contexts/userContext";
import axios from "axios";
import dayjs from "dayjs";
import AddBtn from "src/components/button/plusButton";
import SaveButton from "src/components/button/SaveButton";

import Swal from "sweetalert2";

const data = [
  {
    store_name: "Store 1",
    date: "2024-06-01",
    total: 10500,
    balance: 516,
  },
  {
    store_name: "Store 1",
    date: "2024-06-25",
    total: 9500,
    balance: 516,
  },
  {
    store_name: "Store 2",
    date: "2024-06-10",
    total: 500,
    balance: 516,
  },
  {
    store_name: "Store 2",
    date: "2024-06-15",
    total: 860,
    balance: 516,
  },
  {
    store_name: "Store 3",
    date: "2024-06-21",
    total: 5100,
    balance: 516,
  },
];

const daysInMonth = new Date(2024, 6, 0).getDate(); // June has 30 days

const groupedData = data.reduce((acc, { store_name, date, total, balance }) => {
  if (!acc[store_name]) {
    acc[store_name] = Array(daysInMonth).fill({ total: null, balance: null });
  }
  const day = new Date(date).getDate() - 1;
  acc[store_name][day] = { total, balance };
  return acc;
}, {});

const Goods_List = () => {
  // const { message, checkRole } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const storeNames = Object.keys(groupedData);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const deleteClick = (item) => {
    var result = [];

    var dict = _.groupBy(state.balanceGroup_list, "delguur_id");

    for (var key in dict) {
      if (dict.hasOwnProperty(key)) {
        if (dict[key].length > 0) {
          var register_date = [];

          // eslint-disable-next-line no-loop-func
          _.map(dict[key], (item) => {
            register_date.push(
              _.toString(item.register_date) + " " + _.toString(item.total)
            );
          });

          result.push({
            ...dict[key][0],
            register_date: _.join(register_date, "<br/>"),
            total: _.sumBy(dict[key], "total"),
          });
        }
      }
    }

    // setList(_.orderBy(result, ["delguur_ner"]));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        fetch("https://dmunkh.store/api/backend/userzone")
          .then((response) => console.log("response", response)) //response.json())
          .then((data) => console.log("dataaa", data))
          .catch((error) => console.error("Error:", error));
        // const response =
        // await axios
        //   .get(
        //     // "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/baraa"
        //     // "http://3.0.177.127/api/backend/baraa"
        //     "https://dmunkh.store/api/backend/userzone"
        //   )
        //   .then((response) => {
        //
        //     setList(response);
        //   })
        //   .catch((error) => {
        //     console.log("Error", error);
        //   });

        // var result = _(response.data)
        //   .groupBy("baraa_ner")
        //   .map(function (items, baraa_ner) {
        //     return {
        //       itemname: baraa_ner,
        //       count: _.sumBy(items, "id"),
        //     };
        //   })
        //   .value();

        // setList(_.orderBy(response.data.response, ["id"]));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError(error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);

  return (
    <div className="w-full">
      {" "}
      <h1>Monthly Sales Calendar</h1>
      <table className="pivot-table">
        <thead>
          <tr>
            <th>Store Name</th>
            {daysArray.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {storeNames.map((storeName) => (
            <tr key={storeName}>
              <td>{storeName}</td>
              {groupedData[storeName].map(({ total, balance }, index) => (
                <td key={index}>
                  {total !== null && balance !== null ? (
                    <div>
                      <div>Total: {total}</div>
                      <div>Balance: {balance}</div>
                    </div>
                  ) : (
                    ""
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>{" "}
      <Modal
        style={{ width: "600" }}
        width={800}
        height={550}
        visible={state.modal}
        // visible={true}
        onCancel={() => dispatch({ type: "STATE", data: { modal: false } })}
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <MODAL />
      </Modal>
      <Modal
        style={{ width: "1200" }}
        width={1200}
        height={550}
        visible={state.modal_add_baraa}
        // visible={true}
        onCancel={() =>
          dispatch({ type: "STATE", data: { modal_add_baraa: false } })
        }
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <MODAL_ADD_BARAA />
      </Modal>
      <SaveButton
        onClick={() => {
          deleteClick();
        }}
      />
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
          groupRowsBy="user_id"
          scrollHeight={window.innerHeight - 360}
          globalFilterFields={["baraa_ner"]}
          emptyMessage={
            <div className="text-xs text-orange-500 italic font-semibold">
              Мэдээлэл олдсонгүй...
            </div>
          }
          header={
            <div className="flex items-center justify-between">
              <div className="w-full md:max-w-[200px]">
                <Input
                  placeholder="Хайх..."
                  value={search.global.value}
                  onChange={(e) => {
                    let _search = { ...search };
                    _search["global"].value = e.target.value;
                    setSearch(_search);
                  }}
                />
              </div>
              <div className="flex items-center gap-2 ">
                <div
                  title="Нэмэх"
                  className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer "
                  onClick={() => {
                    dispatch({ type: "STATE", data: { modal: true } });
                  }}
                >
                  <i className="ft-plus" />
                </div>
              </div>
            </div>

            // <div className="flex items-center justify-between  pb-2 mb-2  text-xs">

            // </div>
          }
          rowGroupHeaderTemplate={(data) => {
            return (
              <div className="text-xs font-semibold">
                <span className="ml-1">
                  {data.firstname} | {data.id}
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
            header="№"
            className="text-sm"
            style={{ minWidth: "40px", maxWidth: "40px" }}
            body={(data, row) => row.rowIndex + 1}
          />
          <Column
            style={{ minWidth: "60px", maxWidth: "60px" }}
            field="id"
            className="text-sm"
            header="Order"
          />
          <Column
            field="delguur_ner"
            header="Бараа нэр"
            className="text-sm"
            // style={{ minWidth: "120px", maxWidth: "120px" }}
          />
          {_.map(
            _.orderBy(state.balanceGroup_list, ["delguur_ner"]),
            (item) => {
              return (
                <Column
                  sortable
                  key={item.delguur_id}
                  header={
                    item.delguur_ner +
                    " Үнэ: " +
                    Intl.NumberFormat("en-US").format(item.total)
                  }
                  field={"col" + item.delguur_id}
                  style={{
                    minWidth: "100px",
                    maxWidth: "100px",
                    width: "100px",
                  }}
                  className="text-xs "
                  align="center"
                  body={(data) => {
                    var result = data["col" + item.delguur_id];
                    var price = data["col" + item.delguur_id] * item.price_emc;

                    return result !== 0
                      ? result //+ " - " + Intl.NumberFormat("en-US").format(price)
                      : "";
                    // return item.price_emc;
                  }}
                />
              );
            }
          )}
          <Column
            field="count"
            header="Тоо ширхэг"
            className="text-sm justify-end"
            style={{ minWidth: "120px", maxWidth: "120px" }}
          />
          <Column
            field="price"
            header="Нэгж үнэ"
            style={{ minWidth: "110px", maxWidth: "110px" }}
            className="text-sm justify-end"
          />
          <Column
            field="cash"
            header="Нийт үнэ"
            className="text-sm justify-end textAlign: left"
            style={{ minWidth: "110px", maxWidth: "110px" }}
            bodyClassName="flex items-center justify-end"
            body={(data) => {
              return data.count * data.price;
            }}
          />
          <Column
            field="is_approve"
            header="Баталгаажуулалт"
            className="text-sm"
            style={{ minWidth: "130px", maxWidth: "130px" }}
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
                  {/* {checkRole(["xx_warehouseItem_edit"]) && ( */}
                  <button
                    className="p-1 flex items-center justify-center font-semibold text-green-500 rounded-full border-2 border-green-500 hover:bg-green-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                    onClick={() => {
                      dispatch({
                        type: "STATE",
                        data: { modal_add_baraa: true },
                      });
                      dispatch({
                        type: "ORDER",
                        data: {
                          delguur_id: item.delguur_id,
                          delguur_ner: item.delguur_ner,
                          dt: item.register_date,
                        },
                      });
                    }}
                  >
                    <i className="ft-edit" />
                  </button>
                  {/* )}

                  {checkRole(["xx_warehouseItem_delete"]) && ( */}
                  <button
                    className="p-1 flex items-center justify-center font-semibold text-red-500 rounded-full border-2 border-red-500 hover:bg-red-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                    // onClick={() => ()}
                  >
                    <i className="ft-trash-2" />
                  </button>
                  {/* )} */}
                </div>
              );
            }}
          />
        </DataTable>
      </Spin>
    </div>
  );
};

export default React.memo(Goods_List);
