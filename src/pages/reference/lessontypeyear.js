import React, { useState, useMemo, useLayoutEffect, useEffect } from "react";
import { useUserContext } from "../../contexts/userContext";
import { useReferenceContext } from "../../contexts/referenceContext";
import * as API from "../../api/request";
import { Spin, Select, Input, Modal, DatePicker } from "antd";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import dayjs from "dayjs";

import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import Swal from "sweetalert2";
const { Option } = Select;

const LessonTypeYear = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useReferenceContext();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);
  const yearFormat = "YYYY";
  const [date, setDate] = useState(moment(Date.now()).format("YYYY"));
  const [module, setModule] = useState(1);

  // жагсаалт
  useLayoutEffect(() => {
    setLoading(true);
    API.getTypesYear(module, date)
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_typeyear: _.orderBy(res, ["type_name"]),
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: "STATE",
          data: {
            list_typeyear: [],
          },
        });
        message({
          type: "error",
          error,
          title: "Сургалтын төрлийн жагсаалт татаж чадсангүй",
        });
      })
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, module, date]);

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
  useLayoutEffect(() => {
    API.getModule()
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_module: _.orderBy(res, ["place_name"]),
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

  useLayoutEffect(() => {
    API.getLessonType({ module_id: module })
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_type: _.orderBy(res, ["type_name"]),
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
        API.deleteTypeYear(item.id)
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
              title: " Устгаж чадсангүй",
            });
          });   
      }
    });
  };
  const updateItem = (item) => {
    dispatch({
      type: "STATE",
      data: {
        selected_typeyear: item,
      },
    });
    //     //loadItemTypeList(res.itemtypeid);
    dispatch({
      type: "STATE",
      data: { modal: true },
    });

  };
  const save = () => {
    var error = [];
    state.state.selected_typeyear.type_id || error.push("Сургалтын төрөл:")||
    state.selected_typeyear.place_id || error.push("Танхим:")
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
    } else if (state.id === null) {
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
      // API.putPlace(state.selected_typeyear.id, {
      //   place_name: state.place_name,
      // })
      //   .then(() => {
      //     dispatch({
      //       type: "STATE",
      //       data: {
      //         refresh: state.refresh + 1,
      //       },
      //     });
      //     dispatch({ type: "STATE", data: { modal: false } });
      //     message({ type: "success", title: "Амжилттай хадгалагдлаа" });
      //   })
      //   .catch((error) => {
      //     message({
      //       type: "error",
      //       error,
      //       title: error.response.data.msg,
      //     });
      //   });
    }
  };
  const memo_table = useMemo(() => {
    var result = state.list_typeyear;

    if (search) {
      result = _.filter(result, (a) =>
        _.includes(_.toLower(a.interval_name), _.toLower(search))
      );
    }

    return (
      <DataTable
        scrollable
        dataKey="id"
        size="small"
        stripedRows
        showGridlines
        className="w-full "
        sortMode="single"
        removableSort
        scrollHeight={window.innerHeight - 275}
        responsiveLayout="scroll"
        value={result}
        header={
          <div className="flex items-center justify-between">
            <div className="w-full md:max-w-[200px]">
              <Input
                placeholder="Хайх..."
                prefix={<SearchOutlined />}
                className="w-full rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 ">
              {checkRole(["type_year_add"]) && (
              <div
                title="Нэмэх"
                className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer mr-1"
                onClick={() => {
                  dispatch({
                    type: "CLEAR_TYPEYEAR",
                  });
                  dispatch({
                    type: "STATE",
                    data: { modal: true },
                  });
                }}
              >
                <i className="ft-plus" />
              </div>
               )} 
            </div>
          </div>
        }
        paginator
        rowHover
        first={first}
        rows={per_page}
        onPage={(event) => {
          set_first(event.first);
          set_per_page(event.rows);
        }}
        paginatorTemplate={{
          layout:
            "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
          RowsPerPageDropdown: (options) => {
            const dropdownOptions = [
              { label: 10, value: 10 },
              { label: 20, value: 20 },
              { label: 50, value: 50 },
              { label: 100, value: 100 },
              { label: 200, value: 200 },
              { label: 500, value: 500 },
            ];
            return (
              <>
                <span
                  className="text-xs mx-1"
                  style={{ color: "var(--text-color)", userSelect: "none" }}
                >
                  <span className="font-semibold">Нэг хуудсанд:</span>
                </span>
                <Select
                  size="small"
                  showSearch={false}
                  value={options.value}
                  onChange={(value) => {
                    options.onChange({
                      value: value,
                    });
                  }}
                >
                  {_.map(dropdownOptions, (item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.value}
                    </Select.Option>
                  ))}
                </Select>
              </>
            );
          },
          CurrentPageReport: (options) => {
            return (
              <span
                style={{
                  color: "var(--text-color)",
                  userSelect: "none",
                  width: "200px",
                  textAlign: "center",
                }}
              >
                <span className="text-xs font-semibold">
                  <span>
                    {options.first} - {options.last}
                  </span>
                  <span className="ml-3">Нийт: {options.totalRecords}</span>
                </span>
              </span>
            );
          },
        }}
        paginatorClassName="justify-content-end"
        emptyMessage={
          <div className="text-xs text-orange-500 italic font-semibold">
            Мэдээлэл олдсонгүй...
          </div>
        }
      >
        <Column
          header="№"
          align="center"
          style={{ minWidth: "50px", maxWidth: "50px" }}
          className="text-xs w-full"
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
          body={(data, row) => row.rowIndex + 1}
        />

        <Column
          sortable
          header="Сургалтын төрөл"
          field="type_name"
          style={{ minWidth: "400px", maxWidth: "400px" }}
          className="text-xs "
          headerClassName="flex items-center justify-left"
          bodyClassName="flex items-center justify-start text-left"
        />
        <Column
          sortable
          header="Танхим"
          field="place_name"
          className="text-xs "
          headerClassName="flex items-center justify-left"
          bodyClassName="flex items-center justify-start text-left"
        />
        <Column
          sortable
          header="Суух ажилчидын тоо	"
          field="limit"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center text-center"
          bodyClassName="flex items-center justify-center"
        />
        <Column
          sortable
          header="Сургалтын үргэлжлэх хугацаа"
          field="hour"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center text-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          sortable
          header="Сургалтын үнэ"
          field="price_emc"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          sortable
          header="Сургалтын үнэ /Гаднын байгууллага/"
          field="price_organization"
          style={{ minWidth: "120px", maxWidth: "120px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          sortable
          header="Шалгалтын оноо"
          field="percent"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          sortable
          header="Тэнцэх хувь"
          field="point"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />
        <Column
          align="center"
          header="Үйлдэл"
          className="text-xs"
          style={{ minWidth: "100px", maxWidth: "100px" }}
          headerClassName="flex items-center justify-center"
          body={(item) => {
            return (
              <div className="flex items-center justify-center gap-2">
                {checkRole(["type_year_edit"]) && (
                <button
                  className="p-1 flex items-center justify-center font-semibold text-yellow-500 rounded-full border-2 border-yellow-500 hover:bg-yellow-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                  onClick={() => updateItem(item)}
                >
                  <i className="ft-edit" />
                </button>
               )}

                  {checkRole(["type_year_delete"]) && ( 
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
  }, [state.list_typeyear, search, first, per_page]);

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
          <span className="font-semibold pb-1">
            Суух ажилчидын тоо:<b className="ml-1 text-red-500">*</b>
          </span>
          <Input
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
            Шалгалтын оноо:<b className="ml-1 text-red-500">*</b>
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
            Тэнцэх хувь:<b className="ml-1 text-red-500">*</b>
          </span>
          <Input
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
          onClick={() => save()}
        >
          <i className="fas fa-save" />
          <span className="ml-2">Хадгалах</span>
        </button>
      </Modal>

      <div className="card flex justify-center text-xs rounded p-2">
        <div className="md:flex justify-startrounded gap-4 mt-2">
          <Select
            className="rounded-md md:w-64 "
            placeholder="Сонгоно уу."
            value={module}
            onChange={(value) => {
              setModule(value);
            }}
          >
            {_.map(state.list_module, (item) => (
              <Option className="text-xs" key={item.id} value={item.id}>
                {item.module_name}
              </Option>
            ))}
          </Select>
          <DatePicker
            size="large"
            defaultValue={dayjs(date, yearFormat)}
            format={yearFormat}
            picker="year"
            className="rounded-md h-10 md:w-32   "
            onChange={(e) => {
              setDate(e.$y);
            }}
          />
        </div>

        <div className="my-2 border border-gray-100" />
        <Spin
          tip="Уншиж байна."
          className="min-h-full first-line:bg-opacity-80"
          spinning={loading}
        >
          {memo_table}
        </Spin>
      </div>
    </>
  );
};

export default React.memo(LessonTypeYear);
