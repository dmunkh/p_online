import React from "react";
import { DatePicker, Select } from "antd";
import moment from "moment";
import { useReferenceContext } from "../../../contexts/referenceContext";
import { useUserContext } from "../../../contexts/userContext";
import * as API from "../../../api/reference";
import _ from "lodash";
import { useLayoutEffect } from "react";

const Header = () => {
  const { state, dispatch } = useReferenceContext();
  const { message,  checkRole } = useUserContext();

  //modul жагсаалт
  useLayoutEffect(() => {
    API.getModule()
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_module: _.orderBy(res, ["id"]),
            selected_moduleID: res[0].id,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: "STATE",
          data: {
            list_module: [],
          },
        });
        message({
          type: "error",
          error,
          title: "Сургалтын бүлэг татаж чадсангүй",
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mb-2 pb-2 flex flex-col md:flex-row gap-5 border-b">
      <div className="flex flex-col md:justify-between md:flex-row md:items-center gap-3  pb-2">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex flex-col  md:flex-row md:items-center gap-3 ml-5">
            <span className="md:w-max pr-3 font-semibold text-xs whitespace-nowrap">
              Сургалтын бүлэг:
            </span>
            <div className="w-full md:min-w-[200px]">
            {checkRole(["organization_add"]) && (
              <Select
                value={state.selected_moduleID}
                placeholder="сонгох."
                className="w-full text-xs"
                onChange={(value) => {
                  dispatch({
                    type: "STATE",
                    data: {
                      selected_moduleID: value,
                    },
                  });
                }}
              >
                {_.map(state?.list_module, (item, index) => (
                  <Select.Option
                    key={index}
                    value={item.id}
                    className="text-sm"
                  >
                    {item.module_name}
                  </Select.Option>
                ))}
              </Select>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
