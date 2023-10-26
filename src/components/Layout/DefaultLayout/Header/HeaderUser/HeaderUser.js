import React, { useState, useEffect } from "react";
import "./HeaderUser.css";
import { Dropdown, Menu, Badge } from "antd";
import { BellOutlined } from "@ant-design/icons";
import axios from "axios";
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../../../navigations/routes";

const HeaderUser = () => {
  const navigate = useNavigate();
  const notificationCount = 3; // Số lượng thông báo (thay đổi tùy ý)
  const [userInfo, setUserInfo] = useState({ username: "" });

  const signOutHandler = () => {
    navigate(routes.Logout.path);
  };

  useEffect(() => {
    getUserLogin(); // Gọi hàm để lấy thông tin người dùng
  }, []);

  const getUserLogin = async () => {
    const userId = JSON.parse(decodeURIComponent(sessionStorage.userId));
    console.log(userId);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/profile/${userId}`
      );
      console.log(response);

      // Sau khi nhận dữ liệu từ API, cập nhật state userInfo
      setUserInfo({
        username: response.data.userName,
      });
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item
        key="profile"
        onClick={() => navigate(routes.UserProfile.path)}
      >
        Profile
      </Menu.Item>
      <Menu.Item
        key="changepassword"
        onClick={() => navigate(routes.ChangePassword.path)}
      >
        Change Password
      </Menu.Item>
      <Menu.Item key="logout" onClick={signOutHandler}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="HeaderUser">
      <div className="ContentHeader">
        <div style={{ marginRight: "20px" }}>
          <Badge count={notificationCount}>
            <BellOutlined style={{ fontSize: "20px" }} />
          </Badge>
        </div>
        <span style={{ marginRight: "20px" }}>|</span>
        <div style={{ marginRight: "20px" }}>
          <span>{userInfo.username}</span>
        </div>
        <span style={{ marginRight: "20px" }}>|</span>
        <div style={{ marginRight: "20px" }}>
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <div>
              <Avatar
                round
                name={userInfo.username}
                size="28"
                textSizeRatio={2}
              />
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default HeaderUser;
