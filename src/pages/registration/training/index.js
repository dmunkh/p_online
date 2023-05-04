import React from "react";
import Header from "src/pages/registration/training/header";
import Listtraining from "src/pages/registration/training/listtraining";
import Calendars from "src/pages/registration/training/calendars";
import { useTrainingContext } from "src/contexts/trainingContext";
const Index = () => {
  const { state } = useTrainingContext();
  return (
    <div className="card ">
      <Header />
      <div className="p-1">
        <Listtraining />
        {/* {state.change_btn ? <Calendars /> : <Listtraining />} */}
      </div>
    </div>
  );
};
export default React.memo(Index);
