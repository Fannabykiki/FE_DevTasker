import { calcTaskDueDateColor, classNames } from "@/utils/common";
import { Badge, Tag, Tooltip } from "antd";
import { DraggableStateSnapshot } from "react-beautiful-dnd";
import {
  CommentOutlined,
  PaperClipOutlined,
  WarningFilled,
  WarningOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { DATE_FORMAT, STATUS_COLOR } from "@/utils/constants";
import { ITask } from "@/interfaces/task";
import { TaskType } from ".";
import PriorityStatus from "../Task/PriorityStatus";
import AvatarWithColor from "../AvatarWithColor";

interface Props {
  snapshot?: DraggableStateSnapshot;
  task: ITask;
  onViewTask: (_taskId?: string | undefined) => void;
}

export default function TaskDraggableDisplay({
  snapshot,
  task,
  onViewTask,
}: Props) {
  let taskTypeBorderColor = "border-blue-400";
  switch (task.typeName) {
    case TaskType.Task:
      taskTypeBorderColor = "border-green-400";
      break;
    case TaskType.Bug:
      taskTypeBorderColor = "border-red-400";
      break;
    default:
      break;
  }
  const hexColor = STATUS_COLOR[task.statusName as keyof typeof STATUS_COLOR];
  return (
    <div
      className={classNames(
        "select-none p-4 min-h-[50px] rounded cursor-pointer shadow hover:shadow-lg",
        snapshot?.isDragging ? "bg-neutral-300" : "bg-white",
        "border-0 border-l-4 border-solid",
        taskTypeBorderColor
      )}
      onClick={() => onViewTask(task.taskId)}
    >
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <div
            className={classNames(
              "w-fit px-2 py-1 rounded-full text-xs",
              calcTaskDueDateColor(task.dueDate)
            )}
          >
            <span>{dayjs(task.dueDate).format(DATE_FORMAT)}</span>
          </div>
          <Tag
            className="border-0"
            style={{
              backgroundColor: hexColor ? `${hexColor}20` : "gray",
              color: hexColor || "white",
            }}
          >
            {task.statusName}
          </Tag>
        </div>
        <p>{task.title}</p>
        <div className="flex gap-x-2 items-center">
          <div>
            <PaperClipOutlined /> {task.totalAttachment || 0}
          </div>
          <div>
            <CommentOutlined /> {task.totalComment || 0}
          </div>
          <div className="flex-grow text-right">
            <Tooltip title={`Priority: ${task.priorityName}`}>
              <PriorityStatus priorityName={task.priorityName} />
            </Tooltip>
          </div>
          <Tooltip
            title={`${task.assignTo}${
              task.memberStatus !== "In Team" ? " - Member unavailable" : ""
            }`}
          >
            <Badge
              count={
                task.memberStatus !== "In Team" ? (
                  <WarningFilled className="text-red-500" />
                ) : null
              }
            >
              <AvatarWithColor
                className={classNames(
                  task.memberStatus !== "In Team" &&
                    "border-red-500 border-solid border-2"
                )}
                stringContent={task.assignTo}
              >
                {task.assignTo.slice(0, 1).toUpperCase()}
              </AvatarWithColor>
            </Badge>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
