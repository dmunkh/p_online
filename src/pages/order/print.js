import React, { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { usePlanContext } from "src/contexts/planContext";
import axios from "axios";
import _ from "lodash";
import useBearStore from "src/state/state";
import moment from "moment";
import html2pdf from "html2pdf.js";
import { Spin } from "antd";

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
  const pdfRef = useRef(null);
  const currentDateTime = moment().format("YYYY-MM-DD HH:mm");
  const [pdfBlob, setPdfBlob] = useState(null);

  const printRef = useRef();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open("", "_blank");
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Preview</title>
          <style>
            /* Add any styles for the print preview */
            body {
              font-family: Arial, sans-serif;
             margin: 5px 20px 0 20px; /* top right bottom left */
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContents}
        </body>
      </html>
    `);
    newWindow.document.close(); // To ensure document is fully loaded before print
  };

  useEffect(() => {
    // console.log("delguur iddd", state.order.delguur_id, state.delguur);
    setdelguur(
      _.filter(
        state.delguur_list,
        (a) => parseInt(a.id) === parseInt(state.order.delguur_id)
      )
    );
    setLoading(false);
    // const fetchData = async () => {
    //   try {
    //     setLoading(true);
    //     // const response = await axios.get(
    //     const response = await fetch(
    //       "https://dmunkh.store/api/backend/delguur"
    //       // "http://3.0.177.127/api/backend/delguur"
    //     );
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     const jsonData = await response.json();

    //     setdelguur(
    //       _.filter(
    //         jsonData.response,
    //         (a) => parseInt(a.id) === parseInt(state.order.delguur_id)
    //       )
    //     );
    //     setLoading(false);
    //   } catch (error) {
    //     setLoading(false);
    //     // setError(error);
    //   }
    // };

    // fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.order.order_id]);

  // const handleGeneratePDF = () => {
  //   const element = pdfRef.current;

  //   const opt = {
  //     margin: [0.1, 0.4, 0.1, 0.2], // Top, right, bottom, left margins
  //     filename: "generated_document.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  //   };

  //   // Generate PDF and display it in the iframe
  //   html2pdf()
  //     .from(element)
  //     .set(opt)
  //     .toPdf()
  //     .get("pdf")
  //     .then(function (pdf) {
  //       const pdfUrl = pdf.output("bloburl");
  //       document.getElementById("pdf-preview").src = pdfUrl;
  //       setLoading(false); // Stop loading after PDF is generated
  //     });
  // };
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       // const response = await axios.get(
  //       const response = await fetch(
  //         "http://localhost:5000/api/backend/order_ids?order_ids=3641,3462,4213,3640"
  //         // "http://3.0.177.127/api/backend/delguur"
  //       );
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       const jsonData = await response.json();

  //       setlist(jsonData.response);
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //       // setError(error);
  //     }
  //   };

  //   fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.order.order_id]);
  useEffect(() => {
    if (delguur.length > 0) {
      setLoading(true); // Show loading while generating PDF
      // handleGeneratePDF();
    }
  }, [delguur]);

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

    var ssum = 0;
    _.map(result, (item) => (ssum += item.price * item.count));
    settotal(ssum);
    setlist(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.order.order_id]);

  const tableRef = useRef();

  // const handleGeneratePDF = () => {
  //   const input = tableRef.current;
  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF();
  //     const imgWidth = 210; // A4 width in mm
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  //     pdf.save("table.pdf"); // Save the PDF
  //   });
  // };
  const company = (id) => {
    switch (state.order.xt_id) {
      case 1:
        return "Арвин үр түрүү - Тэнгэийн хишиг ХХК";
      case 2:
        return "Арвин үр түрүү - Тэнгэийн хишиг ХХК";
      case 3:
        return "Хүнс экспресс";
      case 4:
        return "Арвин үр түрүү - Тэнгэийн хишиг ХХК";
      case 5:
        return null;
      default:
        return null; // Handle any other cases
    }
  };
  const driver = (id) => {
    switch (state.order.xt_id) {
      case 1:
        return "Жолооч 99877765";
      case 2:
        return "Жолооч 99357688";
      case 3:
        return "Жолооч 80597132";
      case 4:
        return "";
      case 5:
        return null;
      default:
        return null; // Handle any other cases
    }
  };
  return (
    <div style={{ padding: 0, margin: 0 }}>
      {/* <Spin tip="Уншиж байна" className="bg-opacity-80" spinning={loading}> */}
      <div>
        <button onClick={handlePrint}> Хэвлэх</button>
        <div ref={printRef} id="printable-content">
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
                  {company(userInfo.user_id)}
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
                  {driver(userInfo.user_id)}
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
                  3199355
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
                  colSpan={3}
                  style={{
                    textAlign: "left",
                    fontWeight: 500,
                    fontSize: "12px",
                  }}
                >
                  Данс: Сарнайцэцэг /5090709172/ Арвин үр түрүү ххк /5217205009/
                </th>
                <th
                  style={{
                    textAlign: "left",
                    fontWeight: 500,
                    fontSize: "12px",
                  }}
                >
                  {/* {console.log(userInfo)}
                  {userInfo?.dans} */}
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
                    marginBottom: 20,
                  }}
                >
                  {delguur[0]?.d_dans}
                </th>
              </tr>
              <tr>
                <th colSpan={4}></th>
              </tr>{" "}
              <tr>
                <th colSpan={4}></th>
              </tr>
              <tr style={{ marginBottom: 20, marginTop: 10 }}>
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
                    fontWeight: 600,
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
                    fontWeight: 600,
                  }}
                >
                  Нийт үнэ
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Map over the data array to generate table rows */}
              {_.map(list && list, (item, index) => (
                <tr key={item.id}>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      textAlign: "center",
                      padding: "4px",
                      fontSize: "11px",
                      width: 20,
                      color: "#000000",
                      fontWeight: 600,
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
                      fontWeight: 500,
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
                      fontWeight: 600,
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
                      fontWeight: 600,
                    }}
                  >
                    {item.price}
                  </td>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "4px",
                      fontSize: "12px",
                      width: 60,
                      color: "#000000",
                      fontWeight: 600,
                    }}
                  >
                    {item.count}
                  </td>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      textAlign: "right",
                      padding: "4px",
                      fontSize: "12px",
                      color: "#000000",
                      width: 80,
                      fontWeight: 600,
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
                    color: "#000000",
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
                    color: "#000000",
                  }}
                ></td>
                <td
                  style={{
                    textAlign: "right",
                    padding: "4px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#000000",
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
                    color: "#000000",
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

        {/* <button onClick={handleGeneratePDF} style={{ marginTop: "20px" }}>
          Generate PDF
        </button> */}
        {/* _.map(list && list, (item, index) => ( */}

        {/* {_.map(list && list, (item, index) => (
          <div key={item.id}>
            <h2>item from {item.delguur_ner}</h2>
            <p>
              <strong>item ID:</strong> {item.id} <br />
              <strong>Delguur ID:</strong> {item.delguur_id} <br />
              <strong>item Number:</strong> {item.item_number} <br />
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
                    Нийт
                  </th>
                </tr>
              </thead>
              <tbody>
                {_.map(
                  item.balance && item.balance,
                  (balanceItem, balanceIndex) => (
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
                  )
                )}
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
                    Нийт
                  </td>

                  <td
                    style={{
                      border: "1px solid #dddddd",
                      padding: "2px",
                      textAlign: "center",
                    }}
                  >
                    {" "}
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
        ))}*/}
      </div>
      {/* PDF preview */}
      {/* <iframe
          id="pdf-preview"
          title="PDF Preview Document" // <-- Add a unique title here
          style={{
            width: "100%",
            height: "600px",
            marginTop: "20px",
            border: "1px solid #dddddd",
          }}
        ></iframe> */}
      <div ref={pdfRef} className="pdf-content"></div>
      {/* </Spin> */}
    </div>
  );
};

export default MyComponent;
