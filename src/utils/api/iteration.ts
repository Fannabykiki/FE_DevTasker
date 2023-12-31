import {
  ICreateIterationPayload,
  IIteration,
  IUpdateIterationPayload,
} from "@/interfaces/iteration";
import { HTTP_METHODS } from "../constants";
import axiosClient from "./axios-client";

const create = async (data: ICreateIterationPayload) =>
  axiosClient({
    url: `/api/Interation-management/Interation`,
    method: HTTP_METHODS.POST,
    data,
  }).then((resp) => resp.data);

const update = (data: IUpdateIterationPayload): Promise<any[]> =>
  axiosClient({
    url: `/api/Interation-management/Interation`,
    method: HTTP_METHODS.PUT,
    data,
  }).then((resp) => resp.data);

const getList = (
  signal: AbortSignal | undefined,
  projectId: string
): Promise<IIteration[]> =>
  axiosClient({
    url: `/api/Interation-management/Interation/${projectId}`,
    method: HTTP_METHODS.GET,
    signal,
  }).then((resp) => resp.data);

const getTasks = (
  signal: AbortSignal | undefined,
  iterationId: string
): Promise<IIteration> =>
  axiosClient({
    url: `/api/Interation-management/Interation/tasks/${iterationId}`,
    method: HTTP_METHODS.GET,
    signal,
  }).then((resp) => resp.data);

export const iterationApi = {
  create,
  createKey: "iterationCreate",
  update,
  updateKey: "iterationUpdate",
  getList,
  getListKey: "iterationGetList",
  getTasks,
  getTasksKey: "iterationGetTasks",
};
