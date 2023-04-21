import React from "react";
import { DatePicker, Select } from "antd";
import moment from "moment";
import { useReferenceContext } from "../../../contexts/referenceContext";
import { useUserContext } from "../../../contexts/userContext";
import * as API from "../../../api/request";
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
    <div className="mb-2 pb-2 flex flex-col md:flex-row gap-5 border-b">
      <div className="flex flex-col md:justify-between md:flex-row md:items-center gap-3  pb-2">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="w-full flex items-center gap-3 pr-3">
            <span className="w-25 pr-3 font-semibold text-xs">Он:</span>

            <DatePicker
              allowClear={false}
              className="w-full md:w-[150px] text-xs rounded-lg"
              picker="year"
              format="YYYY"
              value={state.change_year}
              onChange={(date) =>
                dispatch({
                  type: "YEAR",
                  data: moment(date, "YYYY"),
                })
              }
            />
          </div>
          <div className="flex flex-col  md:flex-row md:items-center gap-3">
            <span className="md:w-max pr-3 font-semibold text-xs whitespace-nowrap">
              Байгууллага:
            </span>
            <div className="w-full md:min-w-[200px]">
              <Select
                value={state.selected_organizationID}
                placeholder="Сонгоно уу..."
                allowClear
                className="w-full text-xs"
                onChange={(value, children) => {
                  dispatch({
                    type: "STATE",
                    data: {
                      selected_orgName: children.children,
                      selected_organizationID: value,
                    },
                  });
                }}
              >
                {_.map(state?.list_organization, (item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.organization_name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
