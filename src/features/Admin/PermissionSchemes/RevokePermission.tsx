import { useState } from "react";
import { Checkbox, Col, Divider, Modal, Row, Space, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { toast } from "react-toastify";

import { ISchema } from "@/interfaces/schema";
import { schemaApi } from "@/utils/api/schema";

interface Props {
  isOpen: boolean;
  schemaId: string | undefined;
  permission: ISchema["rolePermissions"][number] | undefined;
  handleClose: () => void;
}

const RevokePermission = ({
  isOpen,
  schemaId,
  permission,
  handleClose,
}: Props) => {
  const [checkedList, setCheckedList] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { mutate: revokePermission, isLoading } = useMutation({
    mutationKey: [schemaApi.revokePermissionKey],
    mutationFn: schemaApi.revokePermission,
    onSuccess: () => {
      queryClient.refetchQueries([schemaApi.getAdminSchemaDetailKey]);
      handleClose();
    },
    onError: (err) => {
      console.error(err);
      toast.error("Revoke permission failed");
    },
  });

  const handleSubmit = () => {
    if (!schemaId || !permission) {
      toast.error("Has an error, please try again");
      handleClose();
      return;
    } else if (!checkedList.length) {
      toast.error("Please select at least 1 permission");
      return;
    }

    revokePermission({
      id: schemaId,
      data: {
        schemaId,
        roleIds: checkedList,
        permissionId: permission.permissionId,
      },
    });
  };

  const onChange = (checkedValues: CheckboxValueType[]) => {
    setCheckedList(checkedValues as string[]);
  };

  return (
    <Modal
      title="Remove permission"
      open={isOpen}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="Remove"
      okButtonProps={{
        loading: isLoading,
      }}
    >
      <Divider className="!m-0" />
      <Space direction="vertical" className="w-full my-5">
        <Row gutter={8}>
          <Col span={8} className="flex items-end justify-end">
            <Typography.Title level={5} className="!m-0 !text-[#5f5f5f]">
              Permission
            </Typography.Title>
          </Col>
          <Col span={16}>
            <Typography.Title level={5} className="!m-0">
              {permission?.name}
            </Typography.Title>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8} className="flex justify-end">
            <Typography.Title level={5} className="!m-0 !text-[#5f5f5f]">
              Removed from
            </Typography.Title>
          </Col>
          <Col span={16}>
            <Space direction="vertical" className="w-full">
              <Checkbox.Group
                className="flex-col"
                options={permission?.roles.map((role) => ({
                  label: role.roleName,
                  value: role.roleId,
                }))}
                onChange={onChange}
              />
            </Space>
          </Col>
        </Row>
      </Space>
      <Divider className="!m-0" />
    </Modal>
  );
};

export default RevokePermission;