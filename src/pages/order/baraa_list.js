import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Input, Select, Modal } from "antd";
import _ from "lodash";
import * as API from "src/api/plan";
import * as REQ from "src/api/request";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";

import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { FilterMatchMode } from "primereact/api";
import { usePlanContext } from "src/contexts/planContext";
import MODAL from "src/pages/order/modal";
import MODAL_ADD_BARAA from "src/pages/order/modal_add_baraa";
// import { useUserContext } from "src/contexts/userContext";
import axios from "axios";
import MODAL_EDIT from "src/pages/order/modal_edit";
import dayjs from "dayjs";
import AddBtn from "src/components/button/plusButton";
import useBearStore from "src/state/state";
import Swal from "sweetalert2";

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
  const [filterlist, setfilterlist] = useState([]);
  const main_company_id = useBearStore((state) => state.main_company_id);
  const group_id = useBearStore((state) => state.group_id);
  const user_id = useBearStore((state) => state.user_id);
  // console.log("group idddd", group_id);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://dmunkh.store/api/backend/balance",
          // "http://localhost:5000/api/backend/balance",
          {
            params: {
              main_company_id: main_company_id,
              user_id: user_id,
              group_id: group_id,
              start_date: moment(state.order.start_date).format("YYYY.MM.DD"),
              end_date: moment(state.order.end_date).format("YYYY.MM.DD"),
            },
          }
        );

        var result = _(response.data.response)
          .groupBy("id_order")
          .map(function (items, id_order) {
            return {
              order_id: id_order,
              delguur_id: items[0].delguur_id,
              delguur_ner: items[0].delguur_ner,
              register_date: items[0].register_date,
              cash: items[0].cash,
              count: _.sumBy(items, "count"),
              total: _.sumBy(items, "total"),
              user_name: items[0].user_name,
              phone: items[0].phone,
              is_approve: items[0].is_approve,
            };
          })
          .value();

        dispatch({
          type: "STATE",
          data: {
            balance_list: response.data.response,
            balanceGroup_list: result,
          },
        });
        console.log("result", result);

        setList(
          _.orderBy(
            _.filter(response.data.response, (a) => a.id !== null),
            ["id"]
          )
        );
        setfilterlist(_.filter(response.data.response, (a) => a.id !== null));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError(error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.order.start_date, state.order.end_date]);
  useEffect(() => {
    console.log("filter order id", state.order.filter_order_id, filterlist);
    var result = filterlist;
    if (state.order.filter_order_id !== 0) {
      setList(
        _.filter(
          result,
          (a) => parseInt(a.id_order) === parseInt(state.order.filter_order_id)
        )
      );
    } else {
      setList(filterlist);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.order.order_id, state.order.filter_order_id]);
  const deleteClick = (item) => {
    Swal.fire({
      text: item.baraa_ner + "г устгах уу",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1890ff",
      cancelButtonColor: "rgb(244, 106, 106)",
      confirmButtonText: "Тийм",
      cancelButtonText: "Үгүй",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .delete("https://dmunkh.store/api/backend/balance/" + item.id)
            .then((response) => {
              dispatch({
                type: "STATE",
                data: { refresh: state.refresh + 1 },
              });
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        } catch (error) {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="w-full">
      {" "}
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
      <Modal
        style={{ width: "1200" }}
        width={1200}
        height={550}
        visible={state.order.modal_edit}
        // visible={true}
        onCancel={() =>
          dispatch({ type: "ORDER", data: { modal_edit: false } })
        }
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <MODAL_EDIT />
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
          groupRowsBy="order_id"
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
          }
          rowGroupHeaderTemplate={(data) => {
            var group = _.filter(list, (a) => a.order_id === data.order_id);
            return (
              <div
                key={"key_group_" + data.id}
                className="flex items-center text-xs font-bold"
              >
                <div className="w-full text-xs">
                  {data.delguur_id} | {data.delguur_ner}
                </div>

                <div className="w-[110px] text-center text-xs ">
                  {Intl.NumberFormat("en-US").format(_.sumBy(group, "total"))}
                </div>
                {/* <div className="w-[250px] text-center"></div> */}
              </div>
            );
          }}
          footerColumnGroup={
            <ColumnGroup>
              <Row>
                <Column
                  colSpan={4}
                  className="text-xs text-right"
                  footer={() => "Нийт"}
                />
                <Column
                  className="w-[60px] text-xs text-right"
                  footer={() =>
                    Intl.NumberFormat("en-US").format(
                      _.sumBy(list, (a) => a.count)
                    )
                  }
                />
                <Column
                  className="w-[60px] text-xs text-right"
                  footer={() => ""}
                />
                <Column
                  className="w-[80px] text-xs text-right"
                  footer={() =>
                    Intl.NumberFormat("en-US").format(
                      _.sumBy(list, (a) => a.price * a.count)
                    )
                  }
                />
                <Column
                  className="w-[70px] text-xs text-right"
                  footer={() => ""}
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
            header="№"
            className="text-sm"
            style={{ minWidth: "40px", maxWidth: "40px" }}
            body={(data, row) => row.rowIndex + 1}
          />

          <Column
            field="bar_code"
            header="barcode"
            className="text-xs"
            style={{ minWidth: "110px", maxWidth: "110px" }}
          />
          <Column
            field="type_id"
            header="Төрөл"
            className="text-xs justify-end textAlign: left"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            bodyClassName="flex items-center justify-end"
            body={(data) => {
              let content;
              let style = { textAlign: "left" };
              switch (data.type_id) {
                case 0:
                  content = "Эхний үлдэгдэл";
                  break;
                case 1:
                  content = "Орлого";
                  break;
                case 2:
                  content = "Зарлага";
                  break;
                case 3:
                  content = "Захиалга";
                  break;
                case 4:
                  content = "Буцаалт";
                  style.color = "red";
                  break;
                case 5:
                  content = "Хаягдал";
                  style.color = "red";
                  break;

                default:
                  content = "Default Content";
              }
              return <div style={style}>{content}</div>;
            }}
          />
          <Column
            field="baraa_ner"
            header="Бараа нэр"
            className="text-xs"

            // style={{ minWidth: "120px", maxWidth: "120px" }}
          />
          <Column
            field="count"
            header="Тоо ширхэг"
            className="text-xs justify-end"
            style={{ minWidth: "60px", maxWidth: "60px" }}
          />
          <Column
            field="price"
            header="Нэгж үнэ"
            style={{ minWidth: "60px", maxWidth: "60px" }}
            className="text-xs justify-end"
          />
          <Column
            field="total"
            header="Нийт үнэ"
            className="text-xs justify-end textAlign: left"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            bodyClassName="flex items-center justify-end"
            body={(data) => {
              return Intl.NumberFormat("en-US").format(data.total);
            }}
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
                        type: "ORDER",
                        data: {
                          modal_edit: true,
                          delguur_id: item.delguur_id,
                          delguur_ner: item.delguur_ner,
                          dt: item.register_date,
                          count: item.count,
                          baraa_id: item.baraa_id,
                          id: item.id,
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
                    onClick={() => deleteClick(item)}
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
