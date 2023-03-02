import axios from "axios";
import Swal from "sweetalert2";

export function API() {
  const headers = {
    "Content-Type": "application/json,",
  };
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token != null) {
    Object.assign(headers, {
      Authorization: "SSO " + token,
    });
  }
  const api = axios.create({
    baseURL: "https://training.erdenetmc.mn/api/",
    timeout: 200000,
    headers,
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error === undefined || error.response === undefined) {
        Swal.fire({
          title: "Сервистэй холбогдсонгүй.",
          icon: "error",
          //timer: 3000,
        });
      } else {
        if (error.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("menuID");
          localStorage.removeItem("menuName");
          window.location.replace("/");
        }
      }
      throw error;
    }
  );
  return api;
}

export async function getUserInfo() {
  const response = await API().get("/user/info");
  return response.data;
}

export async function logOut() {
  const response = await API().get("/logout");
  return response.data;
}
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