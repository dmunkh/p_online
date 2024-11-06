import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Input, Select, Modal, Switch, Checkbox } from "antd";
import _ from "lodash";

import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { FilterMatchMode } from "primereact/api";
import { usePlanContext } from "src/contexts/planContext";
import MODAL from "src/pages/order/modal";
import MODAL_ADD_BARAA from "src/pages/order/modal_add_baraa";
import MODAL_DRIVER from "src/pages/order/modal_add_driver";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import useBearStore from "src/state/state";
// import { useUserContext } from "src/contexts/userContext";
import axios from "axios";
import dayjs from "dayjs";
import AddBtn from "src/components/button/plusButton";
import Print from "./print";
import Print_Total from "./print_total";
import Print_order_list from "./print_order_list";
import PdfModal from "./printpdf";
import Swal from "sweetalert2";

import { jsPDF } from "jspdf";
const Workers = () => {
  // const { message, checkRole } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [pdfBlob, setPdfBlob] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [first, set_first] = useState(0);
  const [loadingbtn, setLoadingbtn] = useState(false);
  const [draw, setDraw] = useState(0);
  const [modalprint, setmodalprint] = useState(false);
  const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);
  const [is_approve, setis_approve] = useState(0);
  const [is_print, setis_print] = useState(0);
  const [list, setList] = useState([]);
  const main_company_id = useBearStore((state) => state.setMainCompanyID);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [draw_check, setdraw_check] = useState(1);
  const handleButtonClick = (user_id) => {
    // const url = `https://main.d5ki8wb12wcij.amplifyapp.com/order/print?user_id=${user_id}`;
    const url = `https://dmunkh.store/order/print?user_id=${user_id}`;
    window.open(url, "_blank");
  };
  const [showModal, setShowModal] = useState(false);
  const list1 = ["Item 1", "Item 2", "Item 3"]; // Example list

  const handleGeneratePdf = () => {
    console.log("modal starts");
    const blob = generatePdf(list1);
    setPdfBlob(blob);
    setShowModal(true); // Open the modal
    console.log(showModal);
  };
  const generatePdf = (list) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("My List Header", 10, 20);

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);

    // List Content
    doc.setFontSize(12);
    list.forEach((item, index) => {
      doc.text(`${index + 1}. ${item}`, 10, 40 + index * 10);
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.line(10, pageHeight - 30, 200, pageHeight - 30);
    doc.setFontSize(10);
    doc.text("This is the footer text", 10, pageHeight - 20);

    return doc.output("blob"); // Returns a blob for previewing
  };
  const calculateApprovedTotal = (list_list) => {
    return _.sumBy(
      _.filter(list_list, (a) => parseInt(a.is_approve) === 1),
      "total"
    );
  };

  const PlanApprove = (type, item, ischecked) => {
    Swal.fire({
      title: "Баталгаажуулалт",
      text:
        type === "approve"
          ? "Захиалгын төлбөр төлөлтийг баталгаажуулах уу"
          : "Хэвлэсэн үү",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Тийм",
      cancelButtonText: "Үгүй",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          var result1 = state.balanceGroup_list;

          var index = _.findIndex(result1, {
            order_id: item.order_id,
          });
          var dt = result1[index].print_date;

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
                is_approve: type === "approve" ? ischecked : item.is_approve,
                is_print: type === "print" ? ischecked : item.is_print,
                print_date:
                  type === "print" ? moment().format("YYYY-MM-DD HH:mm") : dt,
              }
            )
            .then((response) => {
              var index = _.findIndex(result1, {
                order_id: item.order_id,
              });

              if (type === "approve") {
                result1[index].is_approve = ischecked;
                // result1[index].is_print = dt;
              } else {
                result1[index].is_print = ischecked;
                result1[index].print_date = moment().format("YYYY-MM-DD HH:mm");
              }
              dispatch({ type: "STATE", data: { balanceGroup_list: result1 } });
              // setList(result);
              setDraw(draw + 1);
              // dispatch({
              //   type: "STATE",
              //   data: { refresh: state.refresh + 1 },
              // });
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

  const check_position = (e, item) => {
    var result = state.order.checked_positionList;

    if (e.target.checked) {
      result.push({
        order_id: item.order_id,
      });
    } else {
      result = _.reject(
        state.order.checked_positionList,
        (a) => a.order_id === item.order_id
      );
    }

    dispatch({
      type: "ORDER",
      data: { checked_positionList: result },
    });
    // dispatch({
    //   type: "REFRESH_NORM",
    // });

    // result.length > 1 &&
    //   dispatch({
    //     type: "STATE",
    //     data: { list_norm: [], selectedpositionname: null },
    //   });
    setdraw_check((prev) => prev + 1);
  };
  const onCheckboxChange = (e, rowData) => {
    let selected = [...selectedItems];
    if (e.checked) {
      selected.push(rowData);
    } else {
      selected = selected.filter((item) => item !== rowData);
    }
    setSelectedItems(selected);
  };

  const checkboxTemplate = (rowData) => {
    return (
      <Checkbox
        onChange={(e) => onCheckboxChange(e, rowData)}
        checked={selectedItems.includes(rowData)}
      />
    );
  };
  return (
    <div className="w-full">
      <PdfModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        pdfBlob={pdfBlob}
      />
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
        style={{ width: "600", paddingTop: 0 }}
        bodyStyle={{ padding: 10 }}
        width={800}
        height={550}
        visible={state.order.modal_print_total}
        // visible={true}
        onCancel={() =>
          dispatch({ type: "ORDER", data: { modal_print_total: false } })
        }
        // closeIcon={<div className="">x</div>}
        footer={false}
      >
        <Print_Total />
      </Modal>
      <Modal
        style={{ width: "600", paddingTop: 0 }}
        bodyStyle={{ padding: 10 }}
        width={800}
        height={550}
        visible={state.order.modal_print_order_list}
        // visible={true}
        onCancel={() =>
          dispatch({ type: "ORDER", data: { modal_print_order_list: false } })
        }
        // closeIcon={<div className="">x</div>}
        footer={false}
      >
        <Print_order_list />
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
        style={{ width: "600" }}
        width={800}
        height={550}
        visible={state.order.modal_driver}
        // visible={true}
        onCancel={() =>
          dispatch({ type: "ORDER", data: { modal_driver: false } })
        }
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <MODAL_DRIVER />
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
      .
      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <DataTable
          size="small"
          value={_.orderBy(state.balanceGroup_list, [
            "xt_id",
            "delguur_id",
            "register_date",
          ])}
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
          groupRowsBy="xt_id"
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
                <div
                  title="Хүргэлт хийх ажилтан бүртгэх"
                  className="p-1 flex items-center justify-center font-semibold text-green-600 border-2 border-green-600 rounded-full hover:bg-green-600 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer "
                  onClick={() => {
                    state.order.checked_positionList &&
                    state.order.checked_positionList.length > 0
                      ? dispatch({
                          type: "ORDER",
                          data: { modal_driver: true },
                        })
                      : Swal.fire({
                          text: "Захиалга сонгоогүй байна",
                          icon: "warning",

                          cancelButtonColor: "rgb(244, 106, 106)",
                          cancelButtonText: "OK",
                        });
                  }}
                >
                  <i className="ft-edit" />
                </div>
                <div
                  title="Захиалгын жагсаалт хэвлэх"
                  className="p-1 flex items-center justify-center font-semibold text-green-600 border-2 border-green-600 rounded-full hover:bg-green-600 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer "
                  onClick={() => {
                    state.order.checked_positionList &&
                    state.order.checked_positionList.length > 0
                      ? dispatch({
                          type: "ORDER",
                          data: { modal_print_order_list: true },
                        })
                      : Swal.fire({
                          text: "Захиалга сонгоогүй байна",
                          icon: "warning",

                          cancelButtonColor: "rgb(244, 106, 106)",
                          cancelButtonText: "OK",
                        });
                  }}
                >
                  <i className="ft-user" />
                </div>
                <div
                  title="Барааны нэгдсэн жагсаалт хэвлэх"
                  className="p-1 flex items-center justify-center font-semibold text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-600 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer "
                  onClick={handleGeneratePdf}
                  // onClick={() => {
                  //   state.order.checked_positionList &&
                  //   state.order.checked_positionList.length > 0
                  //     ? dispatch({
                  //         type: "ORDER",
                  //         data: { modal_print_total: true },
                  //       })
                  //     : Swal.fire({
                  //         text: "Дэлгүүр сонгоогүй байна",
                  //         icon: "warning",

                  //         cancelButtonColor: "rgb(244, 106, 106)",
                  //         cancelButtonText: "OK",
                  //       });
                  // }}
                >
                  <i className="ft-printer" />
                </div>
                <div
                  title="Барааны нэгдсэн жагсаалт хэвлэх"
                  className="p-1 flex items-center justify-center font-semibold text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-600 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer "
                  onClick={handleGeneratePdf}
                  // onClick={() => {
                  //   state.order.checked_positionList &&
                  //   state.order.checked_positionList.length > 0
                  //     ? dispatch({
                  //         type: "ORDER",
                  //         data: { modal_print_total: true },
                  //       })
                  //     : Swal.fire({
                  //         text: "Дэлгүүр сонгоогүй байна",
                  //         icon: "warning",

                  //         cancelButtonColor: "rgb(244, 106, 106)",
                  //         cancelButtonText: "OK",
                  //       });
                  // }}
                >
                  <i className="ft-printer" />
                </div>
              </div>
            </div>
          }
          // rowGroupHeaderTemplate={(data) => {
          //   return (
          //     <div className="text-xs font-semibold">
          //       <span className="ml-1">
          //         {data.xt_id} - {data.xt_name} - {data.xt_phone}
          //       </span>
          //     </div>
          //   );
          // }}
          rowGroupHeaderTemplate={(data) => {
            var group = _.filter(
              state.balanceGroup_list,
              (a) => a.xt_id === data.xt_id
            );

            return (
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      dispatch({
                        type: "ORDER",
                        data: {
                          checked_positionList: _.filter(
                            state.balanceGroup_list,
                            (a) => a.xt_id === data.xt_id
                          ),
                        },
                      });
                    } else {
                      dispatch({
                        type: "ORDER",
                        data: {
                          checked_positionList: [],
                        },
                      });
                      // dispatch({
                      //   type: "STATE",
                      //   data: {
                      //     checked_positionList: _.reject(
                      //       result,
                      //       (a) => a.negj_code === data.negj_code
                      //     ),
                      //   },
                      // });
                    }
                  }}
                />
                <span>
                  {data.xt_id} - {data.xt_name} - {data.xt_phone} | Падааны тоо:{" "}
                  {Intl.NumberFormat("en-US").format(group.length)} Үнийн дүн:{" "}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "blue",
                    }}
                  >
                    {Intl.NumberFormat("en-US").format(_.sumBy(group, "total"))}
                  </span>{" "}
                  Бэлэн:{" "}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "green",
                    }}
                  >
                    {Intl.NumberFormat("en-US").format(_.sumBy(group, "cash"))}
                  </span>{" "}
                  Зээл:{" "}
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "red",
                    }}
                  >
                    {Intl.NumberFormat("en-US").format(
                      _.sumBy(group, "total") - _.sumBy(group, "cash")
                    )}
                  </span>{" "}
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
                  className="w-[450px] text-xs justify-start"
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
            style={{ minWidth: "50px", maxWidth: "50px" }}
            className="text-xs w-[50px]"
            body={(item) => {
              var checked = false;

              var aa = _.find(state.order.checked_positionList, {
                order_id: item.order_id,
              });

              if (aa !== undefined) checked = true;

              return (
                <Checkbox
                  key={item.id}
                  checked={checked}
                  onChange={(e) => check_position(e, item)}
                />
              );
            }}
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-center justify-center"
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
                          xt_id: item.xt_id,
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
          {/* <Column
            style={{ minWidth: "50px", maxWidth: "50px" }}
            field="xt_id"
            className="text-xs"
            header="Order"
          /> */}
          <Column
            sortable
            field="delguur_ner"
            header="Дэлгүүр"
            className="text-sm text-black"
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
            className="text-sm text-black justify-end"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            body={(data) => {
              return Intl.NumberFormat("en-US").format(data.total);
            }}
          />
          <Column
            field="cash"
            header="Бэлэн төлөлт"
            className="text-sm text-black justify-end"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            body={(data) => {
              return Intl.NumberFormat("en-US").format(data.cash);
            }}
          />
          <Column
            field="count"
            header="Үлдэгдэл"
            className="text-sm text-black justify-end"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            body={(data) => {
              return Intl.NumberFormat("en-US").format(data.total - data.cash);
            }}
          />
          <Column
            field="is_print"
            header="Хэвлэлт"
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
                      checked={item.is_print}
                      onChange={(value) => {
                        setLoadingbtn(true);
                        PlanApprove("print", item, value);
                      }}
                    />
                  </Spin>{" "}
                </div>
              );
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
                        PlanApprove("approve", item, value);
                      }}
                    />
                  </Spin>
                </div>
              );
            }}
          />
          <Column
            field="dist_user_name"
            header="Хүргэлт"
            className="text-xs"
            style={{ minWidth: "70px", maxWidth: "70px" }}
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
                          is_print: item.is_print,
                          print_date: item.print_date,
                          xt_id: item.xt_id,
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
