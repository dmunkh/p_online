import React, { useState, useEffect } from "react";
import { useNormContext } from "src/contexts/normContext";

import { TreeSelect, Input } from "antd";
// import * as API from "src/api/request";
import _ from "lodash";
import { useUserContext } from "src/contexts/userContext";

const Header = () => {
  const { user } = useUserContext();
  const { state, dispatch } = useNormContext();
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    if (state?.list_department?.length > 0 && state?.department === null) {
      var department = _.find(state?.list_department, {
        department_code: user?.info?.tseh_code,
      });

      dispatch({
        type: "DEPARTMENT",
        data: department?.department_id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.list_department]);

  return (
    <div className="mb-2 pb-2 flex flex-col md:flex-row gap-2 border-b">
      <div className="flex items-center justify-between text-xs ml-5">
        <span className="w-36 md:w-full pr-3 font-semibold">БД:</span>
        <div className="w-full md:min-w-[150px] ">
          <Input
            allowClear
            className="w-full text-xs rounded-lg"
            placeholder="Табель №..."
            value={state.tn}
            onChange={(e) => {
              dispatch({ type: "SEARCHTN", data: e.target.value });
            }}
            onPressEnter={(e) => {
              //   API.getSearchWorkerList(e.target.value)
              //     .then((res) => {
              //       setInfo(res);
              //       dispatch({
              //         type: "DEPARTMENT",
              //         data: res?.departmentid,
              //       });
              //       dispatch({
              //         type: "NONORM",
              //         data: false,
              //       });
              //     })
              //     .catch((error) => {
              //       message({
              //         type: "error",
              //         error,
              //         title: "Мэдээлэл олдсонгүй",
              //       });
              //     });
            }}
          />
        </div>
      </div>

      <div className="flex items-center w-full  md:min-w-[500px] text-xs gap-3">
        <span className="w-36 font-semibold whitespace-nowrap pr-5 ml-5">
          Бүтцийн нэгж:
        </span>
        <TreeSelect
          showSearch
          allowClear={true}
          placeholder="Сонгоно уу"
          treeDataSimpleMode={true}
          className="w-full md:max-w-[400px]"
          treeData={state?.list_department}
          treeLine={(true, { showLeafIcon: false })}
          //value={state.department}
          value={10}
          onChange={(value) => {
            dispatch({
              type: "CLEAR",
            });
            dispatch({ type: "SEARCHTN", data: null });

            dispatch({
              type: "DEPARTMENT",
              data: value,
            });
          }}
          filterTreeNode={(search, item) =>
            item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0
          }
          open={open}
          onDropdownVisibleChange={(open) => setOpen(open)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              var department = _.find(state?.list_department, {
                department_code: e.target.value,
              });
              if (department) {
                dispatch({
                  type: "DEPARTMENT",
                  data: department.id,
                });

                setOpen(false);
              }
            }
          }}
        />
      </div>
      {state.tn && (
        <div className="flex items-center w-full  md:min-w-[500px] text-xs gap-3">
          <span>
            {info?.shortname} - {info.depposition_name}
          </span>
        </div>
      )}
    </div>
  );
};

export default React.memo(Header);
