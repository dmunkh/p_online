import { API } from "src/api/request";

export async function getPlanYear(params) {
  const response = await API().get("type/year", { params: { ...params } });
  return response.data;
}

export async function getPlan(params) {
  const response = await API().get("plan", { params: { ...params } });
  return response.data;
}

export async function getPlanNot(params) {
  const response = await API().get("/plan/worker/not", {
    params: { ...params },
  });
  return response.data;
}
export async function getPlanWorker(params) {
  const response = await API().get("/plan/worker", {
    params: {
      ...params,
    },
  });
  return response.data;
}

export async function postPlanWorker(params) {
  const response = await API().post("/plan/worker", {
    ...params,
  });
  return response.data;
}
export async function deletePlanWorker(id) {
  const response = await API().delete("/plan/worker/" + id);
  return response.data;
}

export async function postPlanApprove(params) {
  const response = await API().post("/plan/approve", {
    ...params,
  });
  return response.data;
}

export async function getPlanApprove(params) {
  const response = await API().get("/plan/approve", {
    params: {
      ...params,
    },
  });
  return response.data;
}
