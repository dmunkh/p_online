import { Upload } from "antd";
import React from "react";
const FileUpload = () => {
  return (
    <>
      <Upload>
        <button className="bg-[#01947a] py-2.5 px-5 rounded-lg text-white w-full ">
          Файл хавсаргах
        </button>
      </Upload>
    </>
  );
};
export default React.memo(FileUpload);
