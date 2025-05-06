import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { FC, useState } from "react";
import Logout from "../profilePage/Logout";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Button, Dropdown, Flex, MenuProps } from "antd";
import { HeaderWrapper, STitle } from "./HeaderBar.styles";
import { SaveOutlined } from "@ant-design/icons";
import { Tooltip } from "../../shared";

type THeaderBarProps = {
  surveyTitle?: string;
  onSave?: () => void;
  onCopy?: (id: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  showSurveyControls?: boolean;
};

const HeaderBar: FC<THeaderBarProps> = ({
  surveyTitle,
  onSave,
  onCopy,
  onDelete,
  showSurveyControls = false,
}) => {
  const [menuAvatarOpen, setMenuAvatarOpen] = useState(false);
  const [menuSettingsOpen, setMenuSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenuAvatar = (open: boolean) => {
    setMenuAvatarOpen(open);
    if (open) setMenuSettingsOpen(false);
  };

  const toggleMenuSettings = (open: boolean) => {
    setMenuSettingsOpen(open);
    if (open) setMenuAvatarOpen(false);
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const avatarMenuItems = [
    {
      key: "logout",
      label: <Logout />,
    },
  ];

  const settingsMenuItems = [
    {
      key: "copy",
      label: "Копировать опрос",
      onClick: onCopy as MenuProps["onClick"],
    },
    {
      key: "delete",
      label: "Удалить опрос",
      danger: true,
      onClick: onDelete as MenuProps["onClick"],
    },
  ];

  return (
    <HeaderWrapper align="center" justify="space-between">
      {showSurveyControls && (
        <Flex align="center" gap={16}>
          <Tooltip title="На главную">
            <Button
              type="text"
              shape="circle"
              icon={<HomeIcon fontSize="medium" />}
              onClick={handleHomeClick}
            />
          </Tooltip>
          <STitle level={5}>{surveyTitle || "Новый опрос"}</STitle>
        </Flex>
      )}

      <Flex align="center" gap={16} style={{ marginLeft: "auto" }}>
        {showSurveyControls && (
          <Flex gap={4}>
            <Button
              type="primary"
              className="primary-button"
              icon={<SaveOutlined style={{ fontSize: 20 }} />}
              onClick={onSave}>
              Сохранить
            </Button>

            <Tooltip title="Дополнительно">
              <Dropdown
                menu={{ items: settingsMenuItems }}
                trigger={["click"]}
                open={menuSettingsOpen}
                onOpenChange={toggleMenuSettings}
                placement="bottomRight">
                <Button
                  type="text"
                  shape="circle"
                  icon={<MoreVertIcon fontSize="medium" />}
                  onClick={(e) => e.preventDefault()}
                />
              </Dropdown>
            </Tooltip>
          </Flex>
        )}

        <Dropdown
          menu={{ items: avatarMenuItems }}
          trigger={["click"]}
          open={menuAvatarOpen}
          onOpenChange={toggleMenuAvatar}
          placement="bottomRight">
          <Button
            type="text"
            shape="circle"
            icon={<AccountCircleOutlinedIcon fontSize="large" />}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      </Flex>
    </HeaderWrapper>
  );
};
export default HeaderBar;
