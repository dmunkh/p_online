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
import Swal from "sweetalert2";
// import Swal from "sweetalert2";
const { Option } = Select;

const ModalDriver = () => {
  const { message } = useUserContext();
  const { state, dispatch } = usePlanContext();
  const [loading, setLoading] = useState(false);

  const [delguur, setDelguur] = useState([]);
  const main_company_id = useBearStore((state) => state.main_company_id);
  const [order, setorder] = useState(0);
  const [list, setList] = useState([]);
  const [user_id, setuser_id] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        axios
          .get("https://dmunkh.store/api/backend/user")
          .then((response) => {
            setList(
              _.orderBy(
                _.filter(
                  response.data.response,
                  (a) =>
                    parseInt(a.main_company_id) === parseInt(main_company_id)
                ),
                ["id"]
              )
            );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);

  const handleClick = () => {
    var order_ids = _.join(
      _.map(state.order.checked_positionList, (a) => a.order_id),
      ","
    );

    Swal.fire({
      text: "Захиалга хүргэх ажилтан бүртгэх үү",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1890ff",
      cancelButtonColor: "rgb(244, 106, 106)",
      confirmButtonText: "Тийм",
      cancelButtonText: "Үгүй",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Уншиж байна...",
          text: "Түр хүлээнэ үү......",
          allowOutsideClick: false,
        });
        try {
          setLoading(true);
          axios
            .post("https://dmunkh.store/api/backend/orders/1", {
              // .post("http://localhost:5000/api/backend/orders/1", {
              order_ids: order_ids,
              user_id: user_id,
            })
            // .delete("http://localhost:5000/api/backend/orders/" + item.order_id)
            .then((response) => {
              dispatch({ type: "ORDER", data: { checked_positionList: [] } });
              dispatch({
                type: "STATE",
                data: { refresh: state.refresh + 1 },
              });
              Swal.close();
              Swal.fire(
                "Хадгалагдлаа!",
                "Бүртгэл амжилттай хадгалагдлаа.",
                "success"
              );
            })
            .catch((error) => {
              console.error("Error:", error);
              setLoading(false);
            });
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="flex flex-col text-xs">
      <div>
        <h2 className=" text-center text-lg font-extrabold text-gray-900">
          Түгээлт хийх ажилтан бүртгэл
        </h2>
      </div>

      <hr className="my-2" />
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Хүргэлт хийх ажилтан:</div>
          <div className="w-3/4">
            <Select
              showSearch
              allowClear
              // value={list}
              placeholder="Сонгоно уу."
              optionFilterProp="children"
              className="w-full"
              onChange={(value) => {
                setuser_id(value);
              }}
            >
              {_.map(list, (item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.user_name}
                </Select.Option>
              ))}
            </Select>
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
export default React.memo(ModalDriver);
