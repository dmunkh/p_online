import { API } from "src/api/request";

export async function getLessonType() {
  const response = await API().get("ref/lesson/type");
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
