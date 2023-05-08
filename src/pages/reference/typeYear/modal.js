import React, { useState, useEffect, useRef } from "react";
import { useUserContext } from "src/contexts/userContext";
import { useReferenceContext } from "src/contexts/referenceContext";
import * as API from "src/api/request";

import { Select, InputNumber, Modal, Input } from "antd";


import { Toast } from "primereact/toast";

import _ from "lodash";
import moment from "moment";
import Swal from "sweetalert2";
const { Option } = Select;

const Component = () => {
  const { message } = useUserContext();
  const { state, dispatch } = useReferenceContext();
  const toast = useRef(null);

  const [date, setDate] = useState(moment(Date.now()).format("YYYY"));

  //жагсаалт

  useEffect(() => {
    API.getPlaces()
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_place: _.orderBy(res, ["place_name"]),
          },
        });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Жагсаалт татаж чадсангүй",
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = () => {
    var error = [];
    state.selected_typeyear.type_id || error.push("Сургалтын төрөл:");
    state.selected_typeyear.place_id || error.push("Танхим:");
    const data = {
      hour: state.selected_typeyear.hour,
      limit: state.selected_typeyear.limit,
      percent: state.selected_typeyear.percent,
      place_id: state.selected_typeyear.place_id,
      point: state.selected_typeyear.point,
      price_emc: state.selected_typeyear.price_emc,
      price_organization: state.selected_typeyear.price_organization,
      type_id: state.selected_typeyear.type_id,
      year: date,
    };

    if (error.length > 0) {
      toast.current.show({
        sticky: true,
        severity: "warn",
        //   summary: "Дараах мэдээлэл дутуу байна",
        className: "",
        content: (
          <div
            className="flex flex-column align-items-center "
            style={{ flex: "1" }}
          >
            <div className="text-center">
              <div className="font-bold text-xl my-3">
                Дараах мэдээлэл дутуу байна
              </div>
            </div>
            <div className="flex gap-2">
              {_.map(error, (item, index) => (
                <div key={index}>
                  - <span className="ml-1">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      });
    } else if (state.selected_typeyear.id === null) {
      API.postTypeYear({
        ...data,
      })
        .then(() => {
          console.log(data);
          dispatch({
            type: "STATE",
            data: {
              refresh: state.refresh + 1,
            },
          });
          dispatch({ type: "CLEAR_TYPEYEAR" });
          dispatch({ type: "STATE", data: { modal: false } });
          toast.current.show({
            severity: "success",
            summary: "Амжилттай",
            detail: "Амжилттай хадгалагдлаа",
          });
          // message({ type: "success", title: "Амжилттай хадгалагдлаа" });
        })
        .catch((error) => {
          // toast.current.show({
          //   severity: "error",
          //   summary: "Алдаа",
          //   detail: error.response.data.msg,
          // });

          message({
            type: "error",
            error,
            title: error.response.data.msg,
          });
        });
    } else {
      API.putTypeYear(state.selected_typeyear.id, {
        ...data,
      })
        .then(() => {
          dispatch({
            type: "STATE",
            data: {
              refresh: state.refresh + 1,
            },
          });
          dispatch({ type: "STATE", data: { modal: false } });
          toast.current.show({
            severity: "success",
            summary: "Амжилттай",
            detail: "Амжилттай хадгалагдлаа",
          });

          // message({ type: "success", title: "Амжилттай хадгалагдлаа" });
        })
        .catch((error) => {
          toast.current.show({
            severity: "error",
            summary: "Алдаа",
            detail: error.response.data.msg,
          });

          // message({
          //   type: "error",
          //   error,
          //   title: error.response.data.msg,
          // });
        });
    }
  };

  return (
    <>
      <Modal
        centered
        width={700}
        title={
          <div className="text-center">
            Сургалтийн төрөл
            {state.selected_typeyear.id ? " засварлах " : " бүртгэх "} цонх
          </div>
        }
        visible={state.modal}
        onCancel={() => {
          dispatch({
            type: "STATE",
            data: { modal: false },
          });
        }}
        footer={null}
      >
        <div className="flex flex-col justify-start text-xs">
          <span className="font-semibold pb-1">
            Сургалтын төрөл:<b className="ml-1 text-red-500">*</b>
          </span>
          <Select
            className="w-full text-xs mt-1"
            placeholder="Сонгоно уу."
            value={state.selected_typeyear.type_id}
            onChange={async (value) => {
              console.log(state.list_type);
              dispatch({
                type: "STATE",
                data: {
                  selected_typeyear: {
                    ...state.selected_typeyear,
                    type_id: value,
                  },
                },
              });
            }}
          >
            {_.map(state.list_type, (item) => (
              <Option className="text-xs" key={item.id} value={item.id}>
                {item.type_name}
              </Option>
            ))}
          </Select>
          <div className="my-2 " />
          <span className="font-semibold pb-1">
            Танхим:<b className="ml-1 text-red-500">*</b>
          </span>
          <Select
            className="w-full text-xs mt-1"
            placeholder="Сонгоно уу."
            value={state.selected_typeyear.place_id}
            onChange={(value) => {
              dispatch({
                type: "STATE",
                data: {
                  selected_typeyear: {
                    ...state.selected_typeyear,
                    place_id: value,
                  },
                },
              });
            }}
          >
            {_.map(state.list_place, (item) => (
              <Option className="text-xs" key={item.id} value={item.id}>
                {item.place_name}
              </Option>
            ))}
          </Select>
          <div className="my-2 " />
          <span className="font-semibold pb-1">
            Суух ажилчидын тоо:<b className="ml-1 text-red-500">*</b>
          </span>
          <Input
            type="number"
            size="small"
            className="p-1 w-full text-gray-900 border border-gray-200 rounded-sm"
            value={state.selected_typeyear.limit}
            onChange={(e) => {
              dispatch({
                type: "STATE",
                data: {
                  selected_typeyear: {
                    ...state.selected_typeyear,
                    limit: e.target.value,
                  },
                },
              });
            }}
          />
          <div className="my-2 " />
          <span className="font-semibold pb-1">
            Сургалтын үргэлжлэх хугацаа:<b className="ml-1 text-red-500">*</b>
          </span>
          <Input
            type="number"
            size="small"
            className="p-1 w-full text-gray-900 border border-gray-200 rounded-sm"
            value={state.selected_typeyear.hour}
            onChange={(e) => {
              dispatch({
                type: "STATE",
                data: {
                  selected_typeyear: {
                    ...state.selected_typeyear,
                    hour: e.target.value,
                  },
                },
              });
            }}
          />
          <div className="my-2 " />
          <span className="font-semibold pb-1">
            Сургалтын үнэ:<b className="ml-1 text-red-500">*</b>
          </span>
          <Input
            type="number"
            size="small"
            className="p-1 w-full text-gray-900 border border-gray-200 rounded-sm"
            value={state.selected_typeyear.price_emc}
            onChange={(e) => {
              dispatch({
                type: "STATE",
                data: {
                  selected_typeyear: {
                    ...state.selected_typeyear,
                    price_emc: e.target.value,
                  },
                },
              });
            }}
          />
          <div className="my-2 " />
          <span className="font-semibold pb-1">
            Сургалтын үнэ /Гадны байгууллага/:
            <b className="ml-1 text-red-500">*</b>
          </span>
          <Input
            type="number"
            size="small"
            className="p-1 w-full text-gray-900 border border-gray-200 rounded-sm"
            value={state.selected_typeyear.price_organization}
            onChange={(e) => {
              dispatch({
                type: "STATE",
                data: {
                  selected_typeyear: {
                    ...state.selected_typeyear,
                    price_organization: e.target.value,
                  },
                },
              });
            }}
          />
          <div className="my-1 " />
          <span className="font-semibold pb-1">
            Шалгалтын оноо:
          </span>
          <Input
            size="small"
            className="p-1 w-full text-gray-900 border border-gray-200 rounded-sm"
            value={state.selected_typeyear.percent}
            onChange={(e) => {
              dispatch({
                type: "STATE",
                data: {
                  selected_typeyear: {
                    ...state.selected_typeyear,
                    percent: e.target.value,
                  },
                },
              });
            }}
          />
          <div className="my-2 " />
          <span className="font-semibold pb-1">
            Тэнцэх хувь:
          </span>
          <Input
            type="number"
            size="small"
            className="p-1 w-full text-gray-900 border border-gray-200 rounded-sm"
            value={state.selected_typeyear.point}
            onChange={(e) => {
              dispatch({
                type: "STATE",
                data: {
                  selected_typeyear: {
                    ...state.selected_typeyear,
                    point: e.target.value,
                  },
                },
              });
            }}
          />
        </div>

        <div className="my-3 border " />

        <button
          className="w-full py-2 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-md hover:bg-violet-500 hover:text-white focus:outline-none duration-300 text-xs"
          onClick={() => save(state, dispatch, date, toast)}
        >
          {/* <i className="ft-save" /> */}
          <span className="ml-2">Хадгалах</span>
        </button>
        <Toast ref={toast} />
      </Modal>
      {/* <div className="card flex p-2 border rounded text-xs">
        <div className="flex flex-col rounded">
          <div className=" text-xs rounded p-2">
            <Spin
              tip="Уншиж байна."
              className="min-h-full first-line:bg-opacity-80"
              spinning={loading}
            >
            </Spin>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default React.memo(Component);
