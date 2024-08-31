import React, { useEffect, useState } from "react";
import { usePlanContext } from "src/contexts/planContext";
import axios from "axios";
import _ from "lodash";
import useBearStore from "src/state/state";
import moment from "moment";
const MyComponent = () => {
  const { state, dispatch } = usePlanContext();
  const [loading, setLoading] = useState(false);
  const [list, setlist] = useState([]);
  const main_company_id = useBearStore((state) => state.main_company_id);
  const user_id = useBearStore((state) => state.user_id);
  const group_id = useBearStore((state) => state.group_id);
  const userInfo = useBearStore((state) => state.userInfo);
  const [total, settotal] = useState(0);
  const [delguur, setdelguur] = useState([]);

  const currentDateTime = moment().format("YYYY-MM-DD HH:mm");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const response = await axios.get(
        const response = await fetch(
          "https://dmunkh.store/api/backend/delguur"
          // "http://3.0.177.127/api/backend/delguur"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();

        setdelguur(
          _.filter(
            jsonData.response,
            (a) => parseInt(a.id) === parseInt(state.order.delguur_id)
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
  }, [state.order.order_id]);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await axios.get(
    //       // "http://localhost:5000/api/backend/balance",
    //       "https://dmunkh.store/api/backend/balance",
    //       {
    //         params: {
    //           main_company_id: main_company_id,
    //           user_id: user_id,
    //           group_id: group_id,
    //           start_date: "2024.5.1",
    //           end_date: "2024.6.30",
    //         },
    //       }
    //     );
    //     setlist(
    //       _.orderBy(
    //         _.filter(
    //           response.data.response,
    //           (a) => parseInt(a.id_order) === parseInt(state.order.order_id)
    //         ),
    //         response.data.response,
    //         ["id"]
    //       )
    //     );
    //     var result = _.filter(
    //       response.data.response,
    //       (a) => parseInt(a.id_order) === parseInt(state.order.order_id)
    //     );
    //     var ssum = 0;
    //     _.map(result, (item) => (ssum += item.price * item.count));
    //     settotal(ssum);
    //     setLoading(false);
    //   } catch (error) {
    //     setLoading(false);
    //     // setError(error);
    //   }
    // };
    // fetchData();
    var result = _.filter(
      _.orderBy(state.balance_list, ["baraa_ner"]),
      (a) => _.parseInt(a.order_id) === _.parseInt(state.order.order_id)
    );
    console.log(
      state.order.order_id,
      _.filter(
        result,
        (a) => _.parseInt(a.order_id) === _.parseInt(state.order.order_id)
      )
    );
    var ssum = 0;
    _.map(result, (item) => (ssum += item.price * item.count));
    settotal(ssum);
    setlist(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.order.order_id]);

  return (
    <div style={{ padding: 0, margin: 0 }}>
      {/* <h1>{moment()}</h1> */}
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                fontSize: "11px",
              }}
              colSpan={5}
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
              colSpan={6}
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
              ХТ:...
            </th>
            <th
              style={{
                textAlign: "left",
                fontWeight: 500,
                fontSize: "12px",
              }}
            >
              {state.order.xt_id}
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
              Хэмжээ
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
              colSpan={5}
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

export default MyComponent;
