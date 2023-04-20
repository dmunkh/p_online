import { API } from "./request";

export async function getModule() {
  const response = await API().get("/module");
  return response.data;
}
export async function getInterval() {
  const response = await API().get("/interval");
  return response.data;
}

export async function getLessonType(params) {
  const response = await API().get("/type", {
    params: {
      ...params,
    },
  });
  return response.data;
}
export async function getLessonTypeID(id) {
  const response = await API().get("/type/" + id);
  return response.data;
}
export async function postLessonTypeID(params) {
  const response = await API().post("/type", { ...params });
  return response.data;
}
export async function putLessonTypeID(id, params) {
  const response = await API().put("/type/" + id, { ...params });
  return response.data;
}
export async function deleteLessonTypeID(id) {
  const response = await API().delete("/type/" + id);
  return response.data;
}

export async function getLessonPlace() {
  const response = await API().get("ref/lesson/place");
  return response.data;
}
export async function getLessonOrganization() {
  const response = await API().get("ref/lesson/organization");
  return response.data;
}
export async function getLessonEmployee() {
  const response = await API().get("ref/lesson/worker");
  return response.data;
}
export async function getLessonTypeYear() {
  const response = await API().get("ref/lesson/type/year");
  return response.data;
}
