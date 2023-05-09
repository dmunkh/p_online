import React from "react";

const deleteButton = ({ onClick, title }) => {
  return (
    <button
    title={title}
    className="p-1 flex items-center justify-center font-semibold text-red-500 rounded-full border-2 border-red-500 hover:bg-red-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
    onClick={onClick}
  >
    <i className="ft-trash-2" />
  </button>
  );
};

export default React.memo(deleteButton);
