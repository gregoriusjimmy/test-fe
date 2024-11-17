import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { EllipsisVertical, Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Pin } from "lucide-react";

import { replaceParamFromRoute } from "helpers/replaceParamFromRoute";
import { useMediaQueries } from "hooks/useMediaQuery";
import { useOutsideClick } from "hooks/useOutsideClick";
import cn from "lib/cn";
import useLayoutStore from "store/LayoutStore";

import { TTopic } from "api/topics/types";
import { routePaths, topicSlugParam } from "routes/constants";

interface TopicProps {
  topic: TTopic;
  onDelete: (topic: TTopic) => void;
  onRename: (topic: TTopic, newTitle: string) => void;
  onTogglePinned: (topic: TTopic) => void;
}

const Topic = ({ topic, onDelete, onRename, onTogglePinned }: TopicProps) => {
  const [openOptions, setOpenOptions] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [title, setTitle] = useState(topic.title);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const topicRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const onSetSidebarOpen = useLayoutStore((state) => state.onSetSidebarOpen);
  const isLg = useMediaQueries.LG();
  const navigate = useNavigate();
  useOutsideClick(topicRef, () => {
    setOpenOptions(false);
  });

  const handleOpenOptions = (e: MouseEvent) => {
    e.stopPropagation();
    setOpenOptions(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleClickDelete = (e: MouseEvent) => {
    e.stopPropagation();
    onDelete(topic);
    setOpenOptions(false);
  };

  const handleClickTogglePinned = (e: MouseEvent) => {
    e.stopPropagation();
    onTogglePinned(topic);
    setOpenOptions(false);
  };

  const handleClickRename = (e: MouseEvent) => {
    e.stopPropagation();
    setOpenOptions(false);
    setIsRenaming(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleBlurInput = () => {
    onRename(topic, title);
    setIsRenaming(false);
  };

  const handleKeyDownInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onRename(topic, title);
      setTimeout(() => {
        inputRef.current?.blur();
      }, 100);
    }
  };

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleClickTopic = () => {
    if (!isLg) {
      onSetSidebarOpen(false);
    }
    navigate(
      replaceParamFromRoute({
        param: topicSlugParam,
        route: routePaths.root.topic.root,
        value: String(topic.id),
      })
    );
  };
  return (
    <>
      <div
        className="flex justify-between items-center border-b border-b-background-600 pl-4 pr-2 text-foreground-200 font-medium hover:bg-background-600 rounded-lg cursor-pointer"
        key={topic.id}
        onClick={handleClickTopic}
      >
        {topic.pinned && <Pin className="w-5 h-5 shrink-0 mr-2" />}
        {isRenaming ? (
          <input
            ref={inputRef}
            disabled={!isRenaming}
            onBlur={handleBlurInput}
            onKeyDown={handleKeyDownInput}
            onChange={handleChangeTitle}
            className={cn(
              "py-2.5 bg-transparent truncate cursor-pointer focus:cursor-text w-full",
              {
                "text-ellipsis overflow-hidden whitespace-nowrap": true,
              }
            )}
            value={title}
          />
        ) : (
          <div
            className={cn(
              "py-2.5 bg-transparent grow truncate cursor-pointer",
              {
                "text-ellipsis overflow-hidden whitespace-nowrap": true,
              }
            )}
          >
            {title}
          </div>
        )}

        <div onClick={handleOpenOptions} className="p-1">
          <EllipsisVertical className="w-5 h-5 shrink-0" />
        </div>
      </div>
      {openOptions && (
        <div
          ref={topicRef}
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
          }}
          className="absolute  z-30 py-4 space-y-1 flex flex-col rounded-lg bg-background-500"
        >
          <div
            className="text-foreground-300 flex items-center hover:bg-background-400 cursor-pointer pl-4 pr-8 py-2"
            onClick={handleClickTogglePinned}
          >
            <Pin className="mr-2 w-5 h-5 " />
            {topic.pinned ? `Unpin` : "Pin"}
          </div>
          <div
            className="text-foreground-300 flex items-center hover:bg-background-400 cursor-pointer pl-4 pr-8 py-2"
            onClick={handleClickRename}
          >
            <Pencil className="mr-2 w-5 h-5 " />
            Rename
          </div>
          <div
            className="text-red-500 flex items-center hover:bg-background-400 cursor-pointer pl-4 pr-8 py-2"
            onClick={handleClickDelete}
          >
            <Trash2 className="mr-2 w-5 h-5 text-red-500" />
            Remove
          </div>
        </div>
      )}
    </>
  );
};

export default Topic;
