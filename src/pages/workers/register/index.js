import React from "react";
import WorkerList from "src/pages/workers/register";
import Header from "src/pages/workers/register/header";

const Index = () => {
  return (
    <>
      <div className="card flex justify-center rounded-md p-2 ">
        <div className="flex flex-row gap-2 text-xs">
          <Header />
        </div>
        <WorkerList />
      </div>
    </>
  );
};

export default React.memo(Index);
