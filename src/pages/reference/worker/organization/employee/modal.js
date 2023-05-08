import React from "react";
import { useUserContext } from "src/contexts/userContext";
import { useReferenceContext } from "src/contexts/referenceContext";
import * as API from "src/api/request";

import { Select, Input, Modal } from "antd";

import _ from "lodash";

const Component = (data) => {
  const { message } = useUserContext();
  const { state, dispatch } = useReferenceContext();

  const save = () => {
    var error = [];
    // state.selected_employee.organization_id ||
    //   error.push("Байгууллага:");
    //   state.selected_employee.short_name ||
    //   error.push("Нэр:");
    const data = {
      organization_id: state.organizationID,
      position_name: state.selected_employee.position_name,
      register_number: state.selected_employee.register_number,
      short_name: state.selected_employee.short_name,
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
    } else if (state.selected_employee.id === null) {
      API.postPerson({
        ...data,
      })
        .then(() => {
          dispatch({
            type: "STATE",
            data: {
              refresh: state.refresh + 1,
            },
          });
          // dispatch({ type: "CLEAR_EMPLOYEE" });
          dispatch({ type: "STATE", data: { modal: false } });
          message({ type: "success", title: "Амжилттай хадгалагдлаа" });
          dispatch({ type: "STATE", data: { refresh: state.refresh + 1 } });
        })
        .catch((error) => {
          message({
            type: "error",
            error,
            title: error.response.data.msg,
          });
        });
    } else {
      API.putPerson(state.selected_employee.id, {
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
          console.log(state.selected_employee.id);
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
            Ажилтан
            {state.selected_employee.id ? " засварлах " : " бүртгэх "} цонх
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
        <div className="flex flex-col  text-xs">
          <div className="flex flex-col justify-start">
            <span className="font-semibold pb-1">
              Нэр :<b className="ml-1 text-red-500">*</b>
            </span>
            <Input
              size="small"
              className=" p-1 w-full text-gray-900 border border-gray-200 rounded-sm "
              value={state.selected_employee.short_name}
              onChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: {
                    selected_employee: {
                      ...state.selected_employee,
                      short_name: e.target.value,
                    },
                  },
                });
              }}
            />
          </div>
          <hr className="my-2" />
          <div className="flex flex-col justify-start">
            <span className="font-semibold pb-1">
              Албан тушаал :<b className="ml-1 text-red-500">*</b>
            </span>
            <Input
              size="small"
              className=" p-1 w-full text-gray-900 border border-gray-200 rounded-sm "
              value={state.selected_employee.position_name}
              onChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: {
                    selected_employee: {
                      ...state.selected_employee,
                      position_name: e.target.value,
                    },
                  },
                });
              }}
            />
          </div>
          <hr className="my-2" />
          <div className="flex flex-col justify-start">
            <span className="font-semibold pb-1">
              Регистерийн дугаар :<b className="ml-1 text-red-500">*</b>
            </span>
            <Input
              size="small"
              className=" p-1 w-full text-gray-900 border border-gray-200 rounded-sm "
              value={state.selected_employee.register_number}
              onChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: {
                    selected_employee: {
                      ...state.selected_employee,
                      register_number: e.target.value,
                    },
                  },
                });
              }}
            />
          </div>
        </div>
        <hr className="my-2" />
        <div className="flex gap-4">
          <button
            className="btn btn-primary marker:w-full py-2 flex items-center justify-center font-semibold  border-2 border-violet-500 rounded-md bg-violet-500 focus:outline-none duration-300 "
            onClick={() => save()}
          >
            {/* <i className="fas fa-save" /> */}
            <span className="ml-2">Хадгалах</span>
          </button>
          <button
            type="button"
            className="btn btn-primary marker:w-full py-2 flex items-center justify-center font-semibold  border-2 border-violet-500 rounded-md bg-violet-500 focus:outline-none duration-300 "
            onClick={() => {
              dispatch({
                type: "STATE",
                data: {
                  modal: false,
                },
              });
            }}
          >
            <i className=" mr-2"></i>Хаах
          </button>
        </div>
      </Modal>
    </>
  );
};

export default React.memo(Component);
