import React, { useState, useEffect } from "react";
import * as API from "src/api/plan";
import { useUserContext } from "src/contexts/userContext";
import { usePlanContext } from "src/contexts/planContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
// import Module from "src/components/custom/module";

import dayjs from "dayjs";
// import _ from "lodash";
import {
  DatePicker,
  Spin,
  Modal,
  InputNumber,
  Input,
  Select,
  Space,
} from "antd";
import SaveButton from "src/components/button/SaveButton";
import _ from "lodash";
import axios from "axios";
// import Swal from "sweetalert2";
const { Option } = Select;

const ModalNormDetail = () => {
  const { message } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);

  const [delguur_ner, setdelguur_ner] = useState("");
  const [utas, setutas] = useState(0);
  const [dans, setdans] = useState("");
  const [register, setregister] = useState(0);
  const [baraa, setbaraa] = useState();
  const [hayag, sethayag] = useState("");

  const [company, setCompany] = useState([]);
  const [count, setcount] = useState(0);
  const [boxcount, setboxcount] = useState(0);

  const [unit, setunit] = useState("ш");
  const [price, setprice] = useState(0);
  const [date, setdate] = useState(dayjs());
  const [refresh, setrefresh] = useState(0);

  const [list, setList] = useState([]);

  const [baraa_list, setBaraa_list] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          // "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/baraa"
          // "http://3.0.177.127/api/backend/baraa"
          "http://localhost:5000/api/backend/balance"
        );
        console.log(response.data.response);

        setList(_.orderBy(response.data.response, ["id"]));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError(error);
      }
    };

    fetchData();
  }, [state.refresh, refresh]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          // "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/baraa"
          // "http://3.0.177.127/api/backend/baraa"
          "http://localhost:5000/api/backend/baraa"
        );
        console.log("baraa list", response.data.response);

        setBaraa_list(_.orderBy(response.data.response, ["id"]));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError(error);
      }
    };

    fetchData();
  }, [state.refresh]);

  const handleClick = () => {
    console.log(
      "INSERTING",
      // baraa[0].company_name,
      dayjs(date).format("YYYY"),
      dayjs(date).format("M")
    );

    try {
      console.log("try to insert", baraa[0]);
      const response = axios.post("http://localhost:5000/api/backend/balance", {
        type_id: 3,
        baraa_id: baraa[0].id,
        baraa_ner: baraa[0].baraa_ner,
        company_name: baraa[0].company_ner,
        company_id: baraa[0].company_id,
        delguur_id: state.order.delguur_id,
        delguur_ner: state.order.delguur_ner,
        count: count,
        unit: unit,
        price: price,
        register_date: dayjs(state.order.dt).format("YYYY.MM.DD"),
      });
      setrefresh(refresh + 1);
      dispatch({
        type: "STATE",
        data: { refresh: state.refresh + 1 },
      });

      console.log("return", response.data, "refresh", state.refresh);
      // const fetchData = async () => {
      //   try {
      //     const response = await axios.get(
      //       "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/balance"
      //     );
      //     console.log("data", response.data);
      //   } catch (error) {}
      // };

      // fetchData();
    } catch (error) {}
  };

  return (
    <div className="flex flex-col text-xs">
      <div>
        <h2 className=" text-center text-lg font-extrabold text-gray-900">
          Бараа нэмэх / {state.order.delguur_ner} -{" "}
          {dayjs(state.order.register_date).format("YYYY.MM.DD")} /
        </h2>
      </div>

      <hr className="my-2" />
      <div className="flex flex-col md:flex-row gap-2 ">
        <div className="md:w-1/2">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex p-1 gap-2">
              <div className="w-1/4">Бараа</div>
              <div className="w-3/4">
                <Select
                  showSearch
                  allowClear
                  placeholder="Сонгоно уу."
                  optionFilterProp="children"
                  className="w-full"
                  onChange={(value) => {
                    console.log(
                      value,
                      _.filter(baraa_list, (a) => a.id === value)
                    );
                    setbaraa(_.filter(baraa_list, (a) => a.id === value));
                    setprice(
                      _.filter(baraa_list, (a) => a.id === value)[0].une
                    );
                    setboxcount(0);
                    setcount(0);
                  }}
                >
                  {_.map(baraa_list, (item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.company_ner +
                        " - " +
                        item.baraa_ner +
                        " - " +
                        item.une}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex p-1 gap-2">
              <div className="w-1/4">Тоо ширхэг</div>
              <InputNumber
                value={count}
                onChange={(value) => setcount(value)}
              />
            </div>
            <div className="flex p-1 gap-2">
              <div className="w-1/4">Нэгж үнэ</div>
              <InputNumber
                value={price}
                onChange={(value) => setprice(value)}
              />
            </div>
            <div className="flex p-1 gap-2">
              <div className="w-1/4">Хэмжих нэгж</div>
              <div className="w-3/4">
                <Select
                  showSearch
                  allowClear
                  placeholder="Сонгоно уу."
                  optionFilterProp="children"
                  className="w-full"
                  value={unit}
                  onChange={(value) => setunit(value)}
                >
                  <Option key={"ш"} value={"ш"}>
                    ш
                  </Option>
                  <Option key={"кг"} value={"кг"}>
                    кг
                  </Option>
                  <Option key={"л"} value={"л"}>
                    л
                  </Option>
                </Select>
              </div>
            </div>
            <div className="flex p-1 gap-2">
              <div className="w-1/4">Хайрцаг</div>
              <div className="w-3/4">
                <InputNumber
                  value={boxcount}
                  onChange={(value) => {
                    setboxcount(value);
                    setcount(baraa[0].box_count * value);
                  }}
                />
              </div>
            </div>
            <Spin
              tip="Уншиж байна. Түр хүлээнэ үү"
              className="bg-opacity-60"
              spinning={loading}
            >
              <SaveButton
                onClick={() => {
                  setLoading(true);
                  handleClick();
                  setLoading(false);
                }}
              />
              {/* <button
          className="w-full py-2 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-md hover:bg-violet-500 hover:text-white focus:outline-none duration-300 "
          onClick={() => {
            setLoading(true);
            API.postPlanApprove({
              module_id: state.moduleid,
              year: moment(state.date).format("Y"),
              is_closed: 1,
              department_id: state.department_id,
            })
              .then((res) => {
                dispatch({
                  type: "STATE",
                  data: { refresh: state.refresh + 1 },
                });
                dispatch({ type: "STATE", data: { modal: false } });

                message({
                  type: "success",
                  title: "Баталгаажуулалт амжилттай",
                });

                setLoading(false);
              })
              .catch((error) => {
                message({
                  type: "error",
                  error,
                  title: "Жагсаалт татаж чадсангүй",
                });
                setLoading(false);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <i className="fa fa-save" />

          <span className="ml-2">Хадгалах</span>
        </button> */}
            </Spin>
          </div>
        </div>

        <div className="md:w-1/2">
          {" "}
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
                        <span className="ml-3">
                          Нийт: {options.totalRecords}
                        </span>
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
                      className="text-xs text-right"
                      footer={() => "Нийт"}
                    />
                    <Column
                      className="w-[120px] text-xs text-center"
                      footer={() => _.sumBy(list, (a) => a.price)}
                    />
                    <Column
                      className="w-[70px] text-xs text-right"
                      footer={() => ""}
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
                field="id"
                className="text-sm"
                header="Order"
              />
              <Column
                field="baraa_ner"
                header="Бараа"
                className="text-sm"
                style={{ minWidth: "120px", maxWidth: "120px" }}
              />
              <Column
                field="count"
                header="Тоо ширхэг"
                className="text-sm"
                style={{ minWidth: "80px", maxWidth: "80px" }}
              />
              <Column
                field="price"
                header="Нэгж үнэ"
                style={{ minWidth: "90px", maxWidth: "90px" }}
                className="text-sm"
              />
              <Column
                field="cash"
                header="Нийт үнэ"
                className="text-sm"
                style={{ minWidth: "120px", maxWidth: "120px" }}
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
      </div>
    </div>
  );
};
export default React.memo(ModalNormDetail);
