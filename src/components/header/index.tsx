"use client";

import { ColorModeContext } from "@contexts/color-mode";
import type { RefineThemedLayoutHeaderProps } from "@refinedev/antd";
import { useGetIdentity, useLogout } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Button,
  Dropdown,
  Space,
  Switch,
  theme,
  Typography,
} from "antd";
import type { MenuProps } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import React, { useContext } from "react";
import { useSidebar } from "@providers/sidebar-provider";

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id: string | number;
  name?: string;
  email?: string;
  avatar?: string;
};

export const Header: React.FC<RefineThemedLayoutHeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mutate: logout } = useLogout();
  const { mode, setMode } = useContext(ColorModeContext);
  const sidebar = useSidebar();

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  const displayName = user?.name || user?.email || "المستخدم";

  const userMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      label: "تسجيل الخروج",
      onClick: () => logout(),
    },
  ];

  return (
    <AntdLayout.Header style={headerStyles}>
      {sidebar?.showHamburger && (
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => sidebar.setSidebarOpen(!sidebar.sidebarOpen)}
          style={{ marginInlineEnd: 8 }}
          aria-label="فتح القائمة"
        />
      )}
      <Space size="middle">
        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
          <Space style={{ cursor: "pointer", padding: "4px 8px" }} size="small">
            {user?.avatar ? (
              <Avatar src={user.avatar} alt={displayName} size="default" />
            ) : (
              <Avatar style={{ backgroundColor: token.colorPrimary }}>
                {(displayName as string).charAt(0).toUpperCase()}
              </Avatar>
            )}
            <Text strong>{displayName}</Text>
          </Space>
        </Dropdown>
      </Space>
    </AntdLayout.Header>
  );
};
