import React from "react";

import Header from "src/pages/plan/id/header";
// import Workers from "src/pages/plan/id/workers";
import { usePlanContext } from "src/contexts/planContext";

import { useUserContext } from "src/contexts/userContext";

const Index = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const queryParams = new URLSearchParams(window.location.search);

  //   queryParams.get("id") &&
  //     dispatch({ type: "STATE", data: { department: queryParams.get("id") } });

  return (
    <div className=" card flex p-2 border rounded text-xs">
      <Header />
      INDEX ID
      <div className="flex flex-col md:flex-row gap-2 ">
        <div className="md:w-2/3">{/* <Workers /> */}</div>

        <div className="md:w-2/3">{/* <Norm /> */}</div>
      </div>
    </div>
  );
};

export default React.memo(Index);
