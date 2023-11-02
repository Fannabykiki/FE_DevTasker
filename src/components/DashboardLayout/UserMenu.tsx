import { Dropdown } from "antd";
import { useAuthContext } from "@/context/Auth";
import { useNavigate } from "react-router-dom";
import { MenuInfo } from "rc-menu/lib/interface";
import { UpdateProfile } from "../Modal";
import { useState } from "react";

enum KeyActions {
  SignOut = "sign-out",
  UpdateProfile = "update-profile",
}

interface Props {
  children: React.ReactElement;
}

export default function UserMenu({ children }: Props) {
  const { userInfo, setAuthenticate } = useAuthContext();
  const [openUpdateProfileModal, setOpenUpdateProfileModal] = useState(false);
  const navigate = useNavigate();

  const onSignOut = () => {
    // call api to logout, disable token, etc
    localStorage.removeItem("token");
    setAuthenticate({
      isAuthenticated: false,
      userInfo: null,
    });
    navigate("/login");
  };

  const onSelectAction = ({ key }: MenuInfo) => {
    switch (key) {
      case KeyActions.SignOut:
        onSignOut();
        break;
      case KeyActions.UpdateProfile:
        setOpenUpdateProfileModal(true);
        break;
      default:
        break;
    }
  };

  const actions = [
    {
      key: KeyActions.UpdateProfile,
      label: "Update profile",
    },
    {
      key: KeyActions.SignOut,
      label: "Sign out",
    },
  ];

  return (
    <>
      <Dropdown menu={{ items: actions, onClick: onSelectAction }}>
        {children}
      </Dropdown>
      {(userInfo?.isFirstTime || openUpdateProfileModal) && (
        <UpdateProfile onCancel={() => setOpenUpdateProfileModal(false)} />
      )}
    </>
  );
}
