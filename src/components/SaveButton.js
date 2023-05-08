import React from "react";

const SaveButton = ({onClick}) => {
  return (
    <>
      <hr className="my-2" />
      <div className="flex gap-4">
        <button onClick={onClick} className="btn btn-primary marker:w-full py-2 flex items-center justify-center font-semibold  border-2 border-violet-500 rounded-md bg-violet-500 focus:outline-none duration-300 ">
          {/* <i className="fas fa-save" /> */}
          <span className="ml-2">Хадгалах</span>
        </button>
      </div>
    </>
  );
};

export default React.memo(SaveButton);
