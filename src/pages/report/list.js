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
  const [totalSum, settotalSum] = useState(0);
  console.log(
    "days----",
    daysInMonth,
    moment(state.report.date).format("YYYY.MM.DD HH:mm")
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://dmunkh.store/api/backend/balance",
          // "http://localhost:5000/api/backend/balance",
          {
            params: {
              main_company_id: main_company_id,
              user_id: user_id,
              group_id: group_id,
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

        dispatch({
          type: "STATE",
          data: {
            balance_list: response.data.response,
            balanceGroup_list: result,
          },
        });
        // console.log("result", result);

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
  }, [state.refresh, state.report.date]);

  const aggregateData = _.orderBy(state.balanceGroup_list, [
    "delguur_ner",
  ]).reduce((acc, { delguur_ner, register_date, total, balance }) => {
    const key = `${delguur_ner}-${register_date}`;
    if (!acc[key]) {
      acc[key] = { delguur_ner, register_date, total, balance };
    } else {
      acc[key].total += total;
      acc[key].balance += balance;
    }
    return acc;
  }, {});

  const aggregatedDataArray = Object.values(aggregateData);

  // console.log("aggregete----", aggregateData);

  const groupedData = aggregatedDataArray.reduce(
    (acc, { delguur_ner, register_date, total, balance }) => {
      if (!acc[delguur_ner]) {
        acc[delguur_ner] = {
          days: Array(daysInMonth).fill({ total: null, balance: null }),
          sumTotal: 0,
        };
      }
      const day = new Date(register_date).getDate() - 1;
      acc[delguur_ner].days[day] = { total, balance };
      acc[delguur_ner].sumTotal += total;
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

      // console.log("return", response.data);
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
      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <table className="pivot-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Дэлгүүр нэр</th>
              {daysArray.map((day) => (
                <th key={day}>{day}</th>
              ))}
              <th>Нийт</th>
            </tr>
          </thead>
          <tbody>
            {storeNames.map((delguur_ner, index) => (
              <tr key={delguur_ner}>
                <td>{index + 1}</td>
                <td style={{ textAlign: "left" }}>{delguur_ner}</td>
                {groupedData[delguur_ner].days.map(
                  ({ total, balance }, index) => (
                    <td key={index}>
                      {total !== null && balance !== null ? (
                        <div>
                          <div>{Intl.NumberFormat("en-US").format(total)}</div>
                          {/* <div>Balance: {balance}</div> */}
                        </div>
                      ) : (
                        ""
                      )}
                    </td>
                  )
                )}
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
      </Spin>
    </div>
  );
};

export default React.memo(Workers);
