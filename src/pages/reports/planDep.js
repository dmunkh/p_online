import React, { useLayoutEffect, useState } from "react";
import { useUserContext } from "src/contexts/userContext";
import Header from "src/pages/reports/header";
import { useTrainingContext } from "src/contexts/trainingContext";
import { Spin } from "antd";
import moment from "moment";
import * as API from "src/api/training";

import { Modal } from "antd";
import _ from "lodash";
import department from "../workers/department";

const PlanDep = () => {
  const { message } = useUserContext();
  const [loading] = useState(false);
  const { state, dispatch } = useTrainingContext();

  const [print_modal, setPrint_modal] = useState(false);
  const [listLesson, setListLesson] = useState([]);

  useLayoutEffect(() => {
    if (state.moduleid) {
      API.getReportPlanDep({
        year: moment(state.change_year).format("YYYY"),
        module_id: state.moduleid,
      })
        .then((res) => {
          dispatch({
            type: "STATE",
            data: {
              list_reportplandep: _.orderBy(
                _.filter(
                  res,
                  (a) =>
                    a.departmentcode !== "0102-68" &&
                    a.departmentcode !== "0102-20" &&
                    a.departmentcode !== "0102-70"
                ),
                ["type_id"]
              ),
            },
          });
        })
        .catch((error) => {
          dispatch({
            type: "STATE",
            data: {
              list_reportplandep: [],
            },
          });
          message({
            type: "error",
            error,
            title: "Тайлан татаж чадсангүй",
          });
        });

      API.getTypesYear({
        year: moment(state.change_year).format("YYYY"),
        module_id: state.moduleid,
      })
        .then((res) => {
          dispatch({
            type: "STATE",
            data: {
              list_lessType: _.orderBy(res, ["type_id"]),
            },
          });
        })
        .catch((error) => {
          dispatch({
            type: "STATE",
            data: {
              list_lessType: [],
            },
          });
          message({
            type: "error",
            error,
            title: "Тайлан татаж чадсангүй",
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.change_year, state.moduleid]);

  // const printTo = (list) => {
  //   setPrint_modal(true);
  //   var data = {
  //     year: moment(state.change_year).format("YYYY"),
  //     module_id: state.moduleid,
  //   };
  //   var url = new URL("https://localhost:44335/training/planDepartment");
  //   //var url = new URL("https://training.erdenetmc.mn/api/report/plan/count");

  //   // if (window.location.hostname === "localhost")
  //   //   url = new URL("https://localhost:44335/hse/plan");
  //   Object.keys(data).forEach((key) => url.searchParams.append(key, data[key]));
  //   fetch(url, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "SSO " + localStorage.token,
  //     },
  //   })
  //     .then((response) => response.blob())
  //     .then(function (myBlob) {
  //       const obj_url = URL.createObjectURL(myBlob);

  //       const iframe = document.getElementById("ReportViewer");
  //       iframe.contentWindow.location.replace(obj_url);
  //     })
  //     .catch((error) => {
  //       message({ type: "error", error, title: "Хэвлэж чадсангүй" });
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  // const ss = (list) => {
  //   var result = [];

  //   _.map(list, (item) => {
  //     _.map(item.attendance, (data) => {
  //       data.checked && result.push(data.checked);
  //     });
  //   });

  //   return result.length;
  // };

  const renderFooter = (question) => {
    let sum = new Array(question.data[0].length).fill(0); // Initialize an array to hold the sums for each column

    const cells = _.map(question, (item, index) => {
      const rowSum = [];
      // const rowCells = _.map(item, (cell, colIndex) => {
      //   if (state?.list_lessType.some((i) => i.type_id === cell?.type_id)) {
      //     // rowSum[colIndex] = (rowSum[colIndex] || 0) + (cell.count || 0);
      //     return (
      //       <td className="text-center border" key={colIndex}>
      //         {cell?.count !== 0 ? cell?.count : ""}
      //       </td>
      //     );
      //   }
      //   return null;
      // });

      // // const cells = question?.data.map((item, rowIndex) => {
      // //   const rowSum = []; // Initialize an array to hold the sum for each row

      // //   const rowCells = item?.map((cell, columnIndex) => {
      // //     if (state?.list_lessType.some((i) => i.type_id === cell?.type_id)) {
      // //       rowSum[columnIndex] = (rowSum[columnIndex] || 0) + (cell?.count || 0); // Add the count to the row sum
      // //       return (
      // //         <td className="text-center border" key={columnIndex}>
      // //           {cell?.count !== 0 ? cell?.count : ""}
      // //         </td>
      // //       );
      // //     }
      // //     return null;
      // //   });

      // cells.push(rowCells); // Add the row cells to the cells array

      _.map(item.data, (colSum, colIndex) => {
        sum[colIndex] = (sum[colIndex] || 0) + colSum;
      });

      // rowSum?.forEach((columnSum, columnIndex) => {
      //   sum[columnIndex] = (sum[columnIndex] || 0) + columnSum; // Add the row sum to the column sum
      // });

      return null;
    });

    const footerRow = (
      // <tr key="footer">
      //   {sum.map((columnSum, columnIndex) => (
      //     <td className="text-center border" key={columnIndex}>
      //       {columnSum}
      //     </td>
      //   ))}
      // </tr>
      <tr key="footer">
        {_.map(sum, (columnSum, colIndex) => (
          <td key={colIndex}>{columnSum}</td>
        ))}
      </tr>
    );

    return footerRow;
  };

  const render = (question) => {
    let sum = 0; // Initialize a variable to hold the sum

    const cells = _.orderBy(question.data, ["type_id"]).map((item, index) => {
      if (
        _.orderBy(state?.list_lessType, ["type_id"]).some(
          (i) => i.type_id === item?.type_id
        )
      ) {
        sum += item?.count || 0; // Add the count to the sum
        return (
          <td className="text-center border " key={index}>
            {item?.count !== 0 ? item?.count : ""}
          </td>
        );
      }
      return null;
    });

    cells.push(
      <td
        className="text-center border ml-8 mr-8 font-bold bg-gray-50"
        key="sum"
      >
        {sum !== 0 ? sum : ""}
      </td>
    ); // Add the sum as the last cell

    return cells;
  };
  return (
    <div className=" card flex p-2 rounded text-xs">
      <Header />
      <div className="flex  text-xs max-h-[calc(100vh-300px)] overflow-auto">
        <div className="flex flex-col ">
          <div className="flex justify-center text-xs  ">
            {/* <Spin
              tip="Уншиж байна."
              className="min-h-full first-line:bg-opacity-80"
              spinning={loading}
            > */}
            {/* <App /> */}

            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-center border p-1 bg-slate-100 ">№</th>
                  <th className="text-center border p-1  bg-slate-100">Код</th>
                  <th className="text-center border p-1  bg-slate-100">
                    Бүтцийн нэгж
                  </th>

                  {_.map(state.list_lessType, (answer, index) => {
                    return (
                      <th
                        key={index}
                        className="text-center border p-1  bg-slate-100"
                      >
                        {answer.type_name} + {answer.type_id}
                      </th>
                    );
                  })}

                  <th className="text-center border pl-3 pr-3  bg-slate-100 ">
                    Нийт
                  </th>
                </tr>
              </thead>
              <tbody>
                {_.map(state.list_reportplandep, (item, index) => {
                  return (
                    <tr key={item.id} className="hover:bg-slate-200">
                      <td className="text-center border pl-2 pr-2">
                        {index + 1}
                      </td>
                      <td
                        className="text-center border p-1"
                        style={{ width: "60px" }}
                      >
                        {item.departmentcode}
                      </td>
                      <td
                        className="border px-2 m-w-[200px]"
                        style={{ width: "300px" }}
                      >
                        {item.departmentnameshort}
                      </td>
                      {render(item)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* {memo_table} */}
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

export default React.memo(PlanDep);
