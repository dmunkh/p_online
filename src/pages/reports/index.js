import React, { useLayoutEffect, useState } from "react";
import { useUserContext } from "src/contexts/userContext";
import Header from "src/pages/reports/header";
import { useTrainingContext } from "src/contexts/trainingContext";
import { Spin } from "antd";
import moment from "moment";
import * as API from "src/api/training";
import _ from "lodash";
const Index = () => {
  const { message, checkRole } = useUserContext();
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useTrainingContext();

  useLayoutEffect(() => {
    API.getReportPlan({
      year: moment(state.change_year).format("YYYY"),
      module_id: state.moduleid,
    })
      .then((res) => {
      
        dispatch({
          type: "STATE",
          data: {
            list_reportplan: _.orderBy(res, ["type_id"]),
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
          title: "Төлөвлөгөө жагсаалт татаж чадсангүй",
        });
      })
      .finally(() => printTo(state.list_reportplan));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.change_year, state.moduleid]);

  const printTo = (list) => {
    var data = {
      year: moment(state.change_year).format("YYYY"),
      module_id: state.moduleid,
    };
    //var url = new URL("https://localhost:44335/Hse/Plan");
    var url = new URL("https://training.erdenetmc.mn/api/report/plan/count");

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

  return (
    <div className=" card flex p-2 border rounded text-xs">
      <Header />
      <div className="flex flex-col md:flex-row gap-2 ">
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
      </div>
    </div>
  );
};

export default React.memo(Index);
