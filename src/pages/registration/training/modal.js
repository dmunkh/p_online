import React, { useState, useMemo, useLayoutEffect } from "react";
import { Input, Modal, DatePicker,  Modal as CalModal } from "antd";
import { InputNumber } from "primereact/inputnumber";
import Type from "src/components/custom/LessTypeYear";
import PlaceList from "src/components/custom/placeList";
import { useUserContext } from "src/contexts/userContext";
import { useTrainingContext } from "src/contexts/trainingContext";
import * as API from "src/api/training";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import _ from "lodash";
import moment from "moment";
import Swal from "sweetalert2";
import SaveButton from "src/components/button/SaveButton";
import { ToggleButton } from "primereact/togglebutton";

const Component = (props) => {
  const { state, dispatch } = useTrainingContext();
  const { message, checkRole } = useUserContext();
  const [add, setAdd] = useState(false);
  const [visible, setVisible] = useState(false);

  const save = () => {
    var error = [];
    state.place_id || error.push("Сургалтын танхим");
    // state.begin_date || error.push("Сургалтын эхлэх хугацаа");
    // state.end_date || error.push("Сургалтын дуусах хугацаа");

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
    } else if (state.less_id && props.setedit) {
      API.putLesson(state.less_id, data)
        .then(() => {
          dispatch({ type: "STATE", data: { refresh: state.refresh + 1 } });
          dispatch({ type: "STATE", data: { modal: false } });
          message({
            type: "success",
            title: "Амжилттай засварлагдлаа.",
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

  // жагсаалт
  useLayoutEffect(() => {
    //setLoading(true);
    state.less_id &&
      API.getAttendanceID({
        lesson_id: state.less_id,
      })
        .then((res) => {
          dispatch({
            type: "STATE",
            data: {
              list_attendance_date: _.orderBy(res, ["id"]),
            },
          });
        })
        .catch((error) => {
          dispatch({
            type: "STATE",
            data: {
              list_attendance_date: [],
            },
          });
          message({
            type: "error",
            error,
            title: " жагсаалт татаж чадсангүй",
          });
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.less_id]);

  // useEffect(() => {

  //   state.id &&

  //       API.getLessonTypeID(state.id).then((res) => {
  //         dispatch({
  //           type: "SET_LESSON",
  //           data: {
  //             id: res.id,
  //             begin_date: res.begin_date,
  //             end_date: res.end_date,
  //             hour: res.hour,
  //             limit: res.limit,
  //             percent: res.percent,

  //             point: res.point,
  //             type_id: res.type_id,
  //             place_id: res.place_id,
  //             price_emc: res.price_emc,
  //             price_organization: res.price_organization,
  //           },
  //         });
  //         dispatch({
  //           type: "STATE",
  //           data: { type_id: res.type_id },
  //         });
  //       });

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state.id]);

  const deleteItem = (item) => {
    Swal.fire({
      text: "Устгахдаа итгэлтэй байна уу?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1890ff",
      cancelButtonColor: "rgb(244, 106, 106)",
      confirmButtonText: "Тийм",
      cancelButtonText: "Үгүй",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.deleteAttendance(item.id)
          .then(() => {
            message({
              type: "success",
              title: "Амжилттай устгагдлаа",
            });
            dispatch({ type: "STATE", data: { refresh: state.refresh + 1 } });
          })
          .catch((error) => {
            message({
              type: "error",
              error,
              title: "Сургалтын төрөл устгаж чадсангүй",
            });
          });
      }
    });
  };

  const updateItem = (item) => {
    dispatch({
      type: "STATE",
      data: {
        attendance_id: null,
        attendance_date: moment(),
        attendance_hour: null,
        attendance_minut: null,
      },
    });
    setAdd(false);

    dispatch({
      type: "STATE",
      data: {
        attendance_id: item.id,
        attendance_date: item.attendance_date, // moment(item.attendance_date).format("YYYY.MM.DD"),
        attendance_hour: moment(item.attendance_date).utc().format("HH"),
        attendance_minut: moment(item.attendance_date).utc().format("mm"),
      },
    });
    dispatch({
      type: "STATE",
      data: {
        attendance_hour: moment(item.attendance_date).utc().format("HH"),
      },
    });

    setVisible(true);
  };
  const dateBodyTemplate = (rowData) => {
    return moment(rowData.attendance_date).utc().format("YYYY.MM.DD HH:mm");
  };
  const memo_table = useMemo(() => {
    return (
      <DataTable
        size="small"
        value={state.list_attendance_date}
        responsiveLayout="scroll"
        showGridlines
        scrollable
        scrollHeight={window.innerHeight - 218}
        emptyMessage={
          <div className="text-xs text-orange-500 italic font-semibold">
            Хоосон байна...
          </div>
        }
        header={
          <div className="flex items-center justify-end">
            {checkRole(["lesson_add"]) && (
              <div
                title="Нэмэх"
                className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer "
                onClick={() => {
                  setAdd(true);
                  dispatch({
                    type: "STATE",
                    data: {
                      attendance_id: null,
                      attendance_date: moment(),
                      attendance_hour: null,
                      attendance_minut: null,
                    },
                  });
                  setVisible(true);
                }}
              >
                <i className="ft-plus" />
              </div>
            )}
          </div>
        }
        sortMode="multiple"
        removableSort
      >
        <Column
          header="№"
          align="center"
          style={{ minWidth: "50px", maxWidth: "50px" }}
          className="text-xs"
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
          body={(data, row) => row.rowIndex + 1}
        />
        <Column
          header="Ирцийн огноо"
          headerClassName="text-xs min-w-[10%] justify-center"
          align="center"
          field="attendance_date"
          className="text-xs min-w-[10%]"
          body={dateBodyTemplate}
        />

        <Column
          align="center"
          header="Үйлдэл"
          className="text-xs"
          style={{ minWidth: "90px", maxWidth: "90px" }}
          headerClassName="flex items-center justify-center"
          body={(item) => {
            return (
              <div className="flex items-center justify-center gap-2">
                {checkRole(["lesson_edit"]) && (
                  <button
                    className="p-1 flex items-center justify-center font-semibold text-green-500 rounded-full border-2 border-green-500 hover:bg-green-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                    onClick={() => updateItem(item)}
                  >
                    <i className="ft-edit" />
                  </button>
                )}

                {checkRole(["lesson_delete"]) && (
                  <button
                    className="p-1 flex items-center justify-center font-semibold text-red-500 rounded-full border-2 border-red-500 hover:bg-red-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                    onClick={() => deleteItem(item)}
                  >
                    <i className="ft-trash-2" />
                  </button>
                )}
              </div>
            );
          }}
        />
      </DataTable>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.list_attendance_date, state.refresh]);

  const footerContent = (
    <div className="actions clearfix">
      <button
        className="w-full py-2 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-md hover:bg-violet-500 hover:text-white focus:outline-none duration-300 "
        onClick={() => {
          var data = {
            lesson_id: state.less_id,
            attendance_date: `${moment(state.attendance_date).format(
              "YYYY.MM.DD"
            )} ${state.attendance_hour}:${state.attendance_minut}`,
          };
          if (add) {
            API.postAttendance(data)
              .then(() => {
                dispatch({
                  type: "STATE",
                  data: { refresh: state.refresh + 1 },
                });

                message({
                  type: "success",
                  title: "Амжилттай хадгалагдлаа.",
                });
                dispatch({
                  type: "CLEAR_LESSON",
                });
              })
              .catch((error) => {
                message({
                  type: "error",
                  error,
                  title: "Засварлаж чадсангүй",
                });
              });
          } else if (!add && state.attendance_id) {
            API.putAttendance(state.attendance_id, data)
              .then(() => {
                dispatch({
                  type: "STATE",
                  data: { refresh: state.refresh + 1 },
                });

                message({
                  type: "success",
                  title: "Амжилттай засварлагдлаа.",
                });
                dispatch({
                  type: "CLEAR_LESSON",
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

          setVisible(false);
        }}
      >
        <i className="ft-save" />
        <span className="ml-2">Хадгалах</span>
      </button>
    </div>
  );

  return (
    <>
      <Modal
        centered
        width={850}
        title={
          <div className="text-center">
            {state?.less_id
              ? "Сургалтын төрөл засварлах цонх"
              : "Сургалтын төрөл бүртгэх цонх"}
          </div>
        }
        visible={state.modal}
        onCancel={() => {
          dispatch({
            type: "STATE",
            data: { modal: false },
          });
        }}
        className="text-sm tracking-wide z-20"
        footer={null}
      >
        {props.setedit && (
          <div className=" p-1 flex  justify-end gap-3 ">
            <div className="card flex justify-content-center">
              <ToggleButton
                onLabel="Сургалт засварлах"
                offLabel="Ирц бүртгэх хугацаа"
                onIcon="pi pi-check"
                offIcon="pi pi-times"
                checked={state.timeRegister}
                onChange={(e) =>
                  dispatch({
                    type: "STATE",
                    data: {
                      timeRegister: e.value,
                    },
                  })
                }
                className="w-11rem text-white text-xs bg-indigo-500 shadow-lg p-1 flex items-center justify-center font-semibold  border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer"
              />
            </div>
            {/* <span className="list-group-item-text grey darken-2 m-0 ">
              Ирцийн бүртгэл:
            </span> */}
            {/* <Switch
              checkedChildren={`kjfkjfj`}
              unCheckedChildren={"gggggg"}
              checked={state.timeRegister}
              onChange={(value) => {
                dispatch({
                  type: "STATE",
                  data: { timeRegister: value },
                });
                //setTimeRegister(value);
              }}
            /> */}
          </div>
        )}

        {!state.timeRegister && (
          <div>
            <div className="w-full p-1 flex flex-col justify-start ">
              <span className="list-group-item-text grey darken-2 m-0">
                Сургалтын төрөл:<b className="ml-1 text-red-500">*</b>
              </span>
              <div className="w-full md:min-w-[200px]">
                <Type
                  module_id={state.moduleid}
                  //disabled={props.setedit ? "true" : "false"}
                  year={moment(state.change_year).format("YYYY")}
                  value={state?.id}
                  onChange={(value) => {
                    dispatch({
                      type: "STATE",
                      data: { id: value },
                    });
                    API.getLessonTypeID(value).then((res) => {
                      dispatch({
                        type: "SET_LESSON",
                        data: {
                          id: res.id,
                          begin_date: res.begin_date,
                          end_date: res.end_date,
                          hour: res.hour,
                          limit: res.limit,
                          percent: res.percent,
                          point: res.point,
                          type_id: res.type_id,
                          place_id: res.place_id,
                          price_emc: res.price_emc,
                          price_organization: res.price_organization,
                        },
                      });
                      dispatch({
                        type: "STATE",
                        data: { type_id: res.type_id },
                      });
                    });

                    dispatch({
                      type: "STATE",
                      data: { modal: true },
                    });
                    //loadItemTypeList(res.itemtypeid);
                  }}
                />
              </div>
            </div>
            <div className="w-full p-1 flex flex-col justify-start">
              <span className="list-group-item-text grey darken-2 m-0">
                Сургалтын танхим:<b className="ml-1 text-red-500">*</b>
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
          </div>
        )}
        {!state.timeRegister && (
          <div className="flex flex-col">
            <div className="w-full p-1 flex flex-col justify-start ">
              <span className="list-group-item-text grey darken-2 m-0">
                Сургалтын цаг:
              </span>
              <Input
                className=" p-1 w-full text-gray-900 border border-gray-200  "
                min={1}
                max={900}
                type="number"
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
                Суух ажилчдын тоо:
              </span>
              <Input
                className=" p-1 w-full text-gray-900 border border-gray-200 "
                min={1}
                max={900}
                type="number"
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
                Шалгалтын оноо:
              </span>
              <Input
                className=" p-1 w-full text-gray-900 border border-gray-200"
                value={state.point}
                min={1}
                max={900}
                type="number"
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
                Тэнцэх хувь:
              </span>
              <Input
                className=" p-1 w-full text-gray-900 border border-gray-200 "
                value={state.percent}
                min={1}
                max={900}
                type="number"
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

            <div className="w-full p-1 flex flex-col justify-start">
              <span className="list-group-item-text grey darken-2 m-0">
                Үнэ /Бүтцийн нэгжүүдэд/:
              </span>
              <Input
                className=" p-1 w-full text-gray-900 border border-gray-200  "
                value={state.price_emc}
                type="number"
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
                Үнэ /Гадны байгууллагуудад/:
              </span>
              <Input
                className=" p-1 w-full text-gray-900 border border-gray-200"
                value={state.price_organization}
                type="number"
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
          </div>
        )}
        {state.timeRegister && (
          <div>
            <div className="w-full p-1 flex flex-col justify-start">
              {memo_table}
            </div>
          </div>
        )}

        <div className="my-3 border " />
        {!state.timeRegister && <SaveButton onClick={() => save()} />}
      </Modal>

      <CalModal
        centered
        className="max-w-sm md:w-2/4 text-xs items-center"
        title={
          <div className="text-center">
            {state.id
              ? `${state.type_name} ирцийн огноо засварлах цонх`
              : "Ирцийн огноо бүртгэх цонх"}
          </div>
        }
        visible={visible}
        onCancel={() => {
          setVisible(false);
          dispatch({
            type: "STATE",
            data: {
              attendance_date: moment(),
              attendance_hour: null,
              attendance_minut: null,
            },
          });
        }}
        footer={footerContent}
      >
        <div className="w-full p-1 flex flex-col justify-start ">
          <span className="list-group-item-text grey darken-2 m-0">
            Огноо:<b className="ml-1 text-red-500">*</b>
          </span>
          <DatePicker
            allowClear={false}
            className="w-full md:w-[150px] text-xs"
            format={"YYYY.MM.DD"}
            value={moment(state.attendance_date)}
            onChange={(date) =>
              dispatch({
                type: "STATE",
                data: {
                  attendance_date: date,
                },
              })
            }
          />
        </div>

        <div className="card flex flex-row justify-between gap-3">
          <div className="flex flex-col justify-content-center w-1/2 pl-7 ">
            <span className="list-group-item-text grey darken-2 m-0 pl-2">
              Цаг:<b className="ml-1 text-red-500">*</b>
            </span>
            <InputNumber
              style={{ width: "4rem" }}
              min={0}
              max={100}
              showButtons
              maxLength={2}
              buttonLayout="vertical"
              className="max-w-sm md:max-w-lg text-gray-900 border border-gray-200 w-max-[50] "
              value={state.attendance_hour}
              onValueChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: {
                    attendance_hour: e.value,
                  },
                });
              }}
            />
          </div>

          <div className="flex flex-col w-1/2">
            <span className="list-group-item-text grey darken-2 m-0 pl-2">
              Минут:<b className="ml-1 text-red-500">*</b>
            </span>
            <InputNumber
              className="max-w-sm md:max-w-lg text-gray-900 border border-gray-200  "
              value={state.attendance_minut}
              showButtons
              buttonLayout="vertical"
              style={{ width: "4rem" }}
              maxLength={2}
              min={0}
              max={60}
              onValueChange={(e) => {
                dispatch({
                  type: "STATE",
                  data: {
                    attendance_minut: e.value,
                  },
                });
              }}
            />
          </div>
        </div>
      </CalModal>

      {/* <Dialog
        header="Ирцийн огноо"
        body={dateBodyTemplate}
        visible={visible}
        onHide={() => setVisible(false)}
        className="max-w-sm md:w-2/4 text-xs "
        footer={footerContent}
      >
        <div>
          
          <Calendar
             value={state.attendance_date}
            inline
            showTime
            hourFormat="24"
            className="text-xs pb-2"
            // dateFormat="YYYY.MM.DD HH:MM"
            onChange={(e) => {
           
              dispatch({
                type: "STATE",
                data: {
                  attendance_date: e.value,
                },
              });
            }}
            showIcon
          ></Calendar>
        </div>
      </Dialog> */}
    </>
  );
};

export default React.memo(Component);
