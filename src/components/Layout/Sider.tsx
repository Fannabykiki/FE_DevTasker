import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Divider, Layout, Menu } from "antd";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import useMenuCollapse from "@/hooks/useMenuCollapse";
import useDetailView from "@/hooks/useDetailView";
import { CreateProject } from "../Modal";
import { paths } from "@/routers/paths";
import Brand from "./Brand";

type PathKeys = keyof typeof paths;
type PathValues = (typeof paths)[PathKeys];

interface MenuItem {
  label: string;
  key: PathValues;
  icon: React.ReactElement;
  children?: MenuItem[];
}

export default function UserSider() {
  const { menuCollapse, onToggleMenu } = useMenuCollapse(
    window.innerWidth < 1200
  );
  const {
    openView: openCreateProjectModal,
    onOpenView: onOpenCreateProjectModal,
    onCloseView: onCloseCreateProjectModal,
  } = useDetailView();

  const iconSize = menuCollapse ? 16 : 20;

  const items: MenuItem[] = [
    {
      label: "Dashboard",
      key: paths.user,
      icon: <HomeOutlined width={iconSize} height={iconSize} />,
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    const keys = location.pathname.split("/").slice(1);
    setOpenKeys(keys);
    setSelectedKeys(keys);
  }, [location.pathname]);

  const onClickMenuItem = ({ key }: { key: string }) => {
    navigate(key);
  };

  const onOpenSubMenu = (keys: string[]) => {
    const rootKeys = items
      .filter((item) => {
        if (Object.hasOwn(item, "children")) {
          return item.children;
        }
        return [];
      })
      .map((i) => i.key);
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <>
      <Layout.Sider
        collapsible
        collapsed={menuCollapse}
        onCollapse={onToggleMenu}
        trigger={null}
        width={300}
        collapsedWidth={96}
        breakpoint="xl"
        className="relative p-2"
        theme="light"
      >
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col gap-5 flex-1 h-0">
            <div className="flex justify-center items-center">
              <Brand menuCollapse={menuCollapse} />
            </div>
            <div className="flex-grow">
              <Menu
                mode="inline"
                items={items as any}
                onClick={onClickMenuItem}
                openKeys={openKeys}
                selectedKeys={selectedKeys}
                onOpenChange={onOpenSubMenu}
                className="!border-none font-semibold text-base overflow-y-auto overflow-x-hidden"
              />
              <Divider />
              <div className="px-2">
                <Button
                  title="Add Project"
                  icon={<PlusOutlined />}
                  type="primary"
                  block
                  onClick={() => onOpenCreateProjectModal()}
                >
                  {!menuCollapse && "Add Project"}
                </Button>
              </div>
            </div>
            <Button type="text" onClick={onToggleMenu}>
              {menuCollapse ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
            </Button>
          </div>
        </div>
      </Layout.Sider>
      {openCreateProjectModal && (
        <CreateProject
          open={openCreateProjectModal}
          onClose={onCloseCreateProjectModal}
        />
      )}
    </>
  );
}
