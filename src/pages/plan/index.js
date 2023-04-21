import React from "react";
import Position from "src/pages/plan/type";

import Header from "src/pages/plan/header";

const Index = () => {
  return (
    <div className=" card flex p-2 border rounded text-xs">
      <Header />

      <div className="flex flex-col md:flex-row gap-2 ">
        <div className="md:w-2/3">
          <Position />
        </div>

        <div className="md:w-2/3">{/* <Norm /> */}</div>
      </div>
    </div>
  );
};

export default React.memo(Index);
