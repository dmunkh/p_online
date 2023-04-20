import React from "react";

const Loading = () => {
  return (
    <div className="gadot-spinner">
      <div
        className="spinner-grow"
        role="status"
        style={{
          display: "inline-block",
          width: "80px",
          height: "80px",
          position: "absolute",
          justifyContent: "center",
        }}
      >
        <span className="sr-only">Түр хүлээнэ үү...</span>
      </div>
    </div>
  );
};

export default React.memo(Loading);
