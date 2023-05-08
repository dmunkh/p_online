import React from "react";
import Position from "src/pages/planhab/position";
import Norm from "src/pages/planhab/norm";
import Header from "src/pages/planhab/header";

const Index = () => {
  return (
    <div className=" p-2 text-xs">
      <Header />

      <div className="flex flex-col md:flex-row gap-2 ">
        <div className="md:w-2/3">
          <Position />
        </div>

        <div className="md:w-2/3">
          <Norm />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Index);
