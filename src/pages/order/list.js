import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Input, Select, Modal } from "antd";
import _ from "lodash";

import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { FilterMatchMode } from "primereact/api";
import { usePlanContext } from "src/contexts/planContext";
import MODAL from "src/pages/order/modal";
import MODAL_ADD_BARAA from "src/pages/order/modal_add_baraa";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import useBearStore from "src/state/state";
// import { useUserContext } from "src/contexts/userContext";
import axios from "axios";
import dayjs from "dayjs";
import AddBtn from "src/components/button/plusButton";
import Print from "./print";

import Swal from "sweetalert2";

const Workers = () => {
  // const { message, checkRole } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [first, set_first] = useState(0);
  const [modalprint, setmodalprint] = useState(false);
  const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const main_company_id = useBearStore((state) => state.setMainCompanyID);

  const handleButtonClick = (user_id) => {
    // const url = `https://main.d5ki8wb12wcij.amplifyapp.com/order/print?user_id=${user_id}`;
    const url = `https://dmunkh.store/order/print?user_id=${user_id}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full">
      {" "}
      <Modal
        style={{ width: "600" }}
        width={800}
        height={550}
        visible={modalprint}
        // visible={true}
        onCancel={() => setmodalprint(false)}
        // closeIcon={<div className="">x</div>}
        footer={false}
      >
        <Print />
      </Modal>
      <Modal
        style={{ width: "600" }}
        width={800}
        height={550}
        visible={state.order.modal}
        // visible={true}
        onCancel={() => dispatch({ type: "ORDER", data: { modal: false } })}
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
      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <DataTable
          size="small"
          value={state.balanceGroup_list}
          dataKey="id"
          filters={search}
          paginator
          scrollable
          removableSort
          rowHover
          showGridlines
          className="table-xs"
          filterDisplay="menu"
          responsiveLayout="scroll"
          sortMode="multiple"
          rowGroupMode="subheader"
          groupRowsBy="negj_namemnfull"
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
                    dispatch({
                      type: "ORDER",
                      data: { modal: true, order_id: 0 },
                    });
                  }}
                >
                  <i className="ft-plus" />
                </div>

                <div
                  title="Жагсаалт шинэчлэх"
                  className="p-1 flex items-center justify-center font-semibold text-blue-500 border-2 border-blue-500 rounded-full hover:bg-blue-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer "
                  onClick={() => {
                    dispatch({
                      type: "STATE",
                      data: { refresh: state.refresh + 1 },
                    });
                  }}
                >
                  <i className="ft-search" />
                </div>
              </div>
            </div>
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
          rowClassName={(data) => {
            var result = "cursor-pointer";
            if (state.order.filter_order_id === data.order_id)
              result += " bg-blue-500 text-white";
            return result;
          }}
          onRowClick={(e) => {
            console.log(e);
            dispatch({
              type: "ORDER",
              data: {
                filter_order_id:
                  e.data.order_id === state.order.filter_order_id
                    ? 0
                    : e.data.order_id,
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
          footerColumnGroup={
            <ColumnGroup>
              <Row>
                <Column
                  colSpan={4}
                  footer={() => <div className="text-right text-xs ">Нийт</div>}
                />
                <Column
                  className="w-[110px] text-xs justify-end justify-items-end text-right"
                  footer={() => (
                    <div className="justify-items-end justify-end">
                      {Intl.NumberFormat("en-US").format(
                        _.sumBy(state.balanceGroup_list, (a) => a.total)
                      )}
                    </div>
                  )}
                />
                <Column
                  className="w-[110px] text-xs justify-end justify-items-end text-right"
                  footer={() => (
                    <div className="justify-items-end justify-end">
                      {Intl.NumberFormat("en-US").format(
                        _.sumBy(state.balanceGroup_list, (a) => a.cash)
                      )}
                    </div>
                  )}
                />

                <Column
                  className="w-[110px] text-xs justify-end"
                  footer={() => (
                    <div className="justify-items-end justify-end text-right">
                      {Intl.NumberFormat("en-US").format(
                        _.sumBy(state.balanceGroup_list, (a) => a.total) -
                          _.sumBy(state.balanceGroup_list, (a) => a.cash)
                      )}
                    </div>
                  )}
                />
                <Column
                  className="w-[130px] text-xs"
                  // footer={() => }
                />
                <Column
                  className="w-[110] text-xs"
                  // footer={() => }
                />
                <Column
                  className="w-[100px] text-xs"
                  // footer={() => }
                />
              </Row>
            </ColumnGroup>
          }
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
            field="order_id"
            className="text-sm"
            header="Order"
          />
          <Column field="delguur_ner" header="Дэлгүүр" className="text-sm" />

          <Column
            field="register_date"
            header="Огноо"
            style={{ minWidth: "90px", maxWidth: "90px" }}
            className="text-sm"
            body={(data) => {
              return dayjs(data.register_date).format("YYYY-MM-DD");
            }}
          />
          <Column
            field="total"
            header="Нийт дүн"
            className="text-sm justify-end"
            style={{ minWidth: "110px", maxWidth: "110px" }}
            body={(data) => {
              return Intl.NumberFormat("en-US").format(data.total);
            }}
          />
          <Column
            field="cash"
            header="Бэлэн төлөлт"
            className="text-sm justify-end"
            style={{ minWidth: "110px", maxWidth: "110px" }}
            body={(data) => {
              return Intl.NumberFormat("en-US").format(data.cash);
            }}
          />

          <Column
            field="count"
            header="Үлдэгдэл"
            className="text-sm justify-end"
            style={{ minWidth: "110px", maxWidth: "110px" }}
            body={(data) => {
              return Intl.NumberFormat("en-US").format(data.total - data.cash);
            }}
          />
          <Column
            field="is_approve"
            header="Баталгаажуулалт"
            className="text-sm"
            style={{ minWidth: "130px", maxWidth: "130px" }}
          />
          <Column
            field="user_name"
            header="Бүртгэсэн"
            className="text-sm"
            style={{ minWidth: "100px", maxWidth: "100px" }}
          />
          <Column
            align="center"
            header=""
            className="text-xs"
            style={{ minWidth: "100px", maxWidth: "100px" }}
            headerClassName="flex items-center justify-center"
            body={(item) => {
              console.log("registerr_date", item.register_date);
              return (
                <div className="flex items-center justify-center gap-2">
                  {/* {checkRole(["xx_warehouseItem_edit"]) && ( */}
                  <div
                    title="Нэмэх"
                    className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer "
                    onClick={() => {
                      dispatch({
                        type: "STATE",
                        data: { modal_add_baraa: true },
                      });
                      dispatch({
                        type: "ORDER",
                        data: {
                          order_id: item.order_id,
                          delguur_id: item.delguur_id,
                          delguur_ner: item.delguur_ner,
                          dt: item.register_date,
                        },
                      });
                    }}
                  >
                    <i className="ft-plus" />
                  </div>
                  <button
                    className="p-1 flex items-center justify-center font-semibold text-green-500 rounded-full border-2 border-green-500 hover:bg-green-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                    onClick={() => {
                      dispatch({
                        type: "ORDER",
                        data: {
                          order_id: item.order_id,
                          modal: true,
                          delguur_id: item.delguur_id,
                          dt: item.register_date,
                          cash: item.cash,
                        },
                      });
                    }}
                  >
                    <i className="ft-edit" />
                  </button>
                  {/* )}

                  {checkRole(["xx_warehouseItem_delete"]) && ( */}
                  <button
                    className="p-1 flex items-center justify-center font-semibold text-orange-500 rounded-full border-2 border-orange-500 hover:bg-orange-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                    onClick={() => {
                      setmodalprint(true);
                      dispatch({
                        type: "ORDER",
                        data: {
                          order_id: item.order_id,
                          delguur_id: item.delguur_id,
                          phone: item.phone,
                          user_name: item.user_name,
                        },
                      });
                    }}
                  >
                    <i className="ft-search" />
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

export default React.memo(Workers);
