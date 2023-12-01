import { ITask, ITaskStatus } from "@/interfaces/task";
import { taskApi } from "@/utils/api/task";
import { classNames } from "@/utils/common";
import { DATETIME_FORMAT, DATE_FORMAT } from "@/utils/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Modal,
  Row,
  Select,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import PriorityStatus from "./PriorityStatus";
import useTaskActions from "@/hooks/useTaskActions";
import { toast } from "react-toastify";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import useDetailView from "@/hooks/useDetailView";
import UpdateTask from "../Modal/UpdateTask";
import { iterationApi } from "@/utils/api/iteration";
import { IIteration } from "@/interfaces/iteration";
import AvatarWithColor from "../AvatarWithColor";
import UploadAttachment from "./UploadAttachment";
import AttachmentDisplay from "./AttachmentDisplay";
import { IProject } from "@/interfaces/project";
import { projectApi } from "@/utils/api/project";
import { useAuthContext } from "@/context/Auth";
import { useMemo, useState } from "react";
import CommentTab from "./CommentTab";
import HistoryTab from "./HistoryTab";

interface Props {
  taskId: string;
  isOpen: boolean;
  onClose: VoidFunction;
}

export default function TaskDetail({ taskId, isOpen, onClose }: Props) {
  const { data: task, refetch: refetchTaskDetail } = useQuery({
    queryKey: [taskApi.getDetailKey, taskId],
    queryFn: ({ signal }) => taskApi.getDetail(signal, taskId),
    enabled: Boolean(taskId),
  });

  const { projectId } = useParams();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("comment");

  const project: IProject | undefined = queryClient.getQueryData([
    projectApi.getInfoKey,
    projectId,
  ]);

  const { userInfo } = useAuthContext();

  const member = useMemo(() => {
    return project?.projectMembers.find((mem) => mem.userId === userInfo!.id);
  }, [userInfo, project]);

  const statusList = useMemo(
    () =>
      queryClient.getQueryData<ITaskStatus[]>([
        taskApi.getTaskStatusKey,
        projectId,
      ]) || [],
    [projectId, queryClient]
  );

  const { changeTaskStatusMutation, deleteTaskMutation } = useTaskActions();

  const onChangeTaskStatus = (statusId: string) => {
    changeTaskStatusMutation.mutate(
      {
        id: task!.taskId,
        statusId,
        memberId: member?.memberId || "",
      },
      {
        onSuccess: () => refetchTaskDetail(),
        onError: (err: any) => {
          console.error(err);
          toast.error("Update task status failed! Please try again later");
        },
      }
    );
  };

  const iterations: IIteration[] =
    queryClient.getQueryData([iterationApi.getListKey, projectId]) || [];

  const {
    onOpenView: handleOpenModalUpdate,
    onCloseView: handleCloseModalUpdate,
    openView: isModalUpdateOpen,
    detail: initTaskData,
  } = useDetailView<ITask>();

  const onUpdateTaskSuccess = async () => {
    await queryClient.invalidateQueries({
      queryKey: [taskApi.getDetailKey, taskId],
    });
    await queryClient.refetchQueries([taskApi.getDetailKey, taskId]);
  };

  const onDeleteTask = () => {
    if (task) {
      Modal.confirm({
        title: "Delete task",
        content: "Are you sure to delete this task?",
        onOk: () => {
          deleteTaskMutation.mutate(
            { taskId: task.taskId, memberId: member?.memberId || "" },
            {
              onSuccess: async () => {
                toast.success("Delete task succeed!");
                const currentIteration = iterations?.find(
                  (iteration) =>
                    iteration.interationName === task.interationName
                );
                await queryClient.refetchQueries({
                  queryKey: [
                    iterationApi.getTasksKey,
                    currentIteration?.interationId || "",
                  ],
                });
                onClose();
              },
              onError: (err) => {
                console.error(err);
                toast.error("Delete task failed! Please try again later");
              },
            }
          );
        },
      });
    }
  };

  const tabItems = [
    {
      key: "comment",
      label: "Comment",
    },
    {
      key: "history",
      label: "History",
    },
  ];

  if (task) {
    return (
      <>
        <Modal
          okButtonProps={{ className: "hidden" }}
          cancelButtonProps={{ className: "hidden" }}
          open={isOpen}
          width="90%"
          onCancel={onClose}
        >
          <div className="flex items-center justify-between mt-8">
            <Typography.Title level={4}>{task.title}</Typography.Title>
            <div className="flex gap-x-2">
              <Select
                options={statusList.map((status) => ({
                  label: status.title,
                  value: status.boardStatusId,
                }))}
                value={task.statusId}
                className="min-w-[200px] mb-4"
                onChange={onChangeTaskStatus}
              />
              <Tooltip title="Edit task">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleOpenModalUpdate(task)}
                />
              </Tooltip>
              <Tooltip title="Delete task">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={onDeleteTask}
                />
              </Tooltip>
            </div>
          </div>
          <Row gutter={32}>
            <Col
              span={16}
              className="overflow-y-auto max-h-[300px] md:max-h-[500px] lg:max-h-[700px]"
            >
              <Typography.Title level={5}>Description</Typography.Title>
              {task.description ? (
                <div dangerouslySetInnerHTML={{ __html: task.description }} />
              ) : (
                <span>This task does not have any description.</span>
              )}
              <Divider />
              <div>
                <Typography.Title level={5}>Attachments</Typography.Title>
                <div className="flex flex-col gap-2 mb-4">
                  {task.attachmentResponse?.map((attachment) => (
                    <AttachmentDisplay
                      iterationId={task.interationId}
                      attachment={attachment}
                      key={attachment.attachmentId}
                    />
                  ))}
                </div>
                <UploadAttachment taskId={task.taskId} />
              </div>
              <Divider />
              <Tabs
                items={tabItems}
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key)}
              />
              {activeTab === "comment" && <CommentTab task={task} />}
              {activeTab === "history" && <HistoryTab task={task} />}
            </Col>
            <Col span={8}>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Assignee">
                  <div className="flex gap-x-2 items-center">
                    <AvatarWithColor
                      stringContent={task.assignTo}
                      className="flex-shrink-0"
                    >
                      {task.assignTo[0].toUpperCase()}
                    </AvatarWithColor>
                    {task.assignTo}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Start date">
                  {dayjs(task.startDate).format(DATE_FORMAT)}
                </Descriptions.Item>
                <Descriptions.Item label="Due date">
                  {dayjs(task.dueDate).format(DATE_FORMAT)}
                </Descriptions.Item>
                <Descriptions.Item label="Priority">
                  <div className="flex gap-x-2 items-center">
                    <PriorityStatus priorityName={task.priorityName} />
                    <span>{task.priorityName}</span>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Iteration">
                  {task.interationName}
                </Descriptions.Item>
                <Descriptions.Item label="Task type">
                  <div
                    className={classNames(
                      "text-white px-2 rounded w-fit",
                      task.typeName === "Bug" ? "bg-red-400" : "bg-emerald-500"
                    )}
                  >
                    {task.typeName}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Created by">
                  <div className="flex gap-x-2 items-center">
                    <AvatarWithColor
                      stringContent={task.createBy}
                      className="flex-shrink-0"
                    >
                      {task.createBy[0].toUpperCase()}
                    </AvatarWithColor>
                    {task.createBy}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Created at">
                  {dayjs(task.createTime).format(DATETIME_FORMAT)}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Modal>
        {isModalUpdateOpen && (
          <UpdateTask
            isOpen={isModalUpdateOpen}
            handleClose={handleCloseModalUpdate}
            initTaskData={initTaskData || undefined}
            onSuccess={onUpdateTaskSuccess}
          />
        )}
      </>
    );
  }

  return <></>;
}
