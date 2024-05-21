import React, { useState, useEffect } from "react";
import * as API from "src/api/plan";
import { useUserContext } from "src/contexts/userContext";
import { usePlanContext } from "src/contexts/planContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import TextArea from "antd/lib/input/TextArea";
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
import useBearStore from "src/state/state";
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
  const [baraa, setbaraa] = useState();
  const [count, setcount] = useState(0);
  const [boxcount, setboxcount] = useState(0);
  const [unit, setunit] = useState("ш");
  const [price, setprice] = useState(0);
  const [comment, setcomment] = useState("");
  const [refresh, setrefresh] = useState(0);
  const [list, setList] = useState([]);
  const [type, settype] = useState(3);
  const [baraa_list, setBaraa_list] = useState();
  const [balance_list, setbalance_list] = useState();
  const [baraa_id, setbaraa_id] = useState(0);
  const main_company_id = useBearStore((state) => state.main_company_id);
  const user_id = useBearStore((state) => state.user_id);
  const group_id = useBearStore((state) => state.group_id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/backend/balance",
          {
            params: {
              main_company_id: main_company_id,
              user_id: user_id,
              group_id: group_id,
            },
          }
        );

        setbalance_list(
          _.orderBy(
            _.filter(
              response.data.response,
              (a) => parseInt(a.id_order) === parseInt(state.order.order_id)
            ),
            response.data.response,
            ["id"]
          )
        );

        baraa_list(_.orderBy(response.data.response, ["id"]));
        console.log("baraa jagsaalttttttt", response.data.response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError(error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, refresh, state.order.order_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/backend/baraa",
          { params: { user_id: user_id } }
        );

        setBaraa_list(_.orderBy(response.data.response, ["id"]));
        console.log("baraa jagsaalttttttt", response.data.response);
        // setLoading(false);
      } catch (error) {
        // setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.order.order_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/backend/balance/group",
          {
            params: {
              user_id: user_id,
            },
          }
        );

        setList(_.orderBy(response.data, ["id"]));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError(error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);

  const handleClick = () => {
    try {
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
        order_id: state.order.order_id,
        register_date: dayjs(state.order.dt).format("YYYY.MM.DD"),
        mc_id: main_company_id,
        user_id: user_id,
        comment: comment,
      });
      setrefresh(refresh + 1);
      dispatch({
        type: "STATE",
        data: { refresh: state.refresh + 1 },
      });

      console.log("return", response.data, "refresh", state.refresh);
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
                  value={baraa_id}
                  onChange={(value) => {
                    setbaraa_id(value);
                    setbaraa(_.filter(baraa_list, (a) => a.id === value));
                    console.log(_.filter(baraa_list, (a) => a.id === value));
                    setprice(
                      _.filter(baraa_list, (a) => a.id === value)[0].une
                    );
                    // setprice(
                    //   _.filter(baraa_list, (a) => a.id === value)[0].une
                    // );
                    // setunit(
                    //   _.filter(baraa_list, (a) => a.id === value)[0].unit
                    // );
                    setboxcount(0);
                    setcount(0);
                  }}
                >
                  {_.map(list, (item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.ner + " - " + item.uldegdel}
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
              <div className="w-1/4">Төрөл</div>
              <div className="w-3/4">
                <Select
                  showSearch
                  allowClear
                  placeholder="Сонгоно уу."
                  optionFilterProp="children"
                  className="w-full"
                  value={type}
                  onChange={(value) => settype(value)}
                >
                  <Option key={3} value={3}>
                    Захиалга
                  </Option>
                  <Option key={4} value={4}>
                    Буцаалт
                  </Option>
                  <Option key={5} value={5}>
                    Хаягдал
                  </Option>
                </Select>
              </div>
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
            <div className="w-full p-1 flex flex-col justify-start ">
              <span className="list-group-item-text grey darken-2 m-0">
                Тайлбар:
              </span>
              <TextArea
                className=" p-1 w-full text-gray-900 border border-gray-200 rounded-lg "
                value={comment}
                onChange={(e) => {
                  setcomment(e.target.value);
                }}
              />
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
                      className="w-[120px] text-sm text-right"
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
                header="order_id"
              />
              <Column
                style={{ minWidth: "60px", maxWidth: "60px" }}
                field="id"
                className="text-sm"
                header="id"
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
                className="text-sm justify-end"
                style={{ minWidth: "80px", maxWidth: "80px" }}
              />
              <Column
                field="price"
                header="Нэгж үнэ"
                style={{ minWidth: "90px", maxWidth: "90px" }}
                className="text-sm justify-end"
                body={(data) => {
                  return Intl.NumberFormat("en-US").format(data.price);
                }}
              />
              <Column
                field="cash"
                header="Нийт үнэ"
                className="text-sm justify-end"
                style={{ minWidth: "120px", maxWidth: "120px" }}
                body={(data) => {
                  return Intl.NumberFormat("en-US").format(
                    data.price * data.count
                  );
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