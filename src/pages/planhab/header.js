import React, { useEffect } from "react";
import Department from "src/components/custom/departmentTseh";
import { usePlanHabContext } from "src/contexts/planhabContext";
import { DatePicker } from "antd";


import _ from "lodash";
import { useUserContext } from "src/contexts/userContext";

const Header = () => {
  const { user } = useUserContext();
  const { state, dispatch } = usePlanHabContext();

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
      <div className="flex items-center w-full  md:min-w-[500px] text-xs gap-2">
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
        <span className="font-semibold whitespace-nowrap">Бүтцийн нэгж:</span>
        <Department
          value={state.department}
          onChange={(value) =>
            dispatch({ type: "STATE", data: { department: value } })
          }
        />
        {/* <Module />
        <Type module_id={1} /> */}
      </div>
    </div>
  );
};
export default Header;
