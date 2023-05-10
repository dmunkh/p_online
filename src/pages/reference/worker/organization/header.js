import React from "react";
import { DatePicker, Select } from "antd";
import moment from "moment";
import { useReferenceContext } from "src/contexts/referenceContext";
import { useUserContext } from "src/contexts/userContext";
import * as API from "src/api/request";
import _ from "lodash";

import { useLayoutEffect } from "react";

const Header = () => {
  const { state, dispatch } = useReferenceContext();
  const { message } = useUserContext();

  //байгуулга жагсаалт
  useLayoutEffect(() => {
    API.getOrganization()
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_organization: _.orderBy(
              _(res)
                .groupBy("organization_name")
                .map((list, key) => ({
                  organization_name: list[0].organization_name,
                  ID: list[0].ID,
                }))
                .value(),
              ["organization_name"]
            ),
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: "STATE",
          data: {
            list_organization: [],
          },
        });
        message({
          type: "error",
          error,
          title: "Байгууллагын жагсаалт татаж чадсангүй",
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
  <></>
  );
};

export default React.memo(Header);
