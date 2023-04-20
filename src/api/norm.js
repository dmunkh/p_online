import { API } from "./request";

export async function getPosition(params) {
  const response = await API().get("/norm/position", {
    params: {
      ...params,
    },
  });
  return response.data;
}
export async function getPositionNormList(params) {
  const response = await API().get("/norm", {
    params: {
      ...params,
    },
  });
  return response.data;
}
