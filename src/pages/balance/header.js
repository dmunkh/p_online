import React, { useState, useEffect } from "react";
// import { useUserContext } from "src/contexts/userContext";
import { usePlanContext } from "src/contexts/planContext";
import Module from "src/components/custom/module";
// import Tree from "src/components/custom/departmentTree";
// import * as API from "src/api/request";
import { DatePicker, Select } from "antd";
import moment from "moment";
import Company from "src/components/Company";
import axios from "axios";
import useBearStore from "src/state/state";
import _ from "lodash";
const { Option } = Select;

const Header = () => {
  const { state, dispatch } = usePlanContext();
  const [baraa_list, setBaraa_list] = useState();
  const [loading, setLoading] = useState(false);
  const user_id = useBearStore((state) => state.user_id);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://dmunkh.store/api/backend/baraa",
          { params: { user_id: user_id } }
        );

        setBaraa_list(_.orderBy(response?.data?.response, ["id"]));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError(error);
      }
    };

    fetchData();
  }, [state.refresh]);
  return (
    <div className="mb-2 pb-2 flex flex-col md:flex-row gap-2 border-b">
      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex item-center gap-2 ">
          {state.single_page ? (
            <div
              title="Буцах"
              className="px-3 flex items-center justify-center text-blue-700 text-lg border rounded-md cursor-pointer hover:scale-110 duration-300 h-10"
              onClick={() =>
                dispatch({ type: "STATE", data: { single_page: false } })
              }
            >
              <i className="fa fa-arrow-left" />
            </div>
          ) : (
            ""
          )}
        </div>
        <span className="md:w-[50px] font-semibold">Огноо:</span>
        <div className="w-full md:min-w-[110px] ">
          <DatePicker
            allowClear={false}
            className="w-full md:w-[110px] text-xs"
            value={moment(state.balance.start_date)}
            onChange={(date) => {
              dispatch({
                type: "BALANCE",
                data: { start_date: date },
              });
            }}
          />
        </div>
      </div>

      <div className="flex items-center md:w-[190px] text-xs gap-2">
        <span className="font-semibold whitespace-nowrap"> - </span>
        <DatePicker
          allowClear={false}
          className="w-full md:w-[110px] text-xs"
          value={moment(state.balance.end_date)}
          onChange={(date) => {
            dispatch({
              type: "BALANCE",
              data: { end_date: date },
            });
          }}
        />
      </div>
      <div className="flex items-center w-[800px]  md:w-[850px] text-xs gap-2">
        <Company
          value={state.balance.seller_id}
          onChange={(value) => {
            dispatch({ type: "BALANCE", data: { seller_id: value } });
          }}
        />{" "}
        <div className="w-full">
          <Select
            showSearch
            allowClear
            placeholder="Сонгоно уу."
            optionFilterProp="children"
            className="w-full"
            value={state.balance.baraa_id_filter}
            onChange={(value) => {
              // var selected_baraa = _.filter(baraa_list, (a) => a.id === value);

              dispatch({
                type: "BALANCE",
                data: { baraa_id_filter: value },
              });
            }}
          >
            {_.map(baraa_list, (item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.company_ner + " - " + item.baraa_ner + " - " + item.une}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};
export default Header;
