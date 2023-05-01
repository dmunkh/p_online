import React from "react";
import LessonList from "src/pages/workers/lessonList";
import Header from "src/pages/workers/header";
import ModuleType from "src/pages/workers/moduletype";

const Index = () => {
  return (
    <>
      <div className="card flex justify-center rounded-md p-2 ">
        <div className="flex flex-col lg:flex-row gap-2 text-xs">
          <div className="lg:w-1/4">
            <ModuleType />
          </div>
          <div className="lg:w-3/4 mt-3">
            <Header />
            <LessonList />
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Index);
