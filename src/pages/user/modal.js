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
import Swal from "sweetalert2";

import TextArea from "antd/lib/input/TextArea";
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

  const handleClick = () => {
    Swal.fire({
      title: "Уншиж байна...",
      text: "Түр хүлээнэ үү",
      allowOutsideClick: false,
    });

    if (state.user.id === 0) {
      try {
        setLoading(true);
        axios
          .post("https://dmunkh.store/api/backend/users/" + state.user.id, {
            user_name: state.user.user_name,
            phone: state.user.phone,
            // unit: unit,
          })
          .then((response) => {
            dispatch({
              type: "STATE",
              data: { refresh: state.refresh + 1 },
            });

            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            console.error("Error:", error);
          });
        setLoading(false);
        Swal.close();
        Swal.fire(
          "Хадгалагдлаа!",
          "Бүртгэл амжилттай хадгалагдлаа.",
          "success"
        );
        // Swal.fire({
        //   title: "Operation Successful",
        //   text: "Your request was completed successfully!",
        //   icon: "success",
        //   showCancelButton: true,
        //   confirmButtonText: "Approve",
        //   cancelButtonText: "Cancel",
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     Swal.fire("Approved!", "Your action has been approved.", "success");
        //   } else {
        //     Swal.fire("Cancelled", "Your action was cancelled.", "error");
        //   }
        // });
      } catch (error) {
        Swal.close();
        setLoading(false);
      }
    } else {
      try {
        axios
          .put("https://dmunkh.store/api/backend/users/" + state.user.id, {
            user_name: state.user.user_name,
            phone: state.user.phone,
            // unit: unit,
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
        Swal.close();
        Swal.fire(
          "Хадгалагдлаа!",
          "Бүртгэл амжилттай хадгалагдлаа.",
          "success"
        );
      } catch (error) {
        Swal.close();
        setLoading(false);
      }
    }
  };
  return (
    <div className="flex flex-col text-xs">
      <div>
        <h2 className=" text-center text-lg font-extrabold text-gray-900">
          Хэрэглэгч засах
        </h2>
      </div>

      <hr className="my-2" />
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="flex p-1 gap-2">
          <div className="w-1/4">Нэр</div>
          <div className="w-3/4">
            {" "}
            <Input
              value={state.user.user_name}
              // onChange={(e) => setdelguur_ner(e.target.value)}
              onChange={(e) =>
                dispatch({
                  type: "USER",
                  data: { user_name: e.target.value },
                })
              }
            />
          </div>
        </div>

        <div className="flex p-1 gap-2">
          <div className="w-1/4">Утас</div>
          <div className="w-3/4">
            <Input
              value={state.user.phone}
              onChange={(e) =>
                dispatch({
                  type: "USER",
                  data: { phone: e.target.value },
                })
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
          disabled={loading}
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
