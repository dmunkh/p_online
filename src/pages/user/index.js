import React from "react";
import List from "src/pages/user/list";
import Zone from "src/pages/user/userzone_list";
import Header from "src/pages/order/header";
import { usePlanContext } from "src/contexts/planContext";

const Index = () => {
  const { state } = usePlanContext();
  return (
    <div className=" p-2 text-xs">
      {/* <Header /> */}
      <div className="flex flex-col md:flex-row gap-2 ">
        <div className="md:w-1/2">
          <List />
        </div>
        {/* <div className="md:w-1/2"> */}
        {/* <Zone /> */}
        {/* </div> */}
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
