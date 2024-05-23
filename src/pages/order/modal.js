import React, { useState, useEffect } from "react";
import * as API from "src/api/plan";
import { useUserContext } from "src/contexts/userContext";
import { usePlanContext } from "src/contexts/planContext";
// import Module from "src/components/custom/module";

import dayjs from "dayjs";
// import _ from "lodash";
import {
  DatePicker,
  Spin,
  Modal,
  InputNumber,
  Input,
  Select,
  Space,
} from "antd";
import SaveButton from "src/components/button/SaveButton";
import _ from "lodash";
import axios from "axios";
import moment from "moment";
import useBearStore from "src/state/state";
// import Swal from "sweetalert2";
const { Option } = Select;

const ModalNormDetail = () => {
  const { message } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const [loading, setLoading] = useState(false);

  const [delguur, setDelguur] = useState([]);

  const [company, setCompany] = useState([]);
  const [cash, setcash] = useState(0);
  const [order, setorder] = useState(0);
  const [date, setdate] = useState(dayjs());

  const [delguur_list, setDelguur_list] = useState();
  const main_company_id = useBearStore((state) => state.main_company_id);
  const user_id = useBearStore((state) => state.user_id);

  console.log("date", dayjs(state.order.dt), state.order.order_id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          // "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/baraa"
          // "http://3.0.177.127/api/backend/baraa"
          "http://localhost:5000/api/backend/delguur"
        );
        console.log(response.data.response);

        setCompany(_.orderBy(response.data.response, ["id"]));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError(error);
      }
    };

    fetchData();
  }, [state.refresh]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          // "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/baraa"
          // "http://3.0.177.127/api/backend/baraa"
          "http://localhost:5000/api/backend/delguur"
        );
        console.log("baraa list", response.data.response);

        setDelguur_list(_.orderBy(response.data.response, ["id"]));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError(error);
      }
    };

    fetchData();
  }, [state.refresh]);

  const handleClick = () => {
    console.log(
      "INSERTING",
      // baraa[0].company_name,
      dayjs(date).format("YYYY"),
      dayjs(date).format("M"),
      state.order.order_id
    );

    if (state.order.order_id === 0) {
      try {
        const response = axios.post(
          "http://localhost:5000/api/backend/orders",
          {
            delguur_id: delguur[0].id,
            delguur_ner: delguur[0].delguur_ner,
            order_number: order,
            cash: state.order.cash,
            register_date: state.order.dt,
            is_approve: 0,
            mc_id: main_company_id,
            user_id: user_id,
          }
        );
        dispatch({
          type: "STATE",
          data: { refresh: state.refresh + 1 },
        });

        console.log("return", response.data, "refresh", state.refresh);
        // const fetchData = async () => {
        //   try {
        //     const response = await axios.get(
        //       "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/balance"
        //     );
        //     console.log("data", response.data);
        //   } catch (error) {}
        // };

        // fetchData();
      } catch (error) {}
    } else {
      try {
        const response = axios.put(
          "http://localhost:5000/api/backend/orders/" + state.order.order_id,
          {
            delguur_id: delguur[0].id,
            delguur_ner: delguur[0].delguur_ner,
            order_number: order,
            cash: state.order.cash,
            register_date: moment(state.order.dt).format("YYYY.MM.DD"),
            is_approve: 0,
          }
        );
        dispatch({
          type: "STATE",
          data: { refresh: state.refresh + 1 },
        });

        console.log("return", response.data, "refresh", state.refresh);
        // const fetchData = async () => {
        //   try {
        //     const response = await axios.get(
        //       "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/balance"
        //     );
        //     console.log("data", response.data);
        //   } catch (error) {}
        // };

        // fetchData();
      } catch (error) {}
    }
  };

  return (
    <div className="flex flex-col text-xs">
      <div>
        <h2 className=" text-center text-lg font-extrabold text-gray-900">
          Захиалга бүртгэл
        </h2>
      </div>

      <hr className="my-2" />
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Огноо</div>
          <div className="w-3/4">
            <DatePicker
              className="w-full"
              value={moment(state.order.dt)}
              onChange={(date) =>
                dispatch *
                {
                  type: "ORDER",
                  data: { dt: dayjs(date).format("YYYY.MM.DD") },
                }
              }
            />
          </div>
        </div>
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Дэлгүүр сонгох</div>
          <div className="w-3/4">
            <Select
              showSearch
              allowClear
              value={state.order.delguur_id}
              placeholder="Сонгоно уу."
              optionFilterProp="children"
              className="w-full"
              onChange={(value) => {
                console.log(
                  value,
                  _.filter(delguur_list, (a) => a.id === value)
                );
                setDelguur(_.filter(delguur_list, (a) => a.id === value));
                dispatch({ type: "ORDER", data: { delguur_id: value } });
              }}
            >
              {_.map(delguur_list, (item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.delguur_ner}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Захиалгын дугаар</div>
          <InputNumber value={order} onChange={(value) => setorder(value)} />
        </div>
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Бэлэн төлөлт</div>
          <InputNumber
            value={state.order.cash}
            onChange={(value) =>
              dispatch({ type: "ORDER", data: { cash: value } })
            }
          />
        </div>

        <Spin
          tip="Уншиж байна. Түр хүлээнэ үү"
          className="bg-opacity-60"
          spinning={loading}
        >
          <SaveButton
            onClick={() => {
              setLoading(true);
              handleClick();
              setLoading(false);
            }}
          />
          {/* <button
          className="w-full py-2 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-md hover:bg-violet-500 hover:text-white focus:outline-none duration-300 "
          onClick={() => {
            setLoading(true);
            API.postPlanApprove({
              module_id: state.moduleid,
              year: moment(state.date).format("Y"),
              is_closed: 1,
              department_id: state.department_id,
            })
              .then((res) => {
                dispatch({
                  type: "STATE",
                  data: { refresh: state.refresh + 1 },
                });
                dispatch({ type: "STATE", data: { modal: false } });

                message({
                  type: "success",
                  title: "Баталгаажуулалт амжилттай",
                });

                setLoading(false);
              })
              .catch((error) => {
                message({
                  type: "error",
                  error,
                  title: "Жагсаалт татаж чадсангүй",
                });
                setLoading(false);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <i className="fa fa-save" />

          <span className="ml-2">Хадгалах</span>
        </button> */}
        </Spin>
      </div>
    </div>
  );
};
export default React.memo(ModalNormDetail);
