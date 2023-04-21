import { API } from "src/api/request";

export async function getApprove(params) {
  const response = await API().get("plan/approve", { params: { ...params } });
  return response.data;
}

export async function postApprove(params) {
  const response = await API().post("plan/approve", { ...params });
  return response.data;
}
