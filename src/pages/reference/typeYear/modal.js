import React, { useEffect, useRef } from "react";
import { useUserContext } from "src/contexts/userContext";
import { useReferenceContext } from "src/contexts/referenceContext";
import * as API from "src/api/request";

import { Select, Modal, Input } from "antd";

import { Toast } from "primereact/toast";
import moment from "moment";
import _ from "lodash";

import SaveButton from "src/components/button/SaveButton";
const { Option } = Select;

const Component = () => {
  const { message } = useUserContext();
  const { state, dispatch } = useReferenceContext();
  const toast = useRef(null);

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
    console.log(state.date);
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
      year: moment(state.date).format("YYYY"),
    };

    if (error.length > 0) {
      message({
        type: "warning",
        title: (
          <div className="text-orange-500 font-semibold">
            Дараах мэдээлэл дутуу байна
          </div>
        ),
        description: (
          <div className="flex flex-col gap-1">
            {_.map(error, (item, index) => (
              <div key={index}>
                - <span className="ml-1">{item}</span>
              </div>
            ))}
          </div>
        ),
      });
    } else if (state.selected_typeyear.id === null) {
      API.postTypeYear({
        ...data,
      })
        .then(() => {
          dispatch({
            type: "STATE",
            data: {
              refresh: state.refresh + 1,
            },
          });
          dispatch({ type: "CLEAR_TYPEYEAR" });
          dispatch({ type: "STATE", data: { modal: false } });
          message({ type: "success", title: "Амжилттай хадгалагдлаа" });
        })
        .catch((error) => {
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
          message({ type: "success", title: "Амжилттай хадгалагдлаа" });
        })
        .catch((error) => {
          message({
            type: "error",
            error,
            title: error.response.data.msg,
          });
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
          <span className="font-semibold pb-1">Суух ажилчидын тоо:</span>
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
            Сургалтын үргэлжлэх хугацаа:
          </span>
          <Input
            type="number"
            size="small"
            className=" p-1 w-full text-gray-900 border border-gray-200 rounded-sm"
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
          <span className="font-semibold pb-1">Сургалтын үнэ:</span>
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
            status="error"
          />
          <div className="my-2 " />
          <span className="font-semibold pb-1">
            Сургалтын үнэ /Гадны байгууллага/:
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
          <span className="font-semibold pb-1">Шалгалтын оноо:</span>
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
          <span className="font-semibold pb-1">Тэнцэх хувь:</span>
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

        <SaveButton onClick={() => save()} />
        <Toast ref={toast} />
      </Modal>
    </>
  );
};

export default React.memo(Component);
