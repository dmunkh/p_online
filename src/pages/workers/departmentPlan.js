import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Input, Select, Checkbox, Modal } from "antd";
import _ from "lodash";
// import { SearchOutlined } from "@ant-design/icons";
import * as API from "src/api/plan";
import DepartmentTseh from "src/components/custom/departmentTseh";
// import { Row } from "primereact/row";

// import { ColumnGroup } from "primereact/columngroup";
import moment from "moment";
import { FilterMatchMode } from "primereact/api";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";
import { useUserContext } from "src/contexts/userContext";
import Employee from "src/pages/workers/employeeLesson";

const Department = () => {
  const { message } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();
  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [first, set_first] = useState(0);
  const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [name, setname] = useState("");
  const [tn, settn] = useState("");

  useEffect(() => {
    setLoading(true);
    API.getPlanWorker({
      year: moment(state.date).format("Y"),
      type_id: state.lesson.type_id,
      department_id: state.department,
    })
      .then((res) => {
        dispatch({
          type: "STATE",
          data: { list_planworker: _.map(res, (item) => item.tn) },
        });

        setList(_.orderBy(res, ["department_code"], ["firstname"]));
      })
      .catch((error) =>
        message({ type: "error", error, title: "Жагсаалт татаж чадсангүй.." })
      )
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.department, state.date, state.moduleid, state.refresh]);

  const check_position = (e, item) => {
    var result = state.list_checked;

    if (e.target.checked) result.push(item.tn);
    else result = _.reject(result, (a) => a === item.tn);

    dispatch({
      type: "STATE",
      data: { list_checked: result },
    });
  };

  useEffect(() => {
    var result = false;
    if (state.list_checked.length === list.length) result = true;

    setCheckAll(result);
  }, [list, state.list_checked]);

  return (
    <>
      <Modal
        width={800}
        height={600}
        visible={state.modal_employee}
        // visible={true}
        onCancel={() =>
          dispatch({ type: "STATE", data: { modal_employee: false } })
        }
        title={"Сургалт (" + name + "| БД: " + tn + ")"}
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <Employee />
      </Modal>
      <span className="font-semibold whitespace-nowrap">Бүтцийн нэгж:</span>
      <DepartmentTseh
        value={state.department}
        onChange={(value) =>
          dispatch({ type: "STATE", data: { department: value } })
        }
      />
      <hr className="my-2" />
      <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
        <DataTable
          scrollable
          dataKey="id"
          filters={search}
          size="small"
          stripedRows
          showGridlines
          paginator
          className="text-xs"
          sortMode="single"
          removableSort
          scrollHeight={600}
          responsiveLayout="scroll"
          value={list}
          rowGroupMode="subheader"
          groupRowsBy="department_name"
          globalFilterFields={["tn", "short_name", "position_name"]}
          header={
            <div className="flex items-center justify-between">
              <div className="w-full md:max-w-[300px]">
                <Input.Search
                  className="md:w-80"
                  placeholder="Хайх..."
                  value={search.global.value}
                  onChange={(e) => {
                    let _search = { ...search };
                    _search["global"].value = e.target.value;
                    setSearch(_search);
                  }}
                />
              </div>

              {state.lesson.limit -
                state.lesson.count_register -
                state.list_checked.length <
              0 ? (
                <span className="text-red-500">
                  {" "}
                  <i className="ft-arrow-up"></i> Лимит хэтэрлээ ({" "}
                  {state.lesson.limit} /
                  {state.lesson.count_register + state.list_checked.length} )
                </span>
              ) : (
                <span>
                  <span className="font-bold">
                    <i className="ft-user-plus"></i>
                  </span>{" "}
                  ( {state.lesson.limit} /
                  {state.lesson.count_register + state.list_checked.length} )
                </span>
              )}
            </div>
          }
          rowClassName={(data) => {
            var result = " ";
            if (_.indexOf(state.list_checked, data.tn) > -1)
              result += "bg-blue-500 text-white";
            return result;
          }}
          emptyMessage={
            <div className="text-xs text-orange-500 italic font-semibold">
              Мэдээлэл олдсонгүй...
            </div>
          }
          rowGroupHeaderTemplate={(data) => {
            return (
              <React.Fragment>
                <span className="text-xs font-semibold">
                  <span>{data.department_code}</span> |
                  <span className="ml-1">{data.department_name}</span>
                </span>
              </React.Fragment>
            );
          }}
          rows={per_page}
          first={first}
          onPage={(event) => {
            set_first(event.first);
            set_per_page(event.rows);
          }}
          paginatorTemplate={{
            layout:
              "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
            RowsPerPageDropdown: (options) => {
              const dropdownOptions = [
                { label: 50, value: 50 },
                { label: 100, value: 100 },
                { label: 200, value: 200 },
                { label: 500, value: 500 },
              ];
              return (
                <>
                  <span
                    className="text-xs mx-1"
                    style={{
                      color: "var(--text-color)",
                      userSelect: "none",
                    }}
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
        >
          <Column
            align="center"
            header={
              <Checkbox
                indeterminate={indeterminate}
                onChange={(e) => {
                  var result = [];

                  if (e.target.checked) {
                    _.map(list, (item) => {
                      result.push(item.tn);
                    });
                  }

                  dispatch({
                    type: "STATE",
                    data: { list_checked: result },
                  });

                  setIndeterminate(false);
                }}
                checked={checkAll}
              />
            }
            style={{ minWidth: "50px", maxWidth: "50px" }}
            className="text-xs w-[50px]"
            body={(item) => {
              var checked = _.indexOf(state.list_checked, item.tn) > -1;
              return (
                <Checkbox
                  key={item.id}
                  checked={checked}
                  onChange={(e) => check_position(e, item)}
                />
              );
            }}
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-center justify-center"
          />

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
            // align="center"
            header="БД"
            field="tn"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            className="text-xs"
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-center justify-start"
          />
          <Column
            sortable
            // align="center"
            header="Овог нэр"
            field="short_name"
            style={{ minWidth: "150px", maxWidth: "150px" }}
            className="text-xs"
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-center justify-start"
            body={(data) => {
              return (
                <span
                  className="text-brown-500 cursor-pointer text-blue-700 font-semibold"
                  onClick={() => {
                    setname(data.short_name);
                    settn(data.tn);
                    dispatch({
                      type: "STATE",
                      data: { modal_employee: true, tn: data.tn },
                    });
                  }}
                >
                  {data.short_name}
                </span>
              );
            }}
          />
          <Column
            sortable
            header="Албан тушаалын нэр"
            field="position_name"
            style={{ minWidth: "150px" }}
            className="text-xs "
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-center justify-start text-left"
            body={(item) => {
              return (
                <span
                  className="text-brown-500 cursor-pointer"
                  onClick={() => {
                    dispatch({
                      type: "STATE",
                      data: { selectedpositionname: item.positionname },
                    });
                  }}
                >
                  {item.position_name}
                </span>
              );
            }}
          />
        </DataTable>
      </Spin>
    </>
  );
};

export default React.memo(Department);
