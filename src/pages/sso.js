import React from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import * as API from "src/api/request";

const SSO = () => {
  const { search } = useLocation();
  let params = queryString.parse(search);

  if (params.error) window.location.replace("https://digital.erdenetmc.mn");
  else {
    API.postAuth({
      code: params.code,
    }).then((res) => {
      if (res.status === 200) {
        window.localStorage.clear();
        localStorage.setItem("token", res.data.token);
        window.location.replace("/me");
      }
    });
  }

  return <></>;
};

export default React.memo(SSO);
