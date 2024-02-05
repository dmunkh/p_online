import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Spin, Input, Select, Checkbox } from "antd";
import _ from "lodash";
// import { SearchOutlined } from "@ant-design/icons";
import * as API from "src/api/plan";
// import { Row } from "primereact/row";
import DepartmentTseh from "src/components/custom/departmentTseh";

// import { ColumnGroup } from "primereact/columngroup";
import moment from "moment";
import * as REQ from "src/api/request";
import { FilterMatchMode } from "primereact/api";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";
import { useUserContext } from "src/contexts/userContext";

const Employee = () => {
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

  useEffect(() => {
    setLoading(true);
    REQ.getEmployee({
      tn: state.tn,
    })
      .then((res) => {
        console.log(res);
        setList(res);
      })
      .catch((error) =>
        message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
      )
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.tn]);

  return (
    <>
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
          globalFilterFields={["tn", "shortname", "position_namemn"]}
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
            header="Огноо"
            field="begin_date"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            className="text-xs"
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-center justify-start"
          />
          <Column
            sortable
            // align="center"
            header="Модуль"
            field="module_name"
            style={{ minWidth: "120px", maxWidth: "120px" }}
            className="text-xs"
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-center justify-start"
          />
          <Column
            sortable
            // align="center"
            header="Сургалтын нэр"
            field="trainingname"
            className="text-xs"
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-center justify-start"
          />
          <Column
            // align="center"
            header="Авах оноо"
            field="scoreplan"
            style={{ minWidth: "60px", maxWidth: "60px" }}
            className="text-xs"
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-right justify-end"
          />
          <Column
            // align="center"
            header="Авсан оноо"
            field="score"
            style={{ minWidth: "60px", maxWidth: "60px" }}
            className="text-xs"
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-right justify-end"
            body={(data) => {
              return data.score !== 0 ? data.score : "";
            }}
          />
          <Column
            // align="center"
            header="Хувь"
            field="result"
            style={{ minWidth: "60px", maxWidth: "60px" }}
            className="text-xs"
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-right justify-end"
            body={(data) => {
              return data.score !== 0 ? data.result : "";
            }}
          />
          <Column
            sortable
            // align="center"
            header="Тэнцсэн эсэх"
            field="resultdesc"
            style={{ minWidth: "80px", maxWidth: "80px" }}
            className="text-xs"
            headerClassName="flex items-center justify-center"
            bodyClassName="flex items-right justify-end"
            body={(data) => {
              var name = "";
              data.resultdesc === "Тэнцсэн"
                ? (name = "success")
                : (name = "danger");

              return data.score !== 0 ? (
                <span className={"badge-" + name + " p-1"}>
                  {" "}
                  {data.resultdesc}{" "}
                </span>
              ) : (
                ""
              );
            }}
          />
        </DataTable>
      </Spin>
    </>
  );
};

export default React.memo(Employee);
