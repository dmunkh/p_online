import { API } from "./request";

export async function getLesson(params) {
  const response = await API().get("/lesson", {
    params: {
      ...params,
    },
  });
  return response.data;
}
export async function getLessonID(id) {
  const response = await API().get("/lesson/" + id);
  return response.data;
}
export async function putLesson(id, params) {
  const response = await API().put("/lesson/" + id, { ...params });
  return response.data;
}
export async function postLesson(params) {
  const response = await API().post("/lesson", params);
  return response.data;
}
export async function deleteLesson(id) {
  const response = await API().delete("/lesson/" + id);
  return response.data;
}

export async function getLessonTypeID(id) {
  const response = await API().get("/type/year/" + id);
  return response.data;
}
export async function getAttendanceID(params) {
  const response = await API().get("/attendance", {
    params: {
      ...params,
    },
  });
  return response.data;
}
export async function postAttendance(params) {
  const response = await API().post("/attendance", params);
  return response.data;
}
export async function putAttendance(id, params) {
  const response = await API().put("/attendance/" + id, { ...params });
  return response.data;
}
export async function deleteAttendance(id) {
  const response = await API().delete("/attendance/" + id);
  return response.data;
}
export async function getTypesYear(params) {
  const response = await API().get("/type/year", { params: { ...params } });
  return response.data;
}
export async function getReportPlan(params) {
  const response = await API().get("/report/plan/count", {
    params: { ...params },
  });
  return response.data;
}
export async function getReportPlanDep(params) {
  const response = await API().get("/report/plan/count/department", {
    params: { ...params },
  });
  return response.data;
}

export async function getReportRegister(params) {
  const response = await API().get("/register/report", {
    params: { ...params },
  });
  return response.data;
}
