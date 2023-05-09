import React, { useState } from "react";
import { DatePicker, Select } from "antd";
import moment from "moment";
import { useReferenceContext } from "../../../contexts/referenceContext";
import { useUserContext } from "../../../contexts/userContext";
import * as API from "../../../api/reference";
import _ from "lodash";
import { useLayoutEffect } from "react";
import Module from "src/components/custom/module";

const Header = () => {
  const { state, dispatch } = useReferenceContext();
  const { message } = useUserContext();
  const [module, setModule] = useState();
  //modul жагсаалт
  // useLayoutEffect(() => {
  //   API.getModule()
  //     .then((res) => {
  //       dispatch({
  //         type: "STATE",
  //         data: {
  //           list_module: _.orderBy(res, ["id"]),
  //           selected_moduleID: res[0].id,
  //         },
  //       });
  //     })
  //     .catch((error) => {
  //       dispatch({
  //         type: "STATE",
  //         data: {
  //           list_module: [],
  //         },
  //       });
  //       message({
  //         type: "error",
  //         error,
  //         title: "Сургалтын бүлэг татаж чадсангүй",
  //       });
  //     });

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div className="mb-2 pb-2 flex flex-col md:flex-row gap-5 border-b">
      <div className="md:w-1/3 flex flex-col  md:flex-row md:items-center gap-3 ml-5">
        <span className="px-3 font-semibold text-xs whitespace-nowrap">
          Сургалтын бүлэг:
        </span>
        <Module
          value={module}
          onChange={(value) => {
            setModule(value);
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(Header);
