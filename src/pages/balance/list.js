import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";

import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";

import { Spin, Input, Select, Modal } from "antd";
import _ from "lodash";
import * as API from "src/api/plan";
import * as REQ from "src/api/request";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { FilterMatchMode } from "primereact/api";
import { usePlanContext } from "src/contexts/planContext";
import MODAL from "src/pages/balance/modal";
// import { useUserContext } from "src/contexts/userContext";
import axios from "axios";
import dayjs from "dayjs";
import useBearStore from "src/state/state";
import AddBtn from "src/components/button/plusButton";

import Swal from "sweetalert2";

const Workers = () => {
  // const { message, checkRole } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const main_company_id = useBearStore((state) => state.main_company_id);

  // useEffect(() => {
  //   setLoading(true);
  //   REQ.getWorkers({
  //     department_id: state.department_id,
  //   })
  //     .then((res) => {
  //       setList(_.orderBy(res, ["department_code"], ["firstname"]));
  //     })
  //     .catch((error) =>
  //       message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
  //     )
  //     .finally(() => {
  //       setLoading(false);
  //     });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.department_id, state.date, state.moduleid, state.refresh]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          // "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/baraa"
          // "http://3.0.177.127/api/backend/baraa"
          "https://dmunkh.store/api/backend/balancelist",
          {
            params: {
              main_company_id: main_company_id,
            },
          }
        );
        console.log("balance list", response.data.response);

        setList(
          response.data.response &&
            _.orderBy(response.data.response, ["baraa_id", "register_date"])
        );
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
      <Modal
        style={{ width: "600" }}
        width={800}
        height={550}
        visible={state.balance.modal}
        // visible={true}
        onCancel={() => dispatch({ type: "BALANCE", data: { modal: false } })}
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <MODAL />
      </Modal>
      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <DataTable
          size="small"
          value={list}
          dataKey="id"
          filters={search}
          paginator
          scrollable
          rowHover
          removableSort
          showGridlines
          className="table-xs"
          filterDisplay="menu"
          responsiveLayout="scroll"
          sortMode="multiple"
          rowGroupMode="subheader"
          groupRowsBy="baraa_id"
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
                      type: "BALANCE",
                      data: {
                        modal: true,
                        count: 0,
                        id: 0,
                        type: 1,
                        baraa_id: null,
                        bonus: 0,
                      },
                    });
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
                  colSpan={7}
                  footer={() => <div className="text-right text-xs ">Нийт</div>}
                />
                <Column
                  className="w-[100px] text-xs justify-end justify-items-end text-right"
                  footer={() => (
                    <div className="justify-items-end justify-end">
                      {Intl.NumberFormat("en-US").format(
                        _.sumBy(list, (a) => a.count * a.price)
                      )}
                    </div>
                  )}
                />
                <Column
                  className="w-[70px] text-xs"
                  // footer={() => (
                  //   <div className="text-center">
                  //     {_.sumBy(list, (a) => a.count)}
                  //   </div>
                  // )}
                />
                <Column
                  className="w-[70px] text-xs"
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
            style={{ minWidth: "40px", maxWidth: "40px" }}
            field="id"
            className="text-sm"
            header="id"
          />
          <Column
            field="delguur_ner"
            header="Дэлгүүр"
            className="text-sm"
            // style={{ minWidth: "120px", maxWidth: "120px" }}
          />
          <Column
            field="company_name"
            header="Компани"
            className="text-sm"
            style={{ minWidth: "120px", maxWidth: "120px" }}
          />
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
            field="type_id"
            header="type_id"
            className="text-sm"
            style={{ minWidth: "40px", maxWidth: "60px" }}
          />
          <Column
            field="baraa_id"
            header="baraa_id"
            className="text-sm"
            style={{ minWidth: "60px", maxWidth: "60px" }}
          />
          <Column
            field="baraa_ner"
            header="Name"
            className="text-sm"
            style={{ minWidth: "120px", maxWidth: "120px" }}
          />
          <Column
            field="price"
            header="Нэгж үнэ"
            className="text-sm justify-end"
            style={{ minWidth: "70px", maxWidth: "70px" }}
          />
          {/* <Column
            field="count"
            header="Эхний үлдэгдэл"
            className="text-sm justify-end text-blue-700 font-semibold"
            style={{ minWidth: "70px", maxWidth: "70px" }}
            body={(data) => {
              return data.type_id === 0 ? data.count : "";
            }}
          /> */}
          <Column
            field="count"
            header="Орлого"
            className="text-sm justify-end text-green-700 font-semibold"
            style={{ minWidth: "70px", maxWidth: "70px" }}
            body={(data) => {
              return data.type_id === 1 ? data.count : "";
            }}
          />
          <Column
            field="count"
            header="Зарлага"
            className="text-sm justify-end text-red-700 font-semibold"
            style={{ minWidth: "70px", maxWidth: "70px" }}
            body={(data) => {
              return data.type_id === 3 || data.type_id === 2 ? data.count : "";
            }}
          />
          <Column
            field="count"
            header="Нийт үнэ"
            style={{ minWidth: "100px", maxWidth: "100px" }}
            className="text-sm justify-end"
            body={(data) => {
              return Intl.NumberFormat("en-US").format(data.count * data.price);
            }}
          />
          <Column
            field="box_count"
            header="Хайрцаг"
            className="text-sm"
            style={{ minWidth: "70px", maxWidth: "70px" }}
          />
          <Column
            field="user_name"
            header="Бүртгэсэн"
            className="text-sm"
            style={{ minWidth: "90px", maxWidth: "90px" }}
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
                        type: "BALANCE",
                        data: {
                          id: item.id,
                          count: item.count,
                          modal: true,
                          type: item.type_id,
                          baraa_id: item.baraa_id,
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
                    // onClick={() => deleteClick(item)}
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

export default React.memo(Workers);
