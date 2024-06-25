import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Input, Select, Modal, Switch, Radio } from "antd";
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
  const [loadingbtn, setLoadingbtn] = useState(false);

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

  const calculateApprovedTotal = (list_list) => {
    return _.sumBy(
      _.filter(list_list, (a) => parseInt(a.is_approve) === 1),
      "total"
    );
  };

  const PlanApprove = (item, ischecked) => {
    console.log("iteeeem", item, ischecked);
    Swal.fire({
      title: "Баталгаажуулалт",
      text: "Захиалгын төлбөр төлөлтийг баталгаажуулах уу",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Тийм",
      cancelButtonText: "Үгүй",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .put(
              "https://dmunkh.store/api/backend/orders/" + item.order_id,
              // "http://localhost:5000/api/backend/orders/" + item.order_id,
              {
                // delguur_id: item.delguur_id,
                // delguur_ner: item.delguur_ner,
                // order_number: item.order_number,
                cash: item.cash,
                // register_date: item.register_date,
                is_approve: 1,
              }
            )
            .then((response) => {
              dispatch({
                type: "STATE",
                data: { refresh: state.refresh + 1 },
              });
              setLoadingbtn(false);
            })
            .catch((error) => {
              setLoadingbtn(false);
              console.error("Error:", error);
            });
        } catch (error) {}
      } else {
        setLoadingbtn(false);
        Swal.fire("Баталгаажуулалт", "Баталгаажуулалт хийгдсэнгүй", "error");
      }
    });

    // API.postApprove({
    //   year: moment(date).format("Y"),
    //   department_id: id,
    //   module_id: module,
    //   is_closed: ischecked,
    // })
    //   .then(() => {
    //     // dispatch({ type: "REFRESH" });
    //     setRefresh(refresh + 1);
    //     message({
    //       type: "success",
    //       title: "Амжилттай хадгалагдлаа",
    //     });
    //     setLoadingbtn(false);
    //   })
    //   .catch((error) => {
    //     setLoadingbtn(false);
    //     message({
    //       type: "error",
    //       error,
    //       title: "Хааж чадсангүй.",
    //     });
    //   });
  };
  const deleteClick = (item) => {
    Swal.fire({
      text: item.delguur_ner + " дэлгүүрийн захиалгыг устгах уу",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1890ff",
      cancelButtonColor: "rgb(244, 106, 106)",
      confirmButtonText: "Тийм",
      cancelButtonText: "Үгүй",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(item);
        try {
          setLoading(true);
          axios
            .delete("https://dmunkh.store/api/backend/orders/" + item.order_id)
            // .delete("http://localhost:5000/api/backend/orders/" + item.order_id)
            .then((response) => {
              dispatch({
                type: "STATE",
                data: { refresh: state.refresh + 1 },
              });
            })
            .catch((error) => {
              console.error("Error:", error);
              setLoading(false);
            });
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      }
    });
  };
  return (
    <div className="w-full">
      <Modal
        style={{ width: "600", paddingTop: 0 }}
        bodyStyle={{ padding: 10 }}
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
          value={_.orderBy(state.balanceGroup_list, ["delguur_id"])}
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
          // rowGroupMode="subheader"
          // groupRowsBy="delguur_ner"
          scrollHeight={window.innerHeight - 360}
          globalFilterFields={["delguur_ner", "order_id", "user_name"]}
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
                      data: { modal: true, order_id: 0, delguur_id: null },
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
                <span className="ml-1">{data.delguur_ner}</span>
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
                  className="w-[80px] text-xs justify-end justify-items-end text-right"
                  footer={() => (
                    <div className="justify-items-end justify-end">
                      {Intl.NumberFormat("en-US").format(
                        _.sumBy(state.balanceGroup_list, (a) => a.total)
                      )}
                    </div>
                  )}
                />
                <Column
                  className="w-[80px] text-xs justify-end justify-items-end text-right"
                  footer={() => (
                    <div className="justify-items-end justify-end">
                      {Intl.NumberFormat("en-US").format(
                        _.sumBy(state.balanceGroup_list, (a) => a.cash)
                      )}
                    </div>
                  )}
                />

                <Column
                  colspan={3}
                  className="w-[310px] text-xs justify-start"
                  footer={() => (
                    <div className="justify-items-end justify-start text-left">
                      Үлдэгдэл:{" "}
                      {Intl.NumberFormat("en-US").format(
                        _.sumBy(state.balanceGroup_list, (a) => a.total) -
                          _.sumBy(state.balanceGroup_list, (a) => a.cash) -
                          calculateApprovedTotal(state.balanceGroup_list)
                      )}{" "}
                      / Хаасан:{" "}
                      {Intl.NumberFormat("en-US").format(
                        calculateApprovedTotal(state.balanceGroup_list)
                      )}
                    </div>
                  )}
                />

                {/* <Column
                  className="w-[100px] text-xs"
                  // footer={() => }
                />
                <Column
                  className="w-[40px] text-xs"
                  // footer={() => }
                /> */}
              </Row>
            </ColumnGroup>
          }
        >
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
                </div>
              );
            }}
          />
          <Column
            align="center"
            header="№"
            className="text-xs"
            style={{ minWidth: "40px", maxWidth: "40px" }}
            body={(data, row) => row.rowIndex + 1}
          />
          <Column
            style={{ minWidth: "50px", maxWidth: "50px" }}
            field="order_id"
            className="text-xs"
            header="Order"
          />
          <Column
            sortable
            field="delguur_ner"
            header="Дэлгүүр"
            className="text-xs w-[140px]"
            body={(data) => {
              return parseInt(data.is_approve) === 1 ? (
                <span>
                  <i
                    className="ft-check font-bold"
                    style={{ color: "#4CAF50" }}
                  />{" "}
                  {data.delguur_ner}
                </span>
              ) : (
                <span>{data.delguur_ner}</span>
              );
            }}
          />

          <Column
            sortable
            field="register_date"
            header="Огноо"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            className="text-xs"
            body={(data) => {
              return dayjs(data.register_date).format("YYYY-MM-DD");
            }}
          />
          <Column
            field="total"
            header="Нийт дүн"
            className="text-xs justify-end"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            body={(data) => {
              return Intl.NumberFormat("en-US").format(data.total);
            }}
          />
          <Column
            field="cash"
            header="Бэлэн төлөлт"
            className="text-xs justify-end"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            body={(data) => {
              return Intl.NumberFormat("en-US").format(data.cash);
            }}
          />

          <Column
            field="count"
            header="Үлдэгдэл"
            className="text-xs justify-end"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            body={(data) => {
              return Intl.NumberFormat("en-US").format(data.total - data.cash);
            }}
          />
          <Column
            field="is_approve"
            header="Төлбөр дуусгах"
            className="text-xs"
            style={{ minWidth: "70px", maxWidth: "70px" }}
            body={(item) => {
              return (
                <div className="flex items-center justify-center gap-3">
                  <Spin tip="." className="bg-opacity-80" spinning={loadingbtn}>
                    <Switch
                      checkedChildren={
                        <i className="fa fa-check  text-green-600" />
                      }
                      unCheckedChildren={<i className="fa fa-times " />}
                      checked={item.is_approve}
                      onChange={(value) => {
                        setLoadingbtn(true);
                        PlanApprove(item, value);
                      }}
                    />
                  </Spin>
                </div>
              );
            }}
          />
          <Column
            field="user_name"
            header="Бүртгэсэн"
            className="text-xs"
            style={{ minWidth: "100px", maxWidth: "100px" }}
          />
          <Column
            align="center"
            header=""
            className="text-xs"
            style={{ minWidth: "60px", maxWidth: "60px" }}
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
                          order_id: item.order_id,
                          modal: true,
                          delguur_id: item.delguur_id,
                          dt: item.register_date,
                          cash: item.cash,
                          is_approve: item.is_approve,
                        },
                      });
                    }}
                  >
                    <i className="ft-edit" />
                  </button>
                  {item.total === 0 || item.total === null ? (
                    <button
                      className="p-1 flex items-center justify-center font-semibold text-red-500 rounded-full border-2 border-red-500 hover:bg-red-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                      onClick={() => deleteClick(item)}
                    >
                      <i className="ft-trash-2" />
                    </button>
                  ) : (
                    ""
                  )}
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
