import React, { useState, useEffect } from "react";
import * as API from "src/api/plan";
import { useUserContext } from "src/contexts/userContext";
import { usePlanContext } from "src/contexts/planContext";
import useBearStore from "src/state/state";
// import Module from "src/components/custom/module";
import moment from "moment";
import dayjs from "dayjs";
import TextArea from "antd/lib/input/TextArea";
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
  const main_company_id = useBearStore((state) => state.main_company_id);
  const user_id = useBearStore((state) => state.user_id);

  const [baraa, setbaraa] = useState();

  const [company, setCompany] = useState([]);
  const [count, setcount] = useState(0);
  const [boxcount, setboxcount] = useState(0);

  const [unit, setunit] = useState("ш");
  const [price, setprice] = useState(0);
  const [date, setdate] = useState(dayjs());
  const [comment, setcomment] = useState("");

  const [baraa_list, setBaraa_list] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/backend/delguur"
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
          "http://localhost:5000/api/backend/baraa",
          { params: { user_id: user_id } }
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
    if (state.balance.id === 0) {
      try {
        console.log("try to insert", baraa[0]);
        const response = axios.post(
          "http://localhost:5000/api/backend/balance",
          {
            order_id: 0,
            type_id: state.balance.type,
            delguur_id: 0,
            delguur_ner: "",
            baraa_id: baraa[0].id,
            baraa_ner: baraa[0].baraa_ner,
            company_name: baraa[0].company_ner,
            company_id: baraa[0].company_id,
            count: state.balance.count,
            unit: unit,
            price: price,
            register_date: dayjs(date).format("YYYY-MM-DD"),
            mc_id: main_company_id,
            user_id: user_id,
            comment: comment,
          }
        );
        dispatch({
          type: "STATE",
          data: { refresh: state.refresh + 1 },
        });

        console.log("return", response.data, "refresh", state.refresh);
      } catch (error) {}
    } else {
      try {
        const response = axios.put(
          "http://localhost:5000/api/backend/balance/" + state.balance.id,
          {
            count: state.balance.count,
          }
        );
        dispatch({
          type: "STATE",
          data: { refresh: state.refresh + 1 },
        });

        console.log("return", response.data, "refresh", state.refresh);
      } catch (error) {}
    }
  };

  return (
    <div className="flex flex-col text-xs">
      <div>
        <h2 className=" text-center text-lg font-extrabold text-gray-900">
          Орлого бүртгэл
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
          <div className="w-1/4">Төрөл</div>
          <div className="w-3/4">
            <Select
              showSearch
              allowClear
              placeholder="Сонгоно уу."
              optionFilterProp="children"
              className="w-full"
              value={state.balance.type}
              onChange={(value) => {
                dispatch({ type: "BALANCE", data: { type: value } });
              }}
            >
              {" "}
              <Select.Option key={0} value={0}>
                Эхний үлдэгдэл
              </Select.Option>
              <Select.Option key={1} value={1}>
                Орлого
              </Select.Option>
              <Select.Option key={2} value={2}>
                Зарлага
              </Select.Option>
              <Select.Option key={3} value={3}>
                Зарцуулалт
              </Select.Option>
            </Select>
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
              value={state.balance.baraa_id}
              onChange={(value) => {
                dispatch({ type: "BALANCE", data: { baraa_id: value } });
                setbaraa(_.filter(baraa_list, (a) => a.id === value));
                setprice(_.filter(baraa_list, (a) => a.id === value)[0].une);
                setboxcount(0);
                setcount(0);
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
          <InputNumber
            value={state.balance.count}
            onChange={(value) =>
              dispatch({ type: "BALANCE", data: { count: value } })
            }
          />
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
        <div className="w-full p-1 flex flex-col justify-start ">
          <span className="list-group-item-text grey darken-2 m-0">
            Тайлбар:
          </span>
          <TextArea
            className=" p-1 w-full text-gray-900 border border-gray-200 rounded-lg "
            value={comment}
            onChange={(e) => {
              setcomment(e.target.value);
            }}
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
        </Spin>
      </div>
    </div>
  );
};
export default React.memo(ModalNormDetail);
