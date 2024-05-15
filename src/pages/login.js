import React from "react";
import useBearStore from "src/state/state";
// import Card from "./card"
import SaveButton from "src/components/button/SaveButton";
const Login = () => {
  const setIsUserValid = useBearStore((state) => state.setIsUserValid);
  const handleClick = () => {
    setIsUserValid(true);
  };
  return (
    <>
      {/* <Card/> */}
      Login
      <SaveButton
        onClick={() => {
          // setLoading(true);
          handleClick();
          // setLoading(false);
        }}
      />
    </>
  );
};
export default React.memo(Login);
