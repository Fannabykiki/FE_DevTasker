import { RoleInputType } from "@/features/Admin/RoleManagement/CreateEditRole";
import { HTTP_METHODS } from "../constants";
import axiosClient from "./axios-client";
import { IAdminRoles } from "@/interfaces/role";
import { IRoleByProjectId } from "@/interfaces/project";

const getAdminRoles = async (
  signal: AbortSignal | undefined,
  queryString: string
): Promise<IAdminRoles[]> =>
  axiosClient({
    url: "/api/role-management/system/roles" + queryString,
    method: HTTP_METHODS.GET,
    signal,
  }).then((resp) => resp.data);

const createRole = (data: RoleInputType) =>
  axiosClient({
    url: "/api/role-management/system/roles",
    method: HTTP_METHODS.POST,
    data,
  }).then((resp) => resp.data);

const updateRole = (data: RoleInputType) =>
  axiosClient({
    url: "/api/role-management/system/roles",
    method: HTTP_METHODS.PUT,
    data,
  }).then((resp) => resp.data);

const deleteRole = (id: string) =>
  axiosClient({
    url: `/api/role-management/system/roles/${id}`,
    method: HTTP_METHODS.DELETE,
  }).then((resp) => resp.data);

const getGrantListBySchemaId = ({
  data,
  schemaId,
}: {
  schemaId: string;
  data: {
    permissionIds: string[];
  };
}) =>
  axiosClient({
    url: `/api/role-management/permission/roles/grant/${schemaId}`,
    method: HTTP_METHODS.POST,
    data,
  }).then((resp) => resp.data);

const getRevokeListBySchemaId = ({
  data,
  schemaId,
}: {
  schemaId: string;
  data: {
    permissionIds: string[];
  };
}) =>
  axiosClient({
    url: `/api/role-management/permission/roles/revoke/${schemaId}`,
    method: HTTP_METHODS.POST,
    data,
  }).then((resp) => resp.data);

const getRolesByProjectId = (
  signal: AbortSignal | undefined,
  projectId: string
): Promise<IRoleByProjectId[]> =>
  axiosClient({
    url: `/api/role-management/project/roles/${projectId}`,
    method: HTTP_METHODS.GET,
    signal,
  }).then((resp) => resp.data);

export const roleApi = {
  getAdminRoles,
  getAdminRolesKey: "getAdminRolesKey",
  createRole,
  createRoleKey: "createRoleKey",
  updateRole,
  updateRoleKey: "updateRoleKey",
  deleteRole,
  deleteRoleKey: "deleteRoleKey",
  getGrantListBySchemaId,
  getGrantListBySchemaIdKey: "getGrantListBySchemaIdKey",
  getRevokeListBySchemaId,
  getRevokeListBySchemaIdKey: "getRevokeListBySchemaIdKey",
  getRolesByProjectId,
  getRolesByProjectIdKey: "getRolesByProjectIdKey",
};
