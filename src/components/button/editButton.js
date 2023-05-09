import React from "react";

const editButton = ({ onClick, title }) => {
  return (
   <button onClick={onClick} className="p-1 flex items-center justify-center font-semibold text-green-500 rounded-full border-2 border-green-500 hover:bg-green-500 hover:scale-125 hover:text-white focus:outline-none duration-300">
      <i className="ft-edit" />
    </button>
  );
};

export default React.memo(editButton);
