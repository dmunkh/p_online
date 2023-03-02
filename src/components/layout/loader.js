import React from "react";

const Loader = () => {
  return (
    <div id="global-loader">
      <img
        src="/img/loaders/loader-4.svg"
        className="loader-img"
        alt="Loader"
      />
    </div>
  );
};

export default React.memo(Loader);
