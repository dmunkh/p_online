import React from "react";
import * as API from "src/api/planhab";
import { useUserContext } from "src/contexts/userContext";
import { usePlanHabContext } from "src/contexts/planhabContext";
import Type from "src/components/custom/typeYear";
import moment from "moment";
import SaveButton from "src/components/button/SaveButton";

// import _ from "lodash";

const ModalNormDetail = () => {
  const { message } = useUserContext();
  const { state, dispatch } = usePlanHabContext();

  return (
    <div className="flex flex-col text-xs">
      <hr className="my-2" />

      <div className="flex items-center">
        <span className="w-1/3 font-semibold">
          Сургалтын төрөл:<b className="ml-1 text-red-500">*</b>
        </span>
        <Type
          year={moment(state.date).format("Y")}
          module_id={1}
          value={state.modaltypeid}
          onChange={(value) => {
            dispatch({ type: "STATE", data: { modaltypeid: value } });
          }}
        />
      </div>
      <SaveButton
        onClick={() => {
          if (state.modaltypeid !== null) {
            API.postPostNormType({
              department_id: state.department_id,
              position_id: state.position_id,
              type_id: state.modaltypeid,
            })
              .then((res) => {
                dispatch({
                  type: "STATE",
                  data: { refresh: state.refresh + 1, modaltypeid: null },
                });
              })
              .catch((error) =>
                message({
                  type: "error",
                  error,
                  title: "Хадгалж чадсангүй",
                })
              )
              .finally(() => {});
            dispatch({ type: "STATE", data: { modal: false } });
          } else {
            message({
              type: "error",
              title: "Сургалтын төрөл сонгоно уу",
            });
          }
        }}
      />

      {/* <hr className="my-2" />
      <button
        className="w-full py-2 flex items-center justify-center font-semibold text-violet-500 border-2 border-violet-500 rounded-md hover:bg-violet-500 hover:text-white focus:outline-none duration-300 "
        onClick={() => {
          if (state.modaltypeid !== null) {
            API.postPostNormType({
              department_id: state.department_id,
              position_id: state.position_id,
              type_id: state.modaltypeid,
            })
              .then((res) => {
                dispatch({
                  type: "STATE",
                  data: { refresh: state.refresh + 1, modaltypeid: null },
                });
              })
              .catch((error) =>
                message({
                  type: "error",
                  error,
                  title: "Хадгалж чадсангүй",
                })
              )
              .finally(() => {});
            dispatch({ type: "STATE", data: { modal: false } });
          } else {
            message({
              type: "error",
              title: "Сургалтын төрөл сонгоно уу",
            });
          }
        }}
      >
        <i className="ft-save" />
        <span className="ml-2">Хадгалах</span>
      </button> */}
    </div>
  );
};
export default React.memo(ModalNormDetail);
