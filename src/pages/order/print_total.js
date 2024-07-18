import React, { useEffect, useState } from "react";
import { usePlanContext } from "src/contexts/planContext";
import axios from "axios";
import _ from "lodash";
import useBearStore from "src/state/state";
import moment from "moment";

const Print_total = () => {
  const { state, dispatch } = usePlanContext();
  const [loading, setLoading] = useState(false);
  const [list, setlist] = useState([]);
  const main_company_id = useBearStore((state) => state.main_company_id);
  const user_id = useBearStore((state) => state.user_id);
  const group_id = useBearStore((state) => state.group_id);
  const userInfo = useBearStore((state) => state.userInfo);
  const [total, settotal] = useState(0);
  const [delguur, setdelguur] = useState([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [result, setResult] = useState({ boxes: 0, remainingUnits: 0 });
  const unitsPerBox = 24;

  const currentDateTime = moment().format("YYYY-MM-DD HH:mm");

  useEffect(() => {
    const fetchData = async () => {
      if (state.order.modal_print_total === true) {
        try {
          setLoading(true);

          var order_ids = _.join(
            _.map(state.order.checked_positionList, (a) => a.order_id),
            ","
          );
          console.log("idssss", order_ids);
          // const response = await axios.get(
          const response = await axios.get(
            // "http://localhost:5000/api/backend/balance_list_orders",
            "https://dmunkh.store/api/backend/balance_list_orders",
            {
              params: {
                order_ids: order_ids,
              },
            }
          );
          // console.log("response", response.data.response);
          var ssum = 0;
          _.map(
            response.data.response && response.data.response,
            (item) => (ssum += item.price * item.count)
          );
          settotal(ssum);
          setlist(response.data.response);

          setLoading(false);
        } catch (error) {
          setLoading(false);
          // setError(error);
        }
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.order.modal_print_total]);

  function convertToBoxesAndUnits(totalUnits, unitsPerBox) {
    const boxes = Math.floor(totalUnits / unitsPerBox);
    const remainingUnits = totalUnits % unitsPerBox;
    return boxes;
  }
  function convertToUnits(totalUnits, unitsPerBox) {
    const boxes = Math.floor(totalUnits / unitsPerBox);
    const remainingUnits = totalUnits - unitsPerBox * boxes;
    return remainingUnits;
  }
  const handleConvert = () => {
    const conversionResult = convertToBoxesAndUnits(
      Number(totalUnits),
      unitsPerBox
    );
    setResult(conversionResult);
  };
  return (
    <div style={{ padding: 0, margin: 0 }}>
      {/* <h1>{moment()}</h1> */} Print total
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                fontSize: "11px",
              }}
              colSpan={9}
            >
              {currentDateTime}
            </th>
          </tr>
          <tr>
            <th
              style={{
                borderBottom: "1px solid #dddddd",
                textAlign: "center",
                padding: "8px",
                fontSize: "16px",
              }}
              colSpan={9}
            >
              ЗАРЛАГЫН БАРИМТ /№:{state.order.order_id}/
            </th>
          </tr>
          <tr>
            <th
              colSpan={2}
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              Компани нэр:
            </th>
            <th
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {userInfo?.company_ner}
            </th>
            <th
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
                width: "100px",
              }}
            >
              Харилцагч:
            </th>
            <th
              colSpan={2}
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {delguur[0]?.delguur_ner} ( {delguur[0]?.company_name} )
            </th>
          </tr>{" "}
          <tr>
            <th
              colSpan={2}
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              Дэлгүүр нэр:
            </th>
            <th
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {userInfo?.hayag}
            </th>
            <th
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              Регистер:
            </th>
            <th
              colSpan={2}
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {delguur[0]?.d_register}
            </th>
          </tr>
          <tr>
            <th
              colSpan={2}
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              Регистер:
            </th>
            <th
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {userInfo?.register}
            </th>
            <th
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {" "}
              Хаяг:
            </th>
            <th
              colSpan={2}
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {delguur[0]?.d_hayag}
            </th>
          </tr>
          <tr>
            <th
              colSpan={2}
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              ХТ:
            </th>
            <th
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {state.order.user_name} / {state.order.phone} /
            </th>
            <th
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {" "}
              Утас:
            </th>
            <th
              colSpan={2}
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {delguur[0]?.d_utas}
            </th>
          </tr>
          <tr>
            <th
              colSpan={2}
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              Данс:
            </th>
            <th
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {userInfo?.dans}
            </th>
            <th
              colSpan={2}
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            ></th>
            <th
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {delguur[0]?.d_dans}
            </th>
          </tr>
          <tr style={{ marginBottom: 20 }}>
            <th
              style={{
                border: "1px solid #dddddd",
                textAlign: "center",
                padding: "2px",
                fontSize: "12px",
              }}
            >
              №
            </th>
            <th
              style={{
                border: "1px solid #dddddd",
                textAlign: "center",
                padding: "2px",
                fontSize: "12px",
              }}
            >
              barcode
            </th>{" "}
            <th
              style={{
                border: "1px solid #dddddd",
                textAlign: "center",
                padding: "2px",
                fontSize: "12px",
              }}
            >
              Бараа нэр
            </th>
            <th
              style={{
                border: "1px solid #dddddd",
                textAlign: "center",
                padding: "2px",
                fontSize: "12px",
              }}
            >
              Багц
            </th>
            <th
              style={{
                border: "1px solid #dddddd",
                textAlign: "center",
                padding: "2px",
                fontSize: "12px",
              }}
            >
              Нэгж үнэ
            </th>
            <th
              style={{
                border: "1px solid #dddddd",
                textAlign: "center",
                padding: "2px",
                fontSize: "12px",
              }}
            >
              Багц
            </th>
            <th
              style={{
                border: "1px solid #dddddd",
                textAlign: "center",
                padding: "2px",
                fontSize: "12px",
              }}
            >
              Задгай
            </th>
            <th
              style={{
                border: "1px solid #dddddd",
                textAlign: "center",
                padding: "2px",
                fontSize: "12px",
              }}
            >
              Нийт
            </th>
            <th
              style={{
                border: "1px solid #dddddd",
                textAlign: "center",
                padding: "2px",
                fontSize: "12px",
              }}
            >
              Нийт үнэ
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Map over the data array to generate table rows */}
          {_.map(list && list, (item, index) => (
            <tr key={item.id} style={{ border: "1px solid #dddddd" }}>
              <td
                style={{
                  border: "1px solid #dddddd",
                  textAlign: "center",
                  padding: "4px",
                  fontSize: "11px",
                  width: 20,
                }}
              >
                {index + 1}
              </td>
              <td
                style={{
                  border: "1px solid #dddddd",
                  textAlign: "left",
                  padding: "4px",
                  fontSize: "11px",
                  width: 120,
                  color: "#000000",
                }}
              >
                {item.bar_code}
              </td>
              <td
                style={{
                  border: "1px solid #dddddd",
                  textAlign: "left",
                  padding: "4px",
                  fontSize: "11px",
                  color: "#000000",
                }}
              >
                {item.baraa_ner}
              </td>{" "}
              <td
                style={{
                  border: "1px solid #dddddd",
                  textAlign: "right",
                  padding: "4px",
                  fontSize: "11px",
                  width: 70,
                  color: "#000000",
                }}
              >
                {item.box_count}
              </td>
              <td
                style={{
                  border: "1px solid #dddddd",
                  textAlign: "right",
                  padding: "4px",
                  fontSize: "11px",
                  width: 70,
                  color: "#000000",
                }}
              >
                {item.price}
              </td>
              <td
                style={{
                  border: "1px solid #dddddd",
                  textAlign: "right",
                  padding: "4px",
                  fontSize: "11px",
                  width: 70,
                  color: "#000000",
                }}
              >
                {convertToBoxesAndUnits(item.count, item.box_count)}
              </td>
              <td
                style={{
                  border: "1px solid #dddddd",
                  textAlign: "right",
                  padding: "4px",
                  fontSize: "11px",
                  width: 70,
                  color: "#000000",
                }}
              >
                {convertToUnits(item.count, item.box_count)}
              </td>
              <td
                style={{
                  border: "1px solid #dddddd",
                  textAlign: "right",
                  padding: "4px",
                  fontSize: "11px",
                  width: 60,
                }}
              >
                {item.count}
              </td>
              <td
                style={{
                  border: "1px solid #dddddd",
                  textAlign: "right",
                  padding: "4px",
                  fontSize: "11px",
                  color: "#000000",
                  width: 80,
                }}
              >
                {Intl.NumberFormat("en-US").format(item.count * item.price)}
              </td>
            </tr>
          ))}
          <tr>
            <td
              colSpan={8}
              style={{
                border: "1px solid #dddddd",
                textAlign: "right",
                padding: "4px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              Нийт үнэ:
            </td>
            <td
              style={{
                border: "1px solid #dddddd",
                textAlign: "right",
                padding: "4px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {Intl.NumberFormat("en-US").format(total)}
            </td>
          </tr>
          <tr style={{ paddingBottom: 20 }}>
            <td
              colSpan={5}
              style={{
                textAlign: "right",
                padding: "4px",
                fontSize: "11px",
                fontWeight: 600,
                marginBottom: 20,
              }}
            ></td>
            <td
              style={{
                textAlign: "right",
                padding: "4px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            ></td>
          </tr>
          <tr>
            <td
              colSpan={2}
              style={{
                // borderbo: "1px solid #dddddd",
                textAlign: "right",
                padding: "4px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              Хүлээн авсан:
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #dddddd",
                textAlign: "right",
                padding: "4px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              /
            </td>
            <td
              style={{
                // border: "1px solid #dddddd",
                textAlign: "right",
                padding: "4px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              /
            </td>
          </tr>
          <tr>
            <td
              colSpan={2}
              style={{
                // border: "1px solid #dddddd",
                textAlign: "right",
                padding: "4px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              Хүлээлгэн өгсөн ажилтан:
            </td>
            <td
              colSpan={2}
              style={{
                borderBottom: "1px solid #dddddd",
                textAlign: "right",
                padding: "4px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              /
            </td>
            <td
              style={{
                // border: "1px solid #dddddd",
                textAlign: "right",
                padding: "4px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              /
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Print_total;
