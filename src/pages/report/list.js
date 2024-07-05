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
import MODAL from "src/pages/company/modal";
// import { useUserContext } from "src/contexts/userContext";
import axios from "axios";
import dayjs from "dayjs";
import AddBtn from "src/components/button/plusButton";
import useBearStore from "src/state/state";
import Swal from "sweetalert2";
import register from "../workers/register";
import * as XLSX from "xlsx";

const Workers = () => {
  const { state, dispatch } = usePlanContext();
  const daysInMonth = new Date(
    moment(state.report.date).format("YYYY"),
    moment(state.report.date).format("MM"),
    0
  ).getDate(); // June has 30 days
  const main_company_id = useBearStore((state) => state.main_company_id);
  const group_id = useBearStore((state) => state.group_id);
  const user_id = useBearStore((state) => state.user_id);
  const userInfo = useBearStore((state) => state.userInfo);
  const [ssum_total, setssum_total] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://dmunkh.store/api/backend/report",
          // "http://localhost:5000/api/backend/report",
          {
            params: {
              sub_code: state.balance.seller_id,
              start_date: moment(state.report.date).format("YYYY.MM.01"),
              end_date: moment(state.report.date).format(
                "YYYY.MM." + daysInMonth
              ),
            },
          }
        );

        var result = _(response.data.response)
          .groupBy("id_order")
          .map(function (items, id_order) {
            return {
              order_id: id_order,
              delguur_id: items[0].delguur_id,
              delguur_ner: items[0].delguur_ner,
              register_date: moment(items[0].register_date).format(
                "YYYY.MM.DD"
              ),
              cash: items[0].cash,
              count: _.sumBy(items, "count"),
              total: _.sumBy(items, "total"),
              user_name: items[0].user_name,
              phone: items[0].phone,
              is_approve: items[0].is_approve,
              is_print: items[0].is_print,
              print_date: items[0].print_date,
              is_dist: items[0].is_dist,
              dist_date_register: items[0].dist_date_register,
            };
          })
          .value();
        var ssum = 0;
        _.map(result, (item) => {
          ssum += item.total;
        });
        setssum_total(ssum);
        dispatch({
          type: "STATE",
          data: {
            balance_list: response.data.response,
            balanceGroup_list: result,
          },
        });

        setList(
          _.orderBy(
            _.filter(response.data.response, (a) => a.id !== null),
            ["id"]
          )
        );

        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError(error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.report.date, state.balance.seller_id]);

  const exportToExcel = () => {
    const worksheetData = [["№", "Дэлгүүр нэр", ...daysArray, "Бэлэн", "Нийт"]];

    storeNames.forEach((delguur_ner, index) => {
      const row = [
        index + 1,
        delguur_ner,
        ...groupedData[delguur_ner].days.map(({ total, balance }) =>
          total !== null ? total : ""
        ),

        groupedData[delguur_ner].sumCash,
        groupedData[delguur_ner].sumTotal,
      ];
      worksheetData.push(row);
    });

    // const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    // XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    // XLSX.writeFile(workbook, "export.xlsx");

    const workbook = XLSX.utils.book_new();
    // const worksheet = XLSX.utils.json_to_sheet([]);
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    // XLSX.utils.sheet_add_aoa(worksheet, Heading, { origin: "A1" });
    // XLSX.utils.sheet_add_json(worksheet, result, {
    //   origin: "A2",
    //   skipHeader: true,
    // });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(
      workbook,
      "Тайлан -" + moment().format("YYYY_MM_сар") + ".xlsx",
      {
        compression: true,
      }
    );
  };
  const aggregateData = _.orderBy(state.balanceGroup_list, [
    "delguur_ner",
  ]).reduce((acc, { delguur_ner, register_date, total, cash }) => {
    const key = `${delguur_ner}-${register_date}`;
    if (!acc[key]) {
      acc[key] = { delguur_ner, register_date, total, cash };
    } else {
      acc[key].total += total;
      acc[key].cash += cash;
    }
    return acc;
  }, {});

  const aggregatedDataArray = Object.values(aggregateData);

  const groupedData = aggregatedDataArray.reduce(
    (acc, { delguur_ner, register_date, total, cash }) => {
      if (!acc[delguur_ner]) {
        acc[delguur_ner] = {
          days: Array(daysInMonth).fill({ total: null, balance: null }),
          sumTotal: 0,
          sumCash: 0,
        };
      }
      const day = new Date(register_date).getDate() - 1;
      acc[delguur_ner].days[day] = { total, cash };
      acc[delguur_ner].sumTotal += total;
      acc[delguur_ner].sumCash += cash;
      return acc;
    },
    {}
  );

  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const storeNames = Object.keys(groupedData);
  const isUserValid = useBearStore((state) => state.isUserValid);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const deleteClick = (item) => {
    try {
      const response = axios.delete(
        "https://dmunkh.store/api/backend/company/" + item.id
      );
      dispatch({
        type: "STATE",
        data: { refresh: state.refresh + 1 },
      });
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div className="w-full">
      {" "}
      <Modal
        style={{ width: "600" }}
        width={800}
        height={550}
        visible={state.company.modal}
        // visible={true}
        onCancel={() => dispatch({ type: "COMPANY", data: { modal: false } })}
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <MODAL />
      </Modal>
      <div className="flex items-center space-x-2 mb-4">
        <img
          alt=""
          title="Excel татах"
          src="/img/excel.png"
          className="w-[30px] h-8 object-cover cursor-pointer hover:scale-125 duration-300"
          onClick={() => exportToExcel()}
        />
        <div className="flex items-center">
          Нийт борлуулалт:{" "}
          <span style={{ fontSize: 14 }}>
            {Intl.NumberFormat("en-US").format(ssum_total)}
          </span>
        </div>
      </div>
      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <div className=" overflow-y-scroll">
          <table className="pivot-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Дэлгүүр нэр</th>
                {daysArray.map((day) => (
                  <th key={day}>{day}</th>
                ))}
                <th>Бэлэн</th>
                <th>Нийт</th>
              </tr>
            </thead>
            <tbody>
              {storeNames.map((delguur_ner, index) => (
                <tr key={delguur_ner}>
                  <td>{index + 1}</td>
                  <td style={{ textAlign: "left" }}>{delguur_ner}</td>
                  {groupedData[delguur_ner].days.map(
                    ({ total, cash }, index) => (
                      <td key={index}>
                        {total !== null && cash !== null ? (
                          <div>
                            <div>
                              {Intl.NumberFormat("en-US").format(total)}
                            </div>
                            <div>
                              Б: {Intl.NumberFormat("en-US").format(cash)}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                    )
                  )}
                  <td style={{ fontWeight: "bold" }}>
                    {Intl.NumberFormat("en-US").format(
                      groupedData[delguur_ner].sumCash
                    )}
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    {Intl.NumberFormat("en-US").format(
                      groupedData[delguur_ner].sumTotal
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td colspan={daysInMonth + 3}>...</td>
              </tr>
              <tr>
                <td colspan={daysInMonth + 3}>...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Spin>
    </div>
  );
};

export default React.memo(Workers);
