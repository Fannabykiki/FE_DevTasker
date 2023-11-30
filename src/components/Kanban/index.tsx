import React, { useEffect, useState, useMemo } from "react";
import {
  DragDropContext,
  OnDragEndResponder,
  DragDropContextProps,
  Draggable,
  Droppable,
  DroppableProps,
  DraggableProps,
} from "react-beautiful-dnd";
import MainTaskDisplay from "./MainTaskDisplay";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@/utils/api/task";
import { iterationApi } from "@/utils/api/iteration";
import useTaskActions from "@/hooks/useTaskActions";
import { Button, Input, Select } from "antd";
import { toast } from "react-toastify";
import { IIteration } from "@/interfaces/iteration";
import useDetailView from "@/hooks/useDetailView";
import { CreateStatus, CreateTask } from "../Modal";
import { ICreateTaskRequest, ITaskStatus } from "@/interfaces/task";
import TaskDetail from "../Task/Detail";
import { classNames } from "@/utils/common";
import { IProject } from "@/interfaces/project";
import { projectApi } from "@/utils/api/project";
import { useAuthContext } from "@/context/Auth";
import { sortBy } from "lodash";
import TaskDraggableDisplay from "./TaskDraggableDisplay";
import useDebounceValue from "@/hooks/useDebounceValue";

export enum TaskType {
  Main = "Work Item",
  Bug = "Bug",
  Task = "Task",
}
const DragDropContextComponent =
  DragDropContext as React.ComponentClass<DragDropContextProps>;
const DraggableComponent = Draggable as React.ComponentClass<DraggableProps>;
const DroppableComponent = Droppable as React.ComponentClass<DroppableProps>;
interface Props {
  iterationId: string;
}

const KanbanDisplay = ({ iterationId }: Props) => {
  const [collapsedTasks, setCollapsedTasks] = useState<string[]>([]);
  const [selectedIteration, setSelectedIteration] = useState<IIteration>();
  const [filterData, setFilterData] = useState({
    name: "",
    statusId: null,
  });

  const queryClient = useQueryClient();

  const { projectId } = useParams();
  const {
    openView: isModalCreateTaskOpen,
    onCloseView: onCloseCreateTaskModal,
    onOpenView: onOpenCreateTaskModal,
    detail: initTaskData,
  } = useDetailView<Partial<ICreateTaskRequest>>();
  const {
    openView: isModalDetailTaskOpen,
    onOpenView: onOpenViewDetailTask,
    onCloseView: onCloseViewDetailTask,
    detail: taskId,
  } = useDetailView<string>();

  const handleOpenCreateTaskModal = (
    initData: Partial<ICreateTaskRequest> = {}
  ) => {
    onOpenCreateTaskModal({
      ...initData,
      interationId: iterationId,
    });
  };

  const [displayStatusList, setDisplayStatusList] = useState<ITaskStatus[]>([]);

  const statusList = useMemo(
    () =>
      queryClient.getQueryData<ITaskStatus[]>([
        taskApi.getTaskStatusKey,
        projectId,
      ]) || [],
    [projectId, queryClient]
  );

  useEffect(() => {
    if (statusList.length > 0 && displayStatusList.length === 0) {
      setDisplayStatusList(statusList);
    }
  }, [statusList, displayStatusList]);

  const { data: iteration, refetch: refetchIteration } = useQuery({
    queryKey: [iterationApi.getTasksKey, iterationId],
    queryFn: ({ signal }) => iterationApi.getTasks(signal, iterationId),
  });

  useEffect(() => {
    if (iteration) {
      setSelectedIteration(iteration);
    }
  }, [iteration]);

  const onToggleCollapseTask = (taskId: string) => {
    setCollapsedTasks((c) => {
      if (c.includes(taskId)) {
        return c.filter((task) => task !== taskId);
      }
      return [...c, taskId];
    });
  };

  const onToggleCollapseAllTask = () => {
    if (collapsedTasks.length === selectedIteration!.tasks.length) {
      setCollapsedTasks([]);
    } else {
      setCollapsedTasks(selectedIteration!.tasks.map((task) => task.taskId));
    }
  };

  const { changeTaskStatusMutation, updateStatusOrderMutation } =
    useTaskActions();

  const project: IProject | undefined = queryClient.getQueryData([
    projectApi.getInfoKey,
    projectId,
  ]);

  const { userInfo } = useAuthContext();

  const member = useMemo(() => {
    return project?.projectMembers.find((mem) => mem.userId === userInfo!.id);
  }, [userInfo, project]);

  const onDragEnd: OnDragEndResponder = (result) => {
    if (selectedIteration) {
      const { source, destination, draggableId } = result;
      // Dropped outside the list
      if (!destination) {
        return;
      }

      if (
        source.droppableId === "status-drop-zone" &&
        destination.droppableId === "status-drop-zone"
      ) {
        if (source.index !== destination.index) {
          const originalStatusList = [...displayStatusList];
          const newStatusList = sortBy(
            displayStatusList.map((status, index) => {
              if (status.boardStatusId === draggableId) {
                console.log("Dragging: ", status.title);
                return { ...status, order: destination.index + 1 };
              }
              if (index >= destination.index && index < source.index) {
                console.log("Moved: ", status.title);
                return { ...status, order: status.order + 1 };
              } else if (index > source.index && index <= destination.index) {
                return { ...status, order: status.order - 1 };
              }
              return status;
            }),
            "order"
          );
          console.log(newStatusList);
          setDisplayStatusList(newStatusList);
          updateStatusOrderMutation.mutate(
            {
              statusId: draggableId,
              order: destination.index + 1,
            },
            {
              onSuccess: async () => {
                toast.success("Change status order succeed!");
                await queryClient.invalidateQueries({
                  queryKey: [taskApi.getTaskStatusKey, projectId],
                });
                await queryClient.refetchQueries({
                  queryKey: [taskApi.getTaskStatusKey, projectId],
                });
              },
              onError: (err: any) => {
                console.error(err);
                toast.error(
                  "Change status order failed! Please try again later"
                );
                setDisplayStatusList(originalStatusList);
              },
            }
          );
        }
      } else {
        // Moving within the same list
        if (source.droppableId !== destination.droppableId) {
          // Moving to a different status
          const newStatusId = destination.droppableId;
          const originalIteration = { ...selectedIteration };
          setSelectedIteration((c) => {
            return {
              ...c!,
              tasks: c!.tasks.map((task) => {
                if (task.taskId === draggableId) {
                  return {
                    ...task,
                    statusId: newStatusId,
                  };
                }
                return task;
              }),
            };
          });
          changeTaskStatusMutation.mutate(
            {
              id: draggableId,
              statusId: newStatusId,
              memberId: member?.memberId || "",
            },
            {
              onSuccess: () => {
                toast.success("Change task status succeed!");
              },
              onError: () => {
                toast.error("Change task status failed!");
                setSelectedIteration(originalIteration);
              },
              onSettled: () => {
                queryClient
                  .invalidateQueries({
                    queryKey: [iterationApi.getTasksKey, iterationId],
                  })
                  .then(() =>
                    queryClient.refetchQueries({
                      queryKey: [iterationApi.getTasksKey, iterationId],
                    })
                  );
              },
            }
          );
        }
      }
    }
  };

  const {
    onOpenView: handleOpenModalCreateStatus,
    onCloseView: handleCloseModalCreateStatus,
    openView: isModalCreateStatusOpen,
  } = useDetailView();

  const filterTaskName = useDebounceValue(filterData.name, 1000);

  if (selectedIteration)
    return (
      <>
        <DragDropContextComponent onDragEnd={onDragEnd}>
          <div className="flex gap-x-2 mb-2">
            <Input
              placeholder="Filter by task name"
              className="w-[200px]"
              value={filterData.name}
              onChange={(e) =>
                setFilterData((c) => ({ ...c, name: e.target.value }))
              }
            />
            <Select
              options={displayStatusList.map((status) => ({
                label: status.title,
                value: status.boardStatusId,
              }))}
              placeholder="Filter by status"
              className="min-w-[200px]"
              onChange={(statusId) =>
                setFilterData((c) => ({ ...c, statusId }))
              }
              allowClear
              value={filterData.statusId}
            />
            <div className="flex flex-grow justify-end">
              <Button
                icon={<PlusOutlined />}
                onClick={() => handleOpenCreateTaskModal()}
              >
                New task
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-x-4 items-center">
              <DroppableComponent
                droppableId="status-drop-zone"
                direction="horizontal"
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    className={classNames(
                      "flex gap-x-4 items-center flex-grow rounded",
                      snapshot.isDraggingOver && "bg-neutral-200"
                    )}
                    {...provided.droppableProps}
                  >
                    {displayStatusList.map((status, index) => (
                      <DraggableComponent
                        draggableId={status.boardStatusId}
                        index={index}
                        key={status.boardStatusId}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                            className="basis-[250px] shrink-0"
                          >
                            <div>
                              <h4 className="mb-0">{status.title}</h4>
                            </div>
                          </div>
                        )}
                      </DraggableComponent>
                    ))}
                    {provided.placeholder}
                    <div className="basis-[250px] rounded p-2">
                      <Button
                        icon={<PlusOutlined />}
                        type="text"
                        onClick={() => handleOpenModalCreateStatus()}
                      >
                        New status
                      </Button>
                    </div>
                  </div>
                )}
              </DroppableComponent>
            </div>
            <div>
              <div className="flex w-full gap-x-4">
                {displayStatusList.map((status, index) => (
                  <div className="flex flex-col" key={status.boardStatusId}>
                    <DroppableComponent
                      key={status.boardStatusId}
                      droppableId={status.boardStatusId}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          className={classNames(
                            "w-[250px] rounded p-2 flex-grow",
                            snapshot.isDraggingOver && "bg-neutral-200"
                          )}
                          {...provided.droppableProps}
                        >
                          <>
                            <div className="flex flex-col gap-y-4">
                              {(
                                selectedIteration.tasks?.filter(
                                  (task) =>
                                    task.statusId === status.boardStatusId &&
                                    (!filterTaskName ||
                                      task.title
                                        .toLowerCase()
                                        .includes(
                                          filterTaskName.toLowerCase()
                                        )) &&
                                    (!filterData.statusId ||
                                      filterData.statusId === task.statusId)
                                ) || []
                              ).map((task, index) => (
                                <DraggableComponent
                                  key={task.taskId}
                                  draggableId={task.taskId}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <TaskDraggableDisplay
                                        snapshot={snapshot}
                                        task={task}
                                        onViewTask={onOpenViewDetailTask}
                                      />
                                    </div>
                                  )}
                                </DraggableComponent>
                              ))}
                            </div>
                            {provided.placeholder}
                          </>
                        </div>
                      )}
                    </DroppableComponent>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DragDropContextComponent>
        {isModalCreateTaskOpen && (
          <CreateTask
            isOpen={isModalCreateTaskOpen}
            handleClose={onCloseCreateTaskModal}
            initTaskData={initTaskData || undefined}
            onSuccess={() => refetchIteration()}
          />
        )}
        {isModalDetailTaskOpen && (
          <TaskDetail
            taskId={taskId || ""}
            isOpen={isModalDetailTaskOpen}
            onClose={onCloseViewDetailTask}
          />
        )}
        {isModalCreateStatusOpen && (
          <CreateStatus
            open={isModalCreateStatusOpen}
            onClose={handleCloseModalCreateStatus}
          />
        )}
      </>
    );
  return null;
};

export default KanbanDisplay;