import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Input, Select, Modal } from "antd";
import useBearStore from "src/state/state";
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
import AddBtn from "src/components/button/plusButton";
import * as XLSX from "xlsx";
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
  const user_id = useBearStore((state) => state.user_id);

  const group_data = [
    { id: 1, baraa_group_name: "Майонез-Лука" },
    { id: 2, baraa_group_name: "G7 кофе" },
    { id: 3, baraa_group_name: "Агро" },
    { id: 4, baraa_group_name: "Saigon" },
    { id: 5, baraa_group_name: "Chili" },
  ];

  const grouped = state.balance.balance_list_group.reduce((acc, item) => {
    const key = item.baraa_type_id;

    if (key == null) return acc; // skip null

    if (!acc[key]) {
      const groupInfo = group_data.find((group) => group.id === key);

      acc[key] = {
        baraa_type_id: key,
        baraa_group_name: groupInfo
          ? groupInfo.baraa_group_name
          : "Тодорхойгүй",
        total: 0,
        total_count: 0,
      };
    }

    const itemCount = item.count ?? 0;
    const itemPrice = item.price ?? 0;

    acc[key].total += itemCount * itemPrice;
    acc[key].total_count += itemCount;

    return acc;
  }, {});

  const result = Object.values(grouped);

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
  const exportToExcel = (list) => {
    let Heading = [["№", "Бараа нэр", "Үлдэгдэл", "Орлого"]];
    var result = _.map(_.orderBy(list, ["ner"]), (a, i) => {
      return {
        i: i + 1,
        baraa_ner: a.ner,
        uldegdel: a.uldegdel,
        orlogo: a.orlogo,
      };
    });
    // result.push({
    //   i: "",
    //   itemname: "Нийт",
    //   time: "",
    //   unitname: "",
    //   sizemin: _.countBy(list, (a) => a.sizemin),
    //   sizemax: _.countBy(list, (a) => a.sizemax),
    //   sizestep: _.sumBy(list, (a) => a.sizestep),
    //   relation_count: _.sumBy(list, (a) => a.relation_count),
    // });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: "A1" });
    XLSX.utils.sheet_add_json(worksheet, result, {
      origin: "A2",
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(
      workbook,
      "Үлдэгдэл" + moment().format("YYYY_MM_сар") + ".xlsx",
      {
        compression: true,
      }
    );
  };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(
  //         "http://tugeelt.online/api/backend/balance/group",
  //         // "http://localhost:5000/api/backend/balance/group",
  //         {
  //           params: {
  //             user_id: user_id, // Add your parameters here
  //             start_date: moment(state.balance.start_date).format("YYYY.MM.DD"),
  //             end_date: moment(state.balance.end_date).format("YYYY.MM.DD"),
  //           },
  //         }
  //       );

  //       var result = _(response.data)
  //         .groupBy("baraa_ner")
  //         .map(function (items, baraa_ner) {
  //           return {
  //             itemname: baraa_ner,
  //             count: _.sumBy(items, "id"),
  //           };
  //         })
  //         .value();

  //       setList(_.orderBy(response.data, ["id"]));
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //       // setError(error);
  //     }
  //   };

  //   fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.refresh, state.balance.start_date, state.balance.end_date]);

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
      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <DataTable
          size="small"
          value={result}
          dataKey="id"
          filters={search}
          paginator
          rowHover
          scrollable
          removableSort
          showGridlines
          className="table-xs"
          filterDisplay="menu"
          responsiveLayout="scroll"
          sortMode="multiple"
          rowGroupMode="subheader"
          groupRowsBy="negj_namemnfull"
          scrollHeight={window.innerHeight - 360}
          globalFilterFields={["ner"]}
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
                  className="p-1 flex items-center justify-center font-semibold text-blue-500 border-2 border-blue-500 rounded-full hover:bg-blue-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer "
                  onClick={() => {
                    dispatch({ type: "STATE", data: { modal: true } });
                  }}
                >
                  <i className="ft-search" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <img
                  alt=""
                  title="Excel татах"
                  src="/img/excel.png"
                  className="w-12 h-8 object-cover cursor-pointer hover:scale-125 duration-300"
                  onClick={() => exportToExcel(list)}
                />
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
            className="text-xs"
            style={{ minWidth: "40px", maxWidth: "40px" }}
            body={(data, row) => row.rowIndex + 1}
          />
          {/* <Column
            style={{ minWidth: "60px", maxWidth: "60px" }}
            field="id"
            className="text-xs"
            header="Order"
          /> */}
          <Column
            sortable
            field="baraa_group_name"
            header="Барааны нэр"
            className="text-xs"
          />
          <Column
            sortable
            field="total_count"
            header="Тоо ширхэг"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            className="text-xs justify-end text-green-700"
          />
          <Column
            sortable
            field="total"
            header="Нийт үнэ"
            className="text-xs text-black-600 font-bold justify-end"
            style={{ minWidth: "120px", maxWidth: "120px" }}
            body={(data) => {
              return Intl.NumberFormat("en-US").format(data.total);
            }}
          />

          <Column
            align="center"
            header=""
            className="text-xs"
            style={{ minWidth: "40px", maxWidth: "40px" }}
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
                        data: { modal: true },
                      });
                      dispatch({
                        type: "BARAA",
                        data: {
                          id: item.id,
                          baraa_ner: item.baraa_ner,
                          company_id: item.company_id,
                          company_ner: item.company_ner,
                          price: item.une,
                          unit: item.unit,
                          box_count: item.box_count,
                        },
                      });
                    }}
                  >
                    <i className="ft-edit" />
                  </button>
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
