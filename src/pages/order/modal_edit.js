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
  const [baraa_list, setBaraa_list] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          // "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/baraa"
          // "http://3.0.177.127/api/backend/baraa"
          "https://dmunkh.store/api/backend/delguur"
        );

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
          "https://dmunkh.store/api/backend/baraa"
        );

        setBaraa_list(_.orderBy(response.data.response, ["id"]));
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
          "https://dmunkh.store/api/backend/delguur"
        );

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
    if (state.order.id === 0) {
      try {
        axios
          .post("https://dmunkh.store/api/backend/orders", {
            delguur_id: delguur[0].id,
            delguur_ner: delguur[0].delguur_ner,
            order_number: order,
            cash: state.order.cash,
            register_date: state.order.dt,
            is_approve: 0,
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
        console.log("INSERTING");
        axios
          .put("https://dmunkh.store/api/backend/balance/" + state.order.id, {
            count: state.order.count,
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
        dispatch({
          type: "STATE",
          data: { refresh: state.refresh + 1 },
        });

        // const fetchData = async () => {
        //   try {
        //     const response = await axios.get(
        //       "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/balance"
        //     );

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
          Бараа засварлах
        </h2>
      </div>

      <hr className="my-2" />
      <div className="rounded-md shadow-sm -space-y-px">
        {/* <div className="flex p-1 gap-2">
          <div className="w-1/4">Бараа сонгох</div>
          <div className="w-3/4">
            <Select
              showSearch
              allowClear
              value={state.order.baraa_id}
              placeholder="Сонгоно уу."
              optionFilterProp="children"
              className="w-full"
              onChange={(value) => {
             
                setDelguur(_.filter(delguur_list, (a) => a.id === value));
                dispatch({ type: "ORDER", data: { baraa_id: value } });
              }}
            >
              {_.map(baraa_list, (item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.baraa_ner}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div> */}
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Тоо ширхэг</div>
          <InputNumber
            value={state.order.count}
            onChange={(value) =>
              dispatch({ type: "ORDER", data: { count: value } })
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
