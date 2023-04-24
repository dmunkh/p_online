import { API } from "./request";

export async function getLesson(params) {
  const response = await API().get("/lesson", {
    params: {
      ...params,
    },
  });
  return response.data;
}
export async function putLesson(id, data) {
  const response = await API().put("/lesson/" + id, data);
  return response.data;
}
export async function deleteLesson(id) {
  const response = await API().delete("/lesson/" + id);
  return response.data;
}
