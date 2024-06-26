import React from "react";
import LessonList from "src/pages/workers/lessonList";
import Header from "src/pages/workers/header";
import ModuleType from "src/pages/workers/moduletype";
import Register from "src/pages/workers/register";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";

const Index = () => {
  const { state } = useRegisterEmplContext();
  return (
    <>
      <div className="card flex justify-center rounded-md p-2 ">
        <Header />

        {!state.lesson ? (
          <div className="flex flex-col lg:flex-row gap-2 text-xs">
            <div className="lg:w-1/4">
              <ModuleType />
            </div>
            <div className="lg:w-3/4">
              <LessonList />
            </div>
          </div>
        ) : (
          <Register />
        )}
      </div>
    </>
  );
};

export default React.memo(Index);
