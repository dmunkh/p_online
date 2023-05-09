import React from "react";

const plusButton = ({onClick, title}) => {
  return (
    <div
    title={title}
    className="p-1 text-xs flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer mr-4"
    onClick={onClick}
  >
    <i className="ft-plus" />
  </div>
  )

};

export default React.memo(plusButton);
