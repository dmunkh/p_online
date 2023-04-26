import { API } from "src/api/request";

export async function getNormPosition(params) {
  const response = await API().get("norm/position", { params: { ...params } });
  return response.data;
}
export async function getNorm(params) {
  const response = await API().get("norm", { params: { ...params } });
  return response.data;
}

export async function postPostNormType(params) {
  const response = await API().post("norm", { ...params });
  return response.data;
}
export async function getModule() {
  const response = await API().get("module");
  return response.data;
}
export async function deleteNorm(params) {
  const response = await API().delete("norm", { params: { ...params } });
  return response.data;
}
