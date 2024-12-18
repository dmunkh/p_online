import React from "react";
import Company from "src/pages/plan/company";
import WorkersType from "src/pages/plan/workersType ";
import Workers from "src/pages/plan/workers";
import Header from "src/pages/plan/header";
import { usePlanContext } from "src/contexts/planContext";

const Index = () => {
  const { state } = usePlanContext();
  return (
    <div className=" p-2 text-xs">
      <div className="flex flex-col md:flex-row gap-2 ">
        <div className="md:w-1/3">
          <Company />
        </div>
        <div className="md:w-2/3">
          <Workers />
        </div>
      </div>

      {/* <Header />
      <div className="flex flex-col md:flex-row gap-2 ">
        {state.single_page ? (
          <div className="md:w-2/3">
            {" "}
            <WorkersType />{" "}
          </div>
        ) : (
          <Type />
        )}

        <div className="md:w-2/3">{state.single_page ? <Workers /> : ""}</div>
      </div> */}
    </div>
  );
};

export default React.memo(Index);
