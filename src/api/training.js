import { API } from "./request";

export async function getLesson(params) {
  const response = await API().get("/lesson", {
    params: {
      ...params,
    },
  });
  return response.data;
}
