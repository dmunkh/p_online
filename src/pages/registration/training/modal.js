import React from "react";
import { Input, Modal, DatePicker } from "antd";
import Module from "src/components/custom/module";
import TypeYear from "src/components/custom/typeYear";
import PlaceList from "src/components/custom/placeList";
import { useUserContext } from "src/contexts/userContext";
import { useTrainingContext } from "src/contexts/trainingContext";
import * as API from "src/api/training";
import _ from "lodash";
import { useLayoutEffect } from "react";
import moment from "moment";

const Component = () => {
  const { state, dispatch } = useTrainingContext();
  const { message } = useUserContext();

  const save = () => {
    var error = [];
    state.place_id || error.push("Сургалтын танхим");
    state.begin_date || error.push("Сургалтын эхлэх хугацаа");
    state.end_date || error.push("Сургалтын дуусах хугацаа");
    state.limit || error.push("Суух ажилчдын тоо ");
    state.hour || error.push("Сургалт үргэлжлэх хугацаа");
    state.point || error.push("Шалгалтын оноо");
    state.price_emc || error.push("Үнэ /Бүтцийн нэгжүүдэд/ ");
    state.price_organization || error.push("Үнэ /Гадны байгууллагуудад/ ");
    var data = {
      place_id: state.place_id,
      begin_date: moment(state.begin_date).format("YYYY.MM.DD"),
      end_date: moment(state.end_date).format("YYYY.MM.DD"),
      limit: state.limit,
      hour: state.hour,
      point: state.point,
      price_emc: state.price_emc,
      price_organization: state.price_organization,
      type_id: state.type_id,
      year: moment(state.change_year).format("YYYY"),
      percent: state.percent,
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
      API.putLesson(state.id, data)
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
      API.postLesson(data)
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
      width={850}
      title={
        <div className="text-center">
          {state.id
            ? `${state.type_name}  засварлах цонх`
            : `Сургалтын төрөл бүртгэх цонх`}
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
        <span className="list-group-item-text grey darken-2 m-0 ">
          Сургалтын бүлэг:
        </span>
        <div className="w-full md:min-w-[200px]">
          <Module
            value={state.moduleid}
            disabled
            onChange={(value) => {
              dispatch({ type: "STATE", data: { moduleid: value } });
            }}
          />
        </div>
      </div>
      <div className="w-full p-1 flex flex-col justify-start ">
        <span className="list-group-item-text grey darken-2 m-0">
          Сургалтын төрөл:<b className="ml-1 text-red-500">*</b>
        </span>
        <TypeYear
          module_id={state.moduleid}
          year={moment(state.change_year).format("YYYY")}
          value={state.type_id}
          onChange={(value) => {
            dispatch({ type: "STATE", data: { type_id: value } });
          }}
        />
      </div>
      <div className="w-full p-1 flex flex-col justify-start">
        <span className="list-group-item-text grey darken-2 m-0">
          Сургалтын танхим:
        </span>
        <div className="w-full md:min-w-[200px]">
          <PlaceList
            value={state.place_id}
            onChange={(value) => {
              dispatch({ type: "STATE", data: { place_id: value } });
            }}
          />
        </div>
      </div>
      <div className="w-full p-1 flex flex-col justify-start ">
        <span className="list-group-item-text grey darken-2 m-0">
          Сургалтын цаг:<b className="ml-1 text-red-500">*</b>
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
      <div className="w-full p-1 flex flex-col justify-start ">
        <span className="list-group-item-text grey darken-2 m-0">
          Суух ажилчдын тоо:<b className="ml-1 text-red-500">*</b>
        </span>
        <Input
          className=" p-1 w-full text-gray-900 border border-gray-200 rounded-lg "
          value={state.limit}
          onChange={(e) => {
            dispatch({
              type: "STATE",
              data: {
                limit: e.target.value,
              },
            });
          }}
        />
      </div>
      <div className="w-full p-1 flex flex-col justify-start ">
        <span className="list-group-item-text grey darken-2 m-0">
          Шалгалтын оноо:<b className="ml-1 text-red-500">*</b>
        </span>
        <Input
          className=" p-1 w-full text-gray-900 border border-gray-200 rounded-lg "
          value={state.point}
          onChange={(e) => {
            dispatch({
              type: "STATE",
              data: {
                point: e.target.value,
              },
            });
          }}
        />
      </div>
      <div className="w-full p-1 flex flex-col justify-start ">
        <span className="list-group-item-text grey darken-2 m-0">
          Тэнцэх хувь:<b className="ml-1 text-red-500">*</b>
        </span>
        <Input
          className=" p-1 w-full text-gray-900 border border-gray-200 rounded-lg "
          value={state.percent}
          onChange={(e) => {
            dispatch({
              type: "STATE",
              data: {
                percent: e.target.value,
              },
            });
          }}
        />
      </div>
      <div className="w-full p-1 flex flex-col justify-start">
        <span className="list-group-item-text grey darken-2 m-0">
          Эхлэх хугацаа:<b className="ml-1 text-red-500">*</b>
        </span>

        <DatePicker
          allowClear={false}
          className="w-full md:w-[100px] text-xs"
          format={"YYYY.MM.DD"}
          value={moment(state.begin_date)}
          onChange={(date) => {
            dispatch({
              type: "STATE",
              data: { begin_date: moment(date) },
            });
          }}
        />
      </div>
      <div className="w-full p-1 flex flex-col justify-start">
        <span className="list-group-item-text grey darken-2 m-0">
          Дуусах хугацаа:<b className="ml-1 text-red-500">*</b>
        </span>

        <DatePicker
          allowClear={false}
          className="w-full md:w-[100px] text-xs"
          format={"YYYY.MM.DD"}
          value={moment(state.end_date)}
          onChange={(date) => {
            dispatch({
              type: "STATE",
              data: { end_date: moment(date) },
            });
          }}
        />
      </div>
      {/* <div className="flex items-center justify-between text-xs gap-2">
        <span className="md:w-[50px] font-semibold">Дуусах хугацаа:</span>
        <div className="w-full md:min-w-[100px] ">
          <DatePicker
            allowClear={false}
            className="w-full md:w-[100px] text-xs"
            format="YYYY.MM.DD"
            value={state.end_date}
            onChange={(date) => {
              dispatch({
                type: "STATE",
                data: { end_date: moment(date) },
              });
            }}
          />
        </div>
      </div> */}
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
