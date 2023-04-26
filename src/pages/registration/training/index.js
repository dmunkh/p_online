import React from "react";
import Header from "src/pages/registration/training/header";
import Listtraining from "src/pages/registration/training/listtraining";
import Calendar from "src/pages/registration/training/calendar";
import { useTrainingContext } from "src/contexts/trainingContext";
const Index = () => {
  const { state } = useTrainingContext();
  return (
    <div className="card ">
      <Header />
      <div className=" card-content card-body">
        {state.change_btn ? <Calendar /> : <Listtraining />}
      </div>
    </div>
  );
};
export default React.memo(Index);
