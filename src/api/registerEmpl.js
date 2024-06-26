import { API } from "./request";

export async function getLesson(params) {
  const response = await API().get("/lesson", {
    params: { ...params },
  });
  return response.data;
}

export async function getWorkers(params) {
  const response = await API().get("/register", {
    params: { ...params },
  });
  return response.data;
}
export async function postWorker(params) {
  const response = await API().post("/register", { ...params });
  return response.data;
}

export async function getPlanNot(params) {
  const response = await API().get("/plan/worker/not", {
    params: { ...params },
  });
  return response.data;
}
export async function putWorker(id, params) {
  const response = await API().put("/register/" + id, { ...params });
  return response.data;
}
export async function deleteWorker(id) {
  const response = await API().delete("/register/" + id);
  return response.data;
}

export async function postAttendance(params) {
  const response = await API().post("/register/attendance", { ...params });
  return response.data;
}

export async function getAtt(params) {
  const response = await API().get("/attendance", {
    params: { ...params },
  });
  return response.data;
}

export async function postAttendanceCard(params) {
  const response = await API().post("/register/attendance/card", { ...params });
  return response.data;
}
