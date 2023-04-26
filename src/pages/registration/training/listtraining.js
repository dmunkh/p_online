import React, { useState, useMemo, useLayoutEffect } from "react";
import { useUserContext } from "src/contexts/userContext";
import { useTrainingContext } from "src/contexts/trainingContext";
import * as API from "src/api/training";
import { Select, Input, Tooltip, Row } from "antd";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Modal from "./modal";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";
import Swal from "sweetalert2";
import moment from "moment";
import ColumnGroup from "antd/lib/table/ColumnGroup";

const Training = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useTrainingContext();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);

  // жагсаалт
  useLayoutEffect(() => {
    //setLoading(true);
    state.moduleid &&
      API.getLesson({
        year: moment(state.change_year).format("YYYY"),
        module_id: state.moduleid,
      })
        .then((res) => {
          dispatch({
            type: "STATE",
            data: {
              list_training: _.orderBy(res, ["type_id"]),
            },
          });
        })
        .catch((error) => {
          dispatch({
            type: "STATE",
            data: {
              list_training: [],
            },
          });
          message({
            type: "error",
            error,
            title: "Сургалтын төрөл жагсаалт татаж чадсангүй",
          });
        })
        .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.change_year, state.moduleid]);

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
        API.deleteLesson(item.id)
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
        message({
          type: "error",
          title: "Амжилттай устгагдлаа",
        });
      }
    });
  };
  const updateItem = (item) => {
    dispatch({
      type: "SET_LESSON",
      data: {
        type_name: item.type_name,
        id: item.id,
        begin_date: item.begin_date,
        end_date: item.end_date,
        hour: item.hour,
        limit: item.limit,
        percent: item.percent,
        place_id: item.place_id,
        point: item.point,
        price_emc: item.price_emc,
        price_organization: item.price_organization,
        year: item.year,
        type_id: item.type_id,
      },
    });
    dispatch({
      type: "STATE",
      data: { modal: true },
    });
    // API.getLessonID(item.id)
    //   .then((res) => {

    //     //loadItemTypeList(res.itemtypeid);
    //   })
    //   .catch((error) => {
    //     message({
    //       type: "error",
    //       error,
    //       title: "Мэдээлэл татаж чадсангүй.",
    //     });
    //     dispatch({
    //       type: "CLEAR",
    //     });
    //   });
  };

  const memo_table = useMemo(() => {
    var result = state.list_training;

    // if (state?.type_id)
    //   result = _.filter(result, (a) => a.type_id === state.type_id);

    if (search) {
      result = _.filter(
        result,
        (a) =>
          _.includes(_.toLower(a.type_name), _.toLower(search)) ||
          _.includes(_.toLower(a.begin_date), _.toLower(search)) ||
          _.includes(_.toLower(a.end_date), _.toLower(search)) ||
          _.includes(_.toLower(a.place_name), _.toLower(search)) ||
          _.includes(_.toLower(a.limit), _.toLower(search)) ||
          _.includes(_.toLower(a.hour), _.toLower(search)) ||
          _.includes(_.toLower(a.limit), _.toLower(search)) ||
          _.includes(_.toLower(a.point), _.toLower(search)) ||
          _.includes(_.toLower(a.percent), _.toLower(search))
      );
    }

    return (
      <DataTable
        scrollable
        dataKey="id"
        size="small"
        stripedRows
        showGridlines
        className="w-full text-sm"
        sortMode="single"
        removableSort
        scrollHeight={window.innerHeight - 400}
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
              {checkRole(["lesson_add"]) && (
                <div
                  title="Нэмэх"
                  className="p-1 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer "
                  onClick={() => {
                    dispatch({
                      type: "CLEAR_LESSON",
                    });
                    API.getLessonTypeID(state?.type_id).then((res) => {
                      dispatch({
                        type: "SET_LESSON",
                        data: {
                          type_name: res.type_name,

                          begin_date: res.begin_date,
                          end_date: res.end_date,
                          hour: res.hour,
                          limit: res.limit,
                          //   percent: res.percent,
                          place_id: res.place_id,
                          point: res.point,
                          //   price_emc: res.price_emc,
                          //   price_organization: res.price_organization,
                          year: res.year,
                          type_id: state?.type_id,
                        },
                      });
                      dispatch({
                        type: "STATE",
                        data: { modal: true },
                      });
                      //loadItemTypeList(res.itemtypeid);
                    });

                    dispatch({
                      type: "STATE",
                      data: { modal: true },
                    });
                  }}
                >
                  <i className="fa fa-plus" />
                </div>
              )}
            </div>
          </div>
        }
        rowGroupMode="subheader"
        groupRowsBy="type_name"
        rowGroupHeaderTemplate={(data) => {
          return (
            <React.Fragment>
              <span className="text-xs font-semibold">
                <span>Сургалтын төрөл : {data.type_id}</span> |
                <span className="ml-1">{data.type_name}</span>
              </span>
            </React.Fragment>
          );
        }}
        footerColumnGroup={
          <ColumnGroup>
            <Row>
              {state.checkNoNorm && (
                <Column className="w-[50px] text-center text-xs" />
              )}
              <Column
                className="w-[50px] max-w-[50px] text-center text-xs"
                footer={result.length}
              />

              <Column
                // className="min-w-[150px]"
                style={{ minWidth: "150px" }}
                footer={() => {
                  return (
                    <div className="flex items-center justify-center">
                      <Tooltip
                        placement="top"
                        title={
                          <div className="flex flex-col gap-2 text-xs">
                            {_.map(
                              Object.entries(_.groupBy(result, "type_id")),
                              (item, index) => {
                                return (
                                  <div key={index} className="">
                                    <span>
                                      {item[0] === "null"
                                        ? "Тодорхойгүй"
                                        : item[0]}
                                    </span>
                                    - <span>{item[1].length}</span>,{"  тоо: "}
                                    <span>
                                      - {_.sumBy(item[1], (a) => a.normcount)}
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        }
                      >
                        <div className="flex items-center justify-center text-blue-500 text-lg">
                          <i className="fe fe-info" />
                        </div>
                      </Tooltip>
                    </div>
                  );
                }}
              />
            </Row>
          </ColumnGroup>
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

        {/* <Column
          sortable
          header="Сургалтын төрөл"
          field="type_name"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-start "
        /> */}
        <Column
          sortable
          header="Эхлэх огноо"
          field="begin_date"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center "
        />

        <Column
          sortable
          header="Дуусах огноо"
          field="end_date"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
        />
        <Column
          sortable
          header="Танхим"
          field="place_name"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
        />
        <Column
          sortable
          header="Суух ажилчдын тоо"
          field="limit"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
        />
        <Column
          sortable
          header="Сургалтын цаг"
          field="hour"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
        />
        <Column
          sortable
          header="Сургалтын тайлбар"
          field="description"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-start text-left"
        />
        {/* <Column
          sortable
          header="Ирц"
          field="attendance"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-start text-left"
        /> */}
        <Column
          sortable
          header="Шалгалтын оноо"
          field="point"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center text-left"
        />
        <Column
          sortable
          header="Тэнцэх хувь"
          field="percent"
          style={{ minWidth: "150px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center text-left"
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
  }, [state.list_training, state.type_id, search, first, per_page]);

  return (
    <>
      <Modal />
      <div className="card flex p-2 border rounded text-xs">
        <div className="flex flex-col rounded">
          <div className="card flex justify-center text-xs rounded p-2">
            {/* <Spin
              tip="Уншиж байна."
              className="min-h-full first-line:bg-opacity-80"
              spinning={loading}
            > */}
            {memo_table}
            {/* </Spin> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(Training);
