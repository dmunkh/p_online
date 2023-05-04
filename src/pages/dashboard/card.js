import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import * as API from "src/api/request";
import { useUserContext } from "src/contexts/userContext";
import DepartmentTseh from "src/components/custom/departmentTseh";

import { Chart } from "primereact/chart";
import { Tag } from "primereact/tag";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";

import _ from "lodash";

const Card = () => {
  const { message } = useUserContext();
  const yearFormat = "YYYY";
  const [date, setDate] = useState(moment(Date.now()).format("YYYY"));
  const [tseh, setTseh] = useState(0);
  const [data, setData] = useState();
  const [count, setCount] = useState();
  const [module_name, setModule_name] = useState();
  const [count_unique, setCount_unique] = useState();
  const [modul, setModule] = useState(1);
  const [modulename, setModuleName] = useState("ХЭМАБ");
  const [barData1, setBarData1] = useState();
  const [barData2, setBarData2] = useState();
  const [barLabels, setBarLabels] = useState();

  useLayoutEffect(() => {
    API.getControlPanel({ year: date, department_id: tseh })
      .then(async (res) => {
        const lebel = [];
        const chartsdata = [];
        const labelcount = [];
        if (res.length > 0) {
          await res.map((el) => {
            // eslint-disable-next-line no-sequences
            lebel.push(el.count_all === 0 ? 0.0001 : el.count_all);
            chartsdata.push(el.module_name);
            labelcount.push(el.count_unique === 0 ? 0.0001 : el.count_unique);
            return true;
          });

          setCount(lebel);
          setModule_name(chartsdata);
          setCount_unique(labelcount);
        } else {
        }

        setData(res);
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Жагсаалт татаж чадсангүй",
        });
      }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, tseh]);
  useLayoutEffect(() => {
    API.getControlDepartment({
      module_id: modul,
      year: date,
      department_id: tseh,
    })
      .then(async (res) => {
        const chartsdata1 = [];
        const chartsdata2 = [];
        const labels = [];
        if (res.length > 0) {
          await res.map((el) => {
            console.log(el);
            // eslint-disable-next-line no-sequences
            labels.push(_.concat(el.count_all, el.departmentname));
            chartsdata1.push(el.count_all === 0 ? 5 : el.count_all);
            chartsdata2.push(el.count_unique === 0 ? 5 : el.count_unique);

            return true;
          });

          setBarData1(chartsdata1);
          setBarData2(chartsdata2);
          setBarLabels(labels);
        } else {
          setBarData1([0.0001]);
          setBarData2([0.0001]);
          setBarLabels([""]);
        }
      })
      .catch((error) => {
        message({
          type: "error",
          error,
          title: "Жагсаалт татаж чадсангүй",
        });
      }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, tseh, modul]);
  const cards = useMemo(() => {
    return (
      <div className=" md:grid grid-cols-5 gap-5 mb-4 ">
        {_.map(data, (item) => (
          <div
            className=" mt-4 "
            key={item.id}
            onClick={() => {
              setModule(item.id);
              setModuleName(item.module_name);
            }}
          >
            <div className=" cursor-pointer group flex flex-col justify-between  rounded-xl bg-white p-4 shadow-xl transition-shadow   border border-gray-100 hover:scale-110">
              <div className="w-full mt-2 inline-flex items-center gap-2 text-bold text-lg text-blue-400  ">
                <p className="font-medium  w-full"> {item.module_name}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-w-full transition-all group-hover:ms-3 rtl:rotate-180 animated-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              <div className="mt-4 border-t-2 border-blue-100 py-2">
                <div className="flex justify-center items-center gap-2 ">
                  <p className="text-sm font-bold uppercase text-gray-600">
                    Нийт:
                  </p>
                  <h3 className="text-2xl font-bold text-[#14b8a6] hover:scale-110 ">
                    {item.count_all}
                  </h3>
                </div>
                <div className="flex justify-center items-center gap-2">
                  <p className="text-sm font-semi-bold uppercase text-gray-600">
                    Ажилтнуудын тоо :
                  </p>
                  <h3 className="text-xl font-bold text-gray-600 hover:scale-110">
                    {item.count_unique}
                  </h3>
                </div>
              </div>
            </div>

            {/* <p className="text-xs whitespace-pre-wrap  font-medium text-gray-500">
                Сургалтанд хамрагдах ажилтнууд :
              </p> */}
          </div>
        ))}
      </div>
    );
  });

  const donut1 = useMemo(() => {
    return (
      <div className="card  p-4">
        <div className="w-full inline-flex items-center gap-2 text-bold  text-emerald-600">
          <Tag
            className="mr-2 uppercase px-3"
            severity="success"
            icon="pi pi-chart-line"
            value="Нийт"
          ></Tag>
        </div>
        <div className="mt-2 border-t-2 border-blue-100 py-2"></div>
        <Chart
          type="doughnut"
          data={{
            labels: module_name,
            datasets: [
              {
                data: count,
                backgroundColor: [
                  "#64B5F6",
                  "#1976D2",
                  "#818cf8",
                  "#FFD54F",
                  "#14b8a6",
                ],
                valueTemplate: count,
              },
            ],
          }}
          className="w-full "
        />
      </div>
    );
  });
  const donut2 = useMemo(() => {
    return (
      <div className="card  p-4 ">
        <div className="w-full  inline-flex items-center gap-2 text-red-500   ">
          <Tag severity="warning" value="Ажилтнуудын тоо" icon="pi pi-check" className="px-3 uppercase"></Tag>
        </div>
        <div className="mt-2 border-t-2 border-blue-100 py-2"></div>
        <Chart
          type="doughnut"
          data={{
            labels: module_name,
            datasets: [
              {
                data: count_unique,
                backgroundColor: [
                  "#64B5F6",
                  "#1976D2",
                  "#818cf8",
                  "#FFD54F",
                  "#14b8a6",
                ],
              },
            ],
          }}
          className="w-full "
        />
      </div>
    );
  });
  const barchart = useMemo(() => {
    return (
      <div className="card  p-4">
        <div className="w-full inline-flex items-center gap-2 text-bold  ">
          <Tag severity="info" value={modulename} className="uppercase px-5"></Tag>
        </div>
        <div className="mt-2 border-t-2 border-blue-100 py-2 "></div>
        <Chart
          className="p-2"
          type="bar"
          data={{
            labels: barLabels,
            datasets: [
              {
                label: "Нийт",
                backgroundColor: ["#38bdf8"],
                borderColor: ["#38bdf8"],
                data: barData1,
              },
              {
                label: "Ажилтнуудын тоо",
                backgroundColor: ["#14b8a6"],
                borderColor: ["#14b8a6"],
                data: barData2,
              },
            ],
          }}
        />
      </div>
    );
  });
  return (
    <div className="md:px-20">
      <div className="card ">
        <div className="md:w-1/3 md:flex justify-start gap-5 p-3 ">
          <DatePicker
            size="large"
            defaultValue={dayjs(date, yearFormat)}
            format={yearFormat}
            picker="year"
            className="h-9 w-full "
            onChange={(e) => {
              setDate(e.$y);
            }}
          />
          <DepartmentTseh
            value={tseh}
            onChange={(value) => {
              setTseh(value);
            }}
          />
        </div>
      </div>
      {cards}
      <div className="md:grid grid-cols-4 gap-5 pb-4">
        {donut1}
        {donut2}
        <div className="col-span-2"> {barchart}</div>
      </div>
    </div>
  );
};

export default React.memo(Card);
