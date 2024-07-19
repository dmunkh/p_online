import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Input, Select, Modal, DatePicker } from "antd";
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
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import Company from "src/components/Company";

const SaleList = () => {
  // const { message, checkRole } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [date, setdate] = useState(moment());
  const main_company_id = useBearStore((state) => state.main_company_id);
  const user_id = useBearStore((state) => state.user_id);

  console.log(state.balance.seller_id);
  useEffect(() => {
    if (state.balance.seller_id !== null) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            "https://dmunkh.store/api/backend/balance/group/user_zone",
            // "http://localhost:5000/api/backend/balance/group/user_zone",
            {
              params: {
                sub_code: state.balance.seller_id, // Add your parameters here
                dt: moment(date).format("YYYY.MM.DD"),
              },
            }
          );

          var result = _(response.data)
            .groupBy("baraa_ner")
            .map(function (items, baraa_ner) {
              return {
                itemname: baraa_ner,
                count: _.sumBy(items, "id"),
              };
            })
            .value();

          setList(_.orderBy(response.data, ["uldegdel", "desc"]));
          setLoading(false);
        } catch (error) {
          setLoading(false);
          // setError(error);
        }
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.balance.seller_id, date]);

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
      <div className="flex p-1 gap-2">
        <DatePicker
          allowClear={false}
          className="md:w-[150px] text-xs"
          value={moment(date)}
          onChange={(date) => {
            setdate(date);
          }}
        />
        <div className="w-full">
          <Company
            value={state.balance.seller_id}
            onChange={(value) => {
              dispatch({ type: "BALANCE", data: { seller_id: value } });
            }}
          />
        </div>
      </div>
      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <DataTable
          size="small"
          value={list}
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
            field="ner"
            header="Барааны нэр"
            className="text-xs"
            style={{ minWidth: "280px", maxWidth: "280px" }}
          />
          <Column
            sortable
            field="uldegdel"
            header="Үлдэгдэл"
            className="text-xs text-blue-600 font-bold justify-end"
            style={{ minWidth: "80px", maxWidth: "80px" }}
          />
          <Column
            sortable
            field="orlogo"
            header="Орлого"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            className="text-xs justify-end text-green-700"
            body={(data) => {
              return data.orlogo ? data.orlogo : "";
            }}
          />
          <Column
            field="zahialga"
            header="Захиалга"
            className="text-xs justify-end text-red-700"
            style={{ minWidth: "70px", maxWidth: "70px" }}
            body={(data) => {
              return data.zahialga ? data.zahialga : "";
            }}
          />
          <Column
            field="ehni_uldegdel"
            header="Эхний үлдэгдэл"
            className="text-xs justify-end"
            style={{ minWidth: "70px", maxWidth: "70px" }}
            body={(data) => {
              return data.ehni_uldegdel ? data.ehni_uldegdel : "";
            }}
          />
          <Column
            field="zarlaga"
            header="Зарлага"
            className="text-xs justify-end"
            style={{ minWidth: "70px", maxWidth: "70px" }}
            body={(data) => {
              return data.zarlaga ? data.zarlaga : "";
            }}
          />
          <Column
            field="hayagdal"
            header="Хаягдал"
            className="text-xs justify-end"
            style={{ minWidth: "70px", maxWidth: "70px" }}
            body={(data) => {
              return data.hayagdal ? data.hayagdal : "";
            }}
          />
          <Column
            field="bonus"
            header="Урамшуулал"
            className="text-xs justify-end"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            body={(data) => {
              return data.bonus ? data.bonus : "";
            }}
          />
          <Column
            field="box_count"
            header="Хайрцаг тоо"
            className="text-xs justify-end"
            style={{ minWidth: "70px", maxWidth: "70px" }}
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

export default React.memo(SaleList);
