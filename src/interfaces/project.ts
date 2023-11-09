export enum EProjectStatus {
  Open = 1,
  Close = 2,
}

export enum EProjectPrivacyStatusLabel {
  Public = "Public",
  Private = "Private",
}

export interface ICreateProjectPayload {
  projectName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  projectStatus: EProjectStatus;
  privacyStatus: boolean;
}

export interface IUpdatePrivacyProjectPayload {
  id: string;
  privacyStatus: boolean;
}

export interface IUpdateInfoProjectPayload {
  id: string;
  data: Partial<ICreateProjectPayload>;
}

export interface ICreateMemberRolePayload {
  roleName: string;
  description: string;
}

export interface IUpdateMemberRolePayload {
  id: string;
  data: {
    roleId: string;
  };
}

export interface IProject {
  projectId: string;
  projectName: string;
  description: string;
  projectStatus: EProjectStatus;
  startDate: string;
  endDate: string;
  createBy: string;
  createAt: string;
  deleteAt: string | null;
  expireAt: string | null;
  privacyStatus: boolean;
  projectMembers: IProjectMember[];
}

export interface IProjectMember {
  memberId: string;
  userId: string;
  roleId: string;
  projectId: string;
  roleName: string | null;
  isOwner: boolean;
}

export interface IAdminProject {
  projectId: string;
  projectName: string;
  description: string;
  projectStatus: string;
  startDate: Date;
  endDate: Date;
  manager: {
    userId: string;
    userName: string;
    email: string;
    phoneNumber: string;
    statusName: string;
    isAdmin: boolean;
    address: string;
    dob: Date | null;
  };
  member: [
    {
      userId: string;
      userName: string;
      email: string;
      phoneNumber: string;
      statusName: string;
      isAdmin: boolean;
      address: string;
      dob: Date | null;
    },
  ];
  createAt: Date;
  deleteAt: null;
  expireAt: null;
  privacyStatus: boolean;
  pagination: null;
}

export interface IAdminProjectAnalyzation {
  projectActive: number;
  projectActivePercent: number;
  projectDelete: number;
  projectDeletePercent: number;
  projectInActive: number;
  projectInActivePercent: number;
  totalProject: number;
}

export interface IAdminUserProjectList {
  projectId: string;
  projectName: string;
  description: string;
  projectStatus: string;
  manager: {
    userId: string;
    userName: string;
    email: string;
    phoneNumber: string;
    statusName: string;
    isAdmin: boolean;
    address: string;
    dob: Date | null;
  };
  startDate: Date;
}