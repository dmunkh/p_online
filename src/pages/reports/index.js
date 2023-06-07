import React, { useLayoutEffect, useMemo, useState } from "react";
import { useUserContext } from "src/contexts/userContext";
import Header from "src/pages/reports/header";
import { useTrainingContext } from "src/contexts/trainingContext";
import { Spin } from "antd";
import moment from "moment";
import * as API from "src/api/training";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { SearchOutlined } from "@ant-design/icons";
import { Input, Tooltip, Row, Modal } from "antd";
import _ from "lodash";
import ColumnGroup from "antd/lib/table/ColumnGroup";

const Index = () => {
  const { message, checkRole } = useUserContext();
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useTrainingContext();
  const [search, setSearch] = useState("");
  const [print_modal, setPrint_modal] = useState(false);

  useLayoutEffect(() => {
    state.moduleid &&
      API.getReportPlan({
        year: moment(state.change_year).format("YYYY"),
        module_id: state.moduleid,
      })
        .then((res) => {
          var result = [];

          _.map(res, (item) => {
            result.push({
              ...item,
              ss: (item.count_worker + item.count_resource) * item.price_emc,
            });
          });

          dispatch({
            type: "STATE",
            data: {
              list_reportplan: _.orderBy(result, ["type_id"]),
            },
          });
        })
        .catch((error) => {
          dispatch({
            type: "STATE",
            data: {
              list_reportplan: [],
            },
          });
          message({
            type: "error",
            error,
            title: "Тайлан татаж чадсангүй",
          });
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.change_year, state.moduleid]);

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
  const memo_table = useMemo(() => {
    var result = state.list_reportplan;

    // if (state?.type_id)
    //   result = _.filter(result, (a) => a.type_id === state.type_id);

    if (search) {
      result = _.filter(
        result,
        (a) =>
          _.includes(_.toLower(a.type_name), _.toLower(search)) ||
          _.includes(_.toLower(a.price_emc), _.toLower(search)) ||
          _.includes(_.toLower(a.price_organization), _.toLower(search)) ||
          _.includes(_.toLower(a.count_worker), _.toLower(search))
      );
    }

    return (
      <DataTable
        scrollable
        dataKey="id"
        size="small"
        stripedRows
        showGridlines
        className="w-full text-sm"
        sortMode="single"
        removableSort
        scrollHeight={window.innerHeight - 280}
        responsiveLayout="scroll"
        value={_.orderBy(result, ["type_name"])}
        header={
          <div className="flex items-center justify-between">
            <div className="w-full md:max-w-[200px]">
              <Input
                placeholder="Хайх..."
                prefix={<SearchOutlined />}
                className="w-full rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="fonticon-wrap"></div>
            <div
              className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer"
              onClick={() => printTo(result)}
            >
              {/* <img
                alt=""
                title="Excel татах"
                src="/assets/images/excel.png"
                className="w-6 h-6 object-cover cursor-pointer hover:scale-125 duration-300"
                onClick={() => exportTo(true, result)}
              /> */}
              <i className="ft-printer"></i>
            </div>
          </div>
        }
        footerColumnGroup={
          <ColumnGroup>
            <Row>
              <Column colSpan={3} />
              <Column
                className="w-[150px] max-w-[150px] text-right text-xs"
                footer={_.sumBy(
                  result,
                  (a) => a.count_worker + a.count_resource
                )}
              />
              <Column
                className="w-[150px] max-w-[150px] text-right text-xs"
                footer={Intl.NumberFormat("en-US").format(
                  _.sumBy(result, (a) => a.ss)
                )}
              />
            </Row>
          </ColumnGroup>
        }
        emptyMessage={
          <div className="text-xs text-orange-500 italic font-semibold">
            Мэдээлэл олдсонгүй...
          </div>
        }
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
          header="Сургалтын төрөл"
          field="type_name"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-start "
        />
        <Column
          sortable
          header="Эрдэнэт үйлдвэр ТӨҮГ төлбөрийн тариф"
          field="price_emc"
          style={{ minWidth: "150px", maxWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-end "
        />

        <Column
          sortable
          header="Гадны байгууллага төлбөрийн тариф"
          field="price_organization"
          style={{ minWidth: "150px", maxWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-end"
        />
        <Column
          sortable
          header="Суралцагчдын тоо"
          field="count_worker"
          style={{ minWidth: "150px", maxWidth: "150px" }}
          className="text-xs text-right "
          headerClassName="flex items-center justify-center"
          bodyClassName="items-right text"
          align="right"
          body={(data) => {
            let dollarUSLocale = Intl.NumberFormat("en-US");
            return (
              <span className=" font-semibold ">
                {dollarUSLocale.format(data.count_worker + data.count_resource)}
              </span>
            );
          }}
        />
        <Column
          sortable
          header="Нийт төлбөр /мян.төгрөг/"
          //field="limit"
          style={{ minWidth: "150px", maxWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-end textAlign:left"
          body={(data) => {
            let dollarUSLocale = Intl.NumberFormat("en-US");
            return (
              <span className=" font-semibold ">
                {dollarUSLocale.format(
                  data.price_emc * (data.count_worker + data.count_resource)
                )}
              </span>
            );
          }}
        />
      </DataTable>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.list_reportplan, search]);

  return (
    <div className=" card flex p-2 rounded text-xs">
      <Header />
      <div className="flex  text-xs">
        <div className="flex flex-col ">
          <div className="flex justify-center text-xs  ">
            {/* <Spin
              tip="Уншиж байна."
              className="min-h-full first-line:bg-opacity-80"
              spinning={loading}
            > */}
            {memo_table}
            {/* </Spin> */}
          </div>
        </div>
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
