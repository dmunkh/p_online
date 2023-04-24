import React, { useEffect, useRef, useState } from "react";
import * as API from "src/api/registerEmpl";
import { Spin } from "antd";
import _ from "lodash";
// import { FilterMatchMode } from "primereact/api";
import { useRegisterEmplContext } from "src/contexts/registerEmplContext";

import { useUserContext } from "src/contexts/userContext";
// import Swal from "sweetalert2";
// import moment from "moment";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";

import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { Select, DatePicker, Modal, Modal as ModalLocation } from "antd";

const List = () => {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useRegisterEmplContext();
  const toast = useRef(null);
  // const [search, setSearch] = useState({
  //   global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  // });
  // const [first, set_first] = useState(0);
  // const [per_page, set_per_page] = useState(50);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [isDialog, setIsDialog] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    // dispatch({
    //   type: "STATE",
    //   data: { loading: true },
    // });
    setLoading(true);
    API.getWorkers({
      department_id: 10,
      lesson_id: 1,
    })
      .then((res) => {
        // var result = [];
        // _.map(_.orderBy(res, ["id"]), (item) => {
        //   result.push({
        //     id: item.id,
        //     title: item.type_name,

        //     start: getDate(item.begin_date) + " 16:00:00",
        //     //   end: getDate(item.end_date),
        //   });
        // });
        setList(res);
      })
      .catch((error) =>
        message({ type: "error", error, title: "Жагсаалт татаж чадсангүй" })
      )
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh, state.department, state.date]);
  const onRowExpand = (event) => {
    console.log("event: ", event);
    toast.current.show({
      severity: "info",
      summary: "Нээгдлээ",
      detail: event.data.OrganizationName,
      life: 3000,
    });
  };

  const onRowCollapse = (event) => {
    toast.current.show({
      severity: "success",
      summary: "Хаагдлаа",
      detail: event.data.OrganizationName,
      life: 3000,
    });
  };
  const rowExpansionTemplate = (data) => {
    console.log("expand", data);
    return (
      <div className="orders-subtable p-l-50">
        <DataTable value={data.child} responsiveLayout="scroll">
          <Column
            header="#"
            headerStyle={{ width: "3em" }}
            body={(data, options) => options.rowIndex + 1}
          ></Column>
          <Column field="tn" sortable></Column>
          <Column field="short_name" header="Овог нэр" sortable></Column>
          <Column field="position_name" header="Албан тушаал"></Column>
          <Column field="TypeID" header="TypeID" sortable hidden></Column>
          {/* <Column
            headerStyle={{ width: "14rem" }}
            body={actionBodyTemplate}
          ></Column> */}
        </DataTable>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => {
            console.log("test1");
          }}
        />
        <Button
          icon="pi pi-plus"
          className="p-button-rounded p-button-info"
          onClick={() => {
            console.log("test");
          }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => console.log("confirm")}
        />
      </React.Fragment>
    );
  };

  // function getDate(dayString) {
  //   const today = new Date();
  //   const year = today.getFullYear().toString();
  //   let month = (today.getMonth() + 1).toString();

  //   if (month.length === 1) {
  //     month = "0" + month;
  //   }

  //   return dayString.replace("YEAR", year).replace("MONTH", month);
  // }
  const actionBodyTemplate2 = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-search"
          className="p-button-rounded p-button-secondary mr-2"
          onClick={() => {
            // setIsShowLocation(false);
            // setIsShow(false);
            setIsDialog(true);
          }}
        />
      </React.Fragment>
    );
  };
  const divStyles = {
    boxShadow: "1px 2px 9px #F4AAB9",
    margin: "10px",
    padding: "10px",
  };
  return (
    <div className="row">
      <div className="col-12">
        <div className="card" style={divStyles}>
          <div className="card-content">
            <div className="card-body" style={{ padding: "3px" }}>
              <div id="users-list" className="list-group">
                <Spin
                  tip="Уншиж байна."
                  className="bg-opacity-80"
                  spinning={loading}
                >
                  <div className="datatable-rowexpansion-demo">
                    <Toast ref={toast} />
                    <div className="card-body p-0">
                      <DataTable
                        value={list}
                        expandedRows={expandedRows}
                        onRowToggle={(e) => {
                          setExpandedRows(e.data);
                        }}
                        stripedRows
                        onRowExpand={onRowExpand}
                        onRowCollapse={onRowCollapse}
                        responsiveLayout="scroll"
                        rowExpansionTemplate={rowExpansionTemplate}
                        dataKey="id"
                        //header={header}
                        sortOrder={1}
                        className="table-xs"
                        selectionMode="single"
                        selection={selected}
                        onSelectionChange={(e) => setSelected(e.value)}
                        // rowGroupFooterTemplate={footerTemplate}
                      >
                        <Column expander style={{ width: "20px" }} />
                        <Column
                          header="#"
                          headerStyle={{ width: "3em" }}
                          body={(data, options) => options.rowIndex + 1}
                        ></Column>
                        <Column
                          field="tn"
                          header="БД"
                          sortable

                          //body={representativeBodyTemplate}
                        />
                        <Column
                          field="short_name"
                          header="Овог нэр"
                          sortable

                          //body={representativeBodyTemplate}
                        />

                        <Column
                          field="position_name"
                          header="Албан тушаал"
                          sortable
                          className="text-center"
                          // body={priceBodyTemplate}
                        />
                        <Column
                          field="TreeCnt"
                          header="Ирц"
                          sortable
                          className="text-center"
                          //body={ratingBodyTemplate}
                        />
                        <Column
                          field="Давтан эсэх"
                          header="Ирц"
                          sortable
                          className="text-center"
                          //body={ratingBodyTemplate}
                        />
                        <Column
                          field=""
                          header="Шалгалтын оноо"
                          sortable
                          className="text-center"
                          //body={ratingBodyTemplate}
                        />
                        <Column
                          field="TreeCnt"
                          header="Шалгалтын хувь"
                          sortable
                          className="text-center"
                          //body={ratingBodyTemplate}
                        />
                        <Column
                          field="TreeCnt"
                          header="Тэнцсэн эсэх"
                          sortable
                          className="text-center"
                          //body={ratingBodyTemplate}
                        />
                        {/* <Column body={actionBodyTemplate2}></Column> */}
                      </DataTable>
                    </div>
                  </div>
                </Spin>
              </div>
              {/* <div classNameName="media">
                <div classNameName="media-body text-left">
                  <h3 classNameName="mb-1 primary">ХЭМАБ</h3>
                  <span classNameName="ft-calendar"> 2023-04-23</span>
                  <br></br>
                  <span>
                    Өргөх, зөөх, тээвэрлэх механизмтай харьцаж ажиллах аюулгүй
                    ажиллагааны сургалт
                  </span>
                  <br></br>
                  <span classNameName="ft-user"> 100/68</span>
                </div>
                <div classNameName="media-right align-self-center">
                  <i classNameName="ft-book-open primary font-large-2 float-right"></i>
                </div>
              </div> */}
              {/* <div classNameName="progress" style={{ height: "4px" }}>
                <div
                  classNameName="progress-bar bg-primary"
                  role="progressbar"
                  aria-valuenow="80"
                  aria-valuemin="80"
                  aria-valuemax="100"
                  style={{ width: "80%" }}
                ></div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* <div classNameName="col-xl-3 col-lg-6 col-12">
        <div classNameName="card" style={divStyles}>
          <div classNameName="card-content">
            <div classNameName="card-body">
              <div classNameName="media">
                <div classNameName="media-body text-left">
                  <h3 classNameName="mb-1 primary">278</h3>
                  <span>New Posts</span>
                </div>
                <div classNameName="media-right align-self-center">
                  <i classNameName="ft-book-open primary font-large-2 float-right"></i>
                </div>
              </div>
              <div classNameName="progress" style={{ height: "4px" }}>
                <div
                  classNameName="progress-bar bg-primary"
                  role="progressbar"
                  aria-valuenow="80"
                  aria-valuemin="80"
                  aria-valuemax="100"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default React.memo(List);
