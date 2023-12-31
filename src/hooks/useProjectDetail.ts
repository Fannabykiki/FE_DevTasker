import { paths } from "@/routers/paths";
import { iterationApi } from "@/utils/api/iteration";
import { projectApi } from "@/utils/api/project";
import { taskApi } from "@/utils/api/task";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function useProjectDetail(projectId: string | undefined) {
  const navigate = useNavigate();

  const {
    data: detail,
    isLoading: isGettingDetail,
    refetch: refetchDetail,
  } = useQuery({
    queryKey: [projectApi.getInfoKey, projectId],
    queryFn: async ({ signal }) => {
      const data = await projectApi.getInfo(signal, projectId!);

      if (data.projectStatus === "Deleted") {
        navigate(paths.user);
        toast.error("Project has deleted");
      }

      return data;
    },
    enabled: Boolean(projectId),
  });

  const {
    data: iterations,
    refetch: refetchIterations,
    isLoading: isGettingIterations,
  } = useQuery({
    queryKey: [iterationApi.getListKey, projectId],
    queryFn: ({ signal }) => iterationApi.getList(signal, projectId!),
    enabled: Boolean(projectId),
    placeholderData: [],
  });

  const { data: kanbanTasks } = useQuery({
    queryKey: [taskApi.getKanbanTasksKey, projectId],
    queryFn: ({ signal }) => taskApi.getKanbanTasks(signal, projectId!),
    enabled: Boolean(projectId),
    placeholderData: [],
  });

  const { data: memberList } = useQuery({
    queryKey: [projectApi.getListUserInProjectByProjectIdKey, projectId],
    queryFn: async ({ signal }) =>
      projectApi.getListUserInProjectByProjectId(signal, projectId),
    enabled: Boolean(projectId),
  });

  const { mutate: updatePrivacyStatus, isLoading: isUpdatingPrivacyStatus } =
    useMutation({
      mutationKey: [projectApi.updatePrivacyKey],
      mutationFn: projectApi.updatePrivacy,
    });

  return {
    detail,
    iterations,
    memberList,
    kanbanTasks,
    actions: {
      isGettingDetail,
      updatePrivacyStatus,
      isUpdatingPrivacyStatus,
      refetchDetail,
      refetchIterations,
      isGettingIterations,
    },
  };
}
