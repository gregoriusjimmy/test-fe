import AIModelPicker from "./AIModelPicker";
import { Menu, MessageSquareDiff } from "lucide-react";

import { useMediaQueries } from "hooks/useMediaQuery";

import { MAIN_HEADER_HEIGHT } from "../constants";
import ThemeSwitcher from "./ThemeSwitcher";

interface HeaderProps {
  onClickMenu: () => void;
  onClickNewChat: () => void;
}

const Header = ({ onClickMenu, onClickNewChat }: HeaderProps) => {
  const isLg = useMediaQueries.LG();

  return (
    <div
      style={{ height: MAIN_HEADER_HEIGHT }}
      className="bg-background-900 w-full flex items-center px-4"
    >
      {!isLg && (
        <div className="flex items-center space-x-3">
          <button
            onClick={onClickMenu}
            className="hover:bg-foreground-800/50 rounded-sm p-2"
          >
            <Menu />
          </button>
          <button
            onClick={onClickNewChat}
            className="hover:bg-foreground-800/50 rounded-sm p-2"
          >
            <MessageSquareDiff />
          </button>
        </div>
      )}
      <div className="ml-auto flex items-center space-x-8">
        <ThemeSwitcher />
        <AIModelPicker />
      </div>
    </div>
  );
};

export default Header;
