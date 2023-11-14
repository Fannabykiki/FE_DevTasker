import React, { useState } from "react";
import {
  DragDropContext,
  OnDragEndResponder,
  DraggableLocation,
  DragDropContextProps,
} from "react-beautiful-dnd";
import MainTaskDisplay from "./MainTaskDisplay";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { taskApi } from "@/utils/api/task";
import { IIteration } from "@/interfaces/iteration";
import { ITask } from "@/interfaces/task";
import { iterationApi } from "@/utils/api/iteration";
import useTaskActions from "@/hooks/useTaskActions";

// Helper functions to reorder and move subtasks
const reorderSubtasks = (
  subtasks: ITask[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(subtasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const moveSubtask = (
  sourceSubtasks: ITask[],
  droppableDestination: DraggableLocation,
  draggableId: string
) => {
  const sourceClone = Array.from(sourceSubtasks);
  const newStatus = droppableDestination.droppableId.split("/")[1];
  const editingItem = sourceClone.find((item) => item.taskId === draggableId);
  editingItem!.statusId = newStatus;

  return sourceClone;
};

export enum TaskType {
  Main = "Work Item",
  Bug = "Bug",
  Task = "Task",
}
const DragDropContextComponent =
  DragDropContext as React.ComponentClass<DragDropContextProps>;

interface Props {
  iterationId: string;
}

const IterationDisplay = ({ iterationId }: Props) => {
  const [collapsedTasks, setCollapsedTasks] = useState<string[]>([]);
  const { projectId } = useParams();

  const { data: iteration, refetch: refetchIteration } = useQuery({
    queryKey: [iterationApi.getDetailKey, iterationId],
    queryFn: ({ signal }) => iterationApi.getDetail(signal, iterationId),
  });

  const { data: statusList } = useQuery({
    queryKey: [taskApi.getTaskStatusesKey, projectId],
    queryFn: ({ signal }) => taskApi.getTaskStatuses(signal, projectId!),
    initialData: [],
  });

  const onToggleCollapseAllTask = () => {
    if (collapsedTasks.length === iteration!.tasks.length) {
      setCollapsedTasks([]);
    } else {
      setCollapsedTasks(iteration!.tasks.map((task) => task.taskId));
    }
  };

  const { updateTaskMutation } = useTaskActions();

  const onDragEnd: OnDragEndResponder = (result) => {
    if (iteration) {
      const { source, destination, draggableId } = result;

      // Dropped outside the list
      if (!destination) {
        return;
      }

      const sourceTask = iteration.tasks.find(
        (task) =>
          task.subTask?.some((subtask) => subtask.taskId === draggableId)
      );

      // Moving within the same list
      if (source.droppableId === destination.droppableId) {
        const newSubtasks = reorderSubtasks(
          sourceTask!.subTask || [],
          source.index,
          destination.index
        );
        // TODO: re-order tasks
        // const newTasks = tasks.map((task) => {
        //   if (task.id === sourceTask!.id) {
        //     return { ...task, subtasks: newSubtasks };
        //   }
        //   return task;
        // });
        // setTasks(newTasks);
      } else {
        // TODO: set new status for task
        // Moving to a different status
        const newStatusId = destination.droppableId.split("/")[1];
        const selectedSubtask = sourceTask!.subTask!.find(
          (subtask) => subtask.taskId === draggableId
        );
        // updateTaskMutation.mutate(
        //   {
        //     id: selectedSubtask!.taskId,
        //     data: {
        //       ...selectedSubtask!,
        //       statusId: newStatusId,
        //     },
        //   },
        //   {
        //     onSuccess: () => refetchIteration(),
        //   }
        // );
        // const newSourceSubtasks = moveSubtask(
        //   sourceTask!.subtasks,
        //   destination,
        //   draggableId
        // );
        // const newTasks = tasks.map((task) => {
        //   if (task.id === sourceTask!.id) {
        //     return {
        //       ...task,
        //       subtasks: newSourceSubtasks,
        //     };
        //   }
        //   return task;
        // }) as Task[];
        // setTasks(newTasks);
      }
    }
  };
  if (iteration)
    return (
      <>
        <DragDropContextComponent onDragEnd={onDragEnd}>
          <div>
            <div className="flex w-full gap-x-4">
              <div className="p-2">
                <h4
                  className="select-none cursor-pointer w-56"
                  onClick={onToggleCollapseAllTask}
                >
                  {collapsedTasks.length === iteration.tasks.length ? (
                    <DoubleRightOutlined className="rotate-90" />
                  ) : (
                    <DoubleLeftOutlined className="rotate-90" />
                  )}{" "}
                  Collapse all
                </h4>
              </div>
              {statusList.map((status) => (
                <div
                  className="basis-[250px] rounded p-2 shrink-0"
                  key={status.boardStatusId}
                >
                  <h4>{status.title}</h4>
                </div>
              ))}
            </div>
          </div>
          {iteration.tasks.map((task) => (
            <MainTaskDisplay
              task={task}
              key={task.taskId}
              statusList={statusList}
              isCollapsed={collapsedTasks.includes(task.taskId)}
            />
          ))}
        </DragDropContextComponent>
      </>
    );
  return null;
};

export default IterationDisplay;