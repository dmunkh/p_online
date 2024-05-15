import React from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import * as API from "../api/request";

const Callback = () => {
  const { search } = useLocation();
  let params = queryString.parse(search);
  console.log("callback params", params.code);
  if (params.error) window.location.replace("https://digital.erdenetmc.mn");
  else {
    API.postAuth({
      code: params.code,
    }).then((res) => {
      if (res.status === 200) {
        window.localStorage.clear();
        localStorage.setItem("token", res.data.token);
        window.location.replace("/dashboard");
      }
    });
  }

  return <></>;
};

export default React.memo(Callback);
