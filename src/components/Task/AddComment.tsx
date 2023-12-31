import { Button, Input } from "antd";
import AvatarWithColor from "../AvatarWithColor";
import { useState } from "react";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import useCommentActions from "@/hooks/useCommentActions";
import { IComment } from "@/interfaces/comment";
import { useAuthContext } from "@/context/Auth";
import { useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@/utils/api/task";
import { isQuillEmpty } from "@/utils/common";
import { IIteration } from "@/interfaces/iteration";
import { iterationApi } from "@/utils/api/iteration";
import { useParams } from "react-router-dom";
import { ITask } from "@/interfaces/task";

interface Props {
  task: ITask;
  parentComment?: IComment;
  onCancel?: VoidFunction;
  isEditing?: boolean;
}

export default function AddComment({
  task,
  parentComment,
  onCancel,
  isEditing = false,
}: Props) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const iterations: IIteration[] =
    queryClient.getQueryData([iterationApi.getListKey, projectId]) || [];
  const currentIteration = iterations?.find(
    (iteration) => iteration.interationName === task?.interationName
  );
  const [isCommenting, setIsCommenting] = useState(false);

  const [comment, setComment] = useState(
    isEditing ? parentComment?.content || "" : ""
  );

  const { createCommentMutation, replyCommentMutation, updateCommentMutation } =
    useCommentActions();

  const onSubmit = () => {
    if (!comment?.trim()) {
      toast.error("Please enter a comment.");
      return;
    }
    if (!isEditing) {
      if (!parentComment) {
        // Add comment
        createCommentMutation.mutate(
          {
            taskId: task.taskId,
            content: comment,
          },
          {
            onSuccess: async () => {
              await queryClient.refetchQueries({
                queryKey: [taskApi.getDetailKey, task.taskId],
              });
              await queryClient.refetchQueries({
                queryKey: [
                  iterationApi.getTasksKey,
                  currentIteration?.interationId || "",
                ],
              });
              await queryClient.invalidateQueries({
                queryKey: [taskApi.getKanbanTasksKey, projectId],
              });
              onCancelComment();
            },
            onError: (err) => {
              console.error(err);
              toast.error("Create comment failed! Please try again later");
            },
          }
        );
      } else {
        // Reply comment
        replyCommentMutation.mutate(
          {
            id: parentComment.commentId,
            data: {
              commentId: parentComment.commentId,
              content: comment,
            },
          },
          {
            onSuccess: async () => {
              toast.success("Reply to comment succeed");
              await queryClient.refetchQueries({
                queryKey: [taskApi.getDetailKey, task.taskId],
              });
              await queryClient.refetchQueries({
                queryKey: [
                  iterationApi.getTasksKey,
                  currentIteration?.interationId || "",
                ],
              });
              await queryClient.invalidateQueries({
                queryKey: [taskApi.getKanbanTasksKey, projectId],
              });
              onCancelComment();
            },
            onError: (err) => {
              console.error(err);
              toast.error("Reply to comment failed! Please try again later");
            },
          }
        );
      }
    } else {
      parentComment &&
        updateCommentMutation.mutate(
          {
            commentId: parentComment.commentId,
            content: comment,
          },
          {
            onSuccess: async () => {
              toast.success("Update comment succeed");
              await queryClient.refetchQueries({
                queryKey: [taskApi.getDetailKey, task.taskId],
              });
              onCancelComment();
            },
            onError: (err) => {
              console.error(err);
              toast.error("Update comment failed! Please try again later");
            },
          }
        );
    }
  };

  const onStartComment = () => {
    setIsCommenting(true);
    setComment("");
  };

  const onCancelComment = () => {
    setIsCommenting(false);
    setComment("");
    onCancel?.();
  };

  const { userInfo } = useAuthContext();

  if (!isCommenting && !parentComment) {
    return (
      <div className="flex gap-x-2">
        <AvatarWithColor
          stringContent={userInfo!.userName || userInfo!.email || "Unknown"}
          className="flex-shrink-0"
        >
          {(userInfo!.userName || userInfo!.email)[0].toUpperCase()}
        </AvatarWithColor>
        <Input.TextArea placeholder="Add a comment" onFocus={onStartComment} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-x-2">
        {!isEditing && (
          <AvatarWithColor
            stringContent={userInfo!.userName || userInfo!.email || "Unknown"}
          >
            {(userInfo!.userName || userInfo!.email)[0].toUpperCase()}
          </AvatarWithColor>
        )}
        <ReactQuill
          theme="snow"
          value={comment}
          onChange={setComment}
          className="w-full h-fit"
        />
      </div>
      <div className="flex gap-x-2 justify-end mt-4">
        <Button
          type="primary"
          onClick={onSubmit}
          disabled={isQuillEmpty(comment)}
          loading={
            replyCommentMutation.isLoading ||
            updateCommentMutation.isLoading ||
            createCommentMutation.isLoading
          }
        >
          Comment
        </Button>
        <Button onClick={onCancelComment}>Cancel</Button>
      </div>
    </div>
  );
}
