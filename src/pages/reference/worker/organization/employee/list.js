import React, { useState, useEffect, useLayoutEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import * as API from "src/api/request";
import { useUserContext } from "src/contexts/userContext";
import { useReferenceContext } from "src/contexts/referenceContext";
import Modal from "./modal";

import Swal from "sweetalert2";
import _ from "lodash";

export default function Employee({ data }) {
  const { message, checkRole } = useUserContext();
  const { state, dispatch } = useReferenceContext();
  const [empList, setEmpList] = useState([]);
  const [search, setSearch] = useState("");
  useLayoutEffect(() => {
    API.getPerson()
      .then(async (res) => {
        await setEmpList(_.filter(res, { organization_id: data.id }));
      })
      .catch((error) => {
        dispatch({
          type: "STATE",
          data: {
            list_employee: [],
          },
        });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refresh]);
  //
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
        API.deletePerson(item.id)
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
              title: "Ажлын байр устгаж чадсангүй",
            });
          });
      }
    });
  };
  const updateItem = (item) => {
    dispatch({
      type: "STATE",
      data: { selected_employee: item },
    });
    dispatch({
      type: "STATE",
      data: { modal: true },
    });

    console.log(state.modal);
  };   
  const header = (
    <div className="flex  md:justify-end gap-2 ">
      {/* <Input
        placeholder="Хайх..."
        prefix={<SearchOutlined />}
        className="md:w-1/5 w-2/5 rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      /> */}
      {checkRole(["person_add"]) && (
        <div className="mt-1">
          <div
            title="Ажилтан нэмэх"
            className="p-1 text-xs flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-full hover:bg-violet-500 hover:text-white hover:scale-125 focus:outline-none duration-300 cursor-pointer mr-6"
            onClick={() => {
              dispatch({
                type: "CLEAR_EMPLOYEE",
              });
              dispatch({
                type:"STATE",
                data:{
                  selected_employee:{
                    organization_id: data.organization_id
                  }
                }
              })
              dispatch({
                type: "STATE",
                data: { modal: true },
              });
            }}
          >
            <i className="ft-plus" />
          </div>
        </div>
      )}
    </div>
  );
  if (search) {
    empList = _.filter(empList, (a) =>
      _.includes(_.toLower(a.short_name), _.toLower(search))
    );
  }
  return (
    <div className="w-full p-1">
      <div className="flex justify-between mr-5 pb-3 ">
        <h5 className=" text-sm font-semibold">{data.organization_name}</h5>
      </div>
      <DataTable
        dataKey="id"
        size="small"
        stripedRows
        showGridlines
        className="w-full "
        sortMode="single"
        removableSort
        responsiveLayout="scroll"
        header={header}
        value={empList}
        emptyMessage={
          <div className="text-xs text-orange-500 italic font-semibold">
            Мэдээлэл олдсонгүй...
          </div>
        }
      >
        <Column
          header="№"
          align="center"
          className="text-xs "
          body={(data, row) => row.rowIndex + 1}
        />
        <Column
          field="organization_name"
          style={{ minWidth: "150px", maxWidth: "400px" }}
          className="text-xs "
          header="Байгууллагын нэр"
          sortable
        ></Column>
        <Column
          field="short_name"
          className="text-xs"
          header="Нэр"
          sortable
        ></Column>
        <Column
          field="position_name"
          style={{ minWidth: "150px", maxWidth: "400px" }}
          className="text-xs"
          header="Албан тушаал"
          sortable
        ></Column>

        <Column
          field="register_number"
          className="text-xs "
          header="Регистерийн дугаар"
          sortable
        ></Column>
        <Column
          align="center"
          header="Үйлдэл"
          className="text-xs"
          style={{ width: "10rem" }}
          body={(item) => {
            return (
              <div className="flex items-center justify-center gap-2">
                {checkRole(["person_edit"]) && (
                  <button
                  className="p-1 flex items-center justify-center font-semibold text-yellow-500 rounded-full border-2 border-yellow-500 hover:bg-yellow-500 hover:scale-125 hover:text-white focus:outline-none duration-300"
                    onClick={() => updateItem(item)}
                  >
                    <i className="ft-edit" />
                  </button>
                )}

                {checkRole(["person_delete"]) && (
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
      <Modal />
    </div>
  );
}
