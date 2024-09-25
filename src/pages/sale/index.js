import React from "react";

import List from "src/pages/sale/list";
import Uldegdel from "src/pages/sale/uldegdel_list";

import { usePlanContext } from "src/contexts/planContext";

const Index = () => {
  const { state } = usePlanContext();
  return (
    <div className=" p-2 text-xs">
      Борлуулалт бүртгэл
      <div className="flex flex-col md:flex-row gap-2 ">
        <div className="md:w-1/2">
          <List />
        </div>
        <div className="md:w-1/2">
          <Uldegdel />
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
