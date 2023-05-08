import React, { useState } from "react";
import { useUserContext } from "src/contexts/userContext";
import { useReferenceContext } from "src/contexts/referenceContext";
import * as API from "src/api/request";

import { Input, Modal, Card } from "antd";

import _ from "lodash";

const Component = () => {
  const { message } = useUserContext();
  const { state, dispatch } = useReferenceContext();
  const [dataList, setDataList] = useState([]);
  const save = () => {
    var error = [];
    state.organization_name || error.push("Байгууллага:");
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
    } else if (state.organizationID === null) {
      API.postOrganization({
        organization_name: state.organization_name,
      })
        .then(() => {
          dispatch({
            type: "STATE",
            data: {
              refresh: state.refresh + 1,
            },
          });
          dispatch({
            type: "STATE",
            data: { organizationID: null, organization_name: "" },
          });
          dispatch({ type: "STATE", data: { modal1: false } });

          message({ type: "success", title: "Амжилттай хадгалагдлаа" });
          dispatch({ type: "STATE", data: { refresh: state.refresh + 1 } });
        })
        .catch((error) => {
          message({
            type: "error",
            error,
            title: error.response.data.msg,
          });
        });
    } else {
      API.putOrganization(state.organizationID, {
        organization_name: state.organization_name,
      })
        .then(() => {
          dispatch({
            type: "STATE",
            data: {
              refresh: state.refresh + 1,
            },
          });
          dispatch({ type: "STATE", data: { modal1: false } });
          message({ type: "success", title: "Амжилттай хадгалагдлаа" });
          dispatch({ type: "STATE", data: { refresh: state.refresh + 1 } });
        })
        .catch((error) => {
          message({
            type: "error",
            error,
            title: error.response.data.msg,
          });
        });
    }
  };
  const onInputChange = async (e) => {
    const newOrganizationName = e.target.value;
    dispatch({
      type: "STATE",
      data: { organization_name: e.target.value },
    });
    await setDataList(
      _.filter(state.list_organization, (a) =>
        _.includes(
          _.toLower(a.organization_name),
          _.toLower(newOrganizationName)
        )
      )
    );
  };

  return (
    <>
      <Modal
        centered
        width={700}
        title={
          <div className="text-center">
            Байгууллага
            {state.organizationID ? " нэр засварлах " : " бүртгэх "} цонх
          </div>
        }
        visible={state.modal1}
        onCancel={() => {
          dispatch({
            type: "STATE",
            data: { modal1: false },
          });
        }}
        footer={null}
      >
        <div className="flex flex-col justify-start text-xs">
          <span className="font-semibold pb-1">
            Байгууллагын нэр:<b className="ml-1 text-red-500">*</b>
          </span>
          <Input
            size="small"
            className="p-1 mb-2 w-full text-gray-900 border border-gray-200 rounded-sm"
            value={state.organization_name}
            onChange={onInputChange}
          />
          <Card
            className="overflow-auto"
            style={{
              height: "100px",
              width: "100%",
            }}
          >
            {dataList.length > 0 &&
              dataList.map((data) => {
                return <p
                key={data.id}>{data.organization_name}</p>;
              })}
          </Card>
        </div>

        <div className="my-3 border " />

        <button
          className="w-full py-2 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-md hover:bg-violet-500 hover:text-white focus:outline-none duration-300 text-xs"
          onClick={() => save()}
        >
          <i className="ft-save" />
          <span className="ml-2">Хадгалах</span>
        </button>
      </Modal>
    </>
  );
};

export default React.memo(Component);
