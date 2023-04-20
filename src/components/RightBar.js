import React from "react";
import { DatePicker,Space } from "antd";
// import { useFormState } from "../contexts/FormContext";
const RightBar = (props) => {
  // d-none d-sm-none d-md-block
// const{state, dispatch}=useFormState();
  return (
    <aside
      className={
        props.rightbar ? "notification-sidebar open" : "notification-sidebar"
      }
      id="notification-sidebar"
    >
      <a
        className="notification-sidebar-close"
        href="/"
        onClick={(e) => {
          e.preventDefault();
          props.rightbarToggle();
        }}
      >
        <i className="ft-x font-medium-3 grey darken-1" />
      </a>
      <div className="side-nav notification-sidebar-content">
        <div className="row">
       <div className={"flex-auto items-center justify-between divide-y-2 mx-8 divide-slate-400/25"}>
            <div className="flex justify-center">
              <p className="text-base font-semibold py-2">Шүүлтүүр</p>
            </div>
            <div className="col-12 notification-tab-content scrollbar py-2 px-2.9 ">
              <div className="my-2">
                <Space
                  direction="vertical"
                  style={{
                    width: "100%",
                  }}
                >
                  <p className="font-semibold">Эхлэх огноо</p>
                  <DatePicker
                    size="large"
                    style={{
                      width: "100%",
                    }}
                  />
                  <p className="font-semibold">Дуусах огноо</p>
                  <DatePicker
                    size="large"
                    style={{
                      width: "100%",
                    }}
                  />
                </Space>
                <div className="my-3 text-base font-medium text-gray-900 ">
                  Бүлэг
                </div>
                <select
                  id="countries"
                  placeholder="Бүлэг сонгоно уу"
                  defaultValue={"null"}
                  className="bg-white drop-shadow-xl border text-gray-900 text rounded-lg focus:ring-gray-200 focus:border-gray-200 block w-full p-3"
                >
                  <option value="null">Бүлэг сонгоно уу</option>
                  <option value="US">Ажилтан</option>
                  <option value="CA">Ахмад</option>
                  <option value="FR">МШӨ</option>
                </select>

                <div className="my-3 text-base font-medium text-gray-900 ">
                  Төрөл
                </div>
                <select
                  id="countries"
                  placeholder="Төрөл сонгоно уу"
                  defaultValue={"null"}
                  className="bg-white drop-shadow-xl border text-gray-900 text rounded-lg focus:ring-gray-200 focus:border-gray-200 block w-full p-3"
                >
                  <option value="null">Бүлэг сонгоно уу</option>
                  <option value="US">Ажилтан</option>
                  <option value="CA">Ахмад</option>
                  <option value="FR">МШӨ</option>
                </select>
                <div className=" flex-auto items-center justify-between divide-y-2  divide-slate-400/25 ">
                  <div className="my-5  text-base font-medium text-gray-900">
                    <p>Хайлт</p>
                    <input
                      type="text"
                      id="base-input"
                      placeholder="Бүртгэлийн дугаар эсвэл Регистер"
                      className="bg-white  mt-3 border drop-shadow-xl border-gray-100 text-gray-500 text-base  rounded-lg  h-10 w-full p-3"
                    />
                  </div>

                  <div>
                    <div className="flex justify-center my-3 ">
                      <button
                        className="bg-[#116f98] w-full h-10 md:mt-2 rounded-lg text-white font-bold"
                        onClick={(e) => {
                          e.preventDefault();
                          props.rightbarToggle();
                        }}
                      >
                        Хайх
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <button
                        className="bg-red-500 w-full h-10 rounded-lg text-white font-bold"
                        onClick={(e) => {
                          e.preventDefault();
                          props.rightbarToggle();
                        }}
                      >
                        Хаах
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div></div>

        
        </div>
 
    </aside>
  );
};

export default React.memo(RightBar);
