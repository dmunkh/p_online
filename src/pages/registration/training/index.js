import React, { useLayoutEffect, useState } from "react";
import { useUserContext } from "../../../contexts/userContext";
import { useTrainingContext } from "../../../contexts/trainingContext";
import Header from "src/pages/registration/training/header";
import Calendar from "src/pages/registration/training/calendar";
import Training from "src/pages/registration/training/listtraining";
import * as API from "src/api/training";
import _ from "lodash";
import { Spin } from "antd";
import Swal from "sweetalert2";

const Index = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useTrainingContext();

  const [loading, setLoading] = useState(false);

  // жагсаалт
  useLayoutEffect(() => {
    setLoading(true);
    state.module_id &&
      API.getLesson({
        year: state.change_year,
        module_id: state.module_id,
      })
        .then((res) => {
          dispatch({
            type: "STATE",
            data: {
              list_training: _.orderBy(res, ["id"]),
            },
          });
        })
        .catch((error) => {
          dispatch({
            type: "STATE",
            data: {
              list_training: [],
            },
          });
          message({
            type: "error",
            error,
            title: "Сургалтын төрөл жагсаалт татаж чадсангүй",
          });
        })
        .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.change_year, state.module_id]);

  return (
    <div className="card ">
      <Header />
      <div className=" card-content card-body">
        {state.change_btn ? <Calendar /> : <Training />}
      </div>
    </div>
  );
};
export default React.memo(Index);
