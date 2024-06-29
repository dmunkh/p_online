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
import { useTrainingContext } from "src/contexts/trainingContext";
// import Swal from "sweetalert2";
const { Option } = Select;

const ModalNormDetail = () => {
  const { message } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          // "https://9xz5rjl8ej.execute-api.us-east-1.amazonaws.com/production/baraa"
          // "http://3.0.177.127/api/backend/baraa"
          "https://dmunkh.store/api/backend/company"
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

  const handleClick = () => {
    if (state.company.id === 0) {
      try {
        const response = axios.post(
          "https://dmunkh.store/api/backend/company",
          {
            company_ner: state.company.company_ner,
            hayag:
              state.company.hayag === "" ||
              state.company.hayag === null ||
              state.company.hayag === undefined
                ? ""
                : state.company.hayag,
            utas:
              state.company.utas === "" ||
              state.company.utas === null ||
              state.company.utas === undefined
                ? ""
                : state.company.utas,
            dans:
              state.company.dans === "" ||
              state.company.dans === null ||
              state.company.dans === undefined
                ? ""
                : state.company.dans,
            register:
              state.company.register === "" ||
              state.company.register === null ||
              state.company.register === undefined
                ? ""
                : state.company.register,
          }
        );
        dispatch({
          type: "STATE",
          data: { refresh: state.refresh + 1 },
        });
      } catch (error) {}
    } else {
      try {
        const response = axios.put(
          "https://dmunkh.store/api/backend/company/" + state.company.id,
          {
            company_ner: state.company.company_ner,
            hayag:
              state.company.hayag === "" ||
              state.company.hayag === null ||
              state.company.hayag === undefined
                ? ""
                : state.company.hayag,
            utas:
              state.company.utas === "" ||
              state.company.utas === null ||
              state.company.utas === undefined
                ? ""
                : state.company.utas,
            dans:
              state.company.dans === "" ||
              state.company.dans === null ||
              state.company.dans === undefined
                ? ""
                : state.company.dans,
            register:
              state.company.register === "" ||
              state.company.register === null ||
              state.company.register === undefined
                ? ""
                : state.company.register,
          }
        );
        dispatch({
          type: "STATE",
          data: { refresh: state.refresh + 1 },
        });
      } catch (error) {}
    }
  };

  return (
    <div className="flex flex-col text-xs">
      <div>
        <h2 className=" text-center text-lg font-extrabold text-gray-900">
          Компани бүртгэл
        </h2>
      </div>

      <hr className="my-2" />
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Компани нэр</div>
          <div className="w-3/4">
            {" "}
            <Input
              value={state.company.company_ner}
              onChange={(e) =>
                dispatch({
                  type: "COMPANY",
                  data: { company_ner: e.target.value },
                })
              }
            />
          </div>
        </div>
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Данс</div>
          <div className="w-3/4">
            {" "}
            <Input
              value={state.company.dans}
              onChange={(e) =>
                dispatch({
                  type: "COMPANY",
                  data: { dans: e.target.value },
                })
              }
            />
          </div>
        </div>
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Хаяг</div>
          <div className="w-3/4">
            <div className="w-3/4">
              {" "}
              <Input
                value={state.company.hayag}
                onChange={(e) =>
                  dispatch({
                    type: "COMPANY",
                    data: { hayag: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex p-1 gap-2">
          <div className="w-1/4">Регистер</div>
          <div className="w-3/4">
            <Input
              value={state.company.register}
              onChange={(e) =>
                dispatch({
                  type: "COMPANY",
                  data: { register: e.target.value },
                })
              }
            />
          </div>
        </div>
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Утас</div>
          <div className="w-3/4">
            <Input
              value={state.company.utas}
              onChange={(e) =>
                dispatch({
                  type: "COMPANY",
                  data: { utas: e.target.value },
                })
              }
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
        </Spin>
      </div>
    </div>
  );
};
export default React.memo(ModalNormDetail);
