import React, { useState } from "react";
import { useFormState } from "../../contexts/formContext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

import Swal from "sweetalert2";
const Worker = () => {
    const [show, setShow] = useState(false);
    const customers = [
        {
          id: 1000,
          name: "FIBO",
          idpassword: "RS111111111",
          fullname: "Бат Дорж",
          date: "",
          employee: "",
          status: "Тийм",
        },
        {
            id: 1000,
            name: "FIBO",
            idpassword: "RS111111111",
            fullname: "Бат Дорж",
            date: "",
            employee: "",
            status: "Тийм",
          },
          {
            id: 1000,
            name: "FIBO",
            idpassword: "RS111111111",
            fullname: "Бат Дорж",
            date: "",
            employee: "",
            status: "Тийм",
          },
       
      ];
    
    const Table = () => {
        const { dispatch } = useFormState();
        const [filters3, setFilters3] = useState({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          name: {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
          },
          "country.name": {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
          },
          representative: { value: null, matchMode: FilterMatchMode.IN },
          status: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
          },
        });
    
        const [selectedCustomer3, setSelectedCustomer3] = useState(null);
    
        const filtersMap = {
          filters3: { value: filters3, callback: setFilters3 },
        };
    
        // eslint-disable-line react-hooks/exhaustive-deps
    
        const onCustomSaveState = (state) => {
          sessionStorage.setItem("dt-state-demo-custom", JSON.stringify(state));
        };
    
        const onCustomRestoreState = () => {
          return JSON.parse(sessionStorage.getItem("dt-state-demo-custom"));
        };
    
        const statusBodyTemplate = (rowData) => {
          return (
            <span className={`customer-badge status-${rowData.status}`}>
              {rowData.status}
            </span>
          );
        };
    
        const onGlobalFilterChange = (event, filtersKey) => {
          const value = event.target.value;
          let filters = { ...filtersMap[filtersKey].value };
          filters["global"].value = value;
    
          filtersMap[filtersKey].callback(filters);
        };
    
        const renderHeader = (filtersKey) => {
          const filters = filtersMap[`${filtersKey}`].value;
          const value = filters["global"] ? filters["global"].value : "";
    
          return (
            <div className="md:flex items-center justify-between mx-2">
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  className="h-10 "
                  type="search"
                  value={value || ""}
                  onChange={(e) => onGlobalFilterChange(e, filtersKey)}
                  placeholder="Хайлт хийх..."
                />
              </span>
        
            </div>
          );
        };
    
        const header3 = renderHeader("filters3");
    
        return (

            <DataTable
              className=""
              value={customers}
              paginator
              rows={10}
              size="small"
              header={header3}
              showGridlines
              filters={filters3}
              onFilter={(e) => setFilters3(e.filters)}
  
              selectionMode="single"
              dataKey="id"
              responsiveLayout="scroll"
              stateStorage="custom"
              customSaveState={onCustomSaveState}
              customRestoreState={onCustomRestoreState}
              emptyMessage="No customers found."
            >
              <Column
                field=""
                header="№"
                style={{ width: "5%" }}
                body={(data, row) => {
                  return row.rowIndex + 1;
                }}
              ></Column>
              <Column field="name" header="Байгууллага" sortable></Column>
              <Column field="idpassword" header="Регистер" sortable></Column>
              <Column field="fullname" header="Овог нэр" sortable></Column>
              <Column field="position" header="Албан тушаал"></Column>
              <Column
                field="date"
                header="Бүртгэсэн огноо"
                sortable
              ></Column>
              <Column field="employee" header="Бүртгэсэн хэрэглэгч" sortable></Column>
              <Column
                field="status"
                header="Төлөв"
                style={{ width: "10%" }}
                body={statusBodyTemplate}
                sortable
              ></Column>
    
              <Column
                header="Үйлдэл"
                style={{ width: "6%" }}
                body={(customers, row) => {
                  return (
                    <div className="flex justify-between">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-red-500"
                        onClick={() => {
                          Swal.fire({
                            title: "Та устгахдаа итгэлтэй байна уу?",
                            icon: "question",
                            showDenyButton: true,
                            confirmButtonColor: "#1890ff",
                            confirmButtonText: "Тийм",
                            denyButtonText: "Үгүй",
                            customClass: {
                              actions: "my-actions",
                              cancelButton: "order-1 right-gap",
                              confirmButton: "order-2",
                              denyButton: "order-3",
                            },
                          }).then((result) => {
                            if (result.isConfirmed) {
                              Swal.fire("Амжилттай усгагдлаа.", "", "success");
                            } else if (result.isDenied) {
                              Swal.fire("Устгаж чадсангүй", "", "info");
                            }
                          });
                        }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                          clipRule="evenodd"
                        />
                      </svg>
    
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 "
                        onClick={() => {
                          setShow(true);
                          dispatch({
                            type: "CHANGE_FORM",
                            data: {
                              id: customers.id,
                              name: customers.name,
                            },
                          });
                        }}
                      >
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                    </div>
                  );
                }}
              ></Column>
            </DataTable>
          
        );
      };
  return (
    <div className="md:flex justify-between  gap-5 ">
      <div className="card flex justify-center rounded-md p-5 md:w-1/3">
        <div className=" flex-auto divide-y-2 divide-gray-100 ">
          <div>
            <p className="font-medium ">Шүүх хэсэг</p>
          </div>
          <div className="">
            <p className=" whitespace-nowrap mt-2  ">Бүтцийн нэгж :</p>
            <select
              id="countries"
              placeholder="Өргөдлийн төрлөө сонгоно уу"
              defaultValue={"null"}
              className="bg-white border border-gray-50  drop-shadow-xl  text-gray-800  rounded-lg block w-full p-2 "
            >
              <option value="null">Сонгоно уу</option>
              <option value="US">Ажилтан</option>
              <option value="CA">Ахмад</option>
              <option value="FR">МШӨ</option>
            </select>

            <p className="mt-2">Чиглэл</p>
            <select
              id="countries"
              placeholder="Өргөдлийн төрлөө сонгоно уу"
              defaultValue={"null"}
              className="bg-white border border-gray-50 drop-shadow-xl  text-gray-500  rounded-lg  block w-full p-2"
            >
              <option value="null">Сонгоно уу</option>
              <option value="US">Ажилтан</option>
              <option value="CA">Ахмад</option>
              <option value="FR">МШӨ</option>
            </select>
            <p className="  mt-2">Он</p>
            <select
              id="countries"
              placeholder="Өргөдлийн төрлөө сонгоно уу"
              defaultValue={"null"}
              className="bg-white border border-gray-50  drop-shadow-xl  text-gray-500  rounded-lgblock w-full p-2"
            >
              <option value="null">Сонгоно уу</option>
              <option value="US">Ажилтан</option>
              <option value="CA">Ахмад</option>
              <option value="FR">МШӨ</option>
            </select>
            <p className="  mt-2">Төрөл</p>
            <select
              id="countries"
              placeholder="Өргөдлийн төрлөө сонгоно уу"
              defaultValue={"null"}
              className="bg-white border border-gray-50 drop-shadow-xl  text-gray-500  rounded-lg block w-full p-2"
            >
              <option value="null">Сонгоно уу</option>
              <option value="US">Ажилтан</option>
              <option value="CA">Ахмад</option>
              <option value="FR">МШӨ</option>
            </select>
            <p className="  mt-2">Огноо</p>
            <select
              id="countries"
              placeholder="Өргөдлийн төрлөө сонгоно уу"
              defaultValue={"null"}
              className="bg-white border border-gray-50  drop-shadow-xl  text-gray-500  rounded-lg block w-full p-2"
            >
              <option value="null">Сонгоно уу</option>
              <option value="US">Ажилтан</option>
              <option value="CA">Ахмад</option>
              <option value="FR">МШӨ</option>
            </select>
            <p className="  mt-2">Тэнцсэн эсэх</p>
            <select
              id="countries"
              placeholder="Өргөдлийн төрлөө сонгоно уу"
              defaultValue={"null"}
              className="bg-white border border-gray-50  drop-shadow-xl  text-gray-500 text rounded-lg block w-full p-2"
            >
              <option value="null">Сонгоно уу</option>
              <option value="US">Ажилтан</option>
              <option value="CA">Ахмад</option>
              <option value="FR">МШӨ</option>
            </select>
            <p className="  mt-2">Давтан эсэх</p>
            <select
              id="countries"
              placeholder="Өргөдлийн төрлөө сонгоно уу"
              defaultValue={"null"}
              className="bg-white border border-gray-50  drop-shadow-xl  text-gray-500 text rounded-lg block w-full p-2"
            >
              <option value="null">Сонгоно уу</option>
              <option value="US">Ажилтан</option>
              <option value="CA">Ахмад</option>
              <option value="FR">МШӨ</option>
            </select>
          </div>
        </div>
      </div>
      <div className="card flex  rounded-md p-5 w-full "><Table/></div>
    </div>
  );
};
export default React.memo(Worker);
