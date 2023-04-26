import React, { useEffect } from "react";
import Department from "src/components/custom/departmentTseh";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";
import Module from "src/components/custom/module";
import Type from "src/components/custom/type";
import { DatePicker } from "antd";
import _ from "lodash";
import { useUserContext } from "src/contexts/userContext";

const Header = () => {
  const { user, message, checkRole } = useUserContext();
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
        <span className="md:w-[40px] font-semibold">Огноо:</span>
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
        <div className="flex items-center w-full  md:w-[500px] text-xs gap-2">
          <span className="font-semibold whitespace-nowrap">Бүтцийн нэгж:</span>
          <Department
            value={state.department}
            onChange={(value) =>
              dispatch({ type: "STATE", data: { department: value } })
            }
          />
        </div>
        {/* <span className="font-semibold whitespace-nowrap">Модуль:</span>
        <Module
          value={state.moduletypeid}
          onChange={(value) =>
            dispatch({ type: "STATE", data: { moduletypeid: value } })
          }
        /> */}
      </div>
    </div>
  );
};
export default Header;
