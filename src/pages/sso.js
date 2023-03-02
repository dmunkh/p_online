import React from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import * as api from "src/api/request";

const SSO = () => {
  const { search } = useLocation();
  let params = queryString.parse(search);

  if (params.error) window.location.replace("https://digital.erdenetmc.mn");
  else {
    api
      .API()
      .post("/auth", {
        code: params.code,
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          window.location.replace("/");
        }
      })
      .catch(() => {});
  }

  return <></>;
};

export default React.memo(SSO);
