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
    baseURL: "https://training.erdenetmc.mn/api",
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
export async function getAuth() {
  const response = await API().get("/auth");
  return response;
}
export async function postAuth(params) {
  const response = await API().post("/auth", { ...params });
  return response;
}

export async function logOut() {
  const response = await API().get("/logout");
  return response.data;
}
export async function getUserDepartment() {
  const response = await API().get("/user/department");
  return response.data;
}

//Танхим
export async function getPlaces() {
  const response = await API().get("/place");
  return response.data;
}
export async function getPlace(id) {
  const response = await API().get("/place/" + id);
  return response.data;
}
export async function postPlace(data) {
  const response = await API().post("/place", data);
  return response.data;
}
export async function putPlace(id, data) {
  const response = await API().put("/place/" + id, data);
  return response.data;
}
export async function deletePlace(id) {
  const response = await API().delete("/place/" + id);
  return response.data;
}

//Гадны байгууллага

export async function getOrganization() {
  const response = await API().get("/organization");
  return response.data;
}
export async function postOrganization(data) {
  const response = await API().post("/organization", data);
  return response.data;
}
export async function putOrganization(id, data) {
  const response = await API().put("/organization/" + id, data);
  return response.data;
}
export async function deleteOrganization(id) {
  const response = await API().delete("/organization/" + id);
  return response.data;
}
