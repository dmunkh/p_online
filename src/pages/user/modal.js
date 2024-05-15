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
// import Swal from "sweetalert2";
const { Option } = Select;

const ModalNormDetail = () => {
  const { message } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const [loading, setLoading] = useState(false);

  const [delguur_ner, setdelguur_ner] = useState("");
  const [utas, setutas] = useState(0);
  const [dans, setdans] = useState("");
  const [register, setregister] = useState(0);
  const [baraa, setbaraa] = useState();
  const [hayag, sethayag] = useState("");

  const [company, setCompany] = useState([]);
  const [count, setcount] = useState(0);
  const [boxcount, setboxcount] = useState(0);

  const [unit, setunit] = useState("ш");
  const [price, setprice] = useState(0);
  const [date, setdate] = useState(dayjs());

  const [baraa_list, setBaraa_list] = useState();

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
          "http://localhost:5000/api/backend/baraa"
        );
        console.log("baraa list", response.data.response);

        setBaraa_list(_.orderBy(response.data.response, ["id"]));
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
      dayjs(date).format("M")
    );

    try {
      console.log("try to insert");
      const response = axios.post("http://localhost:5000/api/backend/orders", {
        delguur_id: 1,
        delguur_ner: "delguur",
        order_number: 2,
        register_date: "2024-5-8",
        is_approve: 0,
      });
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
              // value={dayjs(date)}
              onChange={(date) => setdate(date)}
            />
          </div>
        </div>
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Бараа</div>
          <div className="w-3/4">
            <Select
              showSearch
              allowClear
              placeholder="Сонгоно уу."
              optionFilterProp="children"
              className="w-full"
              onChange={(value) => {
                console.log(
                  value,
                  _.filter(baraa_list, (a) => a.id === value)
                );
                setbaraa(_.filter(baraa_list, (a) => a.id === value));
                setprice(_.filter(baraa_list, (a) => a.id === value)[0].une);
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
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Тоо ширхэг</div>
          <InputNumber value={count} onChange={(value) => setcount(value)} />
        </div>
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Нэгж үнэ</div>
          <InputNumber value={price} onChange={(value) => setprice(value)} />
        </div>
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Хэмжих нэгж</div>
          <div className="w-3/4">
            <Select
              showSearch
              allowClear
              placeholder="Сонгоно уу."
              optionFilterProp="children"
              className="w-full"
              value={unit}
              onChange={(value) => setunit(value)}
            >
              <Option key={"ш"} value={"ш"}>
                ш
              </Option>
              <Option key={"кг"} value={"кг"}>
                кг
              </Option>
              <Option key={"л"} value={"л"}>
                л
              </Option>
            </Select>
          </div>
        </div>
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Хайрцаг</div>
          <div className="w-3/4">
            <InputNumber
              value={boxcount}
              onChange={(value) => setboxcount(value)}
            />
          </div>
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
