import { API } from "./request";

export async function getLesson(params) {
  const response = await API().get("/lesson", {
    params: { year: 2023, module_id: 1 },
  });
  return response.data;
}

export async function getWorkers(params) {
  const response = await API().get("/register", {
    params: { ...params },
  });
  return response.data;
}
