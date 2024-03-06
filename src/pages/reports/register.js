import React, { useLayoutEffect, useMemo, useState } from "react";
import { useUserContext } from "src/contexts/userContext";
import Header from "src/pages/reports/header";
import { useTrainingContext } from "src/contexts/trainingContext";
import { Spin } from "antd";
import moment from "moment";
import * as API from "src/api/training";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Department from "src/components/custom/departmentTseh";
import { FilterMatchMode } from "primereact/api";

import { SearchOutlined } from "@ant-design/icons";
import { Input, Row, Modal, Select, DatePicker } from "antd";
import _ from "lodash";
import ColumnGroup from "antd/lib/table/ColumnGroup";

const Index = () => {
  const { message } = useUserContext();
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useTrainingContext();
  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [print_modal, setPrint_modal] = useState(false);
  const [list, setlist] = useState([]);
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);
  const [dt1, setdt1] = useState(moment());
  const [dt2, setdt2] = useState(moment());
  const { Option } = Select;

  useLayoutEffect(() => {
    if (state.department_id !== null) {
      setLoading(true);
      API.getReportRegister({
        begin_date: moment(dt1).format("YYYY.MM.DD"),
        end_date: moment(dt2).format("YYYY.MM.DD"),
        department_id: state.department_id,
      })
        .then((res) => {
          setlist(_.orderBy(res, ["type_id", "begin_date", "negj_code", "tn"]));
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          message({
            type: "error",
            error,
            title: "Тайлан татаж чадсангүй",
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dt1, dt2, state.moduleid, state.department_id]);

  const printTo = (list) => {
    setPrint_modal(true);
    var data = {
      year: moment(state.change_year).format("YYYY"),
      module_id: state.moduleid,
    };
    var url = new URL("https://localhost:44335/training/plan");
    //var url = new URL("https://training.erdenetmc.mn/api/report/plan/count");

    // if (window.location.hostname === "localhost")
    //   url = new URL("https://localhost:44335/hse/plan");
    Object.keys(data).forEach((key) => url.searchParams.append(key, data[key]));
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "SSO " + localStorage.token,
      },
    })
      .then((response) => response.blob())
      .then(function (myBlob) {
        const obj_url = URL.createObjectURL(myBlob);

        const iframe = document.getElementById("ReportViewer");
        iframe.contentWindow.location.replace(obj_url);
      })
      .catch((error) => {
        message({ type: "error", error, title: "Хэвлэж чадсангүй" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //   var result = _.map(state.list_reportplan, (a, i) => {
  //     return {
  //       // specsname: a.specsname,
  //       // methodname: a.methodname,
  //       // specspercent: a.specspercent,
  //       // resultvalue2: a.resultvalue2,
  //       // resultvalue1: a.resultvalue1,
  //       // resultvalue: a.resultvalue,
  //     };
  //   });
  //   result.push({
  //    specsname: "Нийт",
  //     // methodname: "",
  //     // specspercent: _.sumBy(state.list_rate, (a) => a.specspercent),
  //     // resultvalue2: _.sumBy(state.list_rate, (a) => a.resultvalue2),
  //     // resultvalue1: _.sumBy(state.list_rate, (a) => a.resultvalue1),
  //     // resultvalue: _.sumBy(state.list_rate, (a) => a.resultvalue),
  //   });
  //   const memo_table = useMemo(() => {
  //     var result = state.list_reportplan;

  //     // if (state?.type_id)
  //     //   result = _.filter(result, (a) => a.type_id === state.type_id);

  //     if (search) {
  //       result = _.filter(
  //         result,
  //         (a) =>
  //           _.includes(_.toLower(a.type_name), _.toLower(search)) ||
  //           _.includes(_.toLower(a.price_emc), _.toLower(search)) ||
  //           _.includes(_.toLower(a.price_organization), _.toLower(search)) ||
  //           _.includes(_.toLower(a.count_worker), _.toLower(search))
  //       );
  //     }

  //     return (

  //     );
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [state.list_reportplan, search]);

  return (
    <div className=" card flex p-2 rounded text-xs">
      {/* <Header /> */}
      <div className="flex border-b pb-1">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="w-full flex items-center pl-1">
            <span className="pr-1 font-semibold text-xs">Огноо:</span>
            <DatePicker
              allowClear={false}
              className="w-full md:w-[150px] text-xs"
              value={dt1}
              onChange={(date) => {
                setdt1(date);
              }}
            />{" "}
            -{" "}
            <DatePicker
              allowClear={false}
              className="w-full md:w-[150px] text-xs"
              value={dt2}
              onChange={(date) => {
                setdt2(date);
              }}
            />
          </div>
          <div className="flex items-center w-full  md:w-[400px] text-xs gap-2">
            <span className="font-semibold whitespace-nowrap">
              Бүтцийн нэгж:
            </span>
            <div className="w-full md:min-w-[400px]">
              <Department
                menu={1}
                value={state.department_id}
                onChange={(value) =>
                  dispatch({ type: "STATE", data: { department_id: value } })
                }
              />
            </div>
          </div>

          {/* <div className="flex flex-col  md:flex-row md:items-center gap-3 ">
            <span className="md:w-max pr-1 font-semibold text-xs whitespace-nowrap">
              Сургалтын бүлэг:
            </span>
            <div className="w-full md:min-w-[250px]">
              <Select
                showSearch
                allowClear
                placeholder="Сонгоно уу."
                optionFilterProp="children"
                className="w-full"
                value={state.moduleid}
                onChange={(value) => {
                  dispatch({ type: "STATE", data: { moduleid: value } });
                }}
              >
                {_.map(list, (item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.module_name}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </div> */}
        </div>
      </div>

      <div className="p-2 text-sx">
        <Spin
          tip="Уншиж байна."
          className="min-h-full first-line:bg-opacity-80"
          spinning={loading}
        >
          <DataTable
            scrollable
            dataKey="id"
            size="small"
            stripedRows
            showGridlines
            filters={search}
            paginator
            className="w-full text-sm"
            sortMode="single"
            removableSort
            scrollHeight={window.innerHeight - 320}
            responsiveLayout="scroll"
            value={list}
            globalFilterFields={["tn", "shortname", "position_namemn"]}
            rowGroupMode="subheader"
            groupRowsBy="type_name"
            header={
              <div className="flex items-center justify-between">
                <div className="w-full md:max-w-[200px]">
                  <Input.Search
                    className="md:w-80"
                    placeholder="Хайх..."
                    value={search.global.value}
                    onChange={(e) => {
                      let _search = { ...search };
                      _search["global"].value = e.target.value;
                      setSearch(_search);
                    }}
                  />
                </div>
                <div className="fonticon-wrap"></div>
                {/* <div
                  className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer"
                  // onClick={() => printTo(result)}
                >
                  <img
                    alt=""
                    title="Excel татах"
                    src="/assets/images/excel.png"
                    className="w-6 h-6 object-cover cursor-pointer hover:scale-125 duration-300"
                    onClick={() => exportTo(true, result)}
                  />
                  <i className="ft-printer"></i>
                </div> */}
              </div>
            }
            //   footerColumnGroup={
            //     // <ColumnGroup>
            //     //   <Row>
            //     //     <Column colSpan={3} />
            //     //     <Column
            //     //       className="w-[150px] max-w-[150px] text-right text-xs"
            //     //       footer={_.sumBy(
            //     //         result,
            //     //         (a) => a.count_worker + a.count_resource
            //     //       )}
            //     //     />
            //     //     <Column
            //     //       className="w-[150px] max-w-[150px] text-right text-xs"
            //     //       footer={Intl.NumberFormat("en-US").format(
            //     //         _.sumBy(result, (a) => a.ss)
            //     //       )}
            //     //     />
            //     //   </Row>
            //     // </ColumnGroup>
            //   }
            emptyMessage={
              <div className="text-xs text-orange-500 italic font-semibold">
                Мэдээлэл олдсонгүй...
              </div>
            }
            rowGroupHeaderTemplate={(data) => {
              return (
                <React.Fragment>
                  <span className="text-xs font-semibold">
                    <span className="ml-1">{data.type_name}</span>
                  </span>
                </React.Fragment>
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
              header="№"
              align="center"
              style={{ minWidth: "50px", maxWidth: "50px" }}
              className="text-xs w-full"
              headerClassName="flex items-center justify-center"
              bodyClassName="flex items-center justify-center"
              body={(data, row) => row.rowIndex + 1}
            />
            <Column
              sortable
              header="Сургалтын огноо"
              field="type_name"
              style={{ minWidth: "100px", maxWidth: "100px" }}
              className="text-xs "
              body={(data) => {
                return data.begin_date === data.end_date
                  ? data.begin_date
                  : data.begin_date + " | " + data.end_date;
              }}
            />
            <Column
              sortable
              header="Сургалтын төрөл"
              field="type_name"
              style={{ minWidth: "150px" }}
              className="text-xs "
              headerClassName="flex items-center justify-center"
              bodyClassName="flex items-center justify-start "
            />
            <Column
              sortable
              header="Цех"
              field="tseh_name"
              style={{ minWidth: "150px" }}
              className="text-xs "
              headerClassName="flex items-center justify-center"
              bodyClassName="flex items-center justify-start "
            />
            <Column
              sortable
              header="Нэгж"
              field="negj_name"
              style={{ minWidth: "150px" }}
              className="text-xs "
              headerClassName="flex items-center justify-center"
              bodyClassName="flex items-center justify-start "
            />
            <Column
              sortable
              header="БД"
              field="tn"
              style={{ minWidth: "80px", maxWidth: "80px" }}
              className="text-xs "
              headerClassName="flex items-center justify-center"
              bodyClassName="flex items-center justify-start "
            />
            <Column
              sortable
              header="Овог нэр"
              field="short_name"
              style={{ minWidth: "100px", maxWidth: "100px" }}
              className="text-xs "
              headerClassName="flex items-center justify-center"
              bodyClassName="flex items-center justify-start "
            />
            <Column
              sortable
              header="Албан тушаал"
              field="position_name"
              style={{ minWidth: "150px" }}
              className="text-xs "
              headerClassName="flex items-center justify-center"
              bodyClassName="flex items-center justify-start "
            />
            <Column
              sortable
              header="Авсан оноо"
              field="point"
              style={{ minWidth: "80px", maxWidth: "80px" }}
              className="text-xs "
              headerClassName="flex items-center justify-center"
              bodyClassName="flex items-center justify-end "
            />

            <Column
              sortable
              header="Тэнцсэн эсэх"
              field="is_success"
              style={{ minWidth: "80px", maxWidth: "80px" }}
              className="text-xs "
              body={(data) => {
                var name = "";

                if (data.is_success !== null) {
                  data.is_success === true
                    ? (name = "success")
                    : (name = "danger");
                } else {
                  name = "";
                }

                return data.is_success !== null ? (
                  data.is_success === true ? (
                    <span className={"badge-" + name + " p-1"}>Тэнцсэн</span>
                  ) : (
                    <span className={"badge-" + name + " p-1"}>Тэнцээгүй</span>
                  )
                ) : (
                  ""
                );
              }}
            />
            <Column
              sortable
              header="Давтан эсэх"
              field="is_repeat"
              style={{ minWidth: "80px", maxWidth: "80px" }}
              className="text-xs "
              body={(data) => {
                return data.is_repeat === true ? "Тийм" : "Үгүй";
              }}
            />
          </DataTable>
        </Spin>
      </div>

      <Modal
        centered
        title={<div className="text-center">Тайлан</div>}
        closeIcon="x"
        visible={print_modal}
        onCancel={() => setPrint_modal(false)}
        footer={null}
        width={1024}
      >
        <Spin
          tip="Уншиж байна."
          className="min-h-full bg-gray-300"
          spinning={loading}
        >
          <iframe
            title="PDF"
            frameBorder={0}
            id="ReportViewer"
            style={{
              width: "100%",
              height: window.innerWidth < 500 ? "450px" : "740px",
            }}
          />
        </Spin>
      </Modal>
    </div>
  );
};

export default React.memo(Index);
