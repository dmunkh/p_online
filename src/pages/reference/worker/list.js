import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";


import { SearchOutlined } from "@ant-design/icons";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";

import { useUserContext } from "../../../contexts/userContext";
import { useReferenceContext } from "../../../contexts/referenceContext";
import * as API from "../../../api/request";
import _ from "lodash";
import Swal from "sweetalert2";

export default function List() {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useReferenceContext();
  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const toast = useRef(null);
  useEffect(() => {
    API.getOrganization()
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_organization: _.orderBy(res, ["id"], ),
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: "STATE",
          data: {
            list_organization: [],
          },
        });
      });
    console.log(state.list_organization);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);
  var tt = state.list_organization;
  useEffect(() => {
    API.getPerson()
      .then((res) => {
        dispatch({
          type: "STATE",
          data: {
            list_employee: res,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: "STATE",
          data: {
            list_employee: [],
          },
        });
      });
    console.log(state.list_employee);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);
  var person = state.list_employee;
  const onRowExpand = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Product Expanded",
      detail: event.data.name,
      life: 3000,
    });
  };

  const onRowCollapse = (event) => {
    toast.current.show({
      severity: "success",
      summary: "Product Collapsed",
      detail: event.data.name,
      life: 3000,
    });
  };

  const expandAll = () => {
    let _expandedRows = {};
console.log(
    person
)
    person.forEach((p) => (_expandedRows[`${p.organization_id}`] = true));

    setExpandedRows(_expandedRows);
    console.log(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const formatCurrency = (value) => {
    // return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return "";
  };

  const amountBodyTemplate = (rowData) => {
    return formatCurrency(rowData.amount);
  };

  const statusOrderBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.status.toLowerCase()}
        severity={getOrderSeverity(rowData)}
      ></Tag>
    );
  };

  const searchBodyTemplate = () => {
    return <Button icon="pi pi-search" />;
  };

  const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.price);
  };

  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.inventoryStatus}
        severity={getProductSeverity(rowData)}
      ></Tag>
    );
  };

  const getProductSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const getOrderSeverity = (order) => {
    switch (order.status) {
      case "DELIVERED":
        return "success";

      case "CANCELLED":
        return "danger";

      case "PENDING":
        return "warning";

      case "RETURNED":
        return "info";

      default:
        return null;
    }
  };

  const allowExpansion = (rowData) => {

    return rowData.id > 0;
  };

  const rowExpansionTemplate = (data) => {
    let grouped_data = _.groupBy(person, 'organization_id')
    setProducts(
      _.forEach(person, _.find(person, { }))
    );

    console.log(grouped_data);
    console.log(
        
    );

    return (
      <div className="p-1">
        <h5 className="pb-3 text-sm font-semibold">{data.organization_name} </h5>
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
        value={products}
       
        >
        <Column
          header="№"
          align="center"
          style={{ minWidth: "50px", maxWidth: "50px" }}
          className="text-xs "
          headerClassName="flex items-center justify-center"
          bodyClassName="flex items-center justify-center"
          body={(data, row) => row.rowIndex + 1}
        />
          <Column field="position_name"  style={{ minWidth: "400px", maxWidth: "400px" }} className="text-xs" header="Албан тушаал"   sortable></Column>
          <Column field="organization_name"  className="text-xs " header="Нэр" sortable></Column>
          <Column field="register_number" style={{ minWidth: "200px", maxWidth: "200px" }}   className="text-xs " header="Регистерийн дугаар"   sortable></Column>
          <Column
          align="center"
          header="Үйлдэл"
          className="text-xs"
          style={{ minWidth: "90px", maxWidth: "90px" }}
          headerClassName="flex items-center justify-center"
          body={(item) => {
            return (
              <div className="flex items-center justify-center gap-2">
                {checkRole(["person_edit"]) && (
                  <button
                    className="p-1 flex items-center justify-center font-semibold  rounded-full border-3 border-purple-400 bg-purple-500 hover:scale-125 text-white focus:outline-none duration-300"
                    // onClick={() => updateItem(item)}
                  >
                    <i className="ft-edit" />
                  </button>
                )}

                {checkRole(["person_delete"]) && (
                  <button
                    className="p-1 flex items-center justify-center font-semibold  rounded-full border-3 border-red-400 bg-red-500 hover:scale-125 text-white focus:outline-none duration-300"
                    // onClick={() => deleteItem(item)}
                  >
                    <i className="ft-trash-2" />
                  </button>
                )}
              </div>
            );
          }}
        />
        </DataTable>
      </div>
    );
  };

  const header = (
  
    
     <div className="flex flex-wrap justify-content-end gap-2">
    <Button size="small"  icon="pi pi-plus" label="Бүгдийг нээх" onClick={expandAll} text />
    <Button
      icon="pi pi-minus"
     
      label="Бүгдийг хаах"
      onClick={collapseAll}
      text
    />
  </div>
 
  );

  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable
       value={tt} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
       onRowExpand={onRowExpand} onRowCollapse={onRowCollapse} rowExpansionTemplate={rowExpansionTemplate}
       dataKey="id" header={header} tableStyle={{ minWidth: '60rem' }}
      
      >

<Column expander={allowExpansion} style={{ width: '5rem' }} />
    <Column field="organization_name" header="Name" sortable />
    <Column header="Үйлдэл" style={{ width: '10rem' }} body={(item) => {
            return (
              <div className="flex items-center justify-left gap-2">
                {checkRole(["person_edit"]) && (
                  <button
                    className="p-1 flex items-center justify-center font-semibold  rounded-full border-3 border-purple-400 bg-purple-500 hover:scale-125 text-white focus:outline-none duration-300"
                    // onClick={() => updateItem(item)}
                  >
                    <i className="ft-edit" />
                  </button>
                )}

                {checkRole(["person_delete"]) && (
                  <button
                    className="p-1 flex items-center justify-center font-semibold  rounded-full border-3 border-red-400 bg-red-500 hover:scale-125 text-white focus:outline-none duration-300"
                    // onClick={() => deleteItem(item)}
                  >
                    <i className="ft-trash-2" />
                  </button>
                )}
              </div>
            );
          }} />
      </DataTable>
    </div>
  );
}
