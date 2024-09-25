import React, { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import html2pdf from "html2pdf.js";
import { usePlanContext } from "src/contexts/planContext";
import useBearStore from "src/state/state";
import _ from "lodash";
import moment from "moment";

const PrintOrderList = () => {
  const { state } = usePlanContext();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [delguur, setDelguur] = useState([]);
  const pdfRef = useRef(null);

  const currentDateTime = moment().format("YYYY-MM-DD HH:mm");

  useEffect(() => {
    const fetchDelguurData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://dmunkh.store/api/backend/delguur"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const jsonData = await response.json();
        setDelguur(
          _.filter(
            jsonData.response,
            (a) => parseInt(a.id) === parseInt(state.order.delguur_id)
          )
        );
      } catch (error) {
        console.error("Error fetching delguur data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDelguurData();
  }, [state.order.delguur_id]);

  useEffect(() => {
    if (state.order.modal_print_order_list == true) {
      const fetchOrderData = async () => {
        setLoading(true);
        try {
          const order_ids = _.join(
            _.map(state.order.checked_positionList, (a) => a.order_id),
            ","
          );
          const response = await fetch(
            `http://localhost:5000/api/backend/order_ids?order_ids=${order_ids}`
          );
          if (!response.ok) throw new Error("Network response was not ok");
          const jsonData = await response.json();
          setList(jsonData.response);
        } catch (error) {
          console.error("Error fetching order data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrderData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.order.modal_print_order_list]);

  const handleGeneratePDF = () => {
    const element = pdfRef.current;

    const opt = {
      margin: 0.2, // Adjust margin to fit more on a single page
      filename: "generated_document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1.5 }, // Adjust scale to fit content better
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // Apply the CSS rule to avoid page breaks inside table rows
    const avoidPageBreaks = `
      table, tr, td, th { page-break-inside: avoid !important; }
    `;
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = avoidPageBreaks;
    document.head.appendChild(style);

    // Generate PDF and display it in the iframe
    html2pdf()
      .from(element)
      .set(opt)
      .toPdf()
      .get("pdf")
      .then(function (pdf) {
        const pdfUrl = pdf.output("bloburl");
        document.getElementById("pdf-preview1").src = pdfUrl;
        setLoading(false); // Stop loading after PDF is generated
      });
  };

  useEffect(() => {
    if (list.length > 0) {
      setLoading(true);
      handleGeneratePDF();
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  return (
    <div style={{ padding: 0, margin: 0 }}>
      OrderList
      <Spin tip="Loading..." className="bg-opacity-80" spinning={loading}>
        <iframe
          id="pdf-preview1"
          title="PDF Preview Document"
          style={{
            width: "100%",
            height: "600px",
            marginTop: "20px",
            border: "1px solid #dddddd",
          }}
        ></iframe>
        <div className="page-break" ref={pdfRef}>
          {_.map(list, (item) => (
            <div key={item.id} style={{ height: 1030 }}>
              <h2>Item from {item.delguur_ner}</h2>
              <p>
                <strong>Item ID:</strong> {item.id} <br />
                <strong>Delguur ID:</strong> {item.delguur_id} <br />
                <strong>Item Number:</strong> {item.item_number} <br />
                <strong>Register Date:</strong>{" "}
                {new Date(item.register_date).toLocaleDateString()} <br />
                <strong>Cash:</strong> {item.cash} <br />
                <strong>Month:</strong> {item.month} <br />
                <strong>User ID:</strong> {item.user_id} <br />
              </p>

              <h3>Balance Items</h3>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr style={{ border: "1px solid #dddddd" }}>
                    <th
                      style={{
                        border: "1px solid #dddddd",
                        padding: "2px",
                        textAlign: "left",
                      }}
                    >
                      №
                    </th>
                    <th
                      style={{
                        border: "1px solid #dddddd",
                        padding: "2px",
                        textAlign: "left",
                      }}
                    >
                      Product Name
                    </th>
                    <th
                      style={{
                        border: "1px solid #dddddd",
                        padding: "2px",
                        textAlign: "left",
                      }}
                    >
                      Count
                    </th>
                    <th
                      style={{
                        border: "1px solid #dddddd",
                        padding: "2px",
                        textAlign: "left",
                      }}
                    >
                      Price
                    </th>
                    <th
                      style={{
                        border: "1px solid #dddddd",
                        padding: "2px",
                        textAlign: "left",
                      }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {_.map(item.balance, (balanceItem, balanceIndex) => (
                    <tr
                      key={balanceItem.baraa_id}
                      style={{ border: "1px solid #dddddd" }}
                    >
                      <td
                        style={{
                          border: "1px solid #dddddd",
                          textAlign: "center",
                          padding: "4px",
                          fontSize: "11px",
                          width: "50px",
                        }}
                      >
                        {balanceIndex + 1}
                      </td>
                      <td
                        style={{
                          border: "1px solid #dddddd",
                          padding: "2px",
                          fontSize: "12px",
                        }}
                      >
                        {balanceItem.baraa_ner}
                      </td>
                      <td
                        style={{
                          border: "1px solid #dddddd",
                          padding: "2px",
                          fontSize: "12px",
                          textAlign: "center",
                        }}
                      >
                        {balanceItem.count}
                      </td>
                      <td
                        style={{
                          border: "1px solid #dddddd",
                          padding: "2px",
                          fontSize: "12px",
                          textAlign: "center",
                        }}
                      >
                        {balanceItem.price}
                      </td>
                      <td
                        style={{
                          border: "1px solid #dddddd",
                          padding: "2px",
                          fontSize: "12px",
                          textAlign: "center",
                        }}
                      >
                        {Intl.NumberFormat("en-US").format(
                          balanceItem.count * balanceItem.price
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "right",
                        padding: "2px",
                        fontWeight: "bold",
                      }}
                    >
                      Total
                    </td>
                    <td
                      style={{
                        border: "1px solid #dddddd",
                        padding: "2px",
                        textAlign: "center",
                      }}
                    >
                      {_.sumBy(
                        item.balance,
                        (balanceItem) => balanceItem.count * balanceItem.price
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <hr />
            </div>
          ))}
        </div>
      </Spin>
    </div>
  );
};

export default PrintOrderList;
