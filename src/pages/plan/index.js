import React from "react";
import Position from "src/pages/plan/type";
import WorkersType from "src/pages/plan/workersType ";
import Workers from "src/pages/plan/workers";
import Header from "src/pages/plan/header";
import { usePlanContext } from "src/contexts/planContext";

const Index = () => {
  const { state, dispatch } = usePlanContext();
  return (
    <div className=" card flex p-2 border rounded text-xs">
      <Header />
      <div className="flex flex-col md:flex-row gap-2 ">
        <div className="md:w-2/3">
          {state.single_page ? <WorkersType /> : <Position />}
        </div>
        <div className="md:w-2/3">
          {!state.isapprove && state.single_page ? <Workers /> : ""}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Index);
