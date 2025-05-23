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
import MODAL from "src/pages/delguur/modal";
// import { useUserContext } from "src/contexts/userContext";
import axios from "axios";
import AddBtn from "src/components/button/plusButton";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import delguur from ".";

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

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const fetchData = async () => {
      try {
        setLoading(true);
        // const response = await axios.get(
        const response = await fetch(
          // "http://localhost:5000/api/backend/delguur"
          "https://dmunkh.store/api/backend/delguur"
          // {
          //   headers: {
          //     Authorization: `Bearer ${token}`, // Include 'Bearer' before the token
          //     "Content-Type": "application/json",
          //   },
          // }
          // "http://3.0.177.127/api/backend/delguur"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();

        // setData(jsonData);

        setList(_.orderBy(jsonData.response, ["id"]));
        dispatch({ type: "STATE", data: { delguur_list: jsonData.response } });

        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError(error);
      }
    };

    fetchData();
  }, [state.refresh]);

  const exportToExcel = (list) => {
    let Heading = [
      ["№", "Дэлгүүр нэр", "Компани", "Хаяг", "Утас", "Регистер", "Данс"],
    ];
    var result = _.map(_.orderBy(list, ["delguur_ner"]), (a, i) => {
      return {
        i: i + 1,
        ner: a.delguur_ner,
        uldegdel: a.company_name,
        d_hayag: a.d_hayag,
        d_utas: a.d_utas,
        d_register: a.d_register,
        d_dans: a.d_dans,
      };
    });

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
      "Дэлгүүр" + moment().format("YYYY_MM_сар") + ".xlsx",
      {
        compression: true,
      }
    );
  };
  return (
    <>
      {" "}
      <Modal
        style={{ width: "600" }}
        width={800}
        height={550}
        visible={state.delguur.modal}
        // visible={true}
        onCancel={() => dispatch({ type: "DELGUUR", data: { modal: false } })}
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
          removableSort
          showGridlines
          className="table-xs"
          filterDisplay="menu"
          responsiveLayout="scroll"
          sortMode="multiple"
          rowGroupMode="subheader"
          groupRowsBy="negj_namemnfull"
          scrollHeight={window.innerHeight - 360}
          globalFilterFields={[
            "delguur_ner",
            "company_name",
            "d_hayag",
            "d_register",
            "d_utas",
          ]}
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
                      type: "DELGUUR",
                      data: {
                        id: 0,
                        delguur_ner: "",
                        dans: "",
                        register: "",
                        hayag: "",
                        utas: "",
                        modal: true,
                      },
                    });
                  }}
                >
                  <i className="ft-plus" />
                </div>{" "}
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
        >
          <Column
            align="center"
            header="№"
            className="text-xs w-2"
            style={{ minWidth: "40px", maxWidth: "40px" }}
            body={(data, row) => row.rowIndex + 1}
          />
          <Column
            sortable
            field="delguur_ner"
            header="Дэлгүүр нэр"
            className="text-xs w-2"
          />
          <Column
            className="text-xs w-2"
            field="company_name"
            header="Компани нэр"
          />
          {/* <Column
          field="year"
          header="Огноо"
          style={{ minWidth: "90px", maxWidth: "90px" }}
          body={(data) => {
            return data.year && data.year + "-" + data.month + "-" + data.day;
          }}
        /> */}
          <Column field="d_hayag" header="Хаяг" className="text-xs w-2" />
          <Column
            field="d_utas"
            header="Утас"
            className="text-xs w-2"
            style={{ minWidth: "80px", maxWidth: "80px" }}
          />
          <Column
            field="d_register"
            header="Регистер"
            className="text-xs w-2"
            style={{ minWidth: "80px", maxWidth: "80px" }}
          />
          <Column
            field="d_dans"
            header="Данс"
            className="text-xs w-2"
            style={{ minWidth: "90px", maxWidth: "90px" }}
          />
          <Column
            align="center"
            header=""
            className="text-xs w-2"
            style={{ minWidth: "70px", maxWidth: "70px" }}
            headerClassName="flex items-center justify-center"
            body={(item) => {
              return (
                <div className="flex items-center justify-center gap-2">
                  <button
                    className="p-1 flex items-center justify-center font-semibold text-green-500 rounded-full border-2 border-green-500 hover:bg-green-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                    onClick={() => {
                      dispatch({
                        type: "DELGUUR",
                        data: {
                          id: item.id,
                          delguur_ner: item.delguur_ner,
                          dans: item.d_dans,
                          register: item.d_register,
                          hayag: item.d_hayag,
                          utas: item.d_utas,
                          company_name: item.company_name,
                          modal: true,
                        },
                      });
                    }}
                  >
                    <i className="ft-edit" />
                  </button>

                  <button
                    className="p-1 flex items-center justify-center font-semibold text-red-500 rounded-full border-2 border-red-500 hover:bg-red-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                    onClick={() => {}}
                  >
                    <i className="ft-trash" />
                  </button>
                </div>
              );
            }}
          />
        </DataTable>
      </Spin>
    </>
  );
};

export default React.memo(Workers);
