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
  Radio,
} from "antd";
import SaveButton from "src/components/button/SaveButton";
import _ from "lodash";
import axios from "axios";
import moment from "moment";
import useBearStore from "src/state/state";
import Swal from "sweetalert2";
const { Option } = Select;

const ModalNormDetail = () => {
  const { message } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const [loading, setLoading] = useState(false);

  const [delguur, setDelguur] = useState([]);

  const [company, setCompany] = useState([]);
  const [cash, setcash] = useState(0);
  const [order, setorder] = useState(0);
  const [date, setdate] = useState(moment());

  const [value, setValue] = useState(1);
  const [label, setLabel] = useState("Бэлэн");

  const [delguur_list, setDelguur_list] = useState();
  const main_company_id = useBearStore((state) => state.main_company_id);
  const user_id = useBearStore((state) => state.user_id);

  console.log("date", dayjs(state.order.dt), state.order.order_id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await axios
          .get(
            // "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/baraa"
            // "http://3.0.177.127/api/backend/baraa"
            "https://dmunkh.store/api/backend/delguur"
          )
          .then((response) => {
            setCompany(_.orderBy(response.data.response, ["id"]));
            console.log("Response:", response);
          })
          .catch((error) => {
            console.error("Error:", error);
          });

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
        await axios
          .get(
            // "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/baraa"
            // "http://3.0.177.127/api/backend/baraa"
            "https://dmunkh.store/api/backend/delguur"
          )
          .then((response) => {
            setDelguur_list(_.orderBy(response.data.response, ["id"]));
          })
          .catch((error) => {
            console.error("Error:", error);
          });

        setLoading(false);
      } catch (error) {
        setLoading(false);
        // setError(error);
      }
    };

    fetchData();
  }, [state.refresh]);

  const valueLabelMap = {
    1: "Бэлэн",
    2: "Зээл",
  };
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setValue(selectedValue);
    setLabel(valueLabelMap[selectedValue]);
  };
  const handleClick = () => {
    if (state.order.order_id === 0) {
      try {
        axios
          // .post("https://dmunkh.store/api/backend/orders", {
          .post("http://localhost:5000/api/backend/orders", {
            delguur_id: delguur[0].id,
            delguur_ner: delguur[0].delguur_ner,
            order_number: order,
            cash: state.order.cash,
            register_date: moment(date).format("YYYY-MM-DD HH:mm"),
            is_approve: 0,
            is_cash_loan: value,
            cash_loan_desc: label,
            mc_id: main_company_id,
            user_id: user_id,
          })
          .then((response) => {
            dispatch({
              type: "STATE",
              data: { refresh: state.refresh + 1 },
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } catch (error) {}
    } else {
      try {
        Swal.fire({
          title: "Уншиж байна...",
          text: "Түр хүлээнэ үү",
          allowOutsideClick: false,
        });

        axios
          .put(
            "http://localhost:5000/api/backend/orders/" + state.order.order_id,
            // "https://dmunkh.store/api/backend/orders/" + state.order.order_id,
            {
              // delguur_id: delguur[0].id,
              // delguur_ner: delguur[0].delguur_ner,
              // order_number: order,
              cash: state.order.cash,
              is_approve: state.order.is_approve,
            }
          )
          .then((response) => {
            dispatch({
              type: "STATE",
              data: { refresh: state.refresh + 1 },
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        Swal.close();
        Swal.fire(
          "Хадгалагдлаа!",
          "Бүртгэл амжилттай хадгалагдлаа.",
          "success"
        );
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
              value={moment(date)}
              onChange={(date) => setdate(date)}
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
                setDelguur(
                  _.filter(
                    delguur_list,
                    (a) => parseInt(a.id) === parseInt(value)
                  )
                );
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
          <div className="w-1/4">Төрөл:</div>
          <Radio.Group
            value={value}
            onChange={
              handleChange
              // dispatch({
              //   type: "STATE",
              //   data: { info: { ...state.info, is_risk: e.target.value } },
              // });
            }
          >
            <Radio value={1}>Бэлэн</Radio>
            <Radio value={2}>Зээл</Radio>
          </Radio.Group>
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
