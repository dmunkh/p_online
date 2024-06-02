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
import MODAL from "src/pages/plan/modal";
// import { useUserContext } from "src/contexts/userContext";
import axios from "axios";
import AddBtn from "src/components/button/plusButton";
import useBearStore from "src/state/state";
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
  const user_id = useBearStore((state) => state.user_id);
  console.log(user_id);
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
          "https://dmunkh.store/api/backend/baraa",
          { params: { user_id: user_id } }
        );
        console.log(response.data.response);
        // var result = _(response.data)
        //   .groupBy("baraa_ner")
        //   .map(function (items, baraa_ner) {
        //     return {
        //       itemname: baraa_ner,
        //       count: _.sumBy(items, "id"),
        //     };
        //   })
        //   .value();

        setList(_.orderBy(response.data.response, ["id"]));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError(error);
      }
    };

    fetchData();
  }, [state.refresh]);

  const deleteClick = (item) => {
    try {
      const response = axios.delete(
        "https://dmunkh.store/api/backend/baraa/" + item.id
      );
      dispatch({
        type: "STATE",
        data: { refresh: state.refresh + 1 },
      });

      console.log("return", response.data);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Modal
        style={{ width: "600" }}
        width={800}
        height={550}
        visible={state.baraa.modal}
        // visible={true}
        onCancel={() => dispatch({ type: "BARAA", data: { modal: false } })}
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
                      type: "BARAA",
                      data: {
                        modal: true,
                        id: 0,
                        baraa_ner: "",
                        company_id: "",
                        company_ner: "",
                        price: "",
                        unit: "",
                        box_count: "",
                        bar_code: null,
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
        >
          <Column
            align="center"
            header="№"
            className="text-xs w-2"
            style={{ minWidth: "40px", maxWidth: "40px" }}
            body={(data, row) => row.rowIndex + 1}
          />
          <Column
            style={{ minWidth: "60px", maxWidth: "60px" }}
            field="id"
            header="id"
          />
          <Column
            style={{ minWidth: "100px", maxWidth: "100px" }}
            field="bar_code"
            header="bar_code"
            className="text-xs w-2"
          />
          <Column
            style={{ minWidth: "60px", maxWidth: "60px" }}
            field="company_id"
            header="company_id"
            className="text-xs w-2"
          />

          <Column
            field="company_ner"
            header="Компани"
            className="text-xs w-2"
            style={{ minWidth: "120px", maxWidth: "120px" }}
          />
          {/* <Column
          field="year"
          header="Огноо"
          style={{ minWidth: "90px", maxWidth: "90px" }}
          body={(data) => {
            return data.year && data.year + "-" + data.month + "-" + data.day;
          }}
        /> */}
          <Column
            sortable
            field="baraa_ner"
            header="Барааны нэр"
            className="text-xs w-2"
          />
          <Column
            field="une"
            header="Нэгж үнэ"
            className="text-xs w-2"
            style={{ minWidth: "80px", maxWidth: "80px" }}
          />
          <Column
            field="unit"
            header="Хэмжих нэгж"
            className="text-xs w-2"
            style={{ minWidth: "80px", maxWidth: "80px" }}
          />
          <Column
            field="box_count"
            header="Хайрцаг"
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
                  {/* {checkRole(["xx_warehouseItem_edit"]) && ( */}
                  <button
                    className="p-1 flex items-center justify-center font-semibold text-green-500 rounded-full border-2 border-green-500 hover:bg-green-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                    onClick={() => {
                      dispatch({
                        type: "BARAA",
                        data: {
                          modal: true,
                          id: item.id,
                          baraa_ner: item.baraa_ner,
                          company_id: item.company_id,
                          company_ner: item.company_ner,
                          price: item.une,
                          unit: item.unit,
                          box_count: item.box_count,
                          bar_code: item.bar_code,
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

export default React.memo(Workers);
