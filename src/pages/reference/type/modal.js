import React from "react";
import { Input, Select, Modal } from "antd";

import { useUserContext } from "../../../contexts/userContext";
import { useReferenceContext } from "../../../contexts/referenceContext";
import * as API from "../../../api/reference";
import _ from "lodash";
import { useLayoutEffect } from "react";

const Component = () => {
  const { state, dispatch } = useReferenceContext();
  const { message } = useUserContext();

  //modul жагсаалт
  useLayoutEffect(() => {
    API.getInterval()
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_interval: _.orderBy(res, ["interval_name"]),
          },
        });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Сургалтын бүлэг татаж чадсангүй",
        });
      });
    API.getInterval()
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_interval: _.orderBy(res, ["interval_name"]),
          },
        });
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Сургалтын бүлэг татаж чадсангүй",
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = () => {
    var error = [];
    state.type_name || error.push("Сургалтын нэр");
    state.selected_moduleID || error.push("Сургалтын бүлэг");
    state.interval_id || error.push("Сургалтын давтамж ");
    state.hour || error.push("Сургалт үргэлжлэх хугацаа");
    // state.price_emc || error.push("Үнэ /Бүтцийн нэгжүүдэд/ ");
    // state.price_organization || error.push("Үнэ /Гадны байгууллагуудад/ ");

    var data = {
      type_name: state.type_name,
      module_id: state.selected_moduleID,
      interval_id: state.interval_id,
      hour: state.hour,
      price_emc: state.price_emc,
      price_organization: state.price_organization,
      description: state.description,
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
    } else if (state.id) {
      API.putLessonTypeID(state.id, data)
        .then(() => {
          dispatch({ type: "STATE", data: { refresh: state.refresh + 1 } });
          dispatch({ type: "STATE", data: { modal: false } });
          message({
            type: "success",
            title: "Амжилттай хадгалагдлаа.",
          });
        })
        .catch((error) => {
          message({
            type: "error",
            error,
            title: "Засварлаж чадсангүй",
          });
        });
    } else {
      API.postLessonTypeID(data)
        .then(() => {
          dispatch({ type: "STATE", data: { refresh: state.refresh + 1 } });
          dispatch({ type: "STATE", data: { modal: false } });
          message({
            type: "success",
            title: "Амжилттай хадгалагдлаа.",
          });
        })
        .catch((error) => {
          message({
            type: "error",
            error,
            title: "Засварлаж чадсангүй",
          });
        });
    }
  };

  return (
    <Modal
      centered
      width={700}
      title={
        <div className="text-center">
          {state.id ? state.type_name : "Сургалтын төрөл "}
          {state.id ? " засварлах" : " бүртгэх"} цонх
        </div>
      }
      visible={state.modal}
      onCancel={() => {
        dispatch({
          type: "STATE",
          data: { modal: false },
        });
      }}
      className="text-sm tracking-wide"
      footer={null}
    >

      <div className="w-full p-1 flex flex-col justify-start ">
        <span className="list-group-item-text grey darken-2 m-0">
          Сургалтын нэр:<b className="ml-1 text-red-500">*</b>
        </span>
        <Input
          className=" p-1 w-full text-gray-900 border border-gray-200 rounded-lg "
          value={state.type_name}
          onChange={(e) => {
            dispatch({
              type: "STATE",
              data: {
                type_name: e.target.value,
              },
            });
          }}
        />
      </div>
      <div className="w-full p-1 flex flex-col justify-start">
        <span className="list-group-item-text grey darken-2 m-0">
          Сургалтын давтамж:
        </span>
        <div className="w-full md:min-w-[200px]">
          <Select
            value={state.interval_id}
            placeholder="сонгох."
            allowClear
            className="w-full"
            onChange={(value) => {
              dispatch({
                type: "STATE",
                data: {
                  interval_id: value,
                },
              });
            }}
          >
            {_.map(state.list_interval, (item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.interval_name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="w-full p-1 flex flex-col justify-start ">
        <span className="list-group-item-text grey darken-2 m-0">
          Сургалт үргэлжлэх хугацаа:<b className="ml-1 text-red-500">*</b>
        </span>
        <Input
          className=" p-1 w-full text-gray-900 border border-gray-200 rounded-lg "
          value={state.hour}
          onChange={(e) => {
            dispatch({
              type: "STATE",
              data: {
                hour: e.target.value,
              },
            });
          }}
        />
      </div>
      <div className="w-full p-1 flex flex-col justify-start">
        <span className="list-group-item-text grey darken-2 m-0">
          Үнэ /Бүтцийн нэгжүүдэд/:<b className="ml-1 text-red-500">*</b>
        </span>
        <Input
          className=" p-1 w-full text-gray-900 border border-gray-200 rounded-lg "
          value={state.price_emc}
          onChange={(e) => {
            dispatch({
              type: "STATE",
              data: {
                price_emc: e.target.value,
              },
            });
          }}
        />
      </div>
      <div className="w-full p-1 flex flex-col justify-start ">
        <span className="list-group-item-text grey darken-2 m-0">
          Үнэ /Гадны байгууллагуудад/:<b className="ml-1 text-red-500">*</b>
        </span>
        <Input
          className=" p-1 w-full text-gray-900 border border-gray-200 rounded-lg "
          value={state.price_organization}
          onChange={(e) => {
            dispatch({
              type: "STATE",
              data: {
                price_organization: e.target.value,
              },
            });
          }}
        />
      </div>
      <div className="w-full p-1 flex flex-col justify-start ">
        <span className="list-group-item-text grey darken-2 m-0">
          Сургалтын тайлбар:
        </span>
        <Input
          className=" p-1 w-full text-gray-900 border border-gray-200 rounded-lg "
          value={state.description}
          onChange={(e) => {
            dispatch({
              type: "STATE",
              data: {
                description: e.target.value,
              },
            });
          }}
        />
      </div>

      <div className="my-3 border " />

      <button
        className="w-full py-2 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-md hover:bg-violet-500 hover:text-white focus:outline-none duration-300 "
        onClick={() => save()}
      >
        <i className="ft-save" />
        <span className="ml-2">Хадгалах</span>
      </button>
    </Modal>
  );
};

export default React.memo(Component);
