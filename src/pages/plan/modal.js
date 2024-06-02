import React, { useState, useEffect } from "react";
import * as API from "src/api/plan";
import { useUserContext } from "src/contexts/userContext";
import { usePlanContext } from "src/contexts/planContext";
// import Module from "src/components/custom/module";
import moment from "moment";
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

  const [baraa_ner, setbaraa_ner] = useState("");
  const [boxcount, setboxcount] = useState(0);
  const [une, setune] = useState(0);
  const [baraa, setbaraa] = useState();
  const [unit, setunit] = useState("ш");
  const [date, setdate] = useState(dayjs());
  const [company, setCompany] = useState([]);

  const [baraa_list, setBaraa_list] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          // "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/baraa"
          // "http://3.0.177.127/api/backend/baraa"
          "https://dmunkh.store/api/backend/company"
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

  const handleClick = () => {
    if (state.baraa.id === 0) {
      try {
        console.log(
          "try inserting....",
          state.baraa.baraa_ner,
          state.baraa.company_ner,
          state.baraa.company_id,
          state.baraa.price,
          state.baraa.box_count,
          state.baraa.unit,
          state.baraa.bar_code
        );
        axios
          .post("https://dmunkh.store/api/backend/baraa", {
            baraa_ner: state.baraa.baraa_ner,
            company_ner: state.baraa.company_ner,
            company_id: state.baraa.company_id,
            une: state.baraa.price,
            box_count: state.baraa.box_count,
            unit: state.baraa.unit,
            bar_code: state.baraa.bar_code,
            // unit: unit,
          })
          .then((response) => {
            // Handle success
            dispatch({
              type: "STATE",
              data: { refresh: state.refresh + 1 },
            });
            console.log("Response:", response);
            // Do something with the response, if needed
          })
          .catch((error) => {
            // Handle error
            console.error("Error:", error);
            // Do something with the error, if needed
          });
      } catch (error) {
        setLoading(false);
      }
    } else {
      try {
        console.log("INSERTING", state.baraa.baraa_ner, state.baraa.id);

        axios
          .put("https://dmunkh.store/api/backend/baraa/" + state.baraa.id, {
            baraa_ner: state.baraa.baraa_ner,
            company_ner: state.baraa.company_ner,
            company_id: state.baraa.company_id,
            une: state.baraa.price,
            box_count: state.baraa.box_count,
            unit: state.baraa.unit,
            bar_code: state.baraa.bar_code,
          })
          .then((response) => {
            // Handle success
            dispatch({
              type: "STATE",
              data: { refresh: state.refresh + 1 },
            });
            console.log("Response:", response);
            // Do something with the response, if needed
          })
          .catch((error) => {
            // Handle error
            console.error("Error:", error);
            // Do something with the error, if needed
          });
      } catch (error) {
        setLoading(false);
      }
    }
  };
  return (
    <div className="flex flex-col text-xs">
      <div>
        <h2 className=" text-center text-lg font-extrabold text-gray-900">
          Бараа бүртгэл
        </h2>
      </div>
      <hr className="my-2" />
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Барааны нэр</div>
          <div className="w-3/4">
            {" "}
            <Input
              value={state.baraa.baraa_ner}
              onChange={(e) =>
                dispatch({ type: "BARAA", data: { baraa_ner: e.target.value } })
              }
            />
          </div>
        </div>
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Компани нэр</div>
          <div className="w-3/4">
            <Select
              showSearch
              allowClear
              placeholder="Сонгоно уу."
              optionFilterProp="children"
              className="w-full"
              value={state.baraa.company_id}
              onChange={(value) => {
                dispatch({
                  type: "BARAA",
                  data: {
                    company_id: _.filter(company, (a) => a.id === value)[0].id,
                    company_ner: _.filter(company, (a) => a.id === value)[0]
                      .company_ner,
                  },
                });
              }}
            >
              {_.map(company, (item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.company_ner}
                </Select.Option>
              ))}
            </Select>
          </div>
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
              value={state.baraa.unit}
              onChange={(value) =>
                dispatch({ type: "BARAA", data: { unit: value } })
              }
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
          <div className="w-1/4">Бараа код</div>
          <div className="w-3/4">
            <InputNumber
              value={state.baraa.bar_code}
              onChange={(value) =>
                dispatch({ type: "BARAA", data: { bar_code: value } })
              }
            />
          </div>
        </div>
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Үнэ</div>
          <div className="w-3/4">
            <InputNumber
              value={state.baraa.price}
              onChange={(value) =>
                dispatch({ type: "BARAA", data: { price: value } })
              }
            />
          </div>
        </div>
        <div className="flex p-1 gap-2">
          <div className="w-1/4">1 хайрцагт тоо</div>
          <div className="w-3/4">
            <InputNumber
              value={state.baraa.box_count}
              onChange={(value) =>
                dispatch({ type: "BARAA", data: { box_count: value } })
              }
            />
          </div>
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
  );
};
export default React.memo(ModalNormDetail);
