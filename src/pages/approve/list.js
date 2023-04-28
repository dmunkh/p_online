import React, { useEffect, useState } from "react";
import * as API from "src/api/approve";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Modal, Input, Switch, DatePicker } from "antd";
import _ from "lodash";
import { FilterMatchMode } from "primereact/api";
import Module from "src/components/custom/module";
import TypeYear from "src/components/custom/typeYear";
import DepartmentTree from "src/components/custom/departmentTree";
import MODAL from "src/pages/planhab/modal";
import { useUserContext } from "src/contexts/userContext";

// import Swal from "sweetalert2";
import moment from "moment";

const List = () => {
  const { message, checkRole } = useUserContext();

  const [module, setModule] = useState(null);
  const [search, setSearch] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [first, set_first] = useState(0);
  const [date, setDate] = useState(moment());
  const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);
  const [loadingbtn, setLoadingbtn] = useState(false);
  const [list, setList] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [typeyear, settypeYear] = useState(null);
  const [checked, setChecked] = useState(false);
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    // dispatch({
    //   type: "STATE",
    //   data: { loading: true },
    // });
    if (date && module) {
      setLoading(true);
      setLoadingbtn(true);
      API.getApprove({
        year: moment(date).format("Y"),
        module_id: module,
        department_id: 0,
      })
        .then((res) => {
          setList(_.orderBy(res, ["departmentlevelid", "departmentcode"]));
          setLoading(false);
          setLoadingbtn(false);
        })
        .catch((error) =>
          message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
        )
        .finally(() => {
          setLoading(false);
          setLoadingbtn(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, date, module]);

  const PlanApprove = (id, ischecked) => {
    API.postApprove({
      year: moment(date).format("Y"),
      department_id: id,
      module_id: module,
      is_closed: ischecked,
    })
      .then(() => {
        // dispatch({ type: "REFRESH" });
        setRefresh(refresh + 1);
        message({
          type: "success",
          title: "Амжилттай хадгалагдлаа",
        });
        setLoadingbtn(false);
      })
      .catch((error) => {
        setLoadingbtn(false);
        message({
          type: "error",
          error,
          title: "Хааж чадсангүй.",
        });
      });
  };

  return (
    <>
      <Modal
        style={{ width: "600" }}
        width={800}
        height={550}
        // visible={state.modal}
        // visible={true}
        // onCancel={() => dispatch({ type: "STATE", data: { modal: false } })}
        title={"Сургалтын төрөл нэмэх"}
        closeIcon={<div className="">x</div>}
        footer={false}
      >
        <MODAL />
      </Modal>
      <div className="card p-2 border rounded text-xs">
        <div className="flex gap-4">
          <div className="flex items-center md:w-[150px] text-xs gap-2">
            <span className="font-semibold whitespace-nowrap">Огноо:</span>
            <DatePicker
              allowClear={false}
              className="w-full text-xs"
              picker="year"
              format="YYYY"
              value={date}
              onChange={(date) => {
                setDate(date);
              }}
            />
          </div>
          <div className="flex items-center md:w-[400px] text-xs gap-2">
            <span className="font-semibold whitespace-nowrap">Модуль:</span>
            <Module value={module} onChange={(value) => setModule(value)} />
          </div>
        </div>

        <Spin tip="Уншиж байна." className="bg-opacity-80" spinning={loading}>
          <DataTable
            size="small"
            value={list}
            dataKey="id"
            filters={search}
            scrollable
            rowHover
            removableSort
            showGridlines
            className="text-xs mt-2"
            filterDisplay="menu"
            responsiveLayout="scroll"
            sortMode="multiple"
            rowGroupMode="subheader"
            groupRowsBy="levelname"
            scrollHeight={window.innerHeight - 360}
            globalFilterFields={["departmentname", "departmentcode"]}
            emptyMessage={
              <div className="text-xs text-orange-500 italic font-semibold">
                Мэдээлэл олдсонгүй...
              </div>
            }
            header={
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
            }
            rowGroupHeaderTemplate={(data) => {
              return (
                <div className="text-xs font-semibold">
                  <span className="ml-1">
                    {data.departmentlevelid} | {data.levelname}
                  </span>
                </div>
              );
            }}
            // rowClassName={(data) => {
            //   var result = "cursor-pointer";
            //   if (state.id === data.id) result = " bg-blue-500 text-white";
            //   return result;
            // }}
          >
            <Column
              align="center"
              className="text-xs"
              style={{ minWidth: "50px", maxWidth: "50px" }}
              body={(data, row) => row.rowIndex + 1}
            />
            <Column
              header="Код"
              field="departmentcode"
              align="center"
              className="text-xs"
              headerClassName="flex items-center justify-center"
              style={{
                minWidth: "150px",
                maxWidth: "150px",
                color: "black",
              }}
            />
            <Column
              header="Бүтцийн нэгжийн нэр"
              field="departmentname"
              className="text-xs "
              headerClassName="flex items-center justify-center"
              style={{ color: "black" }}
              body={(rowData) => {
                return <>{rowData.departmentname}</>;
              }}
            />
            <Column
              header="#"
              headerClassName="text-xs min-w-[10%] justify-center"
              align="center"
              className="text-xs min-w-[10%]"
              style={{
                minWidth: "150px",
                maxWidth: "150px",
                color: "black",
              }}
              body={(item) => {
                return (
                  <div className="flex items-center justify-center gap-3">
                    {/* <InputSwitch
                          checkedChildren={
                            <i className="fa fa-check bg-green-500" />
                          }
                          unCheckedChildren={
                            <i className="fa fa-times bg-red-400" />
                          }
                          checked={item.is_closed}
                          onChange={(value) => PlanApprove(item.id, value)}
                        /> */}
                    <Spin tip="." className="bg-opacity-80" spinning={loading}>
                      <Switch
                        checkedChildren={
                          <i className="fa fa-check  text-green-600" />
                        }
                        unCheckedChildren={<i className="fa fa-times " />}
                        checked={item.is_closed}
                        onChange={(value) => {
                          setLoadingbtn(true);
                          PlanApprove(item.id, value);
                        }}
                      />
                    </Spin>
                  </div>
                );
              }}
            />
          </DataTable>
        </Spin>
      </div>
    </>
  );
};

export default React.memo(List);
