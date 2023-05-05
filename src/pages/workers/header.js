import React, { useEffect } from "react";
import Department from "src/components/custom/departmentTseh";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";
import { DatePicker } from "antd";
import _ from "lodash";
import { useUserContext } from "src/contexts/userContext";
import Module from "src/components/custom/module";

const Header = () => {
  const { user } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();

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
      <div className="flex items-center w-full  md:min-w-[100px] text-xs gap-2">
        <div className="flex item-center gap-2 ">
          {state.lesson && (
            <div
              title="Буцах"
              className="px-3 flex items-center justify-center text-blue-700 text-lg border rounded-md cursor-pointer hover:scale-110 duration-300 h-10"
              onClick={() =>
                dispatch({ type: "STATE", data: { lesson: null } })
              }
            >
              <i className="fa fa-arrow-left" />
            </div>
          )}
        </div>
        <span className="md:w-[20px] font-semibold">Он:</span>
        <DatePicker
          allowClear={false}
          picker="year"
          format="YYYY"
          value={state.date}
          onChange={(date) => {
            dispatch({
              type: "STATE",
              data: { date: date },
            });
          }}
        />
        {!state.lesson && (
          <>
            <span className="text-sm">Модуль</span>
            <Module
              value={state.moduletypeid}
              onChange={(value) =>
                dispatch({ type: "STATE", data: { moduletypeid: value } })
              }
            />
          </>
        )}

        <div className="flex items-center w-full  md:w-[500px] text-xs gap-2">
          {state.lesson && (
            <>
              <span className="font-semibold whitespace-nowrap">
                Бүтцийн нэгж:
              </span>
              <Department
                value={state.department}
                onChange={(value) =>
                  dispatch({ type: "STATE", data: { department: value } })
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Header;
