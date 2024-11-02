import { ChangeEvent, useEffect, useRef, useState } from "react";
import { CirclePlus, LogOut, Search, User } from "lucide-react";

import Button from "components/Button";
import Topics from "./Topics";

import { logout as fetchLogout } from "api/auth";
import { logout } from "helpers/logout";
import { useOutsideClick } from "hooks/useOutsideClick";
import cn from "lib/cn";

import {
  MIN_SIDEBAR_WIDTH,
  SIDEBAR_CONTENT_HEIGHT,
  SIDEBAR_FOOTER_HEIGHT,
  SIDEBAR_HEADER_HEIGHT,
} from "../constants";
import { LogoWhiteSVG } from "components/assets";
import useAuthStore from "store/AuthStore";

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [loadingLogout, setLoadingLogout] = useState(false);
  const email = useAuthStore(state=>state.user.email)
  const ref = useRef<HTMLInputElement>(null);
  useOutsideClick(ref, () => {
    setIsSearchOpen(false);
    setSearchText("");
  });

  const handleClickSearch = () => {
    setIsSearchOpen(true);
  };

  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    if (isSearchOpen) {
      ref.current?.focus();
    }
  }, [isSearchOpen]);

  const handleLogout = async () => {
    if (loadingLogout) return;
    setLoadingLogout(true);
    await fetchLogout().finally(() => {
      setLoadingLogout(false);
      logout();
    });
  };

  return (
    <div
      style={{
        width: isOpen ? MIN_SIDEBAR_WIDTH : 0,
        visibility: isOpen ? "visible" : "hidden",
        opacity: isOpen ? 1 : 0,
      }}
      className={cn(
        "bg-background-900 relative flex flex-col h-screen border-r border-r-gray-800 transition-all duration-300 flex-shrink-0"
      )}
    >
      <div
        style={{ height: SIDEBAR_HEADER_HEIGHT }}
        className="flex flex-col pb-2 pt-4"
      >
        <div className="py-2 flex items-center justify-center">
        <LogoWhiteSVG  className="w-fit h-auto mx-4 mb-4" />
        </div>
        <div className="flex space-x-3 w-full px-4">
          <Button
            onClick={handleClickSearch}
            className={cn(
              "w-[4rem] ring-0 outline-none",
              isSearchOpen && "w-full"
            )}
          >
            <Search className="w-6 h-6 shrink-0" />
            <input
              value={searchText}
              onChange={handleChangeSearch}
              ref={ref}
              placeholder="Search titles..."
              className={cn(
                "m-0 invisible w-0 py-1 h-full outline-none",
                isSearchOpen && "ml-2 w-full visible h-full bg-transparent"
              )}
            />
          </Button>
          <Button
            className={cn(
              "text-lg font-semibold flex items-center w-full",
              isSearchOpen && "w-[4rem]"
            )}
          >
            <CirclePlus className={cn("w-6 h-6 shrink-0")} />
            {!isSearchOpen && (
              <div className="whitespace-pre ml-2">Chat Baru</div>
            )}
          </Button>
        </div>
      </div>
      <div
        style={{ height: SIDEBAR_CONTENT_HEIGHT }}
        className="overflow-auto h-[80vh] px-4 mt-4"
      >
        <Topics searchText={searchText} />
      </div>
      <div
        style={{ height: SIDEBAR_FOOTER_HEIGHT }}
        className="flex flex-col px-4 items-start py-5 space-y-3"
      >
        <div className="flex items-center text-foreground-200">
          <User className="mr-2 w-5 h-5 " /> <div>{email}</div>
        </div>
        <div className="flex items-center text-foreground-200" onClick={handleLogout}>
          <LogOut className="mr-2 w-5 h-5 " /> <button>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
